/* 朗读短文 */
<template>
  <div class="area-content">
    <div
      v-for="(sv,si) in area.PaperQuestionViewModels"
      :key="sv.QuestionID"
      class="question-wrap"
    >
      <div
        v-for="(ssv,ssi) in sv.PaperContentViewModels"
        :key="ssv.ContentID"
        class="content-wrap clearfix mt"
      >
        <p class="font14 prompt">{{sv.Prompt}}
          <img
            v-if="sv.PromptAudioPath"
            class="audio-img vm"
            @click="togglePlay(getSliceUrl(sv.PromptAudioPath))"
            :src="ifPlaying(getSliceUrl(sv.PromptAudioPath))?'/img/laba.gif':'/img/laba.png'"
          >
        </p>
        <InputBox
          :disabled="ifBeChoose(sv)"
          :error="getEditPaperValidateError('ContentTextAndAudio',aIndex,si,ssi)"
          @focus="()=>{selectQuestion(si);editPaperValidateError('ContentTextAndAudio', '', aIndex, si,ssi);}"
          class="mt"
          :textarea="true"
          :inputValue="ssv.Text"
          :audioMode="true"
          :audioUrl="getSliceUrl(ssv.AudioPath)"
          @delAudio="delContentAudio(si,ssi)"
          @uploadAudioSuccess="($event)=>{uploadContentAudioSuccess(si,ssi,$event);editPaperValidateError('ContentTextAndAudio', '', aIndex, si,ssi);}"
          placeholder="短文内容"
          @changeInput="changeEditPaperContentProp(aIndex,si,ssi, 'Text', $event)"
        >
        </InputBox>
        <p class="end-tips font14 prompt">{{area.PaperQuestionViewModels[si].Tips}}
          <img
            v-if="area.PaperQuestionViewModels[si].TipsAudioPath"
            class="audio-img vm"
            @click="togglePlay(getSliceUrl(area.PaperQuestionViewModels[si].TipsAudioPath))"
            :src="ifPlaying(getSliceUrl(area.PaperQuestionViewModels[si].TipsAudioPath))?'/img/laba.gif':'/img/laba.png'"
          >
        </p>

        <HoverBox
          :disabled="ifBeChoose(sv)"
          :error="getEditPaperValidateError('PaperContentRefTextViewModelsLength',aIndex,si,ssi)"
          class="answer mt gray-border"
          :add="true"
          :batchAdd="true"
          @addEvent="addContentRefText(si,ssi)"
          @batchAddOk="batchAddContentRefTextOk(si,ssi,$event)"
          :ifAddAnswer="false"
          :clear="true"
          @clear="clearAllContentRefText(si,ssi)"
          :preview="ssv.PaperContentRefTextViewModels"
        >
          <p class="font14">【机评参考】</p>
          <p class="red-hint">
            注：请将机评参考中的【数字】转换成相应英文发音实词，如100=》one hundred；【时间】转换成相应英文发音实词，如1999=》nineteenninety-nine；8:30=》eight thirty
          </p>
          <div
            v-for="(sssv,sssi) in ssv.PaperContentRefTextViewModels"
            class="mt"
          >
            <IndexDeleteInput
              :noDel="sssi===0"
              :disabled="ifBeChoose(sv)"
              :error="getEditPaperValidateError('ContentRefText',aIndex,si,ssi,sssi)"
              @focus="()=>{selectQuestion(si);editPaperValidateError('PaperContentRefTextViewModelsLength', '', aIndex, si,ssi);editPaperValidateError('ContentRefText', '', aIndex, si,ssi,sssi);}"
              @colorTextClick="editPaperValidateError('ContentRefTextSplit', '', aIndex, sv.Idx, ssv.Idx, sssi);"
              :index="sssi+1"
              :inputValue="sssv.Content"
              @changeInput="changeEditPaperContentRefTextProp(aIndex,si,ssi,sssi,'Content',$event)"
              @del="delRefTextItem(si,ssi,sssi)"
            >
              <!-- <p>{{getEditPaperValidateError('ContentRefTextSplit',aIndex,si,ssi,sssi)}}</p> -->
              <template v-for="item in getEditPaperValidateError('ContentRefTextSplit',aIndex,sv.Idx,ssv.Idx,sssi)">
                <span
                  class="color-span"
                  v-if="item.Text!=='\n'"
                  :class="{'red':!item.Result}"
                >{{item.Text}}</span>
                <br v-else>
              </template>
            </IndexDeleteInput>
          </div>
        </HoverBox>

        <!-- <div class="ref-gray-border mt">
          <p class="font14">【机评参考】</p>
          <p class="red-hint">
            注：请将机评参考中的【数字】转换成相应英文发音实词，如100=》one hundred；【时间】转换成相应英文发音实词，如1999=》nineteenninety-nine；8:30=》eight thirty
          </p>
          <div
            v-for="(sssv,sssi) in ssv.PaperContentRefTextViewModels"
            class="mt"
          >
            <IndexDeleteInput
              :disabled="ifBeChoose(sv)"
              :error="getEditPaperValidateError('ContentRefText',aIndex,si,ssi,sssi)"
              @focus="()=>{selectQuestion(si);editPaperValidateError('ContentRefText', '', aIndex, si,ssi,sssi);}"
              @colorTextClick="editPaperValidateError('ContentRefTextSplit', '', aIndex, sv.Idx, ssv.Idx, sssi);"
              :noDel="true"
              :index="sssi+1"
              :inputValue="sssv.Content"
              @changeInput="changeEditPaperContentRefTextProp(aIndex,si,ssi,sssi,'Content',$event)"
              @del="delRefTextItem(si,ssi,sssi)"
            >
              <template v-for="item in getEditPaperValidateError('ContentRefTextSplit',aIndex,sv.Idx,ssv.Idx,sssi)">
                <span
                  class="color-span"
                  v-if="item.Text!=='\n'"
                  :class="{'red':!item.Result}"
                >{{item.Text}}</span>
                <br v-else>
              </template>
            </IndexDeleteInput>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  </div>
</template>
<script>
const globalVuex = createNamespacedHelpers("global");
import { createNamespacedHelpers } from "vuex";
import HoverBox from "@/components/HoverBox";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import InputBox from "@/components/InputBox";
import IndexDeleteInput from "@/components/editPaper/IndexDeleteInput";
import deepClone from "clone";
export default {
  props: ["aIndex", "getQuestionBasket"],
  components: {
    InputBox,
    HoverBox,
    IndexDeleteInput
  },
  data() {
    return {};
  },
  computed: {
    ...globalVuex.mapGetters(["ifPlaying"]),
    ...mapState(["paperData", "areaIndex", "questionIndex", "error"]),
    imgAction() {
      return (
        window.API_URL + "/api/CommonProcess/uploadResource?resourceType=1"
      );
    },
    area() {
      return this.paperData.PaperAreaViewModels[this.aIndex];
    }
  },
  created() {},
  methods: {
    //拷贝104
    //拷贝104
    //拷贝104
    //拷贝104
    ...globalVuex.mapActions(["togglePlay"]),
    addContentRefText(si, ssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentRefTextViewModels.push({
        ContentID:
          newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si]
            .PaperContentViewModels[ssi].ContentID,
        Content: ""
      });
      this.changePaperData(newData);
    },

    clearAllContentRefText(si, ssi) {
      this.$Modal.confirm({
        content: "确定要清空吗?",
        onOk: () => {
          this.changeEditPaperContentProp(
            this.aIndex,
            si,
            ssi,
            "PaperContentRefTextViewModels",
            [
              {
                ContentID: this.paperData.PaperAreaViewModels[this.aIndex]
                  .PaperQuestionViewModels[si].PaperContentViewModels[ssi]
                  .ContentID,
                Content: ""
              }
            ]
          );
        }
      });
    },

    batchAddContentRefTextOk(si, ssi, value) {
      const newData = deepClone(this.paperData);
      const arr = value.split("\n");
      let removeNoneArr = [];
      arr.forEach(v => {
        if (v) {
          removeNoneArr.push({
            ContentID:
              newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ContentID,
            Content: v
          });
        }
      });
      const PaperContentRefTextViewModels =
        newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si]
          .PaperContentViewModels[ssi].PaperContentRefTextViewModels;
      //update by yijun.chen at 2019.03.08判断如果追加的数组大于0 则判断之前的数组中是否有空内容 剔除空的数组
      if (removeNoneArr.length > 0) {
        const tempArr = [];
        PaperContentRefTextViewModels.forEach(v => {
          if (v.Content != null && v.Content !== "") {
            tempArr.push(v);
          }
        });
        removeNoneArr = tempArr.concat(removeNoneArr);
      } else {
        removeNoneArr = PaperContentRefTextViewModels;
      }
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[
        ssi
      ].PaperContentRefTextViewModels = removeNoneArr; //PaperContentRefTextViewModels.concat(removeNoneArr);
      this.changePaperData(newData);
    },

    //拷贝104
    //拷贝104
    //拷贝104
    //拷贝104
    //拷贝104
    ...mapMutations([
      "changePaperData",
      "changeAreaIndex",
      "changeQuestionIndex",
      "changeError",
      "pushDeleteMedia"
    ]),
    changeAnswerItem() {},
    delAnswerItem(si, ssi, sssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentAnswerViewModels.splice(
        sssi,
        1
      );
      this.changePaperData(newData);
    },
    addContentAnswer(si, ssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentAnswerViewModels.push({
        ContentID:
          newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si]
            .PaperContentViewModels[ssi].ContentID,
        Content: ""
      });
      this.changePaperData(newData);
    },
    batchAddOk(si, ssi, value) {
      const newData = deepClone(this.paperData);
      const arr = value.split("\n");
      let removeNoneArr = [];
      arr.forEach(v => {
        if (v) {
          removeNoneArr.push({
            ContentID:
              newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ContentID,
            Content: v
          });
        }
      });
      const PaperContentAnswerViewModels =
        newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si]
          .PaperContentViewModels[ssi].PaperContentAnswerViewModels;
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[
        ssi
      ].PaperContentAnswerViewModels = PaperContentAnswerViewModels.concat(
        removeNoneArr
      );
      this.changePaperData(newData);
    },
    clearAllAnswer(si, ssi) {
      this.$Modal.confirm({
        content: "确定要清空吗?",
        onOk: () => {
          this.changeEditPaperContentProp(
            this.aIndex,
            si,
            ssi,
            "PaperContentAnswerViewModels",
            []
          );
        }
      });
    },
    selectQuestion(si) {
      this.changeAreaIndex(this.aIndex);
      this.changeQuestionIndex(si);
      //切换试题篮
      this.getQuestionBasket();
    },
    async delAudio(si) {
      this.pushDeleteMedia(this.area.PaperQuestionViewModels[si].AudioID);
      this.changeEditPaperQuestionProp(this.aIndex, si, "AudioID", "");
      this.changeEditPaperQuestionProp(this.aIndex, si, "AudioPath", "");
    },
    async delContentAudio(si, ssi) {
      this.pushDeleteMedia(
        this.area.PaperQuestionViewModels[si].PaperContentViewModels[ssi]
          .AudioID
      );
      this.changeEditPaperContentProp(this.aIndex, si, ssi, "AudioID", "");
      this.changeEditPaperContentProp(this.aIndex, si, ssi, "AudioPath", "");
    },
    uploadAudioSuccess(si, ref) {
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "AudioID",
        ref.ResourceID
      );
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "AudioPath",
        ref.ResourcePath
      );
    },
    uploadContentAudioSuccess(si, ssi, ref) {
      this.changeEditPaperContentProp(
        this.aIndex,
        si,
        ssi,
        "AudioID",
        ref.ResourceID
      );
      this.changeEditPaperContentProp(
        this.aIndex,
        si,
        ssi,
        "AudioPath",
        ref.ResourcePath
      );
    },
    getBackgroundImgUrl(url) {
      return `url(${this.getSliceUrl(url)})`;
    },
    ifBeChoose(sv) {
      return !!sv.TrackQuestionID;
    }
  }
};
</script>

<style lang="less" scoped>
.color-span.red {
  color: #ff1d1c;
}
.area-content {
  padding: 16px;
  background: #f7f7f7;
  .question-wrap {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
    .mt {
      margin-top: 15px;
      &:first-child {
        margin-top: 0;
      }
    }
    .content-wrap {
      .index {
        color: #333333;
        font-size: 18px;
        float: left;
        width: 27px;
      }
      .content-main {
        float: left;
        width: 679px;
        .answer {
          padding: 8px 12px;
          background-color: white;
        }
      }
    }
  }
}
.ref-gray-border {
  background: white;
  padding: 11px;
  border: dashed 1px #e5e5e5;
}
.red-hint {
  margin-top: 5px;
  color: #ff1d1c;
}
.end-tips {
  padding-top: 20px;
}
.answer {
  background-color: white;
  padding: 10px;
}
</style>



/**听后回答 */
<template>
  <div class="area-content">
    <div
      v-for="(sv,si) in area.PaperQuestionViewModels"
      :key="sv.QuestionID"
      class="question-wrap"
    >
      <InputBox
        :disabled="ifBeChoose(sv)"
        @focus="()=>{selectQuestion(si);}"
        :error="getEditPaperValidateError('PromptOfPaperAndAudio',aIndex,si)"
        class="mt"
        :inputValue="sv.PromptOfPaper"
        :textarea="true"
        :audioMode="true"
        :preview="true"
        :audioUrl="getSliceUrl(sv.PromptOfPaperAudioPath)"
        @delAudio="delQuestionAudio(si)"
        placeholder="答题指导"
        @changeInput="changeEditPaperQuestionProp(aIndex,si, 'PromptOfPaper', $event)"
        @uploadAudioSuccess="($event)=>{uploadDirectAudioSuccess(si,$event);editPaperValidateError('PromptOfPaperAndAudio', '', aIndex, si);}"
      >
      </InputBox>
      <InputBox
        :disabled="ifBeChoose(sv)"
        v-if="!getEditPaperValidateError('QuestionRefTextSplit',aIndex,sv.Idx)"
        :error="getEditPaperValidateError('QuestionRefTextAndAudio',aIndex,si)"
        @focus="()=>{selectQuestion(si);editPaperValidateError('QuestionRefTextAndAudio', '', aIndex, si);}"
        class="mt"
        :textarea="true"
        :inputValue="sv.RefText"
        :audioMode="true"
        :preview="true"
        :audioUrl="getSliceUrl(sv.AudioPath)"
        @delAudio="delAudio(si)"
        @uploadAudioSuccess="($event)=>{uploadAudioSuccess(si,$event);editPaperValidateError('QuestionRefTextAndAudio', '', aIndex, si);}"
        placeholder="听力原文"
        @changeInput="changeEditPaperQuestionProp(aIndex,si, 'RefText', $event)"
      >
      </InputBox>
      <div
        v-else
        @click="editPaperValidateError('QuestionRefTextSplit', '', aIndex, sv.Idx);"
        class="color-text-wrap mt"
      >
        <PopWords
          validateName="QuestionRefTextSplit"
          :i="aIndex"
          :si="si"
          :siIdx="sv.Idx"
          :cb="t=>changeEditPaperQuestionProp(aIndex,si, 'RefText', t)"
        ></PopWords>
      </div>

      <p class="font14 end-tips ">{{sv.Prompt}}
        <img
          v-if="sv.PromptAudioPath"
          class="audio-img vm"
          @click="togglePlay(getSliceUrl(sv.PromptAudioPath))"
          :src="ifPlaying(getSliceUrl(sv.PromptAudioPath))?'/img/laba.gif':'/img/laba.png'"
        >
      </p>
      <p class="font14 end-tips">{{sv.Tips}}
        <img
          v-if="sv.TipsAudioPath"
          class="audio-img vm"
          @click="togglePlay(getSliceUrl(sv.TipsAudioPath))"
          :src="ifPlaying(getSliceUrl(sv.TipsAudioPath))?'/img/laba.gif':'/img/laba.png'"
        >
      </p>

      <div
        v-for="(ssv,ssi) in sv.PaperContentViewModels"
        :key="ssv.ContentID"
        class="content-wrap clearfix mt"
      >
        <div class="index">{{ssv.Idx}}.</div>
        <div class="content-main">
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
            placeholder="题干内容"
            @changeInput="changeEditPaperContentProp(aIndex,si,ssi, 'Text', $event)"
          >
          </InputBox>
          <HoverBox
            :disabled="ifBeChoose(sv)"
            :error="getEditPaperValidateError('PaperContentAnswerViewModelsLength',aIndex,si,ssi)"
            class="answer mt gray-border"
            :add="true"
            :batchAdd="true"
            @addEvent="addContentAnswer(si,ssi)"
            @batchAddOk="batchAddOk(si,ssi,$event)"
            :ifAddAnswer="true"
            :clear="true"
            @clear="clearAllAnswer(si,ssi)"
            :preview="ssv.PaperContentAnswerViewModels"
          >
            <p class="font14">【参考答案】</p>
            <div
              v-for="(sssv,sssi) in ssv.PaperContentAnswerViewModels"
              class="mt"
            >
              <IndexDeleteInput
                :noDel="sssi===0"
                :disabled="ifBeChoose(sv)"
                :error="getEditPaperValidateError('ContentAnswer',aIndex,si,ssi,sssi)"
                @focus="()=>{selectQuestion(si);editPaperValidateError('PaperContentAnswerViewModelsLength', '', aIndex, si,ssi);editPaperValidateError('ContentAnswer', '', aIndex, si,ssi,sssi);}"
                @colorTextClick="editPaperValidateError('ContentAnswerTextSplit', '', aIndex, sv.Idx, ssv.Idx, sssi);"
                :index="sssi+1"
                :inputValue="sssv.Content"
                @changeInput="changeEditPaperContentAnswerProp(aIndex,si,ssi,sssi,'Content',$event)"
                @del="delAnswerItem(si,ssi,sssi)"
              >

                <!-- <template v-for="item in getEditPaperValidateError('ContentAnswerTextSplit',aIndex,sv.Idx,ssv.Idx,sssi)">
                    <span
                      class="color-span"
                      v-if="item.Text!=='\n'"
                      :class="{'red':!item.Result}"
                    >{{item.Text}}</span>
                    <br v-else>
                  </template> -->
                <PopWords
                  v-if="getEditPaperValidateError('ContentAnswerTextSplit',aIndex,sv.Idx,ssv.Idx,sssi)"
                  validateName="ContentAnswerTextSplit"
                  :i="aIndex"
                  :si="si"
                  :ssi="ssi"
                  :sssi="sssi"
                  :siIdx="sv.Idx"
                  :ssiIdx="ssv.Idx"
                  :cb="t=>changeEditPaperContentAnswerProp(aIndex, si, ssi, sssi, 'Content', t)"
                ></PopWords>
              </IndexDeleteInput>
            </div>
          </HoverBox>
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
        </div>
      </div>

    </div>
  </div>
</template>
<script>
const globalVuex = createNamespacedHelpers("global");
import PopWords from '@/components/editPaper/PaperBox/PopWords'
import { createNamespacedHelpers } from "vuex";
import HoverBox from "@/components/HoverBox";
import IndexDeleteInput from "@/components/editPaper/IndexDeleteInput";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import InputBox from "@/components/InputBox";
import deepClone from "clone";
export default {
  props: ["aIndex", "getQuestionBasket"],
  components: {
    InputBox,
    HoverBox,
    PopWords,
    IndexDeleteInput
  },
  data() {
    return {};
  },
  filters: {
    joinAnswer(v) {
      const arr = v.map(sv => sv.Content);
      return arr.join("/");
    }
  },
  computed: {
    ...globalVuex.mapGetters(['ifPlaying']),
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
  methods: {
    uploadDirectAudioSuccess(si, ref) {
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "PromptOfPaperAudioPath",
        ref.ResourcePath
      );
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "PromptOfPaperAudio",
        ref.ResourceID
      );
    },
    async delQuestionAudio(si) {
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "PromptOfPaperAudioPath",
        ""
      );
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "PromptOfPaperAudio",
        ""
      );
    },
    ...globalVuex.mapActions(["togglePlay"]),
    ...mapMutations([
      "changePaperData",
      "changeAreaIndex",
      "changeQuestionIndex",
      "changeError",
      "pushDeleteMedia"
    ]),
    clearAllAnswerText(aIndex, si, ssi, ssv) {
      ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
        const error = this.getEditPaperValidateError(
          "ContentAnswerTextSplit",
          aIndex,
          si,
          ssv.Idx,
          sssi
        );
        if (error) {
          this.editPaperValidateError(
            "ContentAnswerTextSplit",
            "",
            aIndex,
            si,
            ssv.Idx,
            sssi
          );
        }
      });
    },
    ifHasAnswerError(aIndex, si, ssi, ssv) {
      for (let i = 0; i < ssv.PaperContentAnswerViewModels.length; i++) {
        const error = this.getEditPaperValidateError(
          "ContentAnswerTextSplit",
          aIndex,
          si,
          ssv.Idx,
          i
        );
        if (error) {
          return true;
        }
      }
      return false;
    },
    getContentAnswerTextList(aIndex, si, ssi, ssv) {
      const answerList = [];
      ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
        const error = this.getEditPaperValidateError(
          "ContentAnswerTextSplit",
          aIndex,
          si,
          ssv.Idx,
          sssi
        );
        if (!error) {
          answerList.push(sssv.Content);
        } else {
          answerList.push(error);
        }
      });
      return answerList;
    },
    changeContentAnswer(si, ssi, ssv, value) {
      const arr = value.split("/");
      const answerArr = [];
      arr.forEach(v => {
        if (v) {
          answerArr.push({
            ContentID: ssv.ContentID,
            Content: v
          });
        }
      });
      this.changeEditPaperContentProp(
        this.aIndex,
        si,
        ssi,
        "PaperContentAnswerViewModels",
        answerArr
      );
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
    async delQuestionImage(si, sv) {
      this.pushDeleteMedia(sv.ImageID);
      this.changeEditPaperQuestionProp(this.aIndex, si, "ImageID", "");
      this.changeEditPaperQuestionProp(this.aIndex, si, "ImagePath", "");
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
    uploadImgSuccess(si, ref) {
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "ImageID",
        ref.ResourceID
      );
      this.changeEditPaperQuestionProp(
        this.aIndex,
        si,
        "ImagePath",
        ref.ResourcePath
      );
    },
    changeQuestionSwitchType(si, arr) {
      if (arr[0] === "text") {
        this.changeEditPaperQuestionProp(this.aIndex, si, "ifImage", false);
      } else {
        this.changeEditPaperQuestionProp(this.aIndex, si, "ifImage", true);
      }
    },
    getBackgroundImgUrl(url) {
      return `url(${this.getSliceUrl(url)})`;
    },
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
    delRefTextItem(si, ssi, sssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentRefTextViewModels.splice(
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
      //update by yijun.chen at 2019.03.08判断如果追加的数组大于0 则判断之前的数组中是否有空内容 剔除空的数组
      if (removeNoneArr.length > 0) {
        const tempArr = [];
        PaperContentAnswerViewModels.forEach(v => {
          if (v.Content != null && v.Content !== "") {
            tempArr.push(v);
          }
        });
        removeNoneArr = tempArr.concat(removeNoneArr);
      } else {
        removeNoneArr = PaperContentAnswerViewModels;
      }
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[
        ssi
      ].PaperContentAnswerViewModels = removeNoneArr; //PaperContentAnswerViewModels.concat(removeNoneArr);
      this.changePaperData(newData);
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
      ].PaperContentRefTextViewModels = removeNoneArr; // PaperContentRefTextViewModels.concat(removeNoneArr);
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
    async delContentAudio(si, ssi) {
      this.pushDeleteMedia(
        this.area.PaperQuestionViewModels[si].PaperContentViewModels[ssi]
          .TipsAudioID
      );
      this.changeEditPaperContentProp(this.aIndex, si, ssi, "TipsAudioID", "");
      this.changeEditPaperContentProp(
        this.aIndex,
        si,
        ssi,
        "TipsAudioPath",
        ""
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
    ifBeChoose(sv) {
      return !!sv.TrackQuestionID;
    }
  }
};
</script>

<style lang="less" scoped>
.color-text-wrap {
  font-size: 14px;
  min-height: 48px;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px 30px 6px 10px;
  border: 1px dashed #ff1d1c;
  background: white;
  .error-answer-wrap {
    display: inline-block;
  }
}
.single-row {
  font-size: 14px;
  height: auto;
  min-height: 0;
}
.color-span.red {
  color: #ff1d1c;
}
.area-content {
  padding: 16px;
  background: #f7f7f7;
  .question-wrap {
    .prompt {
      font-weight: bold;
      color: #333;
    }
    .mt {
      margin-top: 15px;
      &:first-child {
        margin-top: 0;
      }
    }
    .content-main {
      padding: 15px 0;
      .answer {
        background: white;
        padding: 8px 12px;
      }
    }
    .content-wrap {
      background: white;
      padding: 16px 12px;
      .head {
        .index {
          color: #333333;
          font-size: 18px;
          float: left;
          width: 27px;
        }
        .content-text {
          float: left;
          width: 679px;
        }
      }
    }
  }
}
.fill-item {
  margin-top: 14px;
  .index {
    width: 22px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    display: inline-block;
    border: solid 1px #e5e5e5;
    border-right: 0;
    background: #f2f2f2;
  }
  .input-wrap {
    width: 678px;
    display: inline-block;
  }
}
.end-tips {
  padding: 20px 0 0 0;
}
.red-hint {
  margin-top: 5px;
  color: #ff1d1c;
}
</style>



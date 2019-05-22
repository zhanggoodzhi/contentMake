/* 看图回答 */
<template>
  <div class="area-content">
    <div
      v-for="(sv,si) in area.PaperQuestionViewModels"
      :key="sv.QuestionID"
      class="question-wrap"
    >
      <p class="font14 prompt">
        <span class="vm">{{sv.Prompt}}</span>
        <img
          v-if="sv.PromptAudioPath"
          class="audio-img vm"
          @click="togglePlay(getSliceUrl(sv.PromptAudioPath))"
          :src="ifPlaying(getSliceUrl(sv.PromptAudioPath))?'/img/laba.gif':'/img/laba.png'"
        >
      </p>
      <ImgBox
        :disabled="ifBeChoose(sv)"
        :error="getEditPaperValidateError('QuestionImage',aIndex,si)"
        class="mt"
        :imgUrl="getSliceUrl(sv.ImagePath)"
        @uploadImgSuccess="($event)=>{uploadImgSuccess(si,$event);editPaperValidateError('QuestionImage', '', aIndex, si);}"
        @delImage="delQuestionImage(si,sv)"
      >
      </ImgBox>
      <p class="font14 tips">
        <span class="vm">{{sv.Tips}}</span>
        <img
          v-if="sv.TipsAudioPath"
          class="audio-img vm"
          @click="togglePlay(getSliceUrl(sv.TipsAudioPath))"
          :src="ifPlaying(getSliceUrl(sv.TipsAudioPath))?'/img/laba.png':'/img/laba.png'"
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
import { createNamespacedHelpers } from "vuex";
import HoverBox from "@/components/HoverBox";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const globalVuex = createNamespacedHelpers("global");
import InputBox from '@/components/InputBox'
import ImgBox from '@/components/editPaper/PaperBox/ImgBox'
import PopWords from '@/components/editPaper/PaperBox/PopWords'
import IndexDeleteInput from '@/components/editPaper/IndexDeleteInput'
import deepClone from 'clone';
export default {
  props: ['aIndex', 'getQuestionBasket'],
  components: {
    InputBox,
    HoverBox,
    ImgBox,
    PopWords,
    IndexDeleteInput
  },
  data() {
    return {
      
    }
  },
  computed: {
    ...globalVuex.mapGetters(['ifPlaying']),
    ...mapState(['paperData', 'areaIndex', 'questionIndex', 'error']),
    area() {
      return this.paperData.PaperAreaViewModels[this.aIndex];
    }
  },
  methods: {
    ...globalVuex.mapActions(["togglePlay"]),
    ...mapMutations(['changePaperData', 'changeAreaIndex', 'changeQuestionIndex', 'changeError', 'pushDeleteMedia']),
    delAnswerItem(si, ssi, sssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels.splice(sssi, 1);
      this.changePaperData(newData);
    },
    delRefTextItem(si, ssi, sssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentRefTextViewModels.splice(sssi, 1);
      this.changePaperData(newData);
    },
    addContentAnswer(si, ssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels.push({
        ContentID: newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
        Content: ''
      });
      this.changePaperData(newData);
    },
    addContentRefText(si, ssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentRefTextViewModels.push({
        ContentID: newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
        Content: ''
      });
      this.changePaperData(newData);
    },
    batchAddOk(si, ssi, value) {
      const newData = deepClone(this.paperData);
      const arr = value.split('\n');
      let removeNoneArr = [];
      arr.forEach(v => {
        if (v) {
          removeNoneArr.push({
            ContentID: newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
            Content: v
          });
        }
      });

      const PaperContentAnswerViewModels = newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels;
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
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels = removeNoneArr;
      /* newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels = PaperContentAnswerViewModels.concat(removeNoneArr); */
      this.changePaperData(newData);
    },
    batchAddContentRefTextOk(si, ssi, value) {
      const newData = deepClone(this.paperData);
      const arr = value.split('\n');
      let removeNoneArr = [];
      arr.forEach(v => {
        if (v) {
          removeNoneArr.push({
            ContentID: newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
            Content: v
          });
        }
      });
      const PaperContentRefTextViewModels = newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentRefTextViewModels;
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
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentRefTextViewModels = removeNoneArr;//PaperContentRefTextViewModels.concat(removeNoneArr);
      this.changePaperData(newData);
    },
    clearAllAnswer(si, ssi) {
      this.$Modal.confirm({
        content: "确定要清空吗?",
        onOk: () => {
          this.changeEditPaperContentProp(this.aIndex, si, ssi, 'PaperContentAnswerViewModels', [{
            ContentID: this.paperData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
            Content: ''
          }])
        }
      });
    },
    clearAllContentRefText(si, ssi) {
      this.$Modal.confirm({
        content: "确定要清空吗?",
        onOk: () => {
          this.changeEditPaperContentProp(this.aIndex, si, ssi, 'PaperContentRefTextViewModels', [{
            ContentID: this.paperData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].ContentID,
            Content: ''
          }])
        }
      });
    },
    selectQuestion(si) {
      this.changeAreaIndex(this.aIndex);
      this.changeQuestionIndex(si);
      //切换试题篮
      this.getQuestionBasket();
    },
    uploadImgSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', ref.ResourcePath);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ifImage', true);
    },
    async delQuestionImage(si, sv) {
      this.pushDeleteMedia(sv.ImageID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', '');
    },
    async delAudio(si) {
      this.pushDeleteMedia(this.area.PaperQuestionViewModels[si].AudioID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', '');
    },
    async delContentAudio(si, ssi) {
      this.pushDeleteMedia(this.area.PaperQuestionViewModels[si].PaperContentViewModels[ssi].AudioID);
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'AudioID', '');
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'AudioPath', '');
    },
    uploadAudioSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', ref.ResourcePath);
    },
    uploadContentAudioSuccess(si, ssi, ref) {
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'AudioID', ref.ResourceID);
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'AudioPath', ref.ResourcePath);
    },
    getBackgroundImgUrl(url) {
      return `url(${this.getSliceUrl(url)})`
    },
    ifBeChoose(sv) {
      return !!sv.TrackQuestionID
    }
  }
}
</script>

<style lang="less" scoped>
.tips {
  margin-top: 10px;
}
.audio-img {
  margin-left: 5px;
  width: 16px;
  height: 13px;
  cursor: pointer;
}
.color-text-wrap {
  font-size: 14px;
  min-height: 48px;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px 30px 6px 10px;
  border: 1px dashed #ff1d1c;
  background: white;
}
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
      background: white;
      padding: 16px 12px;
      .index {
        font-weight: bold;
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
        }
      }
    }
  }
}
.red-hint {
  margin-top: 5px;
  color: #ff1d1c;
}
</style>



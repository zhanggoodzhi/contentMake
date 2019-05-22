/**填空题 */
<template>
  <div class="area-content">
    <div
      v-for="(sv,si) in area.PaperQuestionViewModels"
      :key="sv.QuestionID"
      class="question-wrap"
    >
      <p class="font14 prompt">{{sv.Prompt}}</p>
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
        <!-- <template v-for="item in getEditPaperValidateError('QuestionRefTextSplit',aIndex,sv.Idx)">
          <span
            class="color-span"
            v-if="item.Text!=='\n'"
            :class="{'red':!item.Result}"
          >{{item.Text}}</span>
          <br v-else>
        </template> -->
        <PopWords
          validateName="QuestionRefTextSplit"
          :i="aIndex"
          :si="si"
          :siIdx="sv.Idx"
          :cb="t=>changeEditPaperQuestionProp(aIndex,si, 'RefText', t)"
        ></PopWords>
      </div>
      <InputBox
        :disabled="ifBeChoose(sv)"
        :error="getEditPaperValidateError('QuestionTextAndImage',aIndex,si)"
        @focus="()=>{selectQuestion(si);editPaperValidateError('QuestionTextAndImage', '', aIndex, si);}"
        class="mt"
        :textarea="true"
        :singleSwitch="true"
        :switchType="sv.ifImage?['image']:['text']"
        @changeType="changeQuestionSwitchType(si,$event)"
        :imgUrl="getSliceUrl(sv.ImagePath)"
        @uploadImgSuccess="($event)=>{uploadImgSuccess(si,$event);editPaperValidateError('QuestionTextAndImage', '', aIndex, si);}"
        @delImage="delQuestionImage(si,sv)"
        :inputValue="sv.Text"
        placeholder="要点提示"
        @changeInput="changeEditPaperQuestionProp(aIndex,si, 'Text', $event)"
      >
      </InputBox>
      <div class="content-wrap mt">
        <p class="font14">【参考答案】</p>
        <div
          v-for="(ssv,ssi) in sv.PaperContentViewModels"
          :key="ssv.ContentID"
          class="fill-item"
        >
          <div class="index vm">{{ssv.Idx}}</div>
          <div class="input-wrap vm">
            <InputBox
              :disabled="ifBeChoose(sv)"
              v-if="!ifHasAnswerError(aIndex,sv.Idx,ssi,ssv)"
              :error="getEditPaperValidateError('PaperContentAnswerViewModelsLength',aIndex,si,ssi)"
              @focus="()=>{selectQuestion(si);editPaperValidateError('PaperContentAnswerViewModelsLength', '', aIndex, si,ssi);}"
              :inputValue="ssv.PaperContentAnswerViewModels|joinAnswer"
              placeholder="参考答案，如有多个，请以/分割"
              @changeInput="changeContentAnswer(si,ssi,ssv, $event)"
            ></InputBox>
            <div
              v-else
              @click="clearAllAnswerText(aIndex,sv.Idx,ssi,ssv)"
              class="color-text-wrap  single-row"
            >
              <template v-for="(item,itemIndex) in getContentAnswerTextList(aIndex,sv.Idx,ssi,ssv)">
                <span v-if="typeof(item) =='string'">{{item}}</span>
                <!-- <div
                  class="error-answer-wrap"
                  v-else
                >
                  <span
                    class="color-span"
                    v-for="sitem in item"
                    :class="{'red':!sitem.Result}"
                  >{{sitem.Text}}</span>
                </div> -->
                <div
                  class="error-answer-wrap"
                  v-else
                >
                  <PopWord
                    v-for="(sitem,sitemIndex) in item"
                    :allItem="item"
                    :key="sitemIndex"
                    :item="sitem"
                    :itemIndex="sitemIndex"
                    validateName="ContentAnswerTextSplit"
                    :i="aIndex"
                    :si="si"
                    :ssi="ssi"
                    :sssi="itemIndex"
                    :siIdx="sv.Idx"
                    :ssiIdx="ssv.Idx"
                    :cb="t=>changeEditPaperContentAnswerProp(aIndex, si, ssi, itemIndex, 'Content', t)"
                  ></PopWord>
                </div>
                <span v-if="itemIndex!==getContentAnswerTextList(aIndex,sv.Idx,ssi,ssv).length-1">/</span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import PopWord from '@/components/editPaper/PaperBox/PopWord'
import PopWords from '@/components/editPaper/PaperBox/PopWords'
import InputBox from '@/components/InputBox'
import deepClone from 'clone';
export default {
  props: ['aIndex', 'getQuestionBasket'],
  components: {
    InputBox,
    PopWord,
    PopWords
  },
  data() {
    return {
    }
  },
  filters: {
    joinAnswer(v) {
      const arr = v.map(sv => sv.Content);
      return arr.join('/')
    }
  },
  computed: {
    ...mapState(['paperData', 'areaIndex', 'questionIndex', 'error']),
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
    ...mapMutations(['changePaperData', 'changeAreaIndex', 'changeQuestionIndex', 'changeError', 'pushDeleteMedia']),
    clearAllAnswerText(aIndex, si, ssi, ssv) {
      ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
        const error = this.getEditPaperValidateError('ContentAnswerTextSplit', aIndex, si, ssv.Idx, sssi);
        if (error) {
          this.editPaperValidateError('ContentAnswerTextSplit', '', aIndex, si, ssv.Idx, sssi);

        }
      });
    },
    ifHasAnswerError(aIndex, si, ssi, ssv) {
      for (let i = 0; i < ssv.PaperContentAnswerViewModels.length; i++) {
        const error = this.getEditPaperValidateError('ContentAnswerTextSplit', aIndex, si, ssv.Idx, i);
        if (error) {
          return true;
        }
      }
      return false;
    },
    getContentAnswerTextList(aIndex, si, ssi, ssv) {
      const answerList = [];
      ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
        const error = this.getEditPaperValidateError('ContentAnswerTextSplit', aIndex, si, ssv.Idx, sssi);
        if (!error) {
          answerList.push(sssv.Content);
        } else {
          answerList.push(error);
        }
      });
      return answerList;
    },
    changeContentAnswer(si, ssi, ssv, value) {
      const arr = value.split('/');
      const answerArr = [];
      arr.forEach(v => {
        if (v) {
          answerArr.push({
            ContentID: ssv.ContentID,
            Content: v
          });
        }
      });
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'PaperContentAnswerViewModels', answerArr);
    },
    selectQuestion(si) {
      this.changeAreaIndex(this.aIndex);
      this.changeQuestionIndex(si);
      //切换试题篮
      this.getQuestionBasket();
    },
    async delAudio(si) {
      this.pushDeleteMedia(this.area.PaperQuestionViewModels[si].AudioID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', '');
    },
    async delQuestionImage(si, sv) {
      this.pushDeleteMedia(sv.ImageID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', '');
    },
    uploadAudioSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', ref.ResourcePath);
    },
    uploadImgSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', ref.ResourcePath);
    },
    changeQuestionSwitchType(si, arr) {
      if (arr[0] === 'text') {
        this.changeEditPaperQuestionProp(this.aIndex, si, 'ifImage', false);
      } else {
        this.changeEditPaperQuestionProp(this.aIndex, si, 'ifImage', true);
      }
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
</style>



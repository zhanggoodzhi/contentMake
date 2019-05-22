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
      <p class="font14 prompt">{{sv.Prompt}}</p>
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

        <div class="ref-gray-border mt">
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
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import HoverBox from "@/components/HoverBox";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import InputBox from '@/components/InputBox'
import IndexDeleteInput from '@/components/editPaper/IndexDeleteInput'
import deepClone from 'clone';
export default {
  props: ['aIndex', 'getQuestionBasket'],
  components: {
    InputBox,
    HoverBox,
    IndexDeleteInput
  },
  data() {
    return {

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
    changeAnswerItem() {

    },
    delAnswerItem(si, ssi, sssi) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels.splice(sssi, 1);
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
      newData.PaperAreaViewModels[this.aIndex].PaperQuestionViewModels[si].PaperContentViewModels[ssi].PaperContentAnswerViewModels = PaperContentAnswerViewModels.concat(removeNoneArr);
      this.changePaperData(newData);
    },
    clearAllAnswer(si, ssi) {
      this.$Modal.confirm({
        content: "确定要清空吗?",
        onOk: () => {
          this.changeEditPaperContentProp(this.aIndex, si, ssi, 'PaperContentAnswerViewModels', [])
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
</style>



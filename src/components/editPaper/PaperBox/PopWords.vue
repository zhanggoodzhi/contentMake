<template>
  <div>
    <template v-for="(item,itemIndex) in getEditPaperValidateError(validateName,i,siIdx,ssiIdx,sssi)">
      <v-popover
        @show="words=[]"
        @apply-show="getWords(item.Text)"
        style="display:inline;"
        trigger="hover"
        :key="itemIndex"
        :delay="{ show: 1000, hide: 100 }"
        v-if="item.Text!=='\n'"
      >
        <span
          class="color-span tooltip-target"
          :class="{'red':!item.Result}"
        >{{item.Text}}</span>
        <template slot="popover">
          <div class="popover-content edit-paper-vue-poptip">
            <div
              v-close-popover
              class="item"
              v-for="word in words"
              @click="ignore(word,itemIndex,validateName,i,currentQuestion,currentContent,sssi)"
            >{{word}}</div>
            <div
              v-close-popover
              class="item ignore"
              @click="ignore(item.Text,itemIndex,validateName,i,currentQuestion,currentContent,sssi)"
            >
              <div class="inner">
                忽略此错误
              </div>
            </div>
          </div>
        </template>
      </v-popover>
      <br v-else>
    </template>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import deepClone from "clone";
import {
  GetSuggestWords
} from "@/plugins/service";
export default {
  //siIdx: question 的Idx
  //cb 传入的changeInputValue函数

  props: ['validateName', 'i', 'si', 'ssi', 'sssi', 'siIdx', 'ssiIdx', 'cb'],
  data() {
    return {
      ifLoading: false,
      previewModalVisible: false,
      words: []
    }
  },
  created() {
  },
  computed: {
    ...mapState(['paperData', 'areaIndex', 'questionIndex', 'error']),
    currentQuestion() {
      return this.paperData.PaperAreaViewModels[this.i].PaperQuestionViewModels[this.si];
    },
    currentContent() {
      return this.paperData.PaperAreaViewModels[this.i].PaperQuestionViewModels[this.si].PaperContentViewModels[this.ssi];
    },
    currentAnswer() {
      if (!this.currentContent) {
        return null;
      }
      return this.paperData.PaperAreaViewModels[this.i].PaperQuestionViewModels[this.si].PaperContentViewModels[this.ssi].PaperContentAnswerViewModels[this.sssi]
    }
  },
  methods: {
    ...mapMutations(['changePaperData', 'changeAreaIndex', 'changeQuestionIndex', 'changeError']),
    fixWord(word, errorItemIndex, splitStr, i, siIdx, ssiIdx, sssi) {
      const errorItem = this.getEditPaperValidateError(splitStr, i, siIdx, ssiIdx, sssi);
      errorItem[errorItemIndex].Text = word;
      errorItem[errorItemIndex].Result = true;
      const text = errorItem.map(v => v.Text).join('');
      this.cb(text);
      // 没有错误的时候取消错误状态
      if (!errorItem.find(v => !v.Result)) {
        this.editPaperValidateError(splitStr, '', i, siIdx, ssiIdx, sssi);
      } else {
        this.editPaperValidateError(splitStr, errorItem, i, siIdx, ssiIdx, sssi);
      }
    },
    getWords(text) {
      GetSuggestWords(text).then(d => {
        this.words = d;
      });
    },
    ignore(word, errorItemIndex, splitStr, i, sv, ssv, sssi) {
      let ssiIdx;
      if (ssv) {
        ssiIdx = ssv.Idx;
      }
      this.fixWord(word, errorItemIndex, splitStr, i, sv.Idx, ssiIdx, sssi);
      const newData = deepClone(this.paperData);
      const ignoreObj = {
        "QuestionId": sv.QuestionID,
        "QIdx": sv.Idx,
        "ContentId": ssv ? ssv.ContentID : '',
        "CIdx": ssv ? ssv.Idx : '',
        "AnswerId": this.currentAnswer ? this.currentAnswer.AnswerID : '',
        "AIdx": sssi+1,
        "IgnoreWord": word
      };
      if (!newData.SpellIgnoreList) {
        newData.SpellIgnoreList = [ignoreObj];
      } else {
        newData.SpellIgnoreList.push(ignoreObj);
      }
      this.changePaperData(newData);
    }
  }
}
</script>

<style lang="less" scoped>
.color-span.red {
  color: #ff1d1c;
}
</style>


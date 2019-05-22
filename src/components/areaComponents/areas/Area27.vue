
<template>

  <div class="question-content">
    <div class="question-reftext">【听力原文】</div>
    <div v-for="item in question.PaperQuestionList">
      <!-- <div class="question-des">{{question.Prompt}}</div> -->
      <!-- <div class="question-des">{{item.Prompt}}</div> -->
      <div
        class="question-des"
        v-html="replaceBr(item.RefText)"
      ></div>
      <img
        class="tips-image"
        :src="getSliceUrl(item.ImagePath)"
        v-if="item.ImagePath && item.ImagePath.length > 0"
      />
      <div
        class="question-des"
        v-else
      >{{item.Text}}</div>
      <div v-for="contentItem in item.PaperContentViewModels">
        <div
          class="question-des"
          v-if="contentItem.Text"
        >{{contentItem.Text}}</div>
        <div class="question-answer">
          <div class="content-title">{{contentItem.Idx}}.&nbsp;____________________</div>
          <div class="answer-explain bb">
            <i class=" answer-point-icon font_family icon-answre"></i>参考答案:
            <span class="font16">{{getAnswerString(contentItem.PaperContentAnswerViewModels)}}</span>
          </div>
          <div class="answer-explain">
            <i class=" answer-point-icon font_family icon-konwledge"></i>考查知识点:
            <span>{{getCheckPointString(contentItem.PaperContentAbilityViewModels)}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import deepClone from "clone";
export default {
  props: ["question"],
  components: {},
  created() {
  },
  data() {
    return {};
  },
  methods: {
    getAnswerString(paperContentAnswerViewModels) {
      let answers = new Array();
      paperContentAnswerViewModels.forEach(element => {
        answers.push(element.Content);
      });
      return answers.join("/");
    },
    replaceBr(text) {
      return text.replace(/\n/g, "<Br/>");
    },
    getCheckPointString(paperContentAbilitys) {
      let names = new Array();
      paperContentAbilitys.forEach(element => {
        names.push(element.Name);
      });
      return names.join("、");
    }
  }
};
</script>

<style lang="less" scoped>
.question-content {
  .question-reftext {
    padding-bottom: 3px;
  }
  padding: 10px;
  .tips-image {
    margin-top: 5px;
    width: 400px;
    height: 300px;
    // background-color: red;
  }
  .question-des {
    line-height: 26px;
    padding: 7px 10px;
    font-size: 16px;
    color: #444444;
  }
  .question-answer {
    padding: 10px;
    .content-title {
      padding-bottom: 10px;
      font-size: 16px;
    }
    .answer-title {
      font-size: 14px;
      color: #333333;
    }
    .options {
      padding: 10px 0;
    }
    .answer-des {
      font-size: 16px;
      padding: 10px;
      border-bottom: solid 1px #e1e4eb;
    }
    .answer-explain {
      color: #666;
      span {
        color: #444;
      }
      &.bb{
        border-bottom: 1px solid #e1e4eb;
      }
      font-size: 14px;
      padding: 14px 12px;
      background-color: #e6eaf0;
      .answer-point-icon {
        margin-right: 5px;
        color: #2493f8;
        font-size: 14px;
      }
    }
  }
}
</style>




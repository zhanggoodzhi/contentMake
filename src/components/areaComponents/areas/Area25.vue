
<template>

  <div class="question-content">

    <div class="section-dec font15 first-group"><b>第一节</b></div>
    <div class="section-dec font14">【听力原文】</div>
    <div v-for="(item, questionIndex) in question.PaperQuestionList">
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
        v-show="item.Text.length > 0"
        v-else
      >{{item.Text}}1</div>
      <div v-for="contentItem in item.PaperContentViewModels">
        <div class="question-answer">
          <div
            class="section-dec font15"
            v-show="questionIndex != 0"
          ><b>第二节</b></div>
          <div
            class="content-title"
            v-show="questionIndex == 0"
          >{{contentItem.Idx}}.&nbsp;________________</div>
          <div
            class="content-title"
            v-show="questionIndex != 0"
          >{{contentItem.Tips}}</div>
          <div class="answer-explain">
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
  created() {
  },
  components: {},
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
    }  }
};
</script>

<style lang="less" scoped>
.question-content {
  padding: 10px;
  .section-dec {
    padding: 0 0 10px 0;
    &.font14 {
      padding-bottom: 3px;
    }
  }
  .first-group {
    margin-left: 7px;
    margin-bottom: 3px;
  }
  .question-des {
    line-height: 26px;
    padding: 7px 10px;
    font-size: 16px;
    color: #444444;
  }
  .tips-image {
    margin-top: 5px;
    width: 400px;
    height: 300px;
  }
  .image {
    width: 400px;
    height: 300px;
    // background-color: red;
  }
  .question-answer {
    padding: 10px;
    .content-title {
       font-size: 16px;
      padding-bottom: 10px;
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
      font-size: 14px;
      padding: 14px 12px;
      background-color: #e6eaf0;
      border-bottom: solid 1px #e1e4eb;
      .answer-point-icon {
        margin-right: 5px;
        color: #2493f8;
        font-size: 14px;
      }
    }
  }
}
</style>





<template>
  <div class="question-content">

    <div v-for="item in question.PaperQuestionList">
      <!-- <div
        class="question-des"
        v-if="(null != item.RefText) && (item.RefText.length > 0)"
        v-html="replaceBr(item.RefText)"
      ></div> -->
      <!-- <img
        class="tips-image"
        :src="getSliceUrl(item.ImagePath)"
        v-if="item.ImagePath && item.ImagePath.length > 0"
      />
      <div
        class="question-des"     、



        
        v-else
      >{{item.Text}}</div> -->
      <div v-for="contentItem in item.PaperContentViewModels">

        <div class="question-des">{{contentItem.Text}}</div>
        <div class="question-answer">
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
  created(){
  },
  props: ["question"],
  created() {
  },
  components: {},
  data() {
    return {};
  },

  methods: {
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
.question {
  background-color: #f5f8fc;
  border: solid 1px #e5e5e5;
  padding-top: 20px;
  width: 100%;
  .question-title {
    border-bottom: solid 1px #e5e5e5;
    position: relative;
    height: 20px;
    .title {
      position: absolute;
      top: -10px;
      left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #666;
    }
    .add {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: 0;
      width: 104px;
      height: 40px;
      background-color: #2493f8;
      color: white;
      line-height: 40px;
      text-align: center;
    }
    .remove {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: 0;
      width: 104px;
      height: 40px;
      background-color: #fd9822;
      color: white;
      line-height: 40px;
      text-align: center;
    }
  }
  .question-content {
    padding: 10px;
    .question-des {
      line-height: 26px;
      padding: 7px 10px;
      font-size: 16px;
      color: #444444;
    }
    .question-answer {
      padding: 10px;
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
        .answer-point-icon {
          margin-right:5px;
          color: #2493f8;
          font-size: 14px;
        }
      }
    }
  }
}
</style>




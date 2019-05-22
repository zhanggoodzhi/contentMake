
<template>

  <div class="question-content">
    <div class="question-reftext">【听力原文】</div>
    <div v-for="item in question.PaperQuestionList">

      <!-- <div class="question-des">{{item.Prompt}}</div> -->
      <div
        class="question-des"
        v-html="replaceBr(item.RefText)"
      ></div>
      <div v-for="contentItem in item.PaperContentViewModels">

        <!-- <div class="question-des">{{contentItem.Text}}</div> -->
        <div class="question-answer">
          <div class="content-title">{{contentItem.Idx}}.&nbsp;{{contentItem.Text}}</div>
          <div
            class="options"
            v-if="contentItem.PaperContentOptionViewModels.length > 0"
          >
            <RadioGroup>
              <div
                class="option-item"
                v-for="optionItem in contentItem.PaperContentOptionViewModels"
              >
                <Radio
                  :label="optionItem.OptionID"
                  :key="optionItem.OptionID"
                >
                  <span>{{optionItem.Content}}</span>
                  <img src="" />
                </Radio>
              </div>
            </RadioGroup>
          </div>
          <div class="answer-explain">
            <i class=" answer-point-icon font_family icon-answre"></i>参考答案:
            <ul style="color:#333;font-size:16px;">
              <li v-for="paperContentAnswer in contentItem.PaperContentAnswerViewModels">
                <span>{{paperContentAnswer.Content}}</span>
              </li>
            </ul>
            <!-- <div style="padding-left: 20px">{{paperContentAnswer.Content}}</div> -->
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
/*选择题 */
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import deepClone from "clone";
import { UpdateUserPaperQuestion } from "@/plugins/service";
export default {
  props: ["question", "OperateType"],
  computed: {
    ...mapState(["userDetail"])
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
.question-content {
  padding: 10px;
  .question-des {
    line-height: 26px;
    padding: 7px 10px;
    font-size: 16px;
    color: #444444;
  }
  .original-des {
    font-size: 14px;
    color: #444444;
  }
  .question-answer {
    padding: 10px;
    &:first-child {
      padding-top: 5px;
    }
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
      .option-item {
        display: inline-block;
        padding-right: 20px;
      }
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
li {
  margin-left: 30px;
  list-style: square;
  font-size: 11px;
  color: #a3a3a3;
  font-size: 11px;
  span {
    color: #444;
    font-size: 16px;
  }
}
</style>





<template>

  <div class="question-content">
    <div class="question-reftext">【听力原文】</div>

    <div v-for="item in question.PaperQuestionList">
      <!-- <div class="question-des">{{item.Prompt}}</div> -->
      <div
        class="question-des"
        v-html="replaceEnterByBr(item.RefText)"
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
        <div class="question-answer">
          <div class="content-title">{{contentItem.Idx}}.&nbsp;{{contentItem.Text}}</div>
          <div class="options">
            <RadioGroup
              :value="getAnswer(contentItem)"
              class="custom-radio"
              v-if="contentItem.ResourceType==0 || contentItem.ResourceType==1"
            >

              <div
                :class="(contentItem.Layout == 1)?'option-item-H':'option-item-V'"
                v-for="(optionItem,optionIndex) in contentItem.PaperContentOptionViewModels"
              >

                <Tooltip
                  :content="optionItem.Content"
                  placement="top-start"
                  max-width="700"
                >
                  <Radio
                    :class="(contentItem.Layout == 1)?'max-w200':'max-w700'"
                    class="radio"
                    disabled
                    :label="optionItem.OptionID"
                    :key="optionItem.OptionID"
                    v-model="disabledSingle"
                  >
                    <span>{{getIndex(optionIndex)}}.</span>
                    <span>{{optionItem.Content}}</span>
                  </Radio>

                </Tooltip>
              </div>
            </RadioGroup>

            <RadioGroup
              :value="getAnswer(contentItem)"
              class="custom-radio"
              v-else
            >
              <div
                :class="(contentItem.Layout == 1)?'option-item-H':'option-item-V'"
                v-for="(optionItem,optionIndex) in contentItem.PaperContentOptionViewModels"
              >
                <Radio
                  disabled
                  :label="optionItem.OptionID"
                  :key="optionItem.OptionID"
                  v-model="disabledSingle"
                  class="radio image-group"
                  :class="(contentItem.Layout == 1)?'max-w200':'max-w700'"
                >

                  <span>{{getIndex(optionIndex)}}.</span>
                  <img
                    v-if="optionItem.ImagePath"
                    class="option-image"
                    :src="getSliceUrl(optionItem.ImagePath)"
                  />
                </Radio>
              </div>
            </RadioGroup>

          </div>
          <div class="answer-explain">

            <i class=" answer-point-icon font_family icon-konwledge"></i>
            考查知识点:
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
  created() {
    console.log("question-select", this.question);
  },
  components: {},
  data() {
    return {
      disabledSingle: true,
      answer: ""
    };
  },

  methods: {
    getIndex(value) {
      if (value == 0) {
        return "A";
      } else if (value == 1) {
        return "B";
      } else if (value == 2) {
        return "C";
      } else if (value == 3) {
        return "D";
      } else if (value == 4) {
        return "E";
      } else if (value == 4) {
        return "F";
      }
    },
    replaceBr(text) {
      if (null != text && text.length > 0) {
        return text.replace(/\n/g, "<Br/>");
      }
      return "";
    },
    getAnswer(item) {
      if (item.PaperContentAnswerViewModels.length > 0) {
        const answerContent = item.PaperContentAnswerViewModels[0];
        for (const element of item.PaperContentOptionViewModels) {
          if (element.OptionID == answerContent.Content) {
            return element.OptionID;
          }
        }
      }
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

<style lang="less">
.image-group {
  .ivu-radio-wrapper {
    height: auto;
  }
  .option-image {
    width: 150px;
    height: 112px;
  }
}
</style>

<style lang="less" scoped>
.tips-image {
  width: 400px;
  height: 300px;
  margin-top: 5px;
  margin-left: 10px;
  // background-color: red;
}
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
      .content-title {
        font-size: 16px;
      }
      .answer-title {
        font-size: 14px;
        color: #333333;
      }
      .options {
        padding: 10px 0;
        .option-item-V {
          padding-top:2px;
          padding-bottom:2px;
          // display: inline-block;
          padding-right: 20px;
        }
        .option-item-H {
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
          color: #333;
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
  .prefix-icon {
    font-size: 7px;
  }
  .opreate {
    font-size: 7px;
    margin-left: 10px;
  }
}

.radio {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.max-w200 {
  max-width: 200px;
}
.max-w700 {
  max-width: 700px;
}
</style>
<style lang="less">
.option-item-H,
.option-item-V {
  .ivu-radio-wrapper {
    font-size: 16px;
  }
}
</style>





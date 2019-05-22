<template>
    <div class="question">
        <div class="question-title">
            <div class="title">{{formatAreaType(question.AreaType)}}</div>
            <div
                class="add"
                v-if="OperateType == 'add'"
            >+&nbsp;试题篮</div>
            <div
                class="remove"
                v-else
            >-&nbsp;移除</div>
        </div>
        <div class="question-content">
            <div class="question-des">{{question.Prompt}}</div>
             <div class="question-answer">
                <div class="answer-title">
                    <image
                        src=""
                        class="icon-img"
                    />参考答案</div>
                <div class="answer-des">"A conflicting image of the shooter has emerged as invest
                    igators try to understand the man responsible for the deadliest mass in U.S.
                    history.What could have driven Omar Mir Seddique Mateen
                </div>
                <div class="answer-explain">
                    <image
                        src=""
                        class="icon-img"
                    />考查知识点: <span>{{question.PaperAbilitys}}</span></div>
            </div>
        </div>
    </div>
</template>
<script>
/*阅读 */
import deepClone from "clone";
export default {
  props: ["question", "OperateType"],
  components: {},
  data() {
    return {};
  },

  methods: {}
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
      background-color: #e6eaf0;
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
        span{
          color: #333;
        }
        font-size: 14px;
        padding: 14px 12px;
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




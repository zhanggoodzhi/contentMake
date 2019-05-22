<template>
  <div>
    <CustomCollapse
      :title="getTitle"
      :holeTitle="getHoleTitle"
    >
      <div class="content-setting">
        <div class="form-item clearfix">
          <span class="title">小题数量</span>
          <div class="right">
            <InputNumber
              size="large"
              :disabled="$route.params.type==='preview'||$route.params.type==='prop'||$route.params.type==='lock'"
              placeholder="请输入"
              class="vm input"
              :min="0"
              :max="99"
              :precision="0"
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels.length"
              @on-change="changeContentLength"
            ></InputNumber>
            <span class="vm text font14">道</span>
          </div>
        </div>
        <div class="contents">
          <p class="font14">
            <span>小题设置</span><span class="ml">选项</span>
            <span class="mll">分值
              <Poptip
                v-if="$route.params.type!=='preview'&&$route.params.type!=='prop'&&$route.params.type!=='lock'"
                trigger="hover"
                content="解锁后，可设置不同分值"
                placement="bottom"
              >
                <i
                  @click="switchSyncScore"
                  class=" font_family icon-lock"
                  :class="syncScore?'sync-score-on':'sync-score-off'"
                ></i>
              </Poptip>
            </span>
          </p>
          <div
            class="content-item"
            v-for="(v,i) in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels"
          >
            <div class="index-wrap">
              <span class="vm font14">{{v.rankListenIndex}}</span>
            </div>
            <InputNumber
              size="large"
              :disabled="$route.params.type==='preview'||$route.params.type==='prop'||$route.params.type==='lock'"
              placeholder="请输入"
              class="vm input"
              :min="0"
              :max="4"
              :precision="0"
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels[i].ChooseItem"
              @on-change="changeChooseItem($event,i)"
            ></InputNumber>
            <!-- <InputNumber
              size="large"
              :disabled="$route.params.type==='preview'||$route.params.type==='prop'"
              placeholder="请输入"
              class="vm input"
              :min="0"
              :max="99"
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels[i].Score"
              @on-change="changeContentScore($event,i)"
            ></InputNumber> -->
            <TipInputNumber
              class="score-inputnumber vm input"
              v-model="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels[i].Score"
              @on-change="changeContentScore($event,i)"
              @on-focus="clearError(i)"
              :error="getEditTemplateValidateError('ContentScore',option.pageIndex,option.questionIndex,i)"
              :max="99"
              :toFixed2="true"
            >
            </TipInputNumber>
            <span class="vm text font14">分</span>
          </div>
        </div>
      </div>
    </CustomCollapse>
    <CustomCollapse
      title="答题设置"
      class="head-ml"
    >
      <div class="answer-setting">
        <div class="form-item clearfix">
          <span class="title">对话听</span>
          <div class="right">

            <TipInputNumber
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].AudioPlayTimes"
              @on-change="changeAudioPlayTimes"
              @on-focus="()=>{editTemplateValidateError('AudioPlayTimes', '', this.option.pageIndex, this.option.questionIndex)}"
              :error="getEditTemplateValidateError('AudioPlayTimes',this.option.pageIndex,this.option.questionIndex)"
            >
            </TipInputNumber>
            <!-- <InputNumber
              size="large"
              :disabled="$route.params.type==='preview'||$route.params.type==='prop'"
              placeholder="请输入"
              class="vm input"
              :min="0"
              :max="99"
              :precision="0"
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].AudioPlayTimes"
              @on-change="changeAudioPlayTimes"
            ></InputNumber> -->
            <span class="vm text font14">遍</span>
          </div>
        </div>
        <div class="form-item clearfix">
          <span class="title">读题时间</span>
          <div class="right">
            <TipInputNumber
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].PrepareSeconds"
              @on-change="changePrepareSeconds"
              @on-focus="()=>{editTemplateValidateError('PrepareSeconds', '', this.option.pageIndex, this.option.questionIndex)}"
              :error="getEditTemplateValidateError('PrepareSeconds',this.option.pageIndex,this.option.questionIndex)"
            >
            </TipInputNumber>
            <span class="vm text font14">秒</span>
          </div>
        </div>
        <div class="form-item clearfix">
          <span class="title">答题时间</span>
          <div class="right">
            <TipInputNumber
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].AnswerSeconds"
              @on-change="changeAnswerSeconds"
              @on-focus="()=>{editTemplateValidateError('AnswerSeconds', '', this.option.pageIndex, this.option.questionIndex)}"
              :error="getEditTemplateValidateError('AnswerSeconds',this.option.pageIndex,this.option.questionIndex)"
            >
            </TipInputNumber>
            <span class="vm text font14">秒</span>
          </div>
        </div>
      </div>
    </CustomCollapse>
  </div>
</template>
<script>
import HoverBox from "@/components/HoverBox";
import TipInputNumber from "@/components/TipInputNumber";
import CustomCollapse from "@/components/CustomCollapse";
import { changeQuestionProp, changeContentProp } from "@/plugins/utils";
import { bus, rankListenQuestion } from "@/plugins/bus";
import deepClone from "clone";
export default {
  props: ["option", "changeOption"],
  components: {
    HoverBox,
    CustomCollapse,
    TipInputNumber
  },

  data() {
    return {
      syncScore: true
    };
  },
  computed: {
    getTitle() {
      let title = this.formatAreaType(
        this.option.templateData.TemplateAreaViewModels[this.option.pageIndex]
          .AreaType
      );
      const maxLength = 6;
      if (title.length > maxLength) {
        title = title.slice(0, maxLength) + "...";
      }
      return `【${title}】试题设置`;
    },
    getHoleTitle() {
      let title = this.formatAreaType(
        this.option.templateData.TemplateAreaViewModels[this.option.pageIndex]
          .AreaType
      );
      return `【${title}】试题设置`;
    }
  },
  methods: {
    switchSyncScore() {
      this.syncScore = !this.syncScore;
    },
    changeAudioPlayTimes(value) {
      if (!value) {
        setTimeout(() => {
          changeQuestionProp(this, {
            AudioPlayTimes: 0
          });
        }, 0);
      }
      changeQuestionProp(this, {
        AudioPlayTimes: value
      });
    },
    changePrepareSeconds(value) {
      if (!value) {
        setTimeout(() => {
          changeQuestionProp(this, {
            PrepareSeconds: 0
          });
        }, 0);
      }
      changeQuestionProp(this, {
        PrepareSeconds: value
      });
    },
    changeAnswerSeconds(value) {
      if (!value) {
        setTimeout(() => {
          changeQuestionProp(this, {
            AnswerSeconds: 0
          });
        }, 0);
      }
      changeQuestionProp(this, {
        AnswerSeconds: value
      });
    },
    changeContentLength(number) {
      const newData = deepClone(this.option);
      const oldLength = this.option.templateData.TemplateAreaViewModels[
        this.option.pageIndex
      ].TemplateQuestionViewModels[this.option.questionIndex]
        .TemplateContentViewModels.length;
      if (number > oldLength) {
        for (let i = 0; i < number - oldLength; i++) {
          newData.templateData.TemplateAreaViewModels[
            this.option.pageIndex
          ].TemplateQuestionViewModels[
            this.option.questionIndex
          ].TemplateContentViewModels.push({
            ContentID: "",
            TemplateID: "",
            AreaID: "",
            QuestionID: "",
            Score: 0,
            ChooseItem: 3,
            Idx: oldLength + i + 1
          });
        }
      } else {
        for (let i = 0; i < oldLength - number; i++) {
          newData.templateData.TemplateAreaViewModels[
            this.option.pageIndex
          ].TemplateQuestionViewModels[
            this.option.questionIndex
          ].TemplateContentViewModels.pop();
        }
      }
      this.changeOption(newData);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    changeChooseItem(value, i) {
      if (!value) {
        setTimeout(() => {
          changeContentProp(this, i, {
            ChooseItem: 0
          });
        }, 0);
      }
      changeContentProp(this, i, {
        ChooseItem: value
      });
    },
    clearError(i) {
      if (!this.syncScore) {
        this.editTemplateValidateError('ContentScore', '', this.option.pageIndex, this.option.questionIndex, i);
      } else {
        this.option.templateData.TemplateAreaViewModels[
          this.option.pageIndex
        ].TemplateQuestionViewModels[
          this.option.questionIndex
        ].TemplateContentViewModels.forEach((sv, si) => {
          setTimeout(() => {
            this.editTemplateValidateError('ContentScore', '', this.option.pageIndex, this.option.questionIndex, si);
          }, 0);
        });
      }
    },
    // 让input不能输入空值
    changeContentScore(value, i) {
      if (this.syncScore) {
        this.option.templateData.TemplateAreaViewModels[
          this.option.pageIndex
        ].TemplateQuestionViewModels[
          this.option.questionIndex
        ].TemplateContentViewModels.forEach(element => {
          element.Score = value;
        });
      }
      if (!value) {
        setTimeout(() => {
          changeContentProp(this, i, {
            Score: 0
          });
        }, 0);
      }
      //两位小数（大坑：inputNumber组件如果传入值不变，它显示的内容也不变）
      if (
        value &&
        value.toString().split(".").length > 1 &&
        value.toString().split(".")[1].length > 2
      ) {
        console.log(value.toString());
        this.$nextTick(() => {
          changeContentProp(this, i, {
            Score: null
          });
          this.$nextTick(() => {
            changeContentProp(this, i, {
              Score: Number(
                value.toString().split(".")[0] +
                "." +
                value.toString().split(".")[1][0] +
                value.toString().split(".")[1][1]
              )
            });
            if (this.syncScore) {
              this.option.templateData.TemplateAreaViewModels[
                this.option.pageIndex
              ].TemplateQuestionViewModels[
                this.option.questionIndex
              ].TemplateContentViewModels.forEach(element => {
                element.Score = Number(
                  value.toString().split(".")[0] +
                  "." +
                  value.toString().split(".")[1][0] +
                  value.toString().split(".")[1][1]
                );
              });
            }
          });
        });
        return;
      }
      changeContentProp(this, i, {
        Score: value
      });
    }
  }
};
</script>

<style lang="less" scoped>
.answer-setting,
.content-setting {
  line-height: 32px;
  .form-item {
    margin-bottom: 15px;
    .title {
      font-size: 14px;
      vertical-align: -2px;
    }

    .right {
      float: right;
      .input {
        width: 60px;
      }

      .text {
        margin-left: 6px;
      }
    }
  }
}
.content-setting {
  .contents {
    .index-wrap {
      display: inline-block;
      width: 50px;
      text-align: center;
    }
    border-top: solid 1px #e5e5e5;
    .ml {
      margin-left: 20px;
    }
    .mll {
      margin-left: 30px;
    }
    .content-item {
      margin-top: 12px;
      &:first-child {
        margin-top: 0;
      }
      .input {
        margin-left: 15px;
        width: 50px;
        &:first-child {
          margin-left: 0;
        }
      }
      .text {
        margin-left: 5px;
      }
    }
  }
}
.sync-score-on {
  color: #2493f8;
  font-size: 15px;
}
.sync-score-off {
  color: #333;
  font-size: 15px;
}
</style>


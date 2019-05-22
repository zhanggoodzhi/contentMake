<template>
  <div>
    <CustomCollapse
      :title="getTitle"
      :holeTitle="getHoleTitle"
    >
      <div class="content-setting">
        <div class="form-item clearfix">
          <span class="title">小题分值</span>
          <div class="right">
            <!-- <InputNumber
              size="large"
              :disabled="$route.params.type==='preview'||$route.params.type==='prop'"
              placeholder="请输入"
              class="vm input"
              :min="0"
              :max="99"
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels[0].Score"
              @on-change="changeContentScore"
            ></InputNumber> -->
            <TipInputNumber
              class="score-inputnumber vm input"
             :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].TemplateContentViewModels[0].Score"
              @on-change="changeContentScore"
              @on-focus="()=>{editTemplateValidateError('ContentScore', '', option.pageIndex, option.questionIndex,0)}"
              :error="getEditTemplateValidateError('ContentScore',option.pageIndex,option.questionIndex,0)"
              :max="99"
              :toFixed2="true"
            >
            </TipInputNumber>
            <span class="vm text font14">分</span>
          </div>
        </div>
      </div>
    </CustomCollapse>
    <CustomCollapse title="答题设置" class="head-ml">
      <div class="answer-setting">

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
        <div class="form-item clearfix">
          <span class="title">提前提交最大时长</span>
          <div class="right">
            <TipInputNumber
              :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].PreSubmitMaxSeconds"
              @on-change="changePreSubmitMaxSeconds"
              @on-focus="()=>{editTemplateValidateError('PreSubmitMaxSeconds', '', this.option.pageIndex, this.option.questionIndex)}"
              :error="getEditTemplateValidateError('PreSubmitMaxSeconds',this.option.pageIndex,this.option.questionIndex)"
              :max="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[option.questionIndex].AnswerSeconds"
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
import TipInputNumber from '@/components/TipInputNumber';
import CustomCollapse from "@/components/CustomCollapse";
import { changeQuestionProp, changeContentProp } from "@/plugins/utils";
import deepClone from "clone";
export default {
  props: ["option", "changeOption"],
  components: {
    HoverBox,
    CustomCollapse,
    TipInputNumber
  },

  data() {
    return {};
  },
  computed: {
    getTitle() {
      let title = this.formatAreaType(this.option.templateData.TemplateAreaViewModels[this.option.pageIndex].AreaType);
      const maxLength = 6;
      if (title.length > maxLength) {
        title = title.slice(0, maxLength) + '...';
      }
      return `【${title}】试题设置`;
    }, getHoleTitle() {
      let title = this.formatAreaType(this.option.templateData.TemplateAreaViewModels[this.option.pageIndex].AreaType);
      return `【${title}】试题设置`;
    }
  },
  methods: {
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
    // 修改答题时间，若此时提前提交时间更大，把提前提交最大时间变成当前值
    changeAnswerSeconds(value) {
      if (!value) {
        setTimeout(() => {
          changeQuestionProp(this, {
            AnswerSeconds: 0,
            PreSubmitMaxSeconds: 0
          });
        }, 0);
      }
      if (this.option.templateData.TemplateAreaViewModels[this.option.pageIndex].TemplateQuestionViewModels[this.option.questionIndex].PreSubmitMaxSeconds > value) {
        changeQuestionProp(this, {
          AnswerSeconds: value,
          PreSubmitMaxSeconds: value
        });
      } else {
        changeQuestionProp(this, {
          AnswerSeconds: value
        });
      }
    },
    changePreSubmitMaxSeconds(value) {
      if (!value) {
        setTimeout(() => {
          changeQuestionProp(this, {
            PreSubmitMaxSeconds: 0
          });
        }, 0);
      }
      changeQuestionProp(this, {
        PreSubmitMaxSeconds: value
      });
    },
    changeContentScore(value) {
      if (!value) {
        setTimeout(() => {
          changeContentProp(this, 0, {
            Score: 0
          });
        }, 0);
      }
      //两位小数（大坑：inputNumber组件如果传入值不变，它显示的内容也不变）
      if (value && value.toString().split('.').length > 1 && value.toString().split('.')[1].length > 2) {
        console.log(value.toString());
        this.$nextTick(() => {
          changeContentProp(this, 0, {
            Score: null
          });
          this.$nextTick(() => {
            changeContentProp(this, 0, {
              Score: Number(value.toString().split('.')[0] + '.' + value.toString().split('.')[1][0] + value.toString().split('.')[1][1])
            });
          });
        });
        return;
      }
      changeContentProp(this, 0, {
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
      margin-left: 30px;
    }
    .mll {
      margin-left: 40px;
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
</style>


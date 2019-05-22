/* 听后记录并转述 */
<template>
  <div>
    <TitleAndPrompt
      :option="option"
      :changeOption="changeOption"
    ></TitleAndPrompt>
    <HoverQuestion
      v-for="(v,i) in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels"
      :key="i"
      :qIndex="i"
      :option="option"
      class="question"
      :changeOption="changeOption"
    >
      <template v-if="ifOne">
        <div class="active-content-wrap bg">
          <p class="vm title"><span>试题内容</span></p>
        </div>
        <div class="active-content-option">
          <div
            class="content"
            v-for="sv in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels"
          >
            <span class="vm content-id">{{sv.rankListenIndex}}.</span>
            <div class="vm content-text">
              <span class="vm gray">（分值：<span class="font12">{{sv.Score}}</span>）</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="active-content-wrap  bg special">
          <p class="vm title"><span>试题内容</span></p>
          <p class="vm title"><span>（分值：<span class="font12">{{option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels[0].Score}}</span>）</span></p>
        </div>
      </template>
    </HoverQuestion>
  </div>
</template>
<script>
import HoverBox from "@/components/HoverBox";
import HoverQuestion from "@/components/editTemplate/box/HoverQuestion";
import TitleAndPrompt from "@/components/editTemplate/box/TitleAndPrompt";
import {
  changeAreaProp,
  changeQuestionProp,
  getFormatUrl
} from "@/plugins/utils";
export default {
  props: ["option", "changeOption"],
  components: {
    HoverBox,
    TitleAndPrompt,
    HoverQuestion
  },
  data() {
    return {};
  },
  computed: {
    ifOne() {
      if (this.option.templateData.TemplateAreaViewModels[this.option.pageIndex].SmallIndex == 1) {
        return true;
      }
      return false;
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.question {
  .active-content-wrap {
    height: 200px;
    background-color: #ededed;
    padding: 30px 15px;
    margin-bottom: 20px;
    &.special {
      .title {
        height: auto;
        line-height: 1.5;
        margin-top: 5px;
        &:first-child {
          margin-top: 50px;
        }
        &:last-child {
          color: #969fa7;
        }
      }
    }
    .title {
      height: 140px;
      line-height: 140px;
      color: #333333;
      text-align: center;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .active-content-option {
    margin-top: 20px;

    .content {
      margin-left: 16px;
      margin-bottom: 10px;
      width: 130px;
      display: inline-block;
      .content-id {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 0px;
        color: #333333;
        display: inline-block;
      }
      .content-text {
        background-color: #ededed;
        text-align: center;
        line-height: 23px;
        margin-left: 4px;
        width: 95px;
        /* height: 30px; */
        display: inline-block;

        .gray {
          color: #97a0a8;
        }
      }
    }
  }
}
</style>


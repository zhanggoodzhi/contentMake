/* 听对话或独白回答问题 */
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
      <div
        v-for="sv in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels"
        class="active-content-wrap"
      >
        <p><span>{{sv.rankListenIndex}}.</span><span class="gray">（分值：{{sv.Score}}）</span></p>
      </div>
    </HoverQuestion>
  </div>
</template>
<script>
import HoverBox from '@/components/HoverBox';
import HoverQuestion from '@/components/editTemplate/box/HoverQuestion';
import TitleAndPrompt from '@/components/editTemplate/box/TitleAndPrompt';
import { changeAreaProp, changeQuestionProp, getFormatUrl } from '@/plugins/utils'
import deepClone from 'clone';
export default {
  props: ['option', 'changeOption'],
  components: {
    HoverBox,
    TitleAndPrompt,
    HoverQuestion
  },

  data() {
    return {
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.question {
  .active-content-wrap {
    background-color: #ededed;
    padding: 30px 15px;
    margin-bottom: 20px;
    .gray {
      color: #97a0a8;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>


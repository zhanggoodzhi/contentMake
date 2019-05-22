<template>
  <div class="default-box-wrap">
    <TitleAndPrompt :option="option" :changeOption="changeOption"></TitleAndPrompt>
     <div class="select-tip">
       无试题，请从题型组件中选择
     </div>
  </div>
</template>
<script>
import HoverBox from '@/components/HoverBox';
import deepClone from 'clone';
import TitleAndPrompt from '@/components/editTemplate/box/TitleAndPrompt';
export default {
  props: ['option', 'changeOption'],
  components: {
    HoverBox,
    TitleAndPrompt
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
.select-tip{
  font-size: 14px;
  height: 300px;
  line-height: 300px;
  text-align: center;
  color: #a6a6a6;
}
</style>


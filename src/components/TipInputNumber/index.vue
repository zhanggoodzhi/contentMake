<template>
  <Tooltip
    class="input-number-tooltip"
    :class="{'error':error}"
    placement="left"
    :content="error"
    :disabled="!error"
  >
    <InputNumber
      size="large"
      :disabled="$route.params.type==='preview'||$route.params.type==='prop'"
      placeholder="请输入"
      class="vm input"
      @on-focus="focusEvent"
      @on-change="changeEvent"
      :min="0"
      :max="max?max:199"
      :precision="toFixed2?undefined:0"
      :value="value"
      v-on="$listeners"
    ></InputNumber>
  </Tooltip>
</template>
<script>

export default {
  props: ['error', 'value', 'max','toFixed2'],
  data() {
    return {
      addModalVisible: false
    }
  },
  created() {

  },
  computed: {

  },
  methods: {
    focusEvent() {
      this.$emit('on-focus');
    },
    changeEvent(e) {
      this.$emit('on-change', e);
      setTimeout(()=>{
        this.$emit('on-focus');
      });
    }
  }
}
</script>

<style lang="less" scoped>
</style>
<style lang="less">
</style>


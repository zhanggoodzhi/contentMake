<template>
  <Collapse
    value="1"
    @on-change="changeArrow"
    class="custom-collapse"
  >
    <Panel name="1">
      <div class="header">
        <span class="collapse-title" :title="holeTitle?holeTitle:''">{{title}}</span>
        <Icon
          class="arrow"
          type="ios-arrow-down"
          :class="{'active':arrowState}"
        />
      </div>
      <div slot="content">
        <slot></slot>
      </div>
    </Panel>
  </Collapse>
</template>
<script>
export default {
  // holeTitle: title过长，tip显示的字段
  props: ['title', 'paperMode','holeTitle'],
  data() {
    return {
      arrowState: false
    }
  },
  methods: {
    changeArrow() {
      this.arrowState = !this.arrowState;
    }
  }
}
</script>

<style lang="less">
.custom-collapse {
  border: 0 !important;
  .header {
    background-color: #f5f5f5;
    border-top: 1px solid #2493f8;
  }
  .ivu-collapse-content {
    padding: 0 !important;
    text-align: center;
    .ivu-collapse-content-box {
      width: 199px;
      display: inline-block;
      text-align: left;
    }
  }
  .ivu-collapse-header {
    .ivu-icon-ios-arrow-forward {
      display: none;
    }
    padding: 0 !important;
    border-bottom: 0 !important;
  }
  .collapse-title {
    margin-left: 14px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }
  .arrow {
    float: right;
    font-size: 20px;
    transition: all 0.2s;
    margin-top: 10px;
    margin-right: 7px;
    color: #999999;
    &.active {
      transform: rotateZ(180deg);
    }
  }
}
</style>


<template>
  <!--  class="question-collapse-select" -->
  <!-- v-bind:class="isselect==true ? 'question-collapse-select' : 'question-collapse' " -->
  <Collapse
    value="1"
    @on-change="changeArrow"
    v-bind:class="isselect==true ? 'question-collapse-select' : 'question-collapse' "
  >
    <Panel name="1">
      <div class="header">
        <span class="collapse-title">{{title}}</span>
        <span class="icon-container">
          <Icon
            class="arrow"
            type="ios-arrow-down"
            :class="{'active':arrowState}"
          />
        </span>
      </div>
      <div slot="content">
        <slot></slot>
      </div>
    </Panel>
  </Collapse>
</template>
<script>
export default {
  props: ["title", "paperMode", "isselect"],
  data() {
    return {
      arrowState: false
    };
  },
  methods: {
    changeArrow() {
      this.arrowState = !this.arrowState;
    }
  }
};
</script>

<style lang="less" >
.question-collapse {
  border: 0 !important;
  .header {
    background-color: #fff;
    border-top: 0px solid #333;
  }
  .ivu-collapse-content {
    padding: 0 !important;
    //border: 0.5px solid #2493f8 ;
    background-color: #f5f8fc;
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
    display: inline-block;
    // width: 25%;
    text-align: left;
    margin-left: 1px;
    font-size: 14px;
    color: #333;
  }
  .icon-container {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    .arrow {
      display: inline-block;
      font-size: 15px;
      transition: all 0.2s;
      margin-top: 10px;
      color: #2493f8;
      &.active {
        transform: rotateZ(180deg);
      }
    }
  }
}

.question-collapse-select {
  border: 0 !important;
  .header {
    background-color: #f7f7f7;
    border-top: 0px solid #333;
  }
  .ivu-collapse-content {
    padding: 0 !important;
    //border: 0.5px solid #2493f8 ;
    background-color: #f7f7f7;
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
    margin-left: 1px;
    font-size: 14px;

    color: #999999;
  }
  .icon-container {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    .arrow {
      //float: right;
      display: inline-block;
      font-size: 15px;
      transition: all 0.2s;
      margin-top: 10px;
      //margin-right: 250px;
      color: #999999;
      &.active {
        transform: rotateZ(180deg);
      }
    }
  }
}
</style>


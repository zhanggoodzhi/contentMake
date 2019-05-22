<template>
  <Collapse
    value=""
    @on-change="changeArrow"
    class="paper-area-collapse"
    :class="{'error':error}"
  >
    <Panel name="1">
      <div class="header">
        <span class="collapse-title">{{title}}</span>
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
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const editPaperVuex = createNamespacedHelpers("editPaper");
export default {
  props: ["title", "error", "aIndex", "getQuestionBasket"],
  data() {
    return {
      arrowState: false
    };
  },
  methods: {
    
    ...editPaperVuex.mapMutations(['changePaperFocusInput']),
    ...mapMutations([
      "changePaperData",
      "changeAreaIndex",
      "changeQuestionIndex",
      "changeError",
      "pushDeleteMedia"
    ]),
    changeArrow() {
      this.arrowState = !this.arrowState;
      //

      this.changeAreaIndex(this.aIndex);
      this.changeQuestionIndex(0);
      //切换试题篮
      this.getQuestionBasket();
      this.changePaperFocusInput(this._uid);
    }
  }
};
</script>

<style lang="less">
.paper-area-collapse {
  border: solid 1px #e5e5e5;
  border-radius: 0 !important;
  &.error {
    border-color: red;
    .ivu-collapse-header {
      .header {
        border-color: red;
      }
    }
    .ivu-collapse-item-active {
      .header {
        border-color: #e5e5e5;
      }
    }
  }
  .header {
    background-color: #f5f5f5;
  }
  .ivu-collapse-content {
    padding: 0 !important;
    .ivu-collapse-content-box {
      padding: 0;
      .discription {
        font-size: 14px;
        // padding-top: 3px;
      }
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
    font-size: 15px;
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


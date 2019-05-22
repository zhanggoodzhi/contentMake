<template>
  <Collapse
    value="1"
    @on-change="changeArrow"
    class="paper-area-collapse"
  >
    <Panel name="1">
      <div class="header">
        <span class="collapse-title">{{getCollapseTitle(paperArea)}}</span>
       
        <Icon
          class="arrow"
          type="ios-arrow-down"
          :class="{'active':arrowState}"
        />
         <span class="retract">收起</span>
      </div>
      <div slot="content">
        <slot></slot>
      </div>
    </Panel>
  </Collapse>
</template>
<script>
export default {
  props: ['title', 'paperArea'],
  data() {
    return {
      arrowState: false
    }
  },
  methods: {
    changeArrow() {
      this.arrowState = !this.arrowState;
    },
    getCollapseTitle(v) {
      let count = 0;
      let areaScore = 0;
      let contentScore;
      var isSingleScore = true;
      var firstContentScore = 0;
      v.PaperQuestionViewModels.forEach(sv => {
        sv.PaperContentViewModels.forEach(ssv => {
          count++;
          areaScore += ssv.Score;
          contentScore = ssv.Score;
          if (count == 1) {
            firstContentScore = ssv.Score;
          }
          if (count > 1 && firstContentScore != ssv.Score) {
            isSingleScore = false;
          }
        });
      });
      if (this.ifComplexArea(v.AreaType)) {
        let firstQuestionScore = 0;
        v.PaperQuestionViewModels[0].PaperContentViewModels.forEach(v => {
          firstQuestionScore += v.Score;
        });
        let secondQuestionScore = 0;
        v.PaperQuestionViewModels[1].PaperContentViewModels.forEach(v => {
          secondQuestionScore += v.Score;
        });
        return `${
          v.AreaTitle
          }（第一部分，总分${firstQuestionScore}分；第二部分，总分${secondQuestionScore}分）`;
      } else if (isSingleScore) {
        return `${
          v.AreaTitle
          }（共${count}小题；每小题${contentScore}分，总分${areaScore}分）`;
      } else {
        return `${v.AreaTitle}（共${count}小题；总分${areaScore}分）`;
      }
    },
  }
}
</script>

<style lang="less">
.paper-area-collapse {
  border: solid 1px #e5e5e5;
  border-radius: 0 !important;
  .header {
    background-color: #eff3f5;
    border-bottom: solid 1px #ddd;
  }
  .ivu-collapse-content {
    padding: 0 !important;
    .ivu-collapse-content-box {
      padding: 0;
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
  .retract{
    float: right;
    font-size: 12px;
    color: #777777;
  }
}
</style>


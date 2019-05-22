
<template>
  <div class="question">
    <div class="question-title">
      <div class="title">{{question.AreaTitle||formatAreaType(question.AreaType)}}</div>
      <div
        class="add"
        v-if="!question.IsQuestionBasket"
        @click="updateBasket(0,question)"
      >
        <i class=" prefix-icon font_family icon-template_add_normal_"></i>
        <span class="opreate">试题篮</span>
      </div>
      <div
        class="remove"
        v-else
        @click="updateBasket(1,question)"
      >
        <i class=" prefix-icon font_family icon-reduce"></i>
        <span class="opreate">移除</span>
      </div>
    </div>
    <div class="question-content area-component-common">
      <component
        :is="getAreaComponent(question.AreaType)"
        :question="question"
      ></component>
    </div>
  </div>
  </div>
</template>
<script>
/*选择题 */
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import deepClone from "clone";
import { UpdateUserPaperQuestion, GetCountOfAreaType } from "@/plugins/service";
import * as AreaComponent from "@/components/areaComponents/areas";
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  props: ["question", "OperateType"],
  computed: {
    ...mapState(["userDetail", "BasketCountList"])
  },
  components: { ...areaObj },
  data() {
    return {
      disabledSingle: true
    };
  },

  methods: {
    ...mapMutations(["changeBasketCountList"]),
    getAreaComponent(type) {
      return "Area" + type;
    },
    updateBasket(type, question) {
      const param = [
        {
          Type: type,
          UserID: this.userDetail.UserID,
          QuestionSummaryID: question.QuestionSummaryID,
          AreaType: question.AreaType,
          TemplateAreaID: question.TemplateAreaID
        }
      ];
      UpdateUserPaperQuestion(param).then(d => {
        if (d.Success) {
          question.IsQuestionBasket = !question.IsQuestionBasket;
          this.$Message.success(d.State);
          //更新试题篮头部
          this.getBasketCount();
        } else {
          this.$Message.error("error");
        }
      });
    },
    getBasketCount() {
      GetCountOfAreaType().then(d => {
        const data = d.ResponseData;

        this.changeBasketCountList(data);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  background-color: #f5f8fc;
  border: solid 1px #e5e5e5;
  padding-top: 20px;
  width: 100%;
  .question-title {
    border-bottom: solid 1px #e5e5e5;
    position: relative;
    height: 20px;
    .title {
      font-weight: bold;
      position: absolute;
      top: -10px;
      left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #666;
    }
    .add {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: 0;
      width: 104px;
      height: 40px;
      background-color: #2493f8;
      color: white;
      line-height: 40px;
      text-align: center;
      &:hover {
        opacity: 0.8;
      }
    }
    .remove {
      cursor: pointer;
      position: absolute;
      top: -20px;
      right: 0;
      width: 104px;
      height: 40px;
      background-color: #fd9822;
      color: white;
      line-height: 40px;
      text-align: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .prefix-icon {
    font-size: 7px;
  }
  .opreate {
    font-size: 14px;
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.area-component-common {
  .question-reftext {
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>






<template>

  <div class="question">
    <div class="question-title">
      <div class="title">情景提问</div>
      <div class="add" v-if="OperateType == 'add'">+&nbsp;试题篮</div>
      <div class="remove" v-else>-&nbsp;移除</div>
    </div>



     <component :is="getAreaComponent(1)"></component>


    <!-- 陈 -->
    <!-- <div
      class="item"
      v-for="ques in QuestionList">
      <div class="button">
        <div v-if="userDetail.UserID!=ques.RelationUserID" @click="updateBasket(0,ques)"> + 试题篮</div>
        <div v-if="userDetail.UserID==ques.RelationUserID" @click="updateBasket(1,ques)"> - 移除</div>
      </div>
      <span>{{ques.Prompt}}</span>
    </div> -->
  </div>

</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import { UpdateUserPaperQuestion } from "@/plugins/service";
import * as AreaComponent from "@/components/areaComponents/areas";
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  props: ["SearchParam", "ChangeSearchPara", "QuestionList","OperateType"],
  created() {},
    components: {
    ...areaObj
    },
  computed: {
    ...mapState(["userDetail"])
  },
  mounted() {},
  methods: {
    getAreaComponent(type) {
      return "Area" + type;
    },
    updateBasket(type, question) {
      //type  0=新加  1=移除
      if (type == 0) {
        question.RelationUserID = this.userDetail.UserID;
      } else {
        question.RelationUserID = "";
      }
      const param = {
        Type: type,
        UserID: this.userDetail.UserID,
        QuestionID: question.QuestionID
      };
      UpdateUserPaperQuestion(param).then(d => {
        if (d.Success) {
          this.$Message.success(d.State);
        }
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
  .question-title{
    border-bottom: solid 1px #e5e5e5;
    position: relative;
    height: 20px;
    .title{
      position: absolute;
      top: -10px;
      left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #666; 
    }
    .add{
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
    }
    .remove{
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
    }
  }
}
</style>

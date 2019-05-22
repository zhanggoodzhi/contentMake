/* 听后描述 */
<template>
  <div>
    <div v-for="question in PaperQuestionViewModels">
      <basketQuestion :questionData="question">

      </basketQuestion>
    </div>
  </div>
</template>
<script>
import basketQuestion from "@/components/editPaper/AreaBasket/basketQuestion";

import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import deepClone from "clone";
export default {
  props: [],
  components: {
    basketQuestion
  },
  created(){
  },

  data() {
    return {
    };
  },
  computed: {
    ...mapState([
      "paperData",
      "areaIndex",
      "questionIndex",
      "resultQuestionBasket"
    ]),
    PaperQuestionViewModels() {
      console.log("2、");
      const arr = [];
      if (this.resultQuestionBasket != null) {
        if (
          this.resultQuestionBasket.questionBasketList &&
          this.resultQuestionBasket.questionBasketList.length
        ) {
          const basket = {
            Ability: "",
            Content: []
          };
          this.resultQuestionBasket.questionBasketList.forEach(
            questionbasket => {
              questionbasket.PaperQuestionList.forEach((question, index) => {
                if (index == 0) {
                  //普通题型 和 复杂题型的第一部分
                  basket.RefText = question.RefText;
                  basket.ImagePath=question.ImagePath;
                  //找题干和选择题的选项
                  question.PaperContentViewModels.forEach(content => {
                    //cotent的题干部分
                    const con = {
                      Option: []
                    };
                    //此题可能是图片或者文字
                    con.ImagePath = content.ImagePath;
                    con.Text = content.Text;
                    basket.Content.push(con);
                    //考查知识点
                   
                    content.PaperContentAbilityViewModels.forEach(ability => {
                      basket.Ability = basket.Ability + ability.Name + "、";
                    });                  
                  });
                  //将试卷结构也传进去
                  basket.PaperQuestion = question;
                } else {
                  //复杂题型的第二部分
                  basket.PaperQuestionTwo = question;
                }
              });
              basket.Ability = basket.Ability.substring(0,basket.Ability.length - 1);
              basket.QuestionSummaryID = questionbasket.QuestionSummaryID;
              arr.push(basket);
            }
          );
        }
      }
      return arr;
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
</style>


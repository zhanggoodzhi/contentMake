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
  created() {},
  data() {
    return {
      /* PaperQuestionViewModels: [
        {  
          RefText: "Who are the man and the woman?",
          Ability: "问候、个人情况、工作与职业",
          Content:[{
                Text: "Who are the man and the woman?11",
                Option: []
             },
             {
                Text: "Who are the man and the woman?11",
                Option: []
             }
          ]  
        },
        {
          Text: "Who are the man and the woman?22",
          RefText: "Who are the man and the woman?",
          Ability: "问候、个人情况、工作与职业",
          Option: []
        }
      ] */
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
      const arr = [];

      if (this.resultQuestionBasket != null) {
        if (
          this.resultQuestionBasket.questionBasketList &&
          this.resultQuestionBasket.questionBasketList.length
        ) {
          this.resultQuestionBasket.questionBasketList.forEach(
            questionbasket => {
              questionbasket.PaperQuestionList.forEach(question => {
                const basket = {
                  Ability:'',
                  Content: []
                };
                basket.RefText = question.RefText;
                //找题干和选择题的选项
                question.PaperContentViewModels.forEach(content => {
                  //cotent的题干部分
                  const con = {
                    Option: []
                  };
                  con.Text = content.Text;
                  content.PaperContentOptionViewModels.forEach(option => {
                    const basketOption = {};
                    basketOption.OptionID = this.getOptionText(option.Idx);
                    basketOption.ImagePath = option.ImagePath;
                    basketOption.Content = option.Content;
                    con.Option.push(basketOption);
                  });
                  basket.Content.push(con);
                  //考查知识点
                  content.PaperContentAbilityViewModels.forEach(ability => {
                    basket.Ability = basket.Ability + ability.Name + "、";
                  });
                  
                });
                //将试卷结构也传进去
                basket.Ability=basket.Ability.substring(0,basket.Ability.length-1);
                basket.QuestionSummaryID = questionbasket.QuestionSummaryID;
                basket.PaperQuestion = question;
                arr.push(basket);
              });
            }
          );
        }
      }
      return arr;
    }
  },
  methods: {
    ...mapMutations(["changePaperData"]),

    getOptionText(index) {
      if (index == 1) {
        return "A.";
      }
      if (index == 2) {
        return "B.";
      }
      if (index == 3) {
        return "C.";
      }
      if (index == 4) {
        return "D.";
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>




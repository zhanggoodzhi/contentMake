/* 朗读短文 */
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
  created() {
    
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
      const arr = [];
      if (this.resultQuestionBasket != null) {
         if (
          this.resultQuestionBasket.questionBasketList &&
          this.resultQuestionBasket.questionBasketList.length
        ) {
        this.resultQuestionBasket.questionBasketList.forEach(questionbasket => {
          questionbasket.PaperQuestionList.forEach(question => {
            const basket = {
              Ability:'',
              Content:[],
            };
            //找题干
            question.PaperContentViewModels.forEach(content => {
              //cotent的题干部分
              const con={
                Option:[]
              }
              con.Text = content.Text;
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
        });
      }
      }
      return arr;
    }
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
</style>


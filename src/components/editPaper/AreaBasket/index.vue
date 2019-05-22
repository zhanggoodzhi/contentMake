<template>
  <div v-if="questionIndex!==-1">
    <CustomCollapse
      class="left-title-collapse"
      :title="`【${formatAreaType(paperData.PaperAreaViewModels[areaIndex].AreaType)}】试题篮(${resultQuestionBasket.questionTotalCount})`"
    >
      <component :is="getAreaComponent(paperData.PaperAreaViewModels[areaIndex].AreaType)"></component>
      <div
        v-if="resultQuestionBasket.questionTotalCount!==0"
        class="page-wrap clearfix"
      >
        <Page
          :current="searchBasketParams.Pageparam.PageIndex"
          @on-change="questionChange"
          :total="resultQuestionBasket.questionTotalCount"
          size="small"
          show-sizer
        />
      </div>
      <div
        v-if="resultQuestionBasket.questionTotalCount===0"
        class="none-img-wrap"
      >
        <img
          src="/img/none.png"
          alt=""
        >
        <p>暂无内容！</p>
      </div>
    </CustomCollapse>
  </div>
</template>
<script>
import { GetQuestionBasketDisplay } from "@/plugins/service";
import CustomCollapse from "@/components/CustomCollapse";
import { createNamespacedHelpers } from "vuex";
import * as AreaComponent from "@/components/editPaper/AreaBasket/areas";
import deepClone from "clone";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  components: {
    ...areaObj,
    CustomCollapse
  },
  data() {
    return {

    };
  },
  created() {

  },
  computed: {
    ...mapState([
      "paperData",
      "areaIndex",
      "questionIndex",
      "searchBasketParams",
      "resultQuestionBasket"
    ])
  },
  methods: {
    ...mapMutations(["changeSearchBasketParams", "changeResultQuestionBasket"]),
    getAreaComponent(type) {
      return "Area" + type;
    },

    //获取试题篮数据(用于分页)
    getData() {
      //this.loadingData = true;

      const newDataSearch = deepClone(this.searchBasketParams);
      newDataSearch.ContentCount = this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels.length;
      newDataSearch.AreaType = this.paperData.PaperAreaViewModels[this.areaIndex].AreaType;
      newDataSearch.TemplateID = this.paperData.TemplateID;
      this.changeSearchBasketParams(newDataSearch);
      //加载数据
      GetQuestionBasketDisplay(newDataSearch).then(d => {
        const responseData = d.ResponseData;
        const newData = deepClone(this.resultQuestionBasket);
        newData.questionTotalCount = responseData.Count;
        newData.hasNoData = this.questionTotalCount == 0;
        newData.loadingData = false;
        newData.questionBasketList = responseData.QuestionBasketDisplays
        //设置试题列表
        this.changeResultQuestionBasket(newData);
      });
    },
    //分页
    questionChange(index) {
      const newDataSearch = deepClone(this.searchBasketParams);
      newDataSearch.Pageparam.PageIndex = index;
      this.changeSearchBasketParams(newDataSearch);
      this.getData();
    }
  }
};
</script>

<style lang="less" scoped>
.page-wrap {
  background-color: white;
  width: 100%;
  text-align: right;
  //padding-top: 10px;
}
.none-img-wrap {
  text-align: center;
  img {
    width: 116px;
    height: 73px;
  }
  p {
    margin-top: 10px;
    padding-left: 3px;
    font-size: 14px;
    color: #999999;
  }
}
</style>
<style lang="less">
</style>



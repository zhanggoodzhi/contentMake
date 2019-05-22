<template>
  <div
    class="fixed clearfix"
    ref="content"
  >
    <div
      class="aside-container fixed-div"
      :class="{'first-style':!ifChangeStyle}"
      :style="{'height':propertyHeight+'px',left:LeftWidth+'px'}"
    >
      <Aside
        @selectedAllPaperName="selectedAllPaperName"
        :SearchParam="searchParams"
        :ChangeSearchPara="changeSearchParams"
        class="content"
        @paramChgange="paramChgange"
      ></Aside>
    </div>
    <div
      class="area-container-scroll"
      id="area-fixed-div"
    >
      <div class="area-container w100 aside-container">

        <Head
          :SearchParam="searchParams"
          :ChangeSearchPara="changeSearchParams"
          :HeaderConditions="headerConditins"
          @paramChgange="paramChgange"
          @restAllConditions="resetSearchCondition"
        ></Head>

        <div class="question-list clearfix">

          <div
            class="demo-spin-container"
            v-if="showLoading"
          >
            <Spin fix></Spin>
          </div>
          <div v-else>
            <div class="list-header">
              <div class="all-des">共&nbsp;<span class="count">{{total}}</span>&nbsp;套题</div>
              <div
                 v-show="total > 0"
                class="all-add"
                @click="allAddToQuestionBasket()"
              >全部加入试题篮</div>
            </div>
            <div
              class="empty"
              v-if="total == 0"
            >
              <img
                src="/img/none-small.png"
                class="empty-img"
              >
              <div class="empty-text">暂无数据</div>
            </div>
            <div
              v-else
              v-for="item in questionList"
              class="question-item"
            >
              <AreaCommon :question="item"></AreaCommon>
            </div>

            <div class="page-wrap clearfix">
              <Page
                v-show="total > 0"
                :total="total"
                :current="searchParams.Pageparam.PageIndex"
                @on-change="pageChange"
                show-sizer
                @on-page-size-change="pageSizeChange"
                :page-size="searchParams.Pageparam.PageSize"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import deepClone from "clone";
import Head from "@/components/areaComponents/areaHead";
import { debounce, throttle } from "lodash";
import Aside from "@/components/areaComponents/areaAside";
import Question from "@/components/areaComponents/areaQuestion";
import AreaCommon from "@/components/areaComponents/areaCommon";
import { bus, updateBasketStateEvent } from "@/plugins/bus";
import {
  GetQuestionBasket,
  GetConditionViewModel,
  GetHeadConditionViewModel,
  UpdateUserPaperQuestion,
  GetCountOfAreaType
} from "@/plugins/service";
// import * as AreaComponent from "@/components/areaComponents/areas";
// const areaObj = {};
// Object.keys(AreaComponent).forEach(v => {
//   areaObj[v] = AreaComponent[v];
// });

const { mapState, mapMutations } = createNamespacedHelpers("global");
export default {
  components: {
    Head,
    Aside,
    Question,
    AreaCommon
    // ...areaObj
  },
  computed: {
    ...mapState(["userDetail"])
  },
  created() {
    let that = this;
    this.changeSearchParams(this.searchParams);
    //获取头部搜索条件
    GetHeadConditionViewModel().then(data => {
      if (data.ResponseCode != 0) return;
      this.headerConditins = data.ResponseData;
    });
    bus.$on("updateBasketStateEvent", function (value) {
      that.changeSearchParams(this.searchParams);
    });
  },
  mounted() {
    this.propertyHeight = window.innerHeight - 161;
    this.LeftWidth =
      document.querySelector("#area-fixed-div").offsetLeft - 298;
    const resizeEvent = () => {
      this.$nextTick(() => {
        console.log('触发');
        this.LeftWidth =
          document.querySelector("#area-fixed-div").offsetLeft - 298;
        this.propertyHeight = window.innerHeight - 161;
      });
    };
    const scrollEvent = (e) => {
      this.$nextTick(() => {
        if (window.scrollY > 95) {
          this.ifChangeStyle = true;
        } else {
          this.ifChangeStyle = false;
        }
      });
    };
    window.onresize = debounce(resizeEvent, 200);
    window.onscroll = scrollEvent;
  },
  beforeDestroy() {
    window.onresize = null;
    window.onscroll = null;
  },
  data() {
    return {
      propertyHeight: 700,
      LeftWidth: 0,
      minHeight: 0,
      conditionLit: [],
      ifChangeStyle: false,
      //查询条件
      searchParams: {
        Questionparams: {
          //试卷列表
          PaperIDs: [],
          //教材列表
          MaterialIDs: [],
          //考查能力
          AbilityIDs: [],
          //题型
          AreaTypes: [],
          //城市
          CityIDs: [],
          //试卷类型
          PaperTypeIDs: [],
          //年份
          Years: [],
          //年级
          GradeIDs: [],
          //难易程度
          Difficultys: []
        },
        Pageparam: {
          PageSize: 10,
          PageIndex: 1
        }
      },

      //请求返回的试题列表
      total: 0,
      questionList: [],
      headerConditins: [],
      showLoading: true
    };
  },
  methods: {
    //更新试题蓝状态
    updateBasketState() { },
    ...mapMutations(["changeBasketCountList"]),
    //按试卷全选和取消全选
    selectedAllPaperName(paperIDs) {
      this.searchParams.Questionparams.PaperIDs = paperIDs;
      this.changeSearchParams(this.searchParams);
    },
    //重置搜索条件
    resetSearchCondition() {
      this.searchParams.Questionparams.AreaTypes = [];
      this.searchParams.Questionparams.CityIDs = [];
      this.searchParams.Questionparams.PaperTypeIDs = [];
      this.searchParams.Questionparams.Years = [];
      this.searchParams.Questionparams.GradeIDs = [];
      this.searchParams.Questionparams.Difficultys = [];
      this.changeSearchParams(this.searchParams);
    },
    //监听子组件中选中的参数
    paramChgange(dic) {
      if (dic.key == "Ability") {
        this.searchParams.Questionparams.AbilityIDs = dic.value;
      } else if (dic.key == "Material") {
        this.searchParams.Questionparams.MaterialIDs = dic.value;
      } else if (dic.key == "Paper") {
        this.searchParams.Questionparams.PaperIDs = dic.value;
      } else if (dic.key == "areaTypeIds") {
        this.searchParams.Questionparams.AreaTypes = dic.value;
      } else if (dic.key == "cityIds") {
        this.searchParams.Questionparams.CityIDs = dic.value;
      } else if (dic.key == "paperTypeIds") {
        this.searchParams.Questionparams.PaperTypeIDs = dic.value;
      } else if (dic.key == "yearIds") {
        this.searchParams.Questionparams.Years = dic.value;
      } else if (dic.key == "gradeIds") {
        this.searchParams.Questionparams.GradeIDs = dic.value;
      } else if (dic.key == "difficultyIds") {
        this.searchParams.Questionparams.Difficultys = dic.value;
      }
      this.changeSearchParams(this.searchParams);
    },
    pageChange(number) {
      this.searchParams.Pageparam.PageIndex = number;
      this.changeSearchParams(this.searchParams);
    },

    pageSizeChange(number) {
      this.searchParams.Pageparam.PageSize = number;

      this.changeSearchParams(this.searchParams);
    },
    changeSearchParams(data) {
      GetQuestionBasket(this.searchParams).then(d => {
        this.showLoading = false;
        if (d.ResponseCode == 0) {
          let data = d.ResponseData;
          // this.questionList = data.PaperQuestionViewModels;
          this.questionList = data.PaperQuestionBasketItems;
          this.total = data.Count;
        } else {
          this.$Message.error(d.ResponMessage);
        }
      });
    },
    //全部加入试题篮
    allAddToQuestionBasket(h) {
      const param = [];
      console.log("questionList ==", this.questionList);
      this.questionList.forEach(item => {
        let dic = {
          Type: 0,
          UserID: this.userDetail.UserID,
          QuestionSummaryID: item.QuestionSummaryID,
          AreaType: item.AreaType,
          TemplateAreaID: item.TemplateAreaID
        };
        param.push(dic);
      });
      UpdateUserPaperQuestion(param).then(d => {
        if (d.Success) {
          const templateArr = deepClone(this.questionList);
          templateArr.forEach(item => {
            item.IsQuestionBasket = true;
          });
          this.questionList = templateArr;
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
.content {
  // height: calc(100% - 62px - 15px);
  .main {
    margin-left: 10px;
    height: 100%;
    background-color: #ffffff;
  }
}
.area-container-scroll {
  width: 900px;
  float: right;
  height: 100%;
}
.aside-container {
  float: left;
  height: 100%;
}
.fixed-div {
  transition: all 0.1s;
  position: fixed;
  top: 0;
  &.first-style {
    position: static;
    float: left;
  }
}
.area-container {
  height: 100%;
}
.empty {
  text-align: center;
  .empty-img {
    margin-top: 100px;
  }
  .empty-text {
    font-size: 14px;
    margin-top: 10px;
  }
}
.question-list {
  min-height: 545px;
  margin-top: 20px;
  background-color: white;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 0 27px;
  border: solid 1px #e5e5e5;

  .list-header {
    position: relative;
    height: 40px;
    .all-des {
      font-size: 14px;
      position: absolute;
      top: 20px;
      left: 0;
      .count {
        font-size: 16px;
      }
    }
    .all-add {
      cursor: pointer;
      position: absolute;
      top: 16px;
      right: 0;
      background-color: #2493f8;
      font-size: 14px;
      color: white;
      border-radius: 4px;
      width: 124px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .question-item {
    margin-top: 24px;
  }
  .page-wrap {
    background-color: white;
    width: 100%;
    text-align: right;
    padding: 14px  0;
  }
}

.demo-spin-container {
  display: inline-block;
  width: 100%;
  height: 545px;
  position: relative;
}
</style>
<style lang="less">
.page-wrap{
  .ivu-page-options-sizer{
    margin-right: 0;
  }
}
</style>


<template>
  <div>
    <div class="top-info">
      <span class="label inline-b">标签：</span>
      <span class="text ellipsis w700">{{paperLabel||'无'}}</span>
      <div class="right">
        <span class="label">总分：</span>
        <span class="text">{{paperData.TotalScore}}</span>
      </div>
    </div>
    <div class="top-info">
      <span class="label">教材：</span>
      <span class="text">{{renderMaterial(paperData.MaterialID)}}</span>
      <div class="right">
        <span class="label">考试时长：</span>
        <span class="text">约 {{paperData.TotalExamTime}} 分钟</span>
      </div>
    </div>
    <div class="paper-name-wrap">
      <InputBox
        :error="getEditPaperValidateError('PaperName')"
        @focus="()=>{changeQuestionIndex(-1);editPaperValidateError('PaperName', '');}"
        :inputValue="paperData.PaperName"
        :paperName="true"
        ref="paperName"
        placeholder="请输入试卷名"
        @changeInput="changeInput"
      ></InputBox>
    </div>
    <div
      :key="v.AreaID"
      v-for="(v,i) in paperData.PaperAreaViewModels"
      class="area-wrap"
    >
      <PaperAreaCollapse
        :error="ifAreaError(i)"
        :title="getCollapseTitle(v)"
        :aIndex="i"
        :getQuestionBasket="getData"
      >
        <div>
          <div
            class="discription"
            v-show="v.AreaPrompt.length > 0"
          >{{v.AreaPrompt}}</div>
        </div>
        <div>
          <!-- <component
            v-if="v.AreaType==1"
            :aIndex="i"
            :is="getAreaComponent(v.AreaType)"
          ></component>-->
          <component
            :aIndex="i"
            :getQuestionBasket="getData"
            :is="getAreaComponent(v.AreaType)"
          ></component>
        </div>
      </PaperAreaCollapse>
    </div>
  </div>
</template>
<script>
import { GetQuestionBasketDisplay } from "@/plugins/service";
import InputBox from "@/components/InputBox";
import PaperAreaCollapse from "@/components/PaperAreaCollapse";
import * as AreaComponent from "@/components/editPaper/PaperBox/areas";
import { createNamespacedHelpers } from "vuex";
import deepClone from "clone";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const globalVuex = createNamespacedHelpers("global");
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  components: {
    ...areaObj,
    InputBox,
    PaperAreaCollapse
  },
  data() {
    return {
      audio: "",
      type: ["image", "row"]
    };
  },
  created() {
    // 刷新错误数组
    this.changeError([]);
  },
  mounted() {
    this.$refs.paperName.forceFocus();
  },
  computed: {
    ...mapState([
      "paperData",
      "areaIndex",
      "questionIndex",
      "error",
      "searchBasketParams",
      "resultQuestionBasket"
    ]),

    ...globalVuex.mapState(["MaterialTree", "GradeList", "PaperTypeList"]),
    renderCity() {
      if (this.paperData.CityVMs) {
        return this.paperData.CityVMs.map(v => v.CityName).join("/");
      }
      return "无";
    },
    paperType() {
      if (
        this.PaperTypeList &&
        this.PaperTypeList.find(
          v => v.PaperTypeID === this.paperData.PaperTypeID
        )
      ) {
        return this.PaperTypeList.find(
          v => v.PaperTypeID === this.paperData.PaperTypeID
        ).PaperTypeName;
      }
      return "";
    },
    grade() {
      if (
        this.GradeList &&
        this.GradeList.find(v => v.GradeID === this.paperData.GradeID)
      ) {
        return this.GradeList.find(v => v.GradeID === this.paperData.GradeID)
          .GradeName;
      }
      return "";
    },
    paperLabel() {
      if (!this.PaperTypeList || !this.GradeList) {
        return "";
      }
      const year = this.paperData.Year;
      const city = this.renderCity;
      const arr = [];
      if (year) {
        arr.push(year);
      }
      if (city && city !== "无") {
        arr.push(city);
      }
      if (this.paperType) {
        arr.push(this.paperType);
      }
      if (this.grade) {
        arr.push(this.grade);
      }
      return arr.join("、");
    }
  },
  methods: {
    ...mapMutations([
      "changePaperData",
      "changeAreaIndex",
      "changeQuestionIndex",
      "changeError",
      "changeSearchBasketParams",
      "changeResultQuestionBasket"
    ]),
    //获取试题篮数据
    getData() {
      //this.loadingData = true;
      const newDataSearch = deepClone(this.searchBasketParams);
      newDataSearch.Pageparam.PageIndex = 1; //切换area的时候页面重置为1
      newDataSearch.ContentCount = this.paperData.PaperAreaViewModels[
        this.areaIndex
      ].PaperQuestionViewModels[
        this.questionIndex
      ].PaperContentViewModels.length;
      newDataSearch.AreaType = this.paperData.PaperAreaViewModels[
        this.areaIndex
      ].AreaType;
      newDataSearch.TemplateID = this.paperData.TemplateID;
      this.changeSearchBasketParams(newDataSearch);
      //加载数据
      GetQuestionBasketDisplay(newDataSearch).then(d => {
        const responseData = d.ResponseData;
        const newData = deepClone(this.resultQuestionBasket);
        newData.questionTotalCount = responseData.Count;
        newData.hasNoData = this.questionTotalCount == 0;
        newData.loadingData = false;
        newData.questionBasketList = responseData.QuestionBasketDisplays;
        //设置试题列表
        this.changeResultQuestionBasket(newData);
      });
    },
    renderMaterial(id) {
      if (!this.MaterialTree) {
        return "无";
      }
      let nodeArr = [];
      let formatStr;
      try {
        const searchChild = arr => {
          for (const v of arr) {
            if (v.children.length) {
              nodeArr.push(v);
              searchChild(v.children);
              nodeArr.splice(nodeArr.findIndex(sv => sv.id === v.id), 1);
            } else {
              if (v.id === id) {
                nodeArr.push(v);
                throw "GOT IT!";
              }
            }
          }
        };
        searchChild(this.MaterialTree);
      } catch (err) {
        formatStr = nodeArr.map(v => v.title).join(">");
      }
      return formatStr == undefined ? "无" : formatStr;
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
    getAreaComponent(type) {
      return "Area" + type;
    },
    changeType(str) {
      this.type = str;
    },
    ifAreaError(i) {
      for (const v of this.error) {
        if (v.i == i) {
          return true;
        }
      }
      return false;
    },
    delAudio() {
      this.audio = "";
    },
    uploadAudioSuccess(res) {
      this.audio = window.API_URL + res.ResourcePath;
    },
    changeInput(value) {
      const newData = deepClone(this.paperData);
      newData.PaperName = value;
      this.changePaperData(newData);
    }
  }
};
</script>

<style lang="less" scoped>
.top-info {
  line-height: 20px;
  .label {
    color: #999999;
  }
  .text {
    font-size: 12px;
    color: #666666;
  }
  .right {
    float: right;
  }
}
.paper-name-wrap {
  margin-top: 15px;
}
.area-wrap {
  margin-top: 10px;
  .discription {
    background: #f7f7f7;
    border-bottom: 1px solid #e5e5e5;
    padding: 14px 14px 10px 14px;
  }
}
.inline-b {
  display: inline-block;
  vertical-align: middle;
}
.w700 {
  display: inline-block;
  width: 600px;
  vertical-align: middle;
}
</style>


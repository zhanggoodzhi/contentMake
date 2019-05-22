<template>
  <CustomCollapse
    class="template-property-default-area"
    title="题型组件"
  >
    <div class="paper-property">
      <div
        class="filter-btn"
        @click="searchVisible=!searchVisible"
      >筛选</div>
      <transition>
        <div
          v-if="searchVisible"
          class="search-item-wrap"
        >
          <div class="row">
            <div class="title">学段：</div>
            <div class="content">
              <span
                class="item"
                :class="{'selected':!selectedGradeIdArr.length}"
                @click="setGradeNone()"
              >不限</span>
              <span
                @click="selectGrade(v.GradeSectionID)"
                v-for="v in searchData.GradeSectionList"
                class="item"
                :class="{'selected':ifGradeSelected(v.GradeSectionID)}"
              >{{v.GradeSectionName}}</span>
            </div>
          </div>
          <div class="row">
            <div class="title">地区：</div>
            <div class="content">
              <span
                class="item"
                :class="{'selected':!selectedZoneIdArr.length}"
                @click="setZoneNone()"
              >不限</span>
              <span
                @click="selectZone(v.ZoneID)"
                v-for="v in searchData.ZoneList"
                class="item"
                :class="{'selected':ifZoneSelected(v.ZoneID)}"
              >{{v.ZoneName}}</span>
            </div>
          </div>
        </div>
      </transition>
      <div class="form-item clearfix">
        <div
          class="spin-wrap"
          v-if="!AreaTypeList"
        >
          <Spin
            class="spin"
            size="large"
          ></Spin>
        </div>
        <div
          class="oval"
          v-for="area in AreaTypeList"
          @click="areaSelect(area)"
        >
          {{area.AreaTypeDesc}}
        </div>
      </div>
    </div>
  </CustomCollapse>
</template>
<script>
import HoverBox from '@/components/HoverBox';
import deepClone from 'clone';
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import CustomCollapse from '@/components/CustomCollapse';
import { GetAreaTypeList, GetAreaTypeCondition, GetAreaTypeByGradeAndZone } from "@/plugins/service";
import { changeAreaProp } from '@/plugins/utils'
import { bus, rankListenQuestion } from "@/plugins/bus";
export default {
  props: ['option', 'changeOption'],
  components: {
    HoverBox,
    CustomCollapse,
  },

  data() {
    return {
      userName: '',
      searchVisible: false,
      searchData: {
        GradeSectionList: [],
        ZoneList: [],
      },
      selectedGradeIdArr: [],
      selectedZoneIdArr: [],
    }
  },
  created() {
    GetAreaTypeCondition().then(d => {
      this.searchData = d.ResponseData;
    });
    document.querySelector('body').addEventListener('click', this.hideSearchWrap);
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('click', this.hideSearchWrap);
  },
  mounted: function () {
    //判断题型是否已经加载
    if (this.AreaTypeList == null) {
      this.getAreaTypeList();
      // GetAreaTypeByGradeAndZone({
      //   GradeSectionIDs: this.selectedGradeIdArr,
      //   ZoneIDs: this.selectedZoneIdArr
      // }).then(d => {
      //   const data = d.ResponseData;
      //   this.changeAreaType(data);
      // });
    }
  },
  computed: {
    ...mapState(["AreaTypeList"]),
    // 如果换页了，area里的属性只用smallIndex=1里面的。
    currentPageIndex() {
      const area = this.option.templateData.TemplateAreaViewModels[this.option.pageIndex];
      if (area.SmallIndex > 1) {
        for (let i = 1; ; i++) {
          if (this.option.pageIndex - i < 0) {
            return 0;
          }
          if (this.option.templateData.TemplateAreaViewModels[this.option.pageIndex - i].SmallIndex == 1) {
            return this.option.pageIndex - i;
          }
        }
      }
      return this.option.pageIndex;
    },
  },
  methods: {
    ...mapMutations(["changeAreaType"]),

    hideSearchWrap(e) {
      if (e.target.closest('.filter-btn')) {
        return;
      }
      if (e.target.closest('.search-item-wrap')) {
        return;
      }
      this.searchVisible = false;
    },
    addDescIndex(title) {
      let count = 0;
      for (let i = 0; i < this.option.templateData.TemplateAreaViewModels.length; i++) {
        console.log(this.option.templateData.TemplateAreaViewModels[i]);
        if (this.option.templateData.TemplateAreaViewModels[i].SmallIndex < 2 && this.option.templateData.TemplateAreaViewModels[i].TemplateQuestionViewModels) {
          count++;
        }
        if (this.option.pageIndex === i) {
          break;
        }
      }
      return this.transFormIndexToChinese(count) + '、' + title;
    },
    setGradeNone() {
      this.selectedGradeIdArr = [];
      this.getAreaTypeList();
    },
    setZoneNone() {
      this.selectedZoneIdArr = [];
      this.getAreaTypeList();
    },
    getAreaTypeList() {
      GetAreaTypeByGradeAndZone({
        GradeSectionIDs: this.selectedGradeIdArr,
        ZoneIDs: this.selectedZoneIdArr
      }).then(d => {
        const data = d.ResponseData;
        this.changeAreaType(data);
      });
    },
    ifGradeSelected(id) {
      const index = this.selectedGradeIdArr.indexOf(id);
      if (index !== -1) {
        return true;
      }
      return false;
    },
    ifZoneSelected(id) {
      const index = this.selectedZoneIdArr.indexOf(id);
      if (index !== -1) {
        return true;
      }
      return false;
    },
    selectGrade(id) {
      const index = this.selectedGradeIdArr.indexOf(id);
      if (index !== -1) {
        this.selectedGradeIdArr.splice(index, 1)
      } else {
        this.selectedGradeIdArr.push(id);
      }
      this.getAreaTypeList();
    },
    selectZone(id) {
      const index = this.selectedZoneIdArr.indexOf(id);
      if (index !== -1) {
        this.selectedZoneIdArr.splice(index, 1)
      } else {
        this.selectedZoneIdArr.push(id);
      }
      this.getAreaTypeList();
    },
    //题型选择
    areaSelect(area) {
      const index = this.option.pageIndex;
      const newData = deepClone(this.option);
      newData.questionIndex = 0;
      this.changeOption(newData);
      let desc = area.AreaTypeDesc;
      let indexDesc;
      if (this.option.templateData.TemplateAreaViewModels[index].AreaTitle) {
        desc = this.option.templateData.TemplateAreaViewModels[index].AreaTitle;
        indexDesc = desc;
      } else {
        indexDesc = this.addDescIndex(desc);
      }
      const newArea = {
        AreaType: Number(area.AreaType),
        AreaTitle: indexDesc,
        AreaTypeDesc: indexDesc,
        "SmallIndex": 0,
        IsAreaTitleShow: true,
        IsAreaPromptShow: true,
        TemplateQuestionViewModels: [{
          "QuestionID": "",
          "TemplateID": this.option.templateId,
          "AreaID": "",
          "TotalContentCount": 0,
          "ContentAudioPlayTimes": 0,
          "ReadingSeconds": 0,
          "PrepareSeconds": 0,
          "AnswerSeconds": 0,
          "PreSubmitMaxSeconds": 0,
          "Prompt": "",
          "PromptAudioID": "",
          "PromptAudioPath": "",
          "PromptAudioSeconds": 0,
          "Tips": "",
          "TipsAudioID": "",
          "TipsAudioPath": "",
          "AudioPlayTimes": 0,
          "Idx": 0,
          "ChooseItem": 0,
          "Score": 0.0,
          "NewScreen": false,
          "TemplateContentViewModels": [{
            "ContentID": "",
            "TemplateID": this.option.templateId,
            "AreaID": "",
            "QuestionID": "",
            "ChooseItem": 0,
            "Score": 0.0
          }]
        }]
      };
      const fiveContentArea = deepClone(newArea);
      fiveContentArea.TemplateQuestionViewModels[0].TemplateContentViewModels = [{
        "ContentID": "",
        "TemplateID": this.option.templateId,
        "AreaID": "",
        "QuestionID": "",
        "ChooseItem": 0,
        "Score": 0.0,
        "Idx": 1,
      }, {
        "ContentID": "",
        "TemplateID": this.option.templateId,
        "AreaID": "",
        "QuestionID": "",
        "ChooseItem": 0,
        "Score": 0.0,
        "Idx": 2,
      }, {
        "ContentID": "",
        "TemplateID": this.option.templateId,
        "AreaID": "",
        "QuestionID": "",
        "ChooseItem": 0,
        "Score": 0.0,
        "Idx": 3,
      }, {
        "ContentID": "",
        "TemplateID": this.option.templateId,
        "AreaID": "",
        "QuestionID": "",
        "ChooseItem": 0,
        "Score": 0.0,
        "Idx": 4,
      }, {
        "ContentID": "",
        "TemplateID": this.option.templateId,
        "AreaID": "",
        "QuestionID": "",
        "ChooseItem": 0,
        "Score": 0.0,
        "Idx": 5,
      }];
      const fiveContentQuestion = fiveContentArea.TemplateQuestionViewModels;
      if (area.AreaType == 27) {// 填空题
        changeAreaProp(this, fiveContentArea);
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
        return;
      }
      if (area.AreaType == 25) {// 听后记录并转述
        // changeAreaProp(this, { ...deepClone(fiveContentArea), SmallIndex: 1 });
        newData.templateData.TemplateAreaViewModels[index].AreaType = Number(area.AreaType);
        newData.templateData.TemplateAreaViewModels[index].AreaTitle = indexDesc;
        newData.templateData.TemplateAreaViewModels[index].AreaTypeDesc = indexDesc;
        newData.templateData.TemplateAreaViewModels[index].SmallIndex = 1;
        newData.templateData.TemplateAreaViewModels[
          this.option.pageIndex
        ].TemplateQuestionViewModels = fiveContentQuestion;
        newData.templateData.TemplateAreaViewModels.splice(this.option.pageIndex + 1, 0, { ...deepClone(newArea), SmallIndex: 2, Index: new Date().toString() + Math.random() });
        this.changeOption(newData);
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
        return;
      }
      if (area.AreaType == 1) {//选择题
        const chooseArea = deepClone(newArea);
        chooseArea.TemplateQuestionViewModels[0].TemplateContentViewModels[0].ChooseItem = 3;
        changeAreaProp(this, chooseArea);
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
        return;
      }
      changeAreaProp(this, newArea);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
  }
}
</script>

<style lang="less" scoped>
.filter-btn {
  position: absolute;
  cursor: pointer;
  right: 35px;
  top: 5px;
  font-size: 14px;
  &:hover {
    opacity: 0.7;
  }
}
.search-item-wrap {
  position: absolute;
  background: white;
  border: solid 1px #e5e5e5;
  top: 39px;
  right: 0px;
  width: 381px;
  padding: 20px;
  .row {
    font-size: 14px;
    .title {
      display: inline-block;
      width: 50px;
      vertical-align: top;
    }
    .content {
      display: inline-block;
      width: 285px;
      vertical-align: top;
      .item {
        padding: 0px 5px;
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        cursor: pointer;
        border-radius: 2px;
        text-align: center;
        &.selected {
          color: white;
          background-color: #2493f8;
        }
      }
    }
  }
}
.paper-property {
  line-height: 32px;
  .form-item {
    margin-bottom: 15px;
    .oval {
      line-height: 2;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: 25px;
      display: inline-block;
      border: solid 1px #e5e5e5;
      color: #333;
      margin: 5px;
      &:hover {
        border: solid 1px #2493f8;
        color: #2493f8;
      }
    }
  }
}
</style>
<style lang="less">
.template-property-default-area {
  height: 100%;
  .ivu-collapse-item {
    height: 100%;
  }
  .ivu-collapse-header {
    position: relative;
  }
  .ivu-collapse-content {
    overflow: auto;
    height: calc(100% - 38px);
  }
}
</style>



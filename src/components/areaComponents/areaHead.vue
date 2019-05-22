<template>

  <div class="head">
    <div
      v-show="areaareaList.length > 0"
      class="item-container "
    >
      <div class="condition-name">题型：</div>
      <div class="div-right">
        <div
          class="area"
          @click="areaClick(area)"
          :class="{select:area.isselect}"
          v-for="area in areaareaList"
        >
          <span>{{area.title}} </span>
        </div>
      </div>
    </div>
    <div
      v-show="areapapertypeList.length > 0"
      class="item-container "
    >
      <div class="condition-name">类型：</div>
      <div class="div-right">
        <div
          class="area"
          @click="papertypeClick(papertype)"
          :class="{select:papertype.isselect}"
          v-for="papertype in areapapertypeList"
        >
          <span>{{papertype.title}}</span>
        </div>
      </div>
    </div>
    <div
      v-show="areacityList.length > 0"
      class="item-container "
    >
      <div class="condition-name">地区：</div>
      <div class="div-right">
        <div
          class="area"
          @click="cityClick(city)"
          :class="{select:city.isselect}"
          v-for="city in areacityList"
        >
          <span>{{city.title}}</span>
        </div>
      </div>
    </div>
    <div
      v-show="areayearList.length > 0"
      class="item-container "
    >
      <div class="condition-name">年度：</div>
      <div class="div-right">
        <div
          class="area"
          @click="yearClick(year)"
          :class="{select:year.isselect}"
          v-for="year in areayearList"
        >
          <div >{{year.title}}</div>
        </div>
      </div>
    </div>
    <div
      v-show="areagradeList.length > 0"
      class="item-container "
    >
      <div class="condition-name">年级：</div>
      <div class="div-right">
        <div
          class="area"
          @click="gradeClick(grade)"
          :class="{select:grade.isselect}"
          v-for="grade in areagradeList"
        >
          <span>{{grade.title}}</span>
        </div>
      </div>
    </div>
    <div
      v-show="areadiffList.length > 0"
      class="item-container "
    >
      <div class="condition-name">难度：</div>
      <div class="div-right">
        <div
          class="area"
          @click="diffClick(diff)"
          :class="{select:diff.isselect}"
          v-for="diff in areadiffList"
        >
          <span>{{diff.title}}</span>
        </div>
      </div>
      <div
        class="rest-all"
        @click="restAll"
      ><i class=" refresh font_family icon-refresh"></i><span class="rest-all-text">重置筛选条件</span></div>
    </div>
  </div>

</template>


<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import deepClone from "clone";
import {
  GetPaperTypeList,
  GetCityList,
  GetGradeList,
  GetHeadConditionViewModel
} from "@/plugins/service";

export default {
  created() {
    GetHeadConditionViewModel().then(data => {
      if (data.ResponseCode != 0) return;
      this.responseData = data.ResponseData;
      this.GetFormData();
      // this.GetAreaType();
      // this.GetPaperType();
      // this.GetCity();
      // this.GetYear();
      // this.GetGrade();
      // this.GetDifficul();
    });
  },
  props: ["SearchParam", "ChangeSearchPara", "HeaderConditins"],
  data() {
    return {
      areaareaList: [],
      areapapertypeList: [],
      areayearList: [],
      areacityList: [],
      areagradeList: [],
      areadiffList: [],
      responseData: [],

      //用于搜索的参数数组
      areaTypeIds: [],
      cityIds: [],
      paperTypeIds: [],
      yearIds: [],
      gradeIds: [],
      difficultyIds: []
    };
  },
  mounted: function() {},
  computed: {
    ...mapState(["PaperTypeList", "CityList", "GradeList"])
  },
  methods: {
    sendParamsToparent(obj) {
      this.$emit("paramChgange", obj);
    },
    ...mapMutations(["changeAreaType", "changePaperType", "changeGrade"]),
    GetFormData() {
      this.areaareaList = this.responseData.AreaTypes;
      this.addFirstElement(this.areaareaList);

      this.areapapertypeList = this.responseData.PaperTypes;
      this.addFirstElement(this.areapapertypeList);

      this.areacityList = this.responseData.Zones;
      this.addFirstElement(this.areacityList);

      this.areayearList = this.responseData.Years;
      this.addFirstElement(this.areayearList);

      this.areagradeList = this.responseData.Grades;
      this.addFirstElement(this.areagradeList);

      this.areadiffList = this.responseData.Difficultys;
      this.addFirstElement(this.areadiffList);
    },

    addFirstElement(arr) {
      arr.unshift({
        id: "-1",
        title: "不限",
        isselect: true
      });
    },
    restAll() {
      this.areaareaList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });
      this.areapapertypeList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });
      this.areayearList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });
      this.areacityList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });
      this.areagradeList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });
      this.areadiffList.forEach(item => {
        item.isselect = false;
        if (item.id == "-1") {
          item.isselect = true;
        }
      });

      //清空所有搜索
      this.areaTypeIds = [];
      this.cityIds = [];
      this.paperTypeIds = [];
      this.yearIds = [];
      this.gradeIds = [];
      this.difficultyIds = [];

      this.$emit("restAllConditions");
    },

    // GetAreaType() {
    //   this.areaareaList = this.responseData.AreaTypes;
    //   this.areaareaList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },

    // GetPaperType() {
    //   this.areapapertypeList = this.responseData.PaperTypes;
    //   this.areapapertypeList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },

    // GetCity() {
    //   this.areacityList = this.responseData.Zones;
    //   this.areacityList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },
    // GetYear() {
    //   this.areayearList = this.responseData.Years;
    //   this.areayearList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },

    // GetGrade() {
    //   this.areagradeList = this.responseData.Grades;
    //   this.areagradeList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },

    // GetDifficul() {
    //   this.areadiffList = this.responseData.Difficultys;
    //   this.areadiffList.unshift({
    //     id: "-1",
    //     title: "不限",
    //     isselect: false
    //   });
    // },

    //seltectParma 当前选中的节点
    //conditionArr 存放选中节点的数组
    //identity  当前数组的标志符
    selectCondition(seltectParma, conditionArr, identity, orginArr) {
      if (seltectParma.id == "-1" && seltectParma.isselect == true) {
        return;
      }
      //样式
      if (seltectParma.id == "-1" && seltectParma.isselect == false) {
        orginArr.forEach(item => {
          item.isselect = false;
        });
      }

      if (seltectParma.id != "-1") {
        orginArr[0].isselect = false;
      }
      seltectParma.isselect = !seltectParma.isselect;
      let dic = { key: identity, value: [] };
      if (seltectParma.id != "-1" && seltectParma.isselect == true) {
        conditionArr.push(seltectParma.id);
      } else if (seltectParma.id != "-1" && seltectParma.isselect == false) {
        //如果不是不限 并且是取消选中 则从数据中移除
        conditionArr.forEach((item, index) => {
          if (item == seltectParma.id) {
            conditionArr.splice(index, 1);
          }
        });
      } else if (seltectParma.id == "-1") {
        conditionArr = [];
      }

      if (conditionArr.length == 0) {
        orginArr.forEach(item => {
          if (item.id == "-1") {
            item.isselect = true;
          }
        });
      }

      dic.value = conditionArr;
      return dic;
    },

    areaClick(param) {
      let dic = this.selectCondition(
        param,
        this.areaTypeIds,
        "areaTypeIds",
        this.areaareaList
      );
      this.sendParamsToparent(dic);
    },

    papertypeClick(param) {
      let dic = this.selectCondition(
        param,
        this.paperTypeIds,
        "paperTypeIds",
        this.areapapertypeList
      );
      this.sendParamsToparent(dic);
    },

    cityClick(param) {
      let dic = this.selectCondition(
        param,
        this.cityIds,
        "cityIds",
        this.areacityList
      );
      this.sendParamsToparent(dic);
    },

    yearClick(param) {
      let dic = this.selectCondition(
        param,
        this.yearIds,
        "yearIds",
        this.areayearList
      );
      this.sendParamsToparent(dic);
    },

    gradeClick(param) {
      let dic = this.selectCondition(
        param,
        this.gradeIds,
        "gradeIds",
        this.areagradeList
      );
      this.sendParamsToparent(dic);
    },

    diffClick(param) {
      let dic = this.selectCondition(
        param,
        this.difficultyIds,
        "difficultyIds",
        this.areadiffList
      );
      this.sendParamsToparent(dic);
    }
  }
};
</script>

<style lang="less" scoped>
.head {
  padding: 20px 26px;
  width: 100%;
  // height: 252px;
  //text-align: center;
  font-size: 14px;
  background-color: white;
  border: solid 1px #e5e5e5;
  .item-container {
    padding-bottom: 3px;
    .condition-name {
      display: inline-block;
      vertical-align: top;
      padding: 8px 0;
      width: 6%;
    }
    .div-right {
      display: inline-block;
      width: 94%;
    }
  }

  .area {
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 25px;
    display: inline-block;
    color: #666;
    margin: 5px;

    &:hover {
      color: #2493f8;
    }

    &.select {
      background-color: #2493f8;
      color: white;
      border-radius: 3px;
    }
  }
  .rest-all {
    cursor: pointer;
    display: block;
    color: #2493f8;
    height: 35px;
    line-height: 35px;
    text-align: right;
    .rest-all-text:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
    .refresh {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="less">
.ivu-tree-title {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 165px;
  white-space: nowrap;
}
</style>
>
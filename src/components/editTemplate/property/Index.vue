<template>
  <div class="property-wrap">
    <div>
      <CustomCollapse
        v-if="ifShowTemplateProp"
        title="模板属性"
      >

        <!-- 考拉网用户显示 -->
        <div
          class="template-property"
          :class="{'one-line':$route.params.type==='preview'}"
          v-if="ifkaola()"
        >

          <div style="padding: 10px 0">
            <span class="title">地区</span>
            <span
              class="font14 form-item "
              style="padding-left: 10px"
            >{{getCitysName}}</span>
          </div>
          <div>
            <span class="title">年度</span>
            <Select
              style="width:60%;margin-left:10px;"
              :disabled="$route.params.type==='preview'"
              :value="getDefaultYear(option.templateData.Year)"
              @on-change="changeYear"
              clearable
              class="form-item"
            >
              <Option
                v-for="v in years"
                :key="v"
                :value="v"
              >{{v}}</Option>
            </Select>
          </div>

        </div>

        <!-- 业务支撑用户显示 -->

        <div
          v-else
          class="template-property"
          :class="{'one-line':$route.params.type==='preview'}"
        >
          <p class="title">年度</p>
          <div
            v-if="$route.params.type==='preview'&&!option.templateData.Year"
            class="form-item none"
          >无</div>
          <Select
            v-else
            :disabled="$route.params.type==='preview'"
            :value="option.templateData.Year"
            @on-change="changeYear"
            clearable
            class="form-item"
          >
            <Option
              v-for="v in years"
              :key="v"
              :value="v"
            >{{v}}</Option>
          </Select>
          <p class="title top">适用地区</p>
          <Treeselect
            v-if="$route.params.type!=='preview'"
            noChildrenText="没有子选项"
            noResultsText="搜索无结果"
            noOptionsText="没有可选项"
            class="edit-paper-tree-select"
            style="width:200px"
            :value="getCitys"
            :multiple="true"
            @input="changeCity"
            placeholder="请选择"
            :options="CityList"
          >
            <label
              slot="option-label"
              slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
              :class="labelClassName"
              :title="node.label"
            >
              {{ node.label }}
            </label>
          </Treeselect>
          <p
            class="font14 form-item area"
            style="vertical-align:-2px;"
            v-else
          >{{getCitysName}}</p>
        </div>
      </CustomCollapse>
      <CustomCollapse
        v-if="this.option.pageIndex===-1"
        title="页面属性"
      >
        <div class="paper-property">
          <div class="form-item clearfix">
            <span class="title">页面停留时间</span>
            <div class="right">
              <TipInputNumber
                :value="option.templateData.BackgroundAudioTotalSeconds"
                @on-change="changeBackgroundAudioTotalSeconds"
                @on-focus="()=>{ editTemplateValidateError('BackgroundAudioTotalSeconds', '', -1, -1)}"
                :error="getEditTemplateValidateError('BackgroundAudioTotalSeconds',-1,-1)"
              >
              </TipInputNumber>
              <span class="vm text">秒</span>
            </div>
          </div>
          <div class="form-item clearfix">
            <span class="title">跳转倒计时</span>
            <div class="right">
              <i-switch
                v-if="$route.params.type!=='preview'&&$route.params.type!=='prop'"
                :value="option.templateData.IsShowDisplay"
                @on-change="changeIsShowDisplay"
              />
              <span
                class="vm text"
                v-if="option.templateData.IsShowDisplay"
              >显示</span>
              <span
                class="vm text"
                v-if="!option.templateData.IsShowDisplay"
              >隐藏</span>
            </div>
          </div>
          <div class="form-item clearfix">
            <span class="title">倒计时长</span>
            <div class="right">
              <TipInputNumber
                :value="option.templateData.DisplaySeconds"
                @on-change="changeDisplaySeconds"
                @on-focus="()=>{editTemplateValidateError('DisplaySeconds', '', -1, -1)}"
                :error="getEditTemplateValidateError('DisplaySeconds',-1,-1)"
                :max="maxCountDown"
              >
              </TipInputNumber>
              <span class="vm text">秒</span>
            </div>
          </div>
        </div>
      </CustomCollapse>
    </div>
    <div v-if="ifBlank">
      <CustomCollapse title="空白页属性">
        <div class="paper-property">
          <div class="form-item clearfix">
            <span class="title">页面停留时间</span>
            <div class="right">
              <TipInputNumber
                :value="getBlankTime"
                @on-change="changeBlankTime"
                @on-focus="()=>{editTemplateValidateError('DisplaySeconds', '', this.option.pageIndex, -1)}"
                :error="getEditTemplateValidateError('DisplaySeconds',this.option.pageIndex,-1)"
              >
              </TipInputNumber>
              <span class="vm text">秒</span>
            </div>
          </div>
        </div>
      </CustomCollapse>
    </div>
    <component
      v-if="ifShowComponent"
      :is="getAreaComponent"
      :option="option"
      :changeOption="changeOption"
    >-</component>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import deepClone from "clone";
import Treeselect from "@riophae/vue-treeselect";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import CustomCollapse from "@/components/CustomCollapse";
import { GetCityList } from "@/plugins/service";
import TipInputNumber from "@/components/TipInputNumber";
import DefaultArea from "@/components/editTemplate/property/DefaultArea";
import * as AreaComponent from "@/components/editTemplate/property/areas";
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  props: ["option", "changeOption"],
  components: {
    ...areaObj,
    DefaultArea,
    CustomCollapse,
    TipInputNumber,
    Treeselect
  },
  created: function () {
    console.log(this.option, "option---", this.option.templateData.Year);
    if (!this.CityList.length) {
      this.getCityList("");
      return;
    }
  },
  data() {
    return {
      cityPicker: {
        searchParam: { CityName: "" }
      }
    };
  },
  computed: {
    maxCountDown() {
      const time = this.option.templateData.BackgroundAudioTotalSeconds;
      if (!time) {
        return 0.1;
      }
      return time > 9 ? 9 : time
    },
    getZoneName() {
      const userData = this.getLSUserData();
      return userData.zoneNames;
    },
    ...mapState(["CityList"]),
    ifShowComponent() {
      if (this.option.pageIndex !== -1) {
        if (
          this.option.templateData.TemplateAreaViewModels[this.option.pageIndex]
            .TemplateQuestionViewModels
        ) {
          if (
            !this.option.templateData.TemplateAreaViewModels[
              this.option.pageIndex
            ].TemplateQuestionViewModels.length
          ) {
            return true;
          }
          if (
            this.option.templateData.TemplateAreaViewModels[
              this.option.pageIndex
            ].TemplateQuestionViewModels.length &&
            this.option.questionIndex !== -1
          ) {
            return true;
          }
        }
      }
      return false;
    },
    getCitys() {
      const formatArr = this.option.templateData.CityVMs.map(v => {
        return v.CityID;
      });
      if (!formatArr.length) {
        return null;
      }
      return formatArr;
    },
    getCitysName() {
      console.log(this.option.templateData, "this.option.templateData");
      const formatArr = this.option.templateData.CityVMs.map(v => {
        return v.CityName;
      });

      console.log("hello--", formatArr);
      return formatArr.join("/");
    },
    getAreaComponent() {
      const index = this.option.pageIndex;
      const area = this.option.templateData.TemplateAreaViewModels[index];
      // 题型页(数组形式)
      if (area.TemplateQuestionViewModels) {
        // 具体题型页
        if (area.TemplateQuestionViewModels.length) {
          return "Area" + area.AreaType;
        }
        // 默认题型页
        return "DefaultArea";
      }
    },
    years() {
      const yearArr = [];
      const thisYear = new Date().getFullYear();
      //当前时间往前推十年
      for (let i = thisYear; i > thisYear - 10; i--) {
        yearArr.push(i);
      }
      /* for (let i = 2008; i <= thisYear; i++) {
        yearArr.push(i);
      } */
      return yearArr;
    },
    ifBlank() {
      const index = this.option.pageIndex;
      if (
        index !== -1 &&
        !this.option.templateData.TemplateAreaViewModels[index]
          .TemplateQuestionViewModels
      ) {
        return true;
      }
      return false;
    },
    getBlankTime() {
      const index = this.option.pageIndex;
      const area = this.option.templateData.TemplateAreaViewModels[index];
      return area.DisplaySeconds;
    },
    ifShowTemplateProp() {
      if (this.option.pageIndex === -1) {
        return true;
      } else if (this.ifBlank) {
        return false;
      } else if (
        !this.option.templateData.TemplateAreaViewModels[this.option.pageIndex]
          .TemplateQuestionViewModels.length
      ) {
        return false;
      } else if (this.option.questionIndex === -1) {
        // 具体题型页，questionIndex为-1
        return true;
      }
      return false;
    }
  },
  methods: {
    ...mapMutations(["changeCityList"]),
    changeBlankTime(value) {
      const index = this.option.pageIndex;
      const newData = deepClone(this.option);
      if (!value) {
        setTimeout(() => {
          newData.templateData.TemplateAreaViewModels[
            index
          ].DisplaySeconds = 0;
          this.changeOption(newData);
        }, 0);
      }
      newData.templateData.TemplateAreaViewModels[
        index
      ].DisplaySeconds = value;
      this.changeOption(newData);
    },
    changeDefaultProp(prop, value) {
      const newData = deepClone(this.option);
      newData.templateData[prop] = value;
      this.changeOption(newData);
    },
    changeYear(value) {
      this.changeDefaultProp("Year", value);
    },
    changeBackgroundAudioTotalSeconds(value) {
      if (!value) {
        setTimeout(() => {
          this.changeDefaultProp("BackgroundAudioTotalSeconds", 0);
          this.changeDefaultProp("DisplaySeconds", 0);
        }, 0);
      }
      if (value < this.option.templateData.DisplaySeconds) {
        const newData = deepClone(this.option);
        newData.templateData.DisplaySeconds = value;
        newData.templateData.BackgroundAudioTotalSeconds = value;
        this.changeOption(newData);
      } else {
        this.changeDefaultProp("BackgroundAudioTotalSeconds", value);
      }
    },
    changeDisplaySeconds(value) {
      if (!value) {
        setTimeout(() => {
          this.changeDefaultProp("DisplaySeconds", 0);
        }, 0);
      }
      this.changeDefaultProp("DisplaySeconds", value);
    },
    changeIsShowDisplay(value) {
      this.changeDefaultProp("IsShowDisplay", value);
    },
    changeCity(arr) {
      if (!this.CityList.length) {
        return;
      }
      const citys = arr.map(v => {
        let item;
        for (const sv of this.CityList) {
          if (sv.id === v) {
            item = sv;
            return {
              CityID: item.id,
              CityName: item.label
            };
          }
          for (const ssv of sv.children) {
            if (ssv.id === v) {
              item = ssv;
              return {
                CityID: item.id,
                CityName: item.label
              };
            }
          }
        }
      });
      this.changeDefaultProp("CityVMs", citys);
    },
    getCityList(searchText) {
      this.cityPicker.searchParam.CityName = searchText;
      GetCityList().then(d => {
        const data = d.ResponseData;
        const newData = this.formatCityToTree(data);
        this.changeCityList(newData);
      });
    },
    formatCityToTree(data) {
      let mapObj = {};
      const newArr = [];
      data.forEach((v, i) => {
        if (!mapObj[v.ProvinceID]) {
          mapObj[v.ProvinceID] = [v];
        } else {
          mapObj[v.ProvinceID].push(v);
        }
      });
      Object.keys(mapObj).forEach((v, i) => {
        const children = mapObj[v].map((sv, si) => {
          return {
            id: sv.CityID,
            label: sv.CityName
          };
        });
        newArr.push({
          id: v,
          label: mapObj[v][0].ProvinceName,
          children: children
        });
      });
      return newArr;
    },
    getDefaultYear(currentYear) {
      if (currentYear) {
        return currentYear;
      } else {
        let nowDate = new Date().getFullYear();
        return parseInt(nowDate);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.property-wrap {
  border: solid 1px #e5e5e5;
  border-top: 0;
  margin-left: -1px;
  float: left;
  width: 242px;
  min-height: 100%;
  .template-property {
    .title {
      color: #666666;
      font-size: 14px;
      margin: 5px 0;
      &.top{
        vertical-align: top;
      }
    }

    .form-item {
      &.top{
        vertical-align: top;
      }
      &.none {
        padding-left: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }

  .paper-property {
    font-size: 14px;
    line-height: 32px;
    .form-item {
      margin-bottom: 15px;
      .title {
        vertical-align: middle;
        &.top {
          vertical-align: top;
        }
      }

      .right {
        float: right;
        .input {
          width: 70px;
        }

        .text {
          margin-left: 6px;
        }
      }
    }
  }
}
.one-line {
  .title {
    display: inline-block;
    vertical-align: middle;
    &::after {
      content: ":";
    }
  }
  .form-item {
    width: 135px;
    display: inline-block;
    vertical-align: middle;
  }
  .font14 {
    color: #333;
    padding-left: 10px;
    padding-top: 5px;
  }
}
</style>


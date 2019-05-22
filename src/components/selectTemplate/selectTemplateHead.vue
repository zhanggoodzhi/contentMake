<template>
  <div class="head-content">
    <div>
      <span>地区：</span>
      <span
        class="head-item"
        @click="noSelectZoneClick"
        :class="{select:this.noSelectZone.noSelecItems}"
      >不限</span>
      <div
        class="head-item"
        v-for="zone in zoneData"
        :class="{select:zone.IsSelected}"
        @click="dataItemClick(zone,zoneData,noSelectZone,'on-select-zone',zonesPostback)"
        :key="zone.DataKey"
      >
        <span>{{zone.ZoneName}}</span>
      </div>
    </div>
    <div>
      <span>年度：</span>
      <span
        class="head-item"
        @click="noSelectYearClick"
        :class="{select:this.noSelectYear.noSelecItems}"
      >不限</span>
      <div
        class="head-item"
        v-for="year in yearData"
        :class="{select:year.IsSelected}"
        @click="dataItemClick(year,yearData,noSelectYear,'on-select-year',yearsPostback)"
        :key="year.DataKey"
      >
        <span>{{year.DataKey}}</span>
      </div>
    </div>
    <div class="div-margin-right">
      <span @click="resetAllSelect">
        <i class=" refresh font_family icon-refresh"></i>
        <span class="text">重置选择条件</span>
      </span>
    </div>
  </div>
</template>
<script>
import { getUserData } from "@/plugins/utils";
export default {
  props: ["yearData", "zoneData"],
  data() {
    return {
      noSelectYear: { noSelecItems: true },
      noSelectZone: { noSelecItems: true },
      yearsPostback: [],
      zonesPostback: []
    };
  },

  created() {
     this. defaultSelectedCity();
  },
  watch: {
    zoneData() {
     this. defaultSelectedCity();
    }
  },
  methods: {
     defaultSelectedCity() {
      if (this.ifkaola()) {
        const userData = getUserData();
        const cities = this.CityNamesTransform(userData.zoneNames);
        cities.forEach(city => {
          this.zoneData.forEach(zone => {
            if (zone.ZoneName == city) {
              this.dataItemClick(
                zone,
                this.zoneData,
                this.noSelectZone,
                "on-select-zone",
                this.zonesPostback
              );
            }
          });
        });
      }
    },
    CityNamesTransform(cityNames) {
      const names = cityNames.split(",");
      let cityArr = [];
      for (let i = 0; i < names.length; i++) {
        cityArr.push(names[i]);
      }
      return cityArr;
    },

    dataItemClick(item, filterData, noSelectItem, fireEvent, postbackData) {
      var num = 0;
      postbackData = [];
      item.IsSelected = !item.IsSelected;
      filterData.forEach(element => {
        if (element.IsSelected) {
          ++num;
          postbackData.push(element.DataKey);
        }
      });
      noSelectItem.noSelecItems = num > 0 ? false : true;
      this.$emit(fireEvent, postbackData);
    },
    emptySelect(noSelectItem, filterData) {
      noSelectItem.noSelecItems = true;
      filterData.forEach(element => {
        element.IsSelected = false;
      });
    },
    noSelectZoneClick() {
      this.emptySelect(this.noSelectZone, this.zoneData);
      this.$emit("on-select-zone", []);
    },
    noSelectYearClick() {
      this.emptySelect(this.noSelectYear, this.yearData);
      this.$emit("on-select-year", []);
    },
    resetAllSelect() {
      this.emptySelect(this.noSelectZone, this.zoneData);
      this.emptySelect(this.noSelectYear, this.yearData);
      this.$emit("on-select-none");
    }
  }
};
</script>
<style lang="less" scoped>
.head-content {
  padding: 20px 0px 20px 27px;
  width: 100%;
  height: 100%;
  border-top: 1px solid #e5e5e5;
  font-size: 14px;
  color: #666666;
  .head-item {
    cursor: pointer;
    padding: 2px 8px;
    display: inline-block;
    border: solid 1p;
    color: #333;
    margin: 5px;
    &:hover {
      color: #2493f8;
    }
    &.select {
      background-color: #2493f8;
      border-radius: 3px;
      color: #ffffff;
    }
  }
  .option-icon {
    margin-right: 3px;
    width: 12px;
    height: 12px;
  }
  .div-margin-right {
    margin-right: 27px;
    margin-top: -2%;
    float: right;
    color: #2493f8;
    cursor: pointer;
    &:hover {
      span.text {
        text-decoration: underline;
        color: #2493f8;
      }
    }
    .refresh {
      margin-right: 10px;
    }
  }
}
</style>
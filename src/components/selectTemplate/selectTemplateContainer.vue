<template>
  <div class="body">
    <div class="search-header clearfix">
      <span>
        共
        <span class="template-count">{{this.totalOptionalTemplateCount}}</span> 套模板
      </span>
      <div class="search-wrap">
        <Input
          search
          v-model="searchParams.TemplateName"
          placeholder="请输入模板名称搜索"
          @on-search="search"
        />
      </div>
    </div>
    <div v-if="renderData.length&&!loadingData">
      <div class="list-wrap">
        <selectTemplatebody
          v-for="(item,i) in renderData"
          :key="i"
          :itemData="item"
        ></selectTemplatebody>
      </div>
      <div class="page-wrap clearfix">
        <Page
          class="page"
          :current="searchParams.Pageparam.PageIndex"
          @on-change="pageChange"
          :total="totalOptionalTemplateCount"
          @on-page-size-change="pageSizeChange"
          show-sizer
        />
      </div>
    </div>
    <div
      v-if="loadingData"
      class="spin-wrap"
    >
      <Spin
        class="spin"
        size="large"
      ></Spin>
    </div>
    <div
      class="none-wrap"
      v-if="renderData.length == 0"
    >
      <div>
        <img
          class="search-img"
          v-if="ifSearch"
          src="/img/none.png"
          alt
        >
        <img
          class="none-img"
          v-else
          src="/img/no-data.png"
          alt
        >
      </div>
      <div v-if="!ifSearch">
        <p v-if="Type == 2">
          暂无模板
          <span>,请先</span>
          <span
            @click="createTemplate"
            class="create-template"
          >创建模板</span>
        </p>
        <p v-else>暂无推荐模板!</p>

      </div>
      <div v-else>
        <p>无查询结果</p>
      </div>
    </div>
  </div>
</template>
<script>
import selectTemplatebody from "@/components/selectTemplate/selectTemplatebody";
import {
  GetYearOfTemplate,
  GetZoneOfTemplate,
  GetOptionalTemplate
} from "@/plugins/service";
export default {
  components: {
    selectTemplatebody
  },
  props: [
    "Type",
    "renderData",
    "totalOptionalTemplateCount",
    "hasNoData",
    "loadingData",
    "ifSearch"
  ],
  data() {
    return {
      // ifSearch: false,
      yearData: [],
      zoneData: [],
      optionalTemplate: [],
      // hasNoData: false,
      // loadingData: false,
      searchParams: {
        type: 0,
        TemplateName: "",
        ZoneIDArray: [],
        YearArray: [],
        Pageparam: {
          PageSize: 10,
          PageIndex: 1
        }
      }
    };
  },
  created() {},

  methods: {
    checkadmin() {
      console.log("this.ifadmin();", this.ifadmin());
      return this.ifadmin();
    },
    back() {
      this.$router.back();
    },
    preLoadData() {
      const params = this.searchParams.Type;
      GetYearOfTemplate(params).then(responseData => {
        this.yearData = responseData;
      });
      GetZoneOfTemplate(params).then(responseData => {
        this.zoneData = responseData;
      });
    },
    search() {
      this.$emit("search", this.searchParams.TemplateName);
    },
    getTemplate() {
      GetOptionalTemplate(this.searchParams).then(d => {
        this.loadingData = true;
        const responseData = d.ResponseData;
        this.renderData = responseData.OptionalTemplateList;
        this.totalOptionalTemplateCount = responseData.Count;
        this.hasNoData = this.totalOptionalTemplateCount == 0;
        this.ifSearch = this.searchParams.TemplateName ? true : false;
        this.loadingData = false;
      });
    },
    selectYear(yearArray) {
      this.searchParams.YearArray = yearArray;
      this.getTemplate();
    },
    selectZone(zoneArray) {
      this.searchParams.ZoneIDArray = zoneArray;
      this.getTemplate();
    },
    selectNone() {
      this.searchParams.YearArray = [];
      this.searchParams.ZoneIDArray = [];
      this.getTemplate();
    },
    pageChange(index) {
      this.$emit("pageChange", index);
    },
    pageSizeChange(number) {
      this.$emit("pageSizeChange", number);
    },
    createTemplate() {
      this.$router.push({
        name: "editTemplate"
      });
    }
  }
};
</script>
<style lang="less" scoped>
.body {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  margin-top: 19px;
  padding-bottom: 19px;
  padding-right: 19px;
}
.kaola-body {
  margin-top: 19px;
}
.head {
  border: 1px solid #e5e5e5;
  background-color: #ffffff;
  .top {
    padding: 10px 15px;
  }
  .option-icon {
    margin-right: 3px;
    width: 12px;
    height: 12px;
  }
}
.head-title {
  font-weight: bold !important;
  font-size: 16px;
  letter-spacing: 0px;
  color: #444444;
  padding-top: 19px;
  padding-left: 15px;
  padding-bottom: 19px;
}
.none-wrap {
  padding: 100px 0;
  text-align: center;
  color: #999;
  .search-img {
    width: 232px;
    height: 146px;
    margin-bottom: 20px;
  }
  .none-img {
    width: 166px;
    height: 184px;
    margin-bottom: 30px;
  }
}
.search-header {
  height: 46px;
  position: relative;
  background-color: #ffffff;
  padding-left: 20px;
  padding-top: 16px;
  margin-bottom: 10px;
  .search-wrap {
    width: 284px;
    float: right;
    margin-right: 20px;
  }
}
.template-count {
  font-size: 20px;
}
.page-wrap {
  padding-top: 25px;
  .page {
    float: right;
  }
}
.create-template {
  color: #2493f8;
  &:hover {
    text-decoration: underline;
    color: #2493f8;
    cursor: pointer;
  }
}
.img-wrap {
  display: inline-block;
  cursor: pointer;
  padding: 0 5px;
  transition: all 0.2s;
  &:hover {
    opacity: 0.8;
  }
  .back-icon {
    color: #2493f8;
    // display: block;
    // width: 10px;
    // height: 17px;
  }
}
.back-title {
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
}
</style>

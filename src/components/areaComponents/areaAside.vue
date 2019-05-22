<template>

  <div class="aside">
    <ul class="search-container">
      <li
        class="search-item"
        :class="item.status"
        v-for="(item, index) in tabArr"
        @click="jump(item.route, index)"
      >{{item.name}}</li>
    </ul>
    <div
      v-show="activeTab == 'Paper'"
      class="nameList"
    >
      <div class="search-bar-container">
        <div class="check-all">
          <Checkbox
            @on-change="selectAll"
            v-model="selectAllName"
          ></Checkbox>
          <span class="check-all-text">全选</span>
        </div>
        <div class="search-bar">
          <Input
            class="area-aside-search-input"
            search
            placeholder="输入试卷名称搜索"
            @on-search="searchWithPapaerName()"
            v-model="serachValue"
          />
          <img src="" />
        </div>
      </div>
    </div>

    <div
      class="empty question-list"
      v-if="baseData && baseData.length == 0"
    >
      <img
        src="/img/none-small.png"
        class="empty-img"
      >
      <div class="empty-text">{{ifSearch?'无查询结果':'暂无数据'}}</div>
    </div>

    <div
      class="tree-container-scroll"
      v-bar
    >
      <div
        class="tree-container area-aside-tree"
        :class="{'paper':activeTab==='Paper'}"
      >
        <div v-if="baseData && baseData.length">
          <Tree
            class="tree"
            :data="baseData"
            @on-check-change="AbilityCheck"
            show-checkbox
          ></Tree>
        </div>
      </div>
    </div>
    <div
      class="page-wrap small-page-select"
      v-show="activeTab=='Paper' && baseData.length > 0"
    >
      <Page
        :total="total"
        :current="paperCurrentIndex"
        @on-change="pageChange"
        show-sizer
        @on-page-size-change="pageSizeChange"
        :page-size="pageSize"
        size="small"
      />
    </div>
  </div>

</template>

<script>
import deepClone from "clone";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import {
  GetAllAbility,
  GetPaperNameList,
  GetMaterialTree,
  GetConditionViewModel,
  GetPaperNames
} from "@/plugins/service";
export default {
  created() {
    GetConditionViewModel().then(data => {
      if (data.ResponseCode != 0) return;
      this.responseData = data.ResponseData;
    });
    //请求试卷列表
    let params = {
      PaperName: this.serachValue,
      Pageparam: {
        PageSize: this.pageSize,
        PageIndex: this.paperCurrentIndex,
        OrderBy: ""
      }
    };
    this.getPaperNames(params);
  },
  props: ["SearchParam"],

  computed: {
    ...mapState(["userDetail", "Ability", "PaperNameList", "MaterialTree"])
  },
  mounted() {},
  data() {
    return {
      ifSearch: false,
      total: 0,
      pageSize: 20,
      activeTab: "Paper",
      tabArr: [
        {
          status: "active",
          route: "Paper",
          name: "按试卷"
        },
        {
          status: "",
          route: "Material",
          name: "按教材"
        },
        {
          status: "",
          route: "Ability",
          name: "按考查能力"
        }
      ],
      responseData: {},
      baseData: [],
      paperNames: [],
      serachValue: "",
      paperCurrentIndex: 1,
      selectAllName: false
    };
  },
  methods: {
    pageChange(number) {
      this.paperCurrentIndex = number;
      //请求试卷列表
      let params = {
        PaperName: this.serachValue,
        Pageparam: {
          PageSize: this.pageSize,
          PageIndex: this.paperCurrentIndex,
          OrderBy: ""
        }
      };
      this.getPaperNames(params);
    },
    pageSizeChange(number) {
      this.pageSize = number;
      let params = {
        PaperName: this.serachValue,
        Pageparam: {
          PageSize: this.pageSize,
          PageIndex: this.paperCurrentIndex,
          OrderBy: ""
        }
      };
      this.getPaperNames(params);
    },
    selectAll(selected) {
      this.selectAllName = selected;
      const tempArr = deepClone(this.baseData);
      const paperIds = [];
      tempArr.forEach(item => {
        item.checked = selected;
        paperIds.push(item.id);
      });

      this.paperNames = this.baseData = tempArr;
      this.$emit("selectedAllPaperName", selected ? paperIds : []);

      // this.$emit("selectedAllPaperName", dic);
    },
    ...mapMutations(["changeAbility", "changePaperName", "changeMaterialTree"]),
    getPaperNames(params) {
      GetPaperNames(params).then(data => {
        console.log(data);
        if (data.ResponseCode != 0) return;
        this.baseData = this.paperNames = data.ResponseData.PaperNames;
        this.baseData.forEach(item => {
          item.render = (h, { root, node, data }) => {
            return h(
              "span",
              {
                attrs: {
                  title: item.title
                },
                style: {
                  display: "inline-block"
                  // width: '100%',
                }
              },
              item.title
            );
          };
        });

        this.ifSearch = params.PaperName ? true : false;
        this.total = data.ResponseData.Count;
      });
    },
    searchWithPapaerName() {
      this.selectAllName = false;
      //if (this.serachValue.length == 0) return;
      const params = {
        PaperName: this.serachValue,
        Pageparam: {
          PageSize: this.pageSize,
          PageIndex: 1,
          OrderBy: ""
        }
      };
      this.getPaperNames(params);
    },

    //切换
    jump(route, index) {
      this.activeTab = route;
      this.tabArr.forEach(item => {
        item.status = "";
      });
      this.tabArr[index].status = "active";
      if (route == "Paper") {
        this.baseData = this.paperNames;
      } else if (route == "Material") {
        this.baseData = this.responseData.MaterialTree;
      } else if (route == "Ability") {
        this.baseData = this.responseData.AbilityTree;
      }
      //by gm
      this.baseData.forEach(item => {
        this.recurrenceAddRender(item);
      });
    },

    //递归查询函数
    recurrenceAddRender(obj) {
      obj.render = (h, { root, node, data }) => {
        return h(
          "span",
          {
            attrs: {
              title: obj.title
            },
            style: {
              display: "inline-block",
              // width: '100%',
              width: "161px",
              "text-overflow": "ellipsis",
              "white-space": "nowrap",
              overflow: "hidden",
              "vertical-align": "middle"
            }
          },
          obj.title
        );
      };

      if (undefined != obj.children && obj.children.length > 0) {
        obj.children.forEach(item => {
          this.recurrenceAddRender(item);
        });
      } else {
        return;
      }
    },

    AbilityCheck(obj) {
      if (this.activeTab == "Paper") {
        this.selectAllName = this.paperNames.length == obj.length;
      }
      let dic = {
        key: this.activeTab,
        value: []
      };
      obj.forEach(item => {
        if (
          item.children == undefined ||
          item.children == null ||
          item.children.length == 0
        ) {
          dic.value.push(item.id);
        }
      });
      this.$emit("paramChgange", dic);
    }
  }
};
</script>

<style lang="less" scoped>
.aside {
  position: relative;
  height: 100%;
  width: 280px;
  border: solid 1px #e5e5e5;
  float: left;
  background-color: white;
  .search-container {
    height: 41px;
    display: flex;
    justify-content: space-around;
    background-color: #f1f0f0;
    .search-item {
      display: inline-block;
      width: 33%;
      padding: 10px 0;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &:hover {
        border-bottom: solid #2493f8 2px;
        color: #2493f8;
        font-weight: bold;
        background-color: white;
      }
      &.active {
        border-bottom: solid #2493f8 2px;
        color: #2493f8;
        font-weight: bold;
        background-color: white;
      }
    }
  }

  .search-bar-container {
    padding: 7px 14px;

    border-bottom: solid 1px #e5e5e5;
    .check-all {
      display: inline-block;
      text-align: left;
      padding-right: 10px;
      border-right: solid 1px #e5e5e5;
    }
    .check-all-text {
      height: 21px;
      line-height: 21px;
      vertical-align: middle;
      display: inline-block;
      color: #333333;
      font-size: 14px;
    }
    .search-bar {
      width: 160px;
      display: inline-block;
      text-align: right;
      margin-left: 13px;
      .search-text {
        appearance: none;
      }
    }
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
  .tree-container {
  }
  .page-wrap {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}
.tree-container-scroll {
  padding-bottom: 40px;
  padding-left: 14px;
  height: calc(100% - 94px);
}
</style>
<style lang="less">
.small-page-select {
  .ivu-select-selected-value {
    color: #666;
    font-size: 12px !important;
    line-height: 20px !important;
  }
}
.area-aside-tree {
  margin-top: 15px;
  &.paper {
    margin-top: 5px;
  }
  .ivu-tree-title {
    font-size: 14px;
    margin-top: -1px;
    color: #333;
  }
}
.area-aside-search-input {
  input {
    height: 32px !important;
  }
}
.area-aside-search-input .ivu-input {
  border: none;
}
</style>



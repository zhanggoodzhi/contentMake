<template>
  <div>
    <CustomCollapse
      v-if="questionIndex!==-1"
      class="left-title-collapse"
      :title="`【${formatAreaType(paperData.PaperAreaViewModels[areaIndex].AreaType)}】试题属性`"
    >
      <AreaPropPerty></AreaPropPerty>
    </CustomCollapse>
    <CustomCollapse
      v-else
      class="left-title-collapse"
      title="试卷属性"
    >
      <div class="form-item clearfix">
        <span class="title">年度：</span>
        <div class="right">
          <span class="vm text">{{paperData.Year}}</span>
        </div>
      </div>
      <div class="form-item clearfix">
        <span class="title area">适用地区：</span>
        <div class="right area">
          <span class="text">{{renderCity}}</span>
        </div>
      </div>
      <div class="form-item clearfix">
        <span class="title">试卷类型：</span>
        <div class="right">
          <Select
            style="width:275px"
            :value="paperData.PaperTypeID"
            @on-change="changePaperTypeID"
          >
            <Option
              v-for="v in PaperTypeList"
              :value="v.PaperTypeID"
              :key="v.PaperTypeID"
            >{{ v.PaperTypeName }}</Option>
          </Select>
        </div>
      </div>
      <div class="form-item clearfix">
        <span class="title">教材选择：</span>
        <div class="right">
          <Treeselect
            class="edit-paper-tree-select"
            style="width:275px"
            :value="paperData.MaterialID||null"
            @input="changeMaterialID"
            placeholder="请选择"
            :disable-branch-nodes="true"
            :options="treeOption"
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
        </div>
      </div>
      <div class="form-item clearfix">
        <span class="title">适用年级：</span>
        <div class="right">
          <Select
            style="width:275px"
            :value="paperData.GradeID"
            @on-change="changeGradeID"
          >
            <Option
              v-for="v in GradeList"
              :value="v.GradeID"
              :key="v.GradeID"
            >{{ v.GradeName }}</Option>
          </Select>
        </div>
      </div>
    </CustomCollapse>
  </div>
</template>
<script>
import CustomCollapse from "@/components/CustomCollapse";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import Treeselect from '@riophae/vue-treeselect'
import AreaPropPerty from '@/components/editPaper/PaperProperty/AreaProperty'
const globalVuex = createNamespacedHelpers("global");
import deepClone from 'clone';
import {
  GetPaperTypeList,
  GetGradeList,
  GetMaterialTree
} from "@/plugins/service";
export default {
  components: {
    AreaPropPerty,
    CustomCollapse,
    Treeselect
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['paperData', 'areaIndex', 'questionIndex']),
    ...globalVuex.mapState(['PaperTypeList', 'GradeList', "MaterialTree"]),
    renderCity() {
      if (this.paperData.CityVMs) {
        return this.paperData.CityVMs.map(v => v.CityName).join('/')
      }
      return '无'
    },

    treeOption() {
      const treeData = this.MaterialTree;
      if (!treeData) {
        return []
      }
      const format = (arr) => {
        return arr.map(v => {
          if (!v.children.length) {
            return {
              id: v.id,
              label: v.title,
            }
          }
          return {
            children: format(v.children),
            id: v.id,
            label: v.title,
          }
        });
      }
      const formatData = format(treeData);
      return formatData;
    }
  },
  created() {
    if (this.PaperTypeList) {
      this.changePaperTypeID(this.PaperTypeList[0].PaperTypeID);
    }
    //试卷类型
    if (!this.PaperTypeList) {
      GetPaperTypeList().then(d => {
        const data = d.ResponseData;
        this.changePaperType(data);
      });
    }
    //年级
    if (!this.GradeList) {
      GetGradeList().then(d => {
        const data = d.ResponseData;
        this.changeGrade(data);
      });
    }
    //教材树
    if (this.MaterialTree == null) {
      GetMaterialTree().then(d => {
        const data = d.ResponseData;

        this.changeMaterialTree(data);
      });
    }

  },
  methods: {
    ...mapMutations(['changePaperData']),
    ...globalVuex.mapMutations(['changePaperType', 'changeGrade', "changeMaterialTree"]),
    changePaperTypeID(value) {
      const newData = { ...this.paperData };
      newData.PaperTypeID = value;
      this.changePaperData(newData);
    },
    changeGradeID(value) {
      const newData = { ...this.paperData };
      newData.GradeID = value;
      this.changePaperData(newData);
    },
    changeMaterialID(value) {
      const newData = { ...this.paperData };
      newData.MaterialID = value;
      this.changePaperData(newData);
    },
  }
}
</script>

<style lang="less" scoped>
.form-item {
  margin-bottom: 16px;
  .title {
    display: inline-block;
    width: 70px;
    color: #666666;
    font-size: 14px;
    text-align: right;
    vertical-align: middle;
    &.area{
      vertical-align: top;
    }
  }
  .right {
    display: inline-block;
    font-size: 14px;
    color: #333;
    vertical-align: middle;
    &.area {
      width: 262px;
      vertical-align: top;
    }
  }
}
</style>
<style lang="less">
.paper-max-wrap {
  .property-wrap {
    .custom-collapse {
      .ivu-collapse-content-box {
        width: 345px;
      }
    }
  }
}
.left-title-collapse {
  .ivu-collapse-header {
    text-align: left;
  }
}
</style>



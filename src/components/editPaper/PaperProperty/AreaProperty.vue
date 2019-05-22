<template>
  <div>
    <div class="title-wrap">
      <span class="title vm">难度</span>
      <div class="line vm"></div>
    </div>
    <div class="difficulty-wrap">
      <div
        v-for="(v,i) in question.PaperContentViewModels"
        class="row"
      >
        <div class="index">{{v.Idx}}.</div>
        <div class="group">
          <div
            class="tag"
            @click="changeEditPaperContentProp(areaIndex,questionIndex,i,'Difficulty','容易')"
            :class="{'active':v.Difficulty==='容易'}"
          >容易</div>
          <div
            class="tag"
            @click="changeEditPaperContentProp(areaIndex,questionIndex,i,'Difficulty','普通')"
            :class="{'active':v.Difficulty==='普通'}"
          >普通</div>
          <div
            class="tag"
            @click="changeEditPaperContentProp(areaIndex,questionIndex,i,'Difficulty','困难')"
            :class="{'active':v.Difficulty==='困难'}"
          >困难</div>
        </div>
      </div>
    </div>
    <div class="title-wrap">
      <span class="title vm">考查能力</span>
      <div class="line vm small"></div>
    </div>
    <div class="ability-wrap">
      <div
        v-for="(v,i) in question.PaperContentViewModels"
        class="row"
      >
        <div class="index">{{v.Idx}}.</div>
        <div class="select">
          <Treeselect
            noChildrenText="没有子选项"
            noResultsText="搜索无结果"
            noOptionsText="没有可选项"
            class="edit-paper-tree-select ability"
            style="width:275px"
            :value="getPaperAbilitys(v)"
            :multiple="true"
            @input="changePaperAbilitys(i,$event)"
            placeholder="请选择"
            :disable-branch-nodes="true"
            :options="treeData"
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
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const globalVuex = createNamespacedHelpers("global");
import { GetAllAbility } from "@/plugins/service";
import deepClone from 'clone';
export default {
  components: {
    Treeselect
  },
  mounted: function () {
    if (!this.Ability.Lv1) {
      GetAllAbility().then(d => {
        const data = d.ResponseData;
        this.changeAbility(data);
      });
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['paperData', 'areaIndex', 'questionIndex']),
    ...globalVuex.mapState(['Ability']),
    treeData() {
      const baseData = [];
      if (this.Ability != null) {
        this.Ability.Lv1.forEach(element1 => {
          var base1 = {
            id: element1.ID,
            label: element1.Name,
            children: []
          };
          //二级
          this.Ability.Lv2.forEach(element2 => {
            if (element2.ParentID == element1.ID) {
              var base2 = {
                id: element2.ID,
                label: element2.Name,
                children: []
              };
              //三级
              this.Ability.Lv3.forEach(element3 => {
                if (element3.ParentID == element2.ID) {
                  base2.children.push({
                    id: element3.ID,
                    label: element3.Name
                  });
                }
              });

              base1.children.push(base2);
            }
          });
          baseData.push(base1);
        });
      }
      return baseData;
    },
    question() {
      return this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex]
    }
  },
  methods: {
    ...mapMutations(['changePaperData']),
    ...globalVuex.mapMutations(['changeAbility']),
    getPaperAbilitys(v) {
      return v.PaperContentAbilityViewModels.map(v => v.ID);
    },
    changePaperAbilitys(i, value) {
      const arr = value.map(v => {
        return {
          ID: v
        }
      });
      this.changeEditPaperContentProp(this.areaIndex, this.questionIndex, i, 'PaperContentAbilityViewModels', arr);
    }
  }
}
</script>

<style lang="less" scoped>
.title-wrap {
  margin-top: 23px;
  &:first-child{
    margin-top: 16px;
  }
  .title {
    font-size: 14px;
    color: #999999;
  }
  .line {
    display: inline-block;
    width: 307px;
    height: 1px;
    background-color: #f1f0f0;
    vertical-align: 2px;
    margin-left: 10px;
    &.small {
      width: 279px;
    }
  }
}
.difficulty-wrap {
  .row {
    margin-top: 12px;
    .index {
      font-size: 14px;
      display: inline-block;
      width: 25px;
    }
    .group {
      width: 320px;
      display: inline-block;
      .tag {
        margin-right: 11px;
        border: solid 1px #e5e5e5;
        background-color: #f5f5f5;
        border-radius: 3px;
        display: inline-block;
        cursor: pointer;
        padding: 5px 10px;
        &:last-of-type {
          margin-right: 0;
        }
        &:hover {
          border: solid 1px #2493f8;
          color: #2493f8;
        }
        &.active {
          background: white;
          border: solid 1px #2493f8;
          color: #2493f8;
        }
      }
    }
  }
}
.ability-wrap {
  margin-bottom: 10px;
  .row {
    margin-top: 12px;
    .index {
      margin-top: 5px;
      vertical-align: top;
      font-size: 14px;
      display: inline-block;
      width: 25px;
    }
    .select {
      width: 320px;
      display: inline-block;
    }
  }
}
</style>
<style lang="less">
.edit-paper-tree-select {
  .vue-treeselect__x-container {
    display: none;
  }
  &.ability{

    .vue-treeselect__control{
     border: 0;
     border-bottom: 1px solid #e8e8e8;
     border-radius: 0;
   }
   .vue-treeselect__control-arrow-container{
     display: none;
   }
  }
}
</style>




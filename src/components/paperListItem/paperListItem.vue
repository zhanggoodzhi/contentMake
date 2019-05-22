<template>
  <div class="item">
    <div class="head">
      <img
        class="left-icon vm"
        src="/img/label2.png"
        alt
      >
      <Checkbox
        class="single-checkbox vm"
        v-if="itemData.PaperStatus==2||(ifVerify&&!ifkaola())"
        v-model="itemData.IsChecked"
        :label="itemData.PaperID"
      >
        <span class="text"></span>
      </Checkbox>
      <div
        @click="editPaperName(itemData.PaperID,itemData.PaperName,itemData.RelevanceInPackageCount)"
        class="hover-wrap vm"
        :class="{'hashover':!ifVerify||ifkaola()}"
      >
        <span class="edit-text vm">{{itemData.PaperName}}</span>
        <i class="edit-icon icon-edit vm font_family"></i>
      </div>
      <div class="options-wrap abm">
        <div
          @click="setPaperPublish(itemData.PaperID)"
          class="option-item"
          v-if="itemData.IsShowPublishButton||(ifVerify&&!ifkaola())"
        >
          <i class="font-icon font_family icon-release"></i>
          <span class="vm">发布</span>
        </div>
        <div
          @click="exportPaperPackage(itemData.PaperID)"
          class="option-item"
          v-if="itemData.IsShowExportButton||(ifVerify&&!ifkaola())"
        >
          <i class="font-icon font_family icon-export"></i>
          <span class="vm">导出验收包</span>
        </div>
        <div
          @click="setPaperFinished(itemData.PaperID)"
          class="option-item"
          v-if="itemData.IsShowFinishButton"
        >
          <i class="font-icon font_family icon-common_finish"></i>
          <span class="vm">{{ifkaola()?'提交审核':'完成'}}</span>
        </div>
        <div
          @click="editPaper(itemData.PaperID)"
          class="option-item"
          v-if="itemData.IsShowEditButton"
        >
          <i class="font-icon font_family icon-template_list_edit"></i>
          <span class="vm">编辑</span>
        </div>
        <div
          @click="previewPaper(itemData.PaperID)"
          class="option-item mr"
          v-if="ifVerify&&!ifkaola()"
        >
          <i class="font-icon font_family icon-preview"></i>
          <span class="vm">预览</span>
        </div>
        <div
          v-if="(ifVerify||itemData.PaperStatus==3)&&ifkaola()"
          @click="simulation(itemData)"
          class="option-item"
        >
          <i class="font-icon font_family icon-computer"></i>
          <span class="vm">全真模拟</span>
        </div>
        <Dropdown
          v-if="ifshowDropDown"
          trigger="click"
          class="vm"
          @on-click="clickDropDown"
        >
          <a
            class="dropdown-icon-wrap"
            href="javascript:void(0)"
          >
            <i class="font-icon font_family icon-template_list_more"></i>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem
              name="rollbackPaper"
              v-if="itemData.IsShowEditMenu"
            >
              <span class="vm">编辑</span>
            </DropdownItem>
            <DropdownItem
              name="setPaperProperty"
              v-if="itemData.IsShowPropertyMenu"
            >
              <span
                class="vm"
                style="white-space: nowrap;"
              >属性设置</span>
            </DropdownItem>
            <DropdownItem name="copyPaper">
              <span class="vm">复制</span>
            </DropdownItem>
            <DropdownItem name="previewPaper">
              <span class="vm">预览</span>
            </DropdownItem>
            <DropdownItem
              v-if="canDelete"
              class="del-wrap"
              name="deletePaper"
            >
              <span class="vm">删除</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <div
        class="info-wrap clearfix"
        :class="{'three-item':ifkaola()||ifVerify}"
      >
        <div class="info-item">
          <span class="number">{{itemData.TotalScore}}</span>
          <span class="gray font14 vm span-text">总分</span>
        </div>
        <div class="info-item">
          <span class="font14 vm">约</span>
          <span class="number">{{itemData.TotalMinute}}</span>
          <span class="font14 vm">分钟</span>
          <span class="gray font14 vm span-text">考试时长</span>
        </div>
        <div class="info-item">
          <span class="number">{{itemData.UsedCount}}</span>
          <span class="gray font14 vm span-text">使用次数</span>
        </div>
        <div
          v-if="!ifkaola()&&!ifVerify"
          class="info-item last-item"
        >
          <span class="number">{{itemData.RelevanceInPackageCount}}</span>
          <span class="gray font14 vm span-text">关联试卷包数</span>
        </div>
      </div>
    </div>
    <div class="footer font12 clearfix">
      <p class="left">
        <tooltip
          placement="top"
          :content="itemData.TemplateName"
          max-width="100%"
        >
          <span class="gray">模板：</span>
          <a
            class="texttemplate"
            @click="previewTemplate(itemData.TemplateID)"
          >{{substringIntelligentize(itemData.TemplateName,11)}}</a>
        </tooltip>
        <span class="gray ml">教材：</span>
        <tooltip
          placement="top"
          :content="itemData.MaterialName"
          v-if="itemData.MaterialName"
          max-width="100%"
        >
          <span
            v-if="itemData.MaterialName"
            class="text"
          >{{substringIntelligentize(itemData.MaterialName,20)}}</span>
        </tooltip>
        <a
          v-if="!itemData.MaterialName"
          class="unset"
          @click="setPaperProperty(itemData.PaperID)"
        >未设置</a>
        <tooltip
          placement="top"
          :content="itemData.PaperLable"
          max-width="100%"
        >
          <span class="gray ml">标签：</span>
          <span
            v-if="itemData.PaperLable"
            class="text"
          >{{substringIntelligentize(itemData.PaperLable,16)}}</span>
        </tooltip>
        <a
          v-if="!itemData.PaperLable"
          class="unset"
          @click="setPaperProperty(itemData.PaperID)"
        >未设置</a>
      </p>
      <p class="right">
        <i class="list-inner-icon font_family icon-time"></i>
        <span class="text vm">{{formatComplexDate(itemData.UpdateDateTime)}}</span>
        <i
          v-if="ifShowCreater"
          class="list-inner-icon font_family icon-template_list_user"
        ></i>
        <span
          :title="itemData.UserOrgName"
          v-if="ifVerify&&!ifkaola()&&itemData.UserOrgName"
          class="vm gray ellipsis"
          style="max-width:100px;display:inline-block;"
        >{{itemData.UserOrgName}}：</span>
        <span
          :title="itemData.CreateByName"
          v-if="ifShowCreater"
          class="text vm ellipsis"
          style="max-width:120px;display:inline-block;"
        >{{itemData.CreateByName}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("global");
import { formatComplexDate } from "@/plugins/utils";
export default {
  data() {
    return {
      formatComplexDate: formatComplexDate
    };
  },
  created() {
    console.log(this.itemData);
  },
  computed: {
    ...mapState(["userDetail"]),
    ifShowCreater() {
      if (this.ifkaola()) {
        return false;
      } else {
        if (this.ifVerify) {
          return true;
        } else {
          return false;
        }
      }
    },
    ifshowDropDown() {
      if (this.ifVerify && !this.ifkaola()) {
        return false;
      }
      return true;
    },
    canDelete() {
      // 是不是待审核页面
      if (this.ifVerify) {
        //是不是考拉用户
        if (this.ifkaola()) {
          // 使用次数大于0
          if (this.itemData.UsedCount == 0) {
            return true;
          }
        }
        return false;
      } else {
        return this.itemData.IsShowDeleteMenu;
      }
    },
    ifcreater() {
      if (this.itemData.CreateUser === this.userDetail.NickName) {
        return true;
      }
      return false;
    }
  },
  methods: {
    editPaperName(paperID, paperName, RelevanceInPackageCount) {
      if (this.ifVerify && !this.ifkaola()) {
        return;
      }
      /* alert("paperListItem->editPaperName"); */
      this.$emit("on-edit-paper-name", paperID, paperName, RelevanceInPackageCount);
    },
    editPaper(paperID) {
      this.$emit("on-edit-paper", paperID);
    },
    setPaperFinished(paperID) {
      this.$emit("on-set-paper-finished", paperID);
    },
    exportPaperPackage(paperID) {
      this.$emit("on-export-paper-package", paperID);
    },
    simulation(data) {
      this.$emit("on-simulation", data);
    },
    setPaperPublish(paperID) {
      /* alert("paperListItem->setPaperPublish "); */
      this.$emit("on-set-paper-publish", paperID);
    },
    setPaperProperty(paperID) {
      this.$emit("on-set-paper-property", paperID);
    },
    rollbackPaper(paperID) {
      this.$emit("on-rollback-paper", paperID);
    },
    copyPaper(paperID) {
      /* alert("paperListItem->coyPaper "); */
      this.$emit("on-copy-paper", paperID);
    },
    previewPaper(paperID) {
      this.$emit("on-preview-paper", paperID);
    },
    deletePaper(paperID) {
      /* alert("paperListItem->deletePaper "); */
      this.$emit("on-delete-paper", paperID);
    },
    clickDropDown(data) {
      if (data === "rollbackPaper") {
        this.rollbackPaper(this.itemData.PaperID);
      } else if (data === "setPaperProperty") {
        this.setPaperProperty(this.itemData.PaperID);
      } else if (data === "copyPaper") {
        this.copyPaper(this.itemData.PaperID);
      } else if (data === "previewPaper") {
        this.previewPaper(this.itemData.PaperID);
      } else if (data === "deletePaper") {
        this.deletePaper(this.itemData.PaperID);
      }
    },
    previewTemplate(templateID) {
      this.$router.push({
        name: "templatePreview",
        params: {
          id: templateID,
          type: "preview"
        }
      });
    }
  },
  props: ["itemData", "ifVerify"]
};
</script>

<style lang="less" scoped>
.item {
  font-size: 12px;
  margin-top: 16px;
  border: solid 1px #e5e5e5;
  border-radius: 6px;
  transition: all 0.5s;
  &:hover {
    border: solid 1px #9bcaf4;
  }
  &:first-child {
    margin-top: 0;
  }
  .head {
    position: relative;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f6f6f6;
    padding: 10px;
    .edit-icon {
      color: #2493f8;
      font-size: 16px;
      margin-left: 7px;
      display: none;
    }
    .left-icon {
      width: 24px;
      height: 24px;
      position: absolute;
      transform: translateY(-50%);
      top: 50%;
      left: -4px;
    }
    .hover-wrap {
      display: inline-block;
      margin-left: 18px;
      display: inline-block;
      .edit-text {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
      }
      &.hashover:hover {
        cursor: pointer;
        .edit-text {
          text-decoration: underline;
          color: #2493f8;
          & + i {
            display: inline-block;
          }
        }
      }
    }
    .options-wrap {
      right: 0;
      .option-item {
        .font-icon {
          vertical-align: middle;
          font-size: 12px;
          margin-right: 5px;
        }
        cursor: pointer;
        color: #2493f8;
        margin-left: 20px;
        vertical-align: middle;
        display: inline-block;
        &:hover {
          opacity: 0.8;
        }
        .option-icon {
          margin-right: 3px;
          width: 12px;
          height: 12px;
        }
      }
    }
    .dropdown-icon-wrap {
      display: block;
      margin-left: 20px;
      padding-right: 20px;
      .dropdown-icon {
        display: block;
        width: 2px;
        height: 16px;
      }
    }
    .del-wrap {
      color: #ff463d;
      transition: none;
      &:hover {
        span {
          color: #ff463d;
        }
        opacity: 0.8;
      }
    }
  }
  .content {
    padding: 16px 28px 30px 28px;
    .info-wrap {
      margin-top: 20px;
      &.three-item {
        .info-item {
          width: 33%;
        }
      }
      .info-item {
        float: left;
        padding-left: 17px;
        border-right-color: #eaeef0;
        border-right-width: 1px;
        border-right-style: dashed;
        text-align: center;
        width: 25%;
        &:last-child {
          border-right-style: none !important;
        }
        img {
          width: 14px;
          height: 14px;
          margin-right: 9px;
        }
        .number {
          color: #333333;
          font-size: 30px;
          vertical-align: -3px;
        }
        .span-text {
          display: block;
        }
      }
    }
  }
  .footer {
    padding: 14px 25px;
    border-top: 1px dashed #e4e4e4;
    img {
      width: 14px;
      height: 14px;
    }
    .left {
      float: left;
    }
    .right {
      float: right;
      i {
        margin-right: 6px;
        margin-left: 20px;
      }
    }
  }
}
.gray {
  color: #999999;
}
.text {
  color: #666666;
}
.texttemplate {
  color: #666666;
  &:hover {
    color: #2493f8;
  }
}

.ml {
  margin-left: 17px;
}
.mr {
  margin-right: 30px;
}
.unset {
  color: #2493f8;
}

.single-checkbox {
  .text {
    display: none;
  }
}

.ivu-checkbox-wrapper {
  margin-left: 18px;
  :last-child {
    display: none;
  }
  + .hover-wrap {
    margin-left: 5px !important;
  }
}
.list-inner-icon {
  font-size: 14px;
  color: #a3a3a3;
  vertical-align: middle;
  margin-right: 7px;
}
.width130 {
  max-width: 130px;
}
.width240 {
  max-width: 240px;
}
</style>


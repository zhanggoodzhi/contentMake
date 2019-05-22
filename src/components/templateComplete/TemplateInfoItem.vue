<template>
  <div
    class="item"
    v-if="itemData"
  >
    <div class="head">
      <img
        class="left-icon vm"
        src="/img/label1.png"
        alt=""
      >
      <div
        @click="editTemplateName(itemData)"
        class="hover-wrap"
      >
        <span class="edit-text vm">{{itemData.TemplateName||'新的模板'}}</span>
        <i class="edit-icon icon-edit vm font_family"></i>
      </div>
      <div class="options-wrap abm">
        <Dropdown
          class="vm"
          trigger="click"
          @on-click="clickDropDown"
        >
          <a
            class="dropdown-icon-wrap"
            href="javascript:void(0)"
          >
            <i class=" font-icon font_family icon-template_list_more"></i>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem
              name="edit"
              v-if="ifShowEdit"
            >
              <span class="vm">编辑</span>
            </DropdownItem>
            <DropdownItem name="propSet">
              <span
                class="vm"
                style="white-space: nowrap;"
              >属性设置</span>
            </DropdownItem>
            <DropdownItem name="copy">
              <span class="vm">复制</span>
            </DropdownItem>
            <DropdownItem name="preview">
              <span class="vm">预览</span>
            </DropdownItem>
            <DropdownItem
              v-if="canDelete"
              class="del-wrap"
              name="del"
            >
              <span class="vm">删除</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="content">
      <p class="text font14">{{itemData.TemplateDescribe}}</p>
      <div class="info-wrap clearfix">
        <div class="info-item">
          <i class=" list-inner-icon font_family icon-template_list_zf"></i>
          <span class="gray font14 vm">总分：</span>
          <span class="number">{{itemData.TotalScore||'--'}}</span>
        </div>
        <div class="info-item">
          <i class=" list-inner-icon font_family icon-template_list_tl"></i>
          <span class="gray font14 vm ">听力：</span>
          <span class="number">{{itemData.ListeningScore||'--'}}</span>
        </div>
        <div class="info-item">
          <i class=" list-inner-icon font_family icon-template_list_ky"></i>
          <span class="gray font14 vm">口语：</span>
          <span class="number">{{itemData.SpeakingScore||'--'}}</span>
        </div>
        <div class="info-item">
          <i class=" list-inner-icon font_family icon-template_list_gl"></i>
          <span class="gray font14 vm">关联试卷数：</span>
          <span class="number">{{itemData.RelationPaperCount||'--'}}</span>
        </div>
        <div class="info-item">
          <i class=" list-inner-icon font_family icon-release"></i>
          <span class="gray font14 vm">已发布试卷数：</span>
          <span class="number">{{itemData.ReleasedPaperCount||'--'}}</span>
        </div>
      </div>
    </div>
    <div class="footer clearfix">
      <p class="left">
        <tooltip
          placement="top"
          :disabled="itemData.TemplateAreaList.length<30"
          :content="itemData.TemplateAreaList"
          max-width="100%"
        >
          <span class="gray ib">题型：</span>
          <span class="text ibtext mb">{{substringIntelligentize(itemData.TemplateAreaList,30)||'无'}}</span>
        </tooltip>
        <tooltip
          style="margin-left:10px;"
          placement="top"
          :disabled="itemData.TemplateAttributeList.length<30"
          :content="itemData.TemplateAttributeList"
          max-width="100%"
        >
          <span class="gray ib">标签：</span>
          <span
            v-if="itemData.TemplateAttributeList"
            class="text ibtext"
          >{{substringIntelligentize(itemData.TemplateAttributeList,30)}}</span>
        </tooltip>
        <a
          v-if="ifcreater&&!itemData.TemplateAttributeList"
          class="unset ibtext"
          @click="editTag"
        >未设置</a>
      </p>
      <!-- <p class="left">
        <span class="gray">题型：</span>
        <span class="text">{{itemData.TemplateAreaList}}</span>
        <span class="gray ml">标签：</span>
        <span
          v-if="itemData.TemplateAttributeList"
          class="text"
        >{{itemData.TemplateAttributeList}}</span>
        <a
          v-if="ifcreater&&!itemData.TemplateAttributeList"
          class="unset"
          @click="editTag"
        >未设置</a>
      </p> -->
      <p class="right">
        <i class=" list-inner-icon font_family icon-template_list_time"></i>
        <span class="text vm">{{formatComplexDate(itemData.UpdateTime)}}</span>
        <i
          class=" list-inner-icon font_family icon-template_list_user"
          v-show="!ifkaola()"
        ></i>
        <span
          class="text vm"
          v-show="!ifkaola()"
        >{{itemData.CreateByUserName}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("global");
import { formatComplexDate } from '@/plugins/utils';
export default {
  data() {
    return {
      formatComplexDate: formatComplexDate
    }
  },
  created() {

  },
  computed: {
    ...mapState(['userDetail']),
    canDelete() {
      if (this.ifcreater && this.itemData.RelationPaperCount == 0) {
        return true;
      }
      return false;
    },
    ifcreater() {
      if (this.itemData.CreateUserID == this.userDetail.UserID) {
        return true;
      }
      if (this.ifkaola()) {// 考拉网用户，此页面拥有所有权限，不需要验证创建者
        return true;
      }
      return false;
    },
    ifShowEdit() {
      if (this.ifkaola()) {
        if (!this.itemData.RelationPaperCount) {
          return true;
        }
        return false;
      } else {
        return this.ifcreater;
      }
    }
  },
  methods: {
    editTemplateName(itemData) {
      this.$emit('editTemplateName', itemData);
    },
    editTag() {
      this.$emit('editTemplate', this.itemData.TemplateID, 'prop');
    },
    clickDropDown(data) {
      if (data === 'edit') {
        if (this.itemData.RelationPaperCount == 0) {
          this.$emit('editTemplate', this.itemData.TemplateID);
        } else {
          this.$emit('editTemplate', this.itemData.TemplateID, 'lock', this.itemData.RelationPaperCount);
        }
      } else if (data === 'propSet') {
        this.$emit('editTemplate', this.itemData.TemplateID, 'prop');
      } else if (data === 'del') {
        this.showRedConfirmModal({
          content: '您确定要删除该模板吗？',
          onOk: () => {
            this.$emit('del', this.itemData.TemplateID);
          }
        });
      } else if (data === 'copy') {
        this.$emit('editTemplate', this.itemData.TemplateID, 'copy');
      } else if (data === 'preview') {
        this.$emit('editTemplate', this.itemData.TemplateID, 'preview');
      }
    }
  },
  props: ['itemData']
}
</script>

<style lang="less" scoped>
.item {
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
      font-size: 16px;
      margin-left: 7px;
      display: none;
      color: #2493f8;
    }
    .left-icon {
      width: 22px;
      height: 25px;
      position: absolute;
      transform: translateY(-43%);
      top: 50%;
      left: -4px;
    }
    .hover-wrap {
      margin-left: 18px;
      cursor: pointer;
      .edit-text {
        font-size: 16px;
        color: #333333;
        font-weight: bold;
      }
      &:hover {
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
      padding-right: 15px;
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
      .info-item {
        float: left;
        padding-left: 17px;
        &::after {
          content: "";
          display: inline-block;
          width: 1px;
          height: 21px;
          background: #eaeef0;
          vertical-align: middle;
          margin-left: 17px;
        }
        &:last-child::after {
          width: 0;
        }
        img {
          width: 14px;
          height: 14px;
          margin-right: 9px;
        }
        .number {
          color: #333333;
          font-size: 30px;
          vertical-align: -5px;
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
.ml {
  margin-left: 17px;
}
.unset {
  text-decoration: underline;
}
.font-icon {
  margin-right: 5px;
}
.list-inner-icon {
  font-size: 14px;
  color: #a3a3a3;
  vertical-align: middle;
  margin-right: 7px;
}
</style>


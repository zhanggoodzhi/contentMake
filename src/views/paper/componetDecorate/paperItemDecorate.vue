<template>
  <div>
    <div class="search-header">
      <Checkbox
        v-if="(isToBeRelease||(ifVerify&&!ifkaola()))&&renderData.length>0"
        v-model="checkAll"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
      <span v-show="this.paperTotalCount > 0">
        <span style="font-size:14px;">共</span>
        <span style="font-size:20px;">{{this.paperTotalCount}}</span>
        <span style="font-size:14px;">套试卷</span>
      </span>
      <div
        class="search-wrap"
      >
        <Input
          search
          v-model="searchParams.paperName"
          placeholder="请输入试卷名称搜索"
          @on-search="getData"
          class="search-input-default search-input"
        />
        <Button
          v-if="this.paperStatusEnum==2||(ifVerify&&!ifkaola())"
          @click="batchExportpaperpackage()"
          type="primary"
          class="exprot-button"
        >合并导出验收包</Button>
      </div>
    </div>
    <div v-if="renderData.length&&!loadingData">
      <div class="list-wrap">
        <CheckboxGroup
          @on-change="checkAllGroupChange"
          v-model="checkData"
        >
          <paperListItem
            v-for="(item,i) in renderData"
            :key="i"
            :itemData="item"
            :ifVerify="ifVerify"
            @on-simulation="simulation"
            @on-edit-paper="editPaper"
            @on-edit-paper-name="editPaperName"
            @on-set-paper-finished="setPaperFinished"
            @on-rollback-paper="rollbackPaper"
            @on-export-paper-package="exportpaperpackage"
            @on-set-paper-publish="setpaperpublish"
            @on-set-paper-property="setpaperproperty"
            @on-copy-paper="copypaper"
            @on-preview-paper="previewpaper"
            @on-delete-paper="deletePaper"
          />
        </CheckboxGroup>
      </div>
      <div class="page-wrap clearfix">
        <Page
          class="page"
          :current="searchParams.Pageparam.PageIndex"
          @on-change="pageChange"
          :total="paperTotalCount"
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
      v-if="hasNoData&&!loadingData"
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
      <p>{{ifSearch?'无查询结果':'暂无试卷数据'}}</p>
    </div>
    <Modal
      :loading="true"
      ref="editModal"
      v-model="isShowEditPaperNameModel"
      title="编辑试卷名称"
      okText="确定编辑"
      @on-ok="editOk"
      :mask-closable="false"
      @on-visible-change="editModalVisibleChange"
    >
      <div
        v-if="paperData.RelevanceInPackageCount>0"
        class="tip-wrap"
      >
        <i class="font_family icon-login_notice1 warn"></i>
        <span>提醒：本试卷在线上已被用户使用，请谨慎操作！</span>
      </div>
      <Form
        ref="formValidate"
        class="edit-paper-name-modal-form"
        :model="paperData"
        :label-width="100"
        :rules="rules"
      >
        <FormItem
          prop="paperName"
          label="试卷名称"
        >
          <Input v-model="paperData.paperName"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      width="710"
      class="simulation-modal"
      v-model="isShowSimulationModel"
      footer-hide
      :mask-closable="false"
    >
      <div class="clearfix modal-wrap">
        <div class="left">
          <div class="clearfix">
            <div class="index1">
              <div class="title">
                <div class="round-index vm">1</div>
                <span class="vm">您需要先下载包含本套试卷的任务包；</span>
              </div>
              <div class="inner">
                <Button
                  @click="exportpaperpackage(currentItemData.PaperID)"
                  size="large"
                  icon="ios-download-outline"
                  type="primary"
                >点击这里下载任务包</Button>
              </div>
            </div>
            <div class="index2">
              <div class="title">
                <div class="round-index vm">2</div>
                <span class="vm">打开教师机，进入离线模式；</span>
              </div>
              <img
                class="image"
                src="/img/offline.png"
                alt=""
              >
            </div>
          </div>
        </div>
        <div class="gray-bg"></div>
        <div class="right">
          <div class="index3">
            <div class="title">
              <div class="round-index vm">3</div>
              <span class="vm text">选择考试/练习后，导入任务包，进行全真模拟；</span>
            </div>
            <img
              class="image1"
              src="/img/create.png"
              alt=""
            >
            <img
              class="image2"
              src="/img/import.png"
              alt=""
            >
          </div>
          <div class="no-tip-wrap">
            <Checkbox
              @on-change="changePopupSimulation"
              :value="currentItemData.IsNotPopupSimulation"
            >下一次不再提示</Checkbox>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { bus, updateTopBasketEvent } from "@/plugins/bus";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("global");
import paperListItem from "@/components/paperListItem/paperListItem";

import {
  UpdatePaperName,
  getPaperList,
  SetPopupShow,
  DeletePaper,
  UpdatePaperStatus
} from "@/plugins/service";
import { Trim } from "@/plugins/utils";
export default {
  components: {
    paperListItem
  },
  created() {
    this.getData();
  },
  data() {
    return {
      currentItemData: {
        IsNotPopupSimulation: false
      },
      noTip: false,
      isShowSimulationModel: false,
      ifSearch: false,
      rules: {
        paperName: [{ validator: this.validateName, trigger: "blur" }],
      },
      indeterminate: true,
      checkAll: false,
      paperData: {
        paperID: ""
      },
      paperListData: {},
      hasNoData: false,
      loadingData: false,
      isShowEditPaperNameModel: false,
      confirmModalVisible: false,
      paperTotalCount: 0,
      searchParams: {
        PaperName: "",
        PaperStatus: this.paperStatusEnum,
        Pageparam: {
          PageSize: 10,
          PageIndex: 1
        }
      },
      isToBeRelease: this.paperStatusEnum == 2,
      renderData: [],
      checkData: []
    };
  },

  computed: {
    selectedItem() {
      const arr = [];
      this.renderData.forEach(v => {
        if (v.IsChecked) {
          arr.push(v);
        }
      });
      return arr;
    }
  },
  methods: {
    validateName(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入试卷名称！"));
      } else if (value.trim().length > 30) {
        callback("您输入的试卷名称超出长度，最多30个字符！");
      } else if (this.trim(value).length == 0) {
        return callback(new Error("请输入试卷名称！"));
      } else {
        callback();
      }
    },

    editModalVisibleChange(visible) {
      !visible && this.clearModal();
    },
    async editOk() {
      this.$refs.formValidate.validate(async valid => {
        if (valid) {
          var param = {
            PaperID: this.paperData.paperID,
            PaperName: this.paperData.paperName.trim()
          };
          const d = await UpdatePaperName(param);
          if (d.Success) {
            this.$Message.success(d.State);
            this.isShowEditPaperNameModel = false;
            //重新加载刷新数据
            this.getData();
          }
        }
        this.$refs.editModal.$data.buttonLoading = false;
      });

      //  // 判断输入试卷明不能为全空格或空
      //       const temp = this.trim(this.paperData.paperName);
      //       if (temp.length < 1) {
      //         this.$Message.error("试卷名不能为空");
      //         this.$refs.editModal.$data.buttonLoading = false;
      //         return;
      //       }
    },
    clearModal() {
      this.$refs.formValidate.resetFields();
    },
    getData() {
      (this.loadingData = true),
        getPaperList(this.searchParams).then(d => {
          const responseData = d.ResponseData;
          this.renderData = responseData.PaperListViewModels;
          this.paperTotalCount = responseData.Count;
          this.hasNoData = this.paperTotalCount == 0;
          this.ifSearch = this.searchParams.paperName ? true : false;
          this.loadingData = false;
          this.checkAll = false;
          // 改变头部试题篮数据
          bus.$emit(updateTopBasketEvent);
        });
    },
    pageChange(index) {
      this.searchParams.Pageparam.PageIndex = index;
      this.getData();
    },
    //修改试卷名称
    async editPaperName(paperID, paperName, RelevanceInPackageCount) {
      this.paperData.paperID = paperID;
      this.paperData.paperName = paperName;
      this.paperData.RelevanceInPackageCount = RelevanceInPackageCount;
      this.isShowEditPaperNameModel = true;
    },
    //设置试卷完成状态
    setPaperFinished(paperID) {
      const param = {
        PaperID: paperID,
        Status: this.ifkaola() ? 201 : 2
      };
      this.$Modal.confirm({
        content: `你确定本试卷已经编辑完毕，可以提交${this.ifkaola() ? '审核' : '验收'}了吗？`,
        onOk: async () => {
          UpdatePaperStatus(param).then(d => {
            if (d.Success) {
              this.$Message.success(d.State);
              this.getData();
              if (this.ifkaola()) {
                this.$router.push({ name: "papertoVerify" });
              } else {
                this.$router.push({ name: "papertoBeRelease" });
              }
            } else {
              setTimeout(() => {
                this.$Modal.confirm({
                  okText: "继续编辑",
                  content:
                    `试卷内容尚不完整，无法提交${this.ifkaola() ? '审核' : '验收'}，请继续编辑补充完整！`,
                  onOk: async () => {
                    this.$router.push({
                      name: "editPaper",
                      params: {
                        paperId: paperID,
                        type: "validate"
                      }
                    });
                  }
                });
              }, 500);
            }
          });
        }
      });
    },
    changePopupSimulation() {
      SetPopupShow(this.currentItemData.PaperID).then(() => {
        this.getData();
      });
    },
    simulation(data) {
      if (data.IsNotPopupSimulation) {
        this.$emit("on-export-paper-package", [data.PaperID]);
      } else {
        this.currentItemData = data;
        this.isShowSimulationModel = true;
      }
    },
    editPaper(paperID) {
      if (this.paperStatusEnum == 1 || this.paperStatusEnum == 2 || this.paperStatusEnum == 201) {
        this.$router.push({
          name: "editPaper",
          params: {
            paperId: paperID
          }
        });
      } else {
        //this.paperStatusEnum == 2
        //
      }
    },
    rollbackPaper(paperID) {
      this.$emit("on-rollback-paper", paperID);
    },
    batchExportpaperpackage() {
      const ids = this.selectedItem.map(v => v.PaperID);
      if (!ids.length) {
        this.$Message.error("请先选择试卷");
        return;
      }
      this.$emit("on-export-paper-package", ids, true);
    },
    exportpaperpackage(paperID) {
      this.$emit("on-export-paper-package", [paperID]);
    },
    setpaperpublish(paperID) {
      /* alert("paperItemDecorate->setpaperpublish"); */
      this.$emit("on-set-paper-publish", paperID);
    },
    setpaperproperty(paperID) {
      this.$router.push({
        name: "editPaper",
        params: {
          paperId: paperID,
          type: "prop"
        }
      });
    },
    //复制试卷
    copypaper(paperID) {
      this.$router.push({
        name: "editPaper",
        params: {
          paperId: paperID,
          type: "copy"
        }
      });
      //this.$emit('editTemplate', this.itemData.TemplateID, 'copy');
      //alert("paperItemDecorate->copypaper");
    },
    previewpaper(paperID) {
      // this.$router.push({
      //   name: "paperPreview",
      //   params: {
      //     paperId: paperID,
      //     type: "preview"
      //   }
      // });
      const routerData = this.$router.resolve({
        name: "paperPreview",
        params: {
          paperId: paperID,
          type: "preview"
        }
      });
      window.open(routerData.href, "_blank");
    },
    async deleteData(paperID) {
      const d = await DeletePaper(paperID);
      if (d.Success) {
        this.$Message.success(d.State);
        //刷新数据
        this.getData();
      }
    },
    //删除试卷
    deletePaper(paperID) {
      this.showRedConfirmModal({
        content: '您确定要删除该试卷吗？',
        onOk: () => {
          this.deleteData(paperID);
        }
      });
    },
    handleCheckAll() {
      var isChecked = false;
      this.checkAll = isChecked = !this.checkAll;
      this.renderData.forEach(function (item) {
        item.IsChecked = isChecked;
      });
      if (this.checkAll) {
        this.renderData.forEach(v => {
          this.checkData.push(v.PaperID);
        });
      } else {
        this.checkData = [];
      }
    },
    checkAllGroupChange(data) {
      if (data.length == this.renderData.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  },
  // ifVerify：是否是待审核页面
  props: ["paperStatusEnum", "ifVerify"]
};
</script>

<style lang="less" scoped>
.tip-wrap {
  padding: 13px 20px;
  background: #fdf4e7;
  margin: -16px;
  margin-bottom: 20px;
  .warn {
    color: #ff7e00;
    font-size: 14px;
  }
  span {
    margin-left: 6px;
    color: #ff8a00;
  }
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
.orange {
  font-size: 20px;
  color: #ff8a00;
}
.search-wrap-284 {
  width: 284px !important;
}
.search-header {
  height: 30px;
  color: #666666;
  position: relative;
  .search-wrap {
    width: 450px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    text-align: right;
    .exprot-button {
      margin-left: 10px;
    }

    .search-input {
      width: 300px !important;
    }
  }
}
.list-wrap {
  margin-top: 20px;
}
.page-wrap {
  padding-top: 25px;
  .page {
    float: right;
  }
}
.confirm-modal {
  .img-wrap {
    margin-top: 15px;
    text-align: center;
    img {
      width: 32px;
      height: 32px;
    }
  }
  p {
    width: 200px;
    display: inline-block;
    margin-bottom: 5px;
  }
}
.edit-paper-name-modal-form {
  padding-right: 30px;
  padding-top: 10px;
  margin-bottom: -10px;
}
.simulation-modal {
  .modal-wrap {
    padding: 30px 41px;
  }
  .left {
    float: left;
    .index1 {
      .inner {
        background: #f6f6f6;
        padding: 44px 0px;
        width: 254px;
        text-align: center;
      }
    }
    .index2 {
      margin-top: 30px;
      .image {
        width: 254px;
        height: 186px;
      }
    }
  }
  .title {
    margin-bottom: 20px;
    font-size: 14px;
    .round-index {
      vertical-align: 0px;
      display: inline-block;
      border: solid 1px #2493f8;
      width: 18px;
      height: 18px;
      line-height: 17px;
      text-align: center;
      border-radius: 50%;
      color: #2493f8;
      margin-right: 8px;
    }
    .text {
      vertical-align: top;
      width: 201px;
      display: inline-block;
    }
  }
  .right {
    margin-left: 70px;
    float: left;
    .index3 {
      .image1 {
        width: 247px;
        height: 157px;
        display: block;
      }
      .image2 {
        margin-top: 18px;
        width: 261px;
        height: 157px;
        display: block;
      }
    }
  }
  .no-tip-wrap {
    position: absolute;
    bottom: 40px;
    right: 70px;
  }
  .gray-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 342px;
    width: 18px;
    background: url(/img/simulation-shadow.png) repeat-y;
    background-size: 18px;
  }
}
</style>

<style lang="less">
.simulation-modal {
  .ivu-btn-primary {
    padding: 0 15px;
    .ivu-icon-ios-download-outline {
      font-size: 30px;
      line-height: 40px;
    }
  }
}
.search-input-default {
  input {
    font-size: 14px;
  }
}
</style>



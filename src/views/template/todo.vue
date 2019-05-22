<template>
  <div>
    <div class="search-header">
      <span>共 <span style="font-size:20px;">{{this.total}}</span> 套模板</span>
      <div class="search-wrap">
        <Input
          search
          v-model="searchParams.TemplateName"
          placeholder="请输入模板名称搜索"
          class="search-input-default"
          @on-search="getData"
        />
      </div>
    </div>
    <div v-if="data.length&&!loading">
      <div class="list-wrap">
        <TemplateInfoItem
          v-for="(v,i) in data"
          :key="i"
          :itemData="v"
          @finishedTemplate="finishedTemplate"
          @editTemplateName="editTemplateName"
          @editTemplate="editTemplate"
          @del="del"
        />
      </div>
      <div class="page-wrap clearfix">
        <Page
          class="page"
          :current="searchParams.Pageparam.PageIndex"
          @on-change="pageChange"
          :total="total"
        />
        <!-- <Page
        class="page"
        @on-change="pageChange"
        :total="total"
        :page-size="1"
      /> -->
      </div>
    </div>
    <div
      v-if="loading"
      class="spin-wrap"
    >
      <Spin
        class="spin"
        size="large"
      ></Spin>
    </div>
    <div
      class="none-wrap"
      v-if="ifNone&&!loading"
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
      <p>{{ifSearch?'无查询结果':'暂无未完成模板！'}}</p>
    </div>
    <Modal
      loading
      ref="editModal"
      width="452"
      v-model="editModalVisible"
      title="编辑模板信息"
      okText="确定编辑"
      @on-ok="editModalOk"
      :mask-closable="false"
      @on-visible-change="editModalVisibleChange"
    >
      <Form
        ref="formValidate"
        class="edit-template-name-modal-form"
        :model="templateData"
        :label-width="100"
        :rules="rules"
      >
        <FormItem
          prop="TemplateName"
          label="模板名称"
        >
          <Input v-model="templateData.TemplateName"></Input>
        </FormItem>
        <FormItem
          prop="TemplateDescribe"
          label="描述"
        >
          <Input
            :autosize="{minRows: 4}"
            type="textarea"
            v-model="templateData.TemplateDescribe"
          ></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      width="380"
      loading
      ok-text="确定编辑"
      :closable="false"
      ref="confirmModal"
      class="confirm-modal"
      v-model="confirmModalVisible"
    >
      <div class="img-wrap">
        <i class="font_family icon-warn"></i>
      </div>
      <div class="tc">
        <p class="font14">
          该模板已被<span class="orange"> 12 </span>套试卷使用，
          你确定要编辑模板内容吗？
        </p>
      </div>
    </Modal>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("global");
import TemplateInfoItem from '@/components/templateTodo/TemplateInfoItem';
import { DeleteTemplate, GetTemplateList, GetTemplate, UpdateTemplateName, UpdateTemplateStatus } from "@/plugins/service";
export default {
  components: {
    TemplateInfoItem
  },
  created() {
    this.getData();
  },
  data() {
    return {
      ifSearch: false,
      templateData: {
        TemplateName: '',
        TemplateDescribe: '',
        TemplateID: ''
      },
      ifNone: false,
      loading: false,
      confirmModalVisible: false,
      editModalVisible: false,
      total: 0,
      searchParams: {
        "TemplateName": "",
        "TemplateStatus": 1,
        "Pageparam": {
          "PageSize": 10,
          "PageIndex": 1
        }
      },
      data: [],
      rules: {
        TemplateName: [{ validator: this.validateName, trigger: 'blur' }],
        TemplateDescribe: [
          {
            validator: this.validateDiscription,
            trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    validateName(rule, value, callback) {
      if (!value || !value.trim()) {
        return callback(new Error('请输入模板名称！'));
      } else if (value.trim().length > 20) {
        callback('您输入的模板名称超出长度，最多20个字符！');
      } else {
        callback();
      }
    },
    validateDiscription(rule, value, callback) {
      if (value && value.trim().length > 200) {
        callback('“您输入的模板描述超出长度，最多200个字符！');
      } else {
        callback();
      }
    },
    editModalVisibleChange(visible) {
      !visible && this.clearModal();
    },
    async editModalOk() {
      this.$refs.formValidate.validate(async valid => {
        if (valid) {
          const d = await UpdateTemplateName({
            "TemplateID": this.templateData.TemplateID,
            "TemplateName": this.templateData.TemplateName,
            "TemplateDescribe": this.templateData.TemplateDescribe
          });
          if (d.Success) {
            this.$Message.success(d.State);
            this.editModalVisible = false;
            this.getData();
          }
          this.$refs.editModal.$data.buttonLoading = false;
        } else {
          this.$refs.editModal.$data.buttonLoading = false;
        }
      });
    },
    clearModal() {
      this.$refs.formValidate.resetFields();
    },
    getData() {
      this.loading = true;
      GetTemplateList(this.searchParams).then(d => {
        const data = d.ResponseData;
        if (!data.TemplateListViewModels.length) {
          this.ifNone = true;
        } else {
          this.ifNone = false;
        }
        this.ifSearch = this.searchParams.TemplateName ? true : false;
        this.loading = false;
        this.data = data.TemplateListViewModels;
        this.total = data.Count;
      });
    },
    pageChange(index) {
      this.searchParams.Pageparam.PageIndex = index;
      this.getData();
    },
    //完成试卷
    async finishedTemplate(id) {
      this.$Modal.confirm({
        content: "你确定本模板已经编辑完毕，可以用来制作试卷了吗？",
        onOk: async () => {
          const d = await UpdateTemplateStatus({
            "TemplateID": id,
            "TemplateStatus": 2
          });//---//
          if (d.Success) {
            this.$Message.success(d.State);
            this.getData();
            this.$router.push({ name: "templateComplete" });
          } else {
            setTimeout(() => {
              this.$Modal.confirm({
                okText: "继续编辑",
                content:
                  `模板内容尚不完整，无法完成，请继续编辑补充完整！`,
                onOk: async () => {
                  this.$router.push({
                    name: "editTemplate",
                    params: {
                      id: id,
                      type: "validate"
                    }
                  });
                }
              });
            }, 500);
          }
        }
      });
    },
    editTemplateName(d) {
      this.templateData = {
        TemplateName: d.TemplateName,
        TemplateDescribe: d.TemplateDescribe,
        TemplateID: d.TemplateID
      };
      this.editModalVisible = true;
    },
    editTemplate(id, type) {

      if (type === 'preview') {
        const routerData = this.$router.resolve({//
          name: 'templatePreview',
          params: {
            id: id,
            type: type
          }
        });
        window.open(routerData.href, "_blank");
      } else {
        this.$router.push({
          name: 'editTemplate',
          params: {
            id: id,
            type: type
          }
        });
      }
    },
    async del(id) {
      const d = await DeleteTemplate(id);
      if (d.Success) {
        this.getData();
        this.$Message.success(d.State);
      }
    }
  }
}
</script>

<style lang="less">
.search-input-default {
  input {
    font-size: 14px;
  }
}
</style>

<style lang="less" scoped>
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
.search-header {
  height: 30px;
  color: #666666;
  position: relative;
  .search-wrap {
    width: 284px;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
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
    i {
      color: #f9645c;
      font-size: 30px;
    }
  }
  p {
    width: 200px;
    display: inline-block;
    margin-bottom: 5px;
  }
}
.edit-template-name-modal-form {
  padding-right: 30px;
  padding-top: 10px;
  margin-bottom: -10px;
}
</style>


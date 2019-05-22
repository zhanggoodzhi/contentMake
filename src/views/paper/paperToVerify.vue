<template>
  <div>
    <paperItemDecorate
      ref="component"
      :paperStatusEnum="paperStatus"
      :ifVerify="true"
      @on-edit-paper="editPaper"
      @on-set-paper-publish="setpaperpublish"
      @on-export-paper-package="exportpaperpackage"
    >
    </paperItemDecorate>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import deepClone from "clone";
import paperItemDecorate from "./componetDecorate/paperItemDecorate";
import { PublishPaper, ExportTaskForTest, GetExportTaskStatus, GetPublishPaperStatus } from "@/plugins/service";
export default {
  components: {
    paperItemDecorate
  },
  data() {
    return {
      timer: null,
      paperStatus: 201
    };
  },
  computed: {
    ...mapState([
      'loadingModalVisible',
      'loadingModalPercent',
      'loadingModalTitle'
    ]),
  },
  methods: {
    ...mapMutations([
      'changeLoadingModalVisible',
      'changeLoadingModalPercent',
      'changeLoadingModalTitle'
    ]),
    editPaper(paperID) {
      //todo:wangbin
      //设置试卷为未完成状态
      alert(paperID);
    },
    //发布
    setpaperpublish(paperID) {
      this.$Modal.confirm({
        okText: '确定发布',
        content: "您确定本试卷已经验收完毕，\n可以发布到线上正式使用了吗？",
        onOk: () => {
          PublishPaper(paperID).then(d => {
            clearInterval(this.timer);
            this.changeLoadingModalVisible(false);
            if (d.Success) {
              this.$Message.success(d.State);
              this.$refs.component.getData();
            }
          });
          this.changeLoadingModalPercent(0);
          this.changeLoadingModalTitle('正在发布...');
          this.changeLoadingModalVisible(true);
          this.timer = setInterval(() => {
            GetPublishPaperStatus(paperID).then((d) => {
              const percent = d.ResponseData.Process;
              this.changeLoadingModalPercent(percent);
            });
          }, 500);
        }
      });
    },
    exportpaperpackage(paperIDArr, ifBatch) {
      let text = '导出验收包失败';
      ExportTaskForTest(paperIDArr).then(d => {
        clearInterval(this.timer);
        this.changeLoadingModalVisible(false);
        if (d.httpStatus === 204) {
          this.$Message.error(text);
        } else {
          var a = document.createElement('a');
          const date = new Date();
          a.download = `试卷验收任务包${date.getMonth() + 1}月${date.getDate()}日.zip`;
          a.href = URL.createObjectURL(d);
          a.click();
        }
      }, () => {
        clearInterval(this.timer);
      })
      this.changeLoadingModalPercent(0);
      const title = ifBatch ? '正在合并导出验收包...' : '正在导出验收包...';
      this.changeLoadingModalTitle(title);
      this.changeLoadingModalVisible(true);
      this.timer = setInterval(() => {
        GetExportTaskStatus().then((d) => {
          const percent = d.ResponseData.Process;
          text = d.ResponseData.Message;
          this.changeLoadingModalPercent(percent);
        });
      }, 500);
    }
  }
}
</script>

<style>
</style>

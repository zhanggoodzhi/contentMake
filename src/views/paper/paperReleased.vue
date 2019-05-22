<template>
  <div>
    <paperItemDecorate
      :paperStatusEnum="paperStatus"
      @on-rollback-paper="rollbackPaper"
      @on-export-paper-package="exportpaperpackage"
    >
    </paperItemDecorate>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import paperItemDecorate from "./componetDecorate/paperItemDecorate";
import { PublishPaper, ExportTaskForTest, GetExportTaskStatus, GetPublishPaperStatus } from "@/plugins/service";
export default {
  components: {
    paperItemDecorate
  },
  data() {
    return {
      paperStatus: 3
    };
  },
  methods: {
     ...mapMutations([
      'changeLoadingModalVisible',
      'changeLoadingModalPercent',
      'changeLoadingModalTitle'
    ]),
    rollbackPaper(paperID) {
      this.$Modal.confirm({
        okText: '确定编辑',
        content: "该试卷已经在线上使用，你确定要编辑该试卷内容吗？",
        onOk: () => {
          this.$router.push({
            name: "editPaper",
            params: {
              paperId: paperID
            }
          });
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

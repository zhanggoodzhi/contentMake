<template>
  <div>
    <paperItemDecorate
      :paperStatusEnum="paperStatus"
      @on-edit-paper="editPaper"
    >
    </paperItemDecorate>
  </div>
</template>

<script>
import paperItemDecorate from "./componetDecorate/paperItemDecorate";
export default {
  components: {
    paperItemDecorate
  },
  data () {
    return {
      paperStatus: 1
    };
  },
  methods: {
    editPaper (paperID) {
      //todo:wangbin
      //跳转到试卷编辑页面
      alert(paperID);
    }
  }
}
</script>

<style>
</style>

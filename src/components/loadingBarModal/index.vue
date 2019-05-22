<template>
  <Modal
    :closable="false"
    :mask-closable="false"
    width="572"
    footer-hide
    :value="loadingModalVisible"
    @on-visible-change="changeModal"
  >
    <div class="content">
      <p class="title">{{loadingModalTitle}}</p>
      <div class="gray-wrap">
        <div
          class="blue-bar"
          :style="{width:478*(loadingModalPercent*0.01)+'px'}"
        ></div>
      </div>
      <span class="percent">{{loadingModalPercent}}%</span>
    </div>
  </Modal>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import deepClone from "clone";
export default {
  data() {
    return {
    }
  },
  created() {

  },
  computed: {
    ...mapState([
      'loadingModalVisible', 'loadingModalPercent','loadingModalTitle'
    ]),
  },
  methods: {
    ...mapMutations([
      'changeLoadingModalVisible','changeLoadingModalTitle'
    ]),
    changeModal(flag) {
      this.changeLoadingModalVisible(flag);
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 6px;
  font-size: 14px;
  color: #333;
}
.gray-wrap {
  display: inline-block;
  width: 478px;
  height: 10px;
  background-color: #e4e8eb !important;
  border-radius: 4px;
  .blue-bar {
    height: 10px;
    background-color: #2493f8;
    border-radius: 4px;
  }
}
.percent {
  margin-left: 10px;
}
.content {
  padding: 14px 10px;
}
</style>


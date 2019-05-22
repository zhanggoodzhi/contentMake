<template>
  <Modal
    :width="416"
    :value="redConfirmModalVisible"
    @on-visible-change="changeModal"
    @on-ok="okEvent"
    okText="删除"
    className="red-confirm"
  >
    <div class="ivu-modal-confirm-body">
      <p>
        {{redConfirmModalContent}}
      </p>
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
      'redConfirmModalVisible',
      'redConfirmModalContent',
      'redConfirmModalCb'
    ]),
  },
  methods: {
    ...mapMutations(['changeRedConfirmModalVisible']),
    changeModal(flag) {
      this.changeRedConfirmModalVisible(flag);
    },
    okEvent(){
      this.redConfirmModalCb();
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 6px;
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


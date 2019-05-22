<template>
  <div>
    <div
      class="ok"
      v-if="audioMode&&audioUrl"
    >tdsrdsrrsrtrt</div>
    <div
      class="kk"
    >tdsrdsrrsrtrt</div>
    <slot></slot>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} = createNamespacedHelpers("global");
export default {
  // audioMode:是否有音频模式（未上传，已上传，播放中）
  // audioUrl:音频路径
  // playing：播放中
  // show:显示按钮
  // hide:隐藏按钮
  // error:错误提示
  // none:无选项
  // preview 预览
  // add 添加
  // disabled 禁用hover功能
  // batchAdd 批量添加
  // ifAddAnswer 区分添加参考答案还是机评参考的文字
  props: [
    "audioMode",
    "audioUrl",
    "show",
    "hide",
    "disabled",
    "error",
    "add",
    "batchAdd",
    "ifAddAnswer",
    "clear",
    "preview",
    "none"
  ],
  data() {
    return {
      addModalVisible: false,
      previewModalVisible: false,
      ifLoading: false,
      modalData: {
        answer: ""
      },
      rules: {
        answer: [
          {
            required: true,
            message: this.ifAddAnswer ? "请输入参考答案" : "请输入机评参考",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.ifLoading = true;
    this.loadAudio(this.audioUrl).then(
      audioTime => {
        if (audioTime) {
          this.$emit("audioLoaded", Math.ceil(audioTime));
        }
        this.ifLoading = false;
      },
      () => {
        this.ifLoading = false;
      }
    );
  },
  computed: {
    ...mapGetters(["ifPlaying"]),
    ...mapState(["audioTime", "audioLoadTimeMap"]),
    audioAction() {
      return (
        window.API_URL + "/api/CommonProcess/uploadResource?resourceType=2"
      );
    },
    showTime() {
      if (!this.audioLoadTimeMap[this.audioUrl]) {
        return 0;
      }
      return this.secondToMin(
        Math.ceil(this.audioLoadTimeMap[this.audioUrl].time)
      );
    }
  },
  watch: {
    audioUrl(value) {
      this.ifLoading = true;
      this.loadAudio(value).then(
        audioTime => {
          if (audioTime) {
            this.$emit("audioLoaded", Math.ceil(audioTime));
          }
          this.ifLoading = false;
        },
        () => {
          this.ifLoading = false;
        }
      );
    }
  },
  methods: {
    ...mapActions(["togglePlay", "loadAudio", 'stopAudio']),
    beforeUpload() {
      this.ifLoading = true;
    },
    playWithTime(url) {
      this.togglePlay(url);
    },
    batchAddEvent() {
      this.addModalVisible = true;
    },
    previewEvent() {
      this.previewModalVisible = true;
    },
    addModalOk() {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.addModalVisible = false;
          this.$emit("batchAddOk", this.modalData.answer);
        } else {
          this.$refs.addModal.$data.buttonLoading = false;
        }
      });
    },
    addModalVisibleChange(visible) {
      !visible && this.clearModal();
    },
    clearModal() {
      setTimeout(() => {
        this.$refs.formValidate.resetFields();
      }, 500);
    },
    delAudio() {
      this.stopAudio();
      this.$emit('del');
    },
    emitEvent(str) {
      this.$emit(str);
    },
    uploadSuccess(res) {
      if (res.Success) {
        this.$emit("uploadSuccess", res);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ok{
  color: yellow;
}
.kk{
  color: red;
}
.disabled.hover-box-wrap {
  border: 1px solid #e5e5e5 !important;
  .audio-icon {
    display: none !important;
  }
  .option-wrap {
    display: none !important;
  }
}
.audio-icon {
  position: absolute;
  z-index: 2;
  right: 11px;
  top: 8px;
  img {
    width: 30px;
    height: 30px;
  }
}
.preview-audio-icon {
  position: absolute;
  right: 11px;
  z-index: 2;
  top: 8px;
  cursor: pointer;
  i {
    font-size: 20px;
    color: #ff8a00;
    &:hover {
      opacity: 0.8;
    }
  }
}
.hover-box-wrap {
  position: relative;
  &:hover {
    & > .ivu-tooltip-rel > .option-wrap {
      display: block;
    }
    .audio-icon {
      display: none;
    }
  }
  .option-wrap {
    right: 0;
    z-index: 3;
    border: 1px solid #2493f8;
    border-bottom: 0;
    position: absolute;
    top: -25px;
    right: -1px;
    display: none;
    background: #f7fbff;
    .option-item {
      line-height: 16px;
      display: inline-block;
      padding: 3px 10px;
      border-right: 1px solid #c5dff6;
      position: relative;
      cursor: pointer;
      &:hover {
        background: #ebf5fe;
      }
      &:last-child {
        border-right: 0;
      }
      img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
      }
      .font_family {
        font-size: 12px;
        margin-right: 5px;
        color: #2591f4;
      }
      span {
        color: #2493f8;
      }
      .red {
        color: #ff463d;
      }
      .gray {
        color: #676767;
      }
    }
  }
}
.arr-text {
  .item {
    border-bottom: 1px solid #ededed;
    padding: 5px 0;
    &:last-child {
      border-bottom: 0;
    }
    .weight {
      font-weight: bold;
    }
  }
}
</style>
<style lang="less">
.edit-paper-preview-modal {
  .ivu-modal-body {
    padding-top: 35px;
    font-size: 16px;
  }
  .ivu-modal-footer {
    display: none;
  }
}
.hidden-upload {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .ivu-upload-select {
    width: 100%;
    height: 100%;
    z-index: 9999;
  }
}
.image-icon {
  width: 25px;
  height: 25px;
}
</style>


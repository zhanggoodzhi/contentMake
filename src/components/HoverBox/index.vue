<template>
  <Tooltip
    class="hover-box-wrap template-hover-border"
    :class="{red:error,disabled:$route.params.type==='preview'||$route.params.type==='prop'||disabled}"
    :content="error"
    :disabled="!error"
  >
    <div
      v-if="audioMode&&audioUrl"
      class="audio-icon"
    >
      <img
        v-if="ifPlaying(audioUrl)"
        src="/img/audio_playing.gif"
        alt=""
      />
      <img
        v-else
        src="/img/template_audio.png"
        alt=""
      />
    </div>
    <div
      v-if="audioMode&&audioUrl&&$route.params.type==='preview'"
      @click="togglePlay(audioUrl)"
      class="preview-audio-icon"
    >
      <img
        class="image-icon"
        v-if="ifPlaying(audioUrl)"
        src="/img/template_close_normal.png"
        alt=""
      />
      <img
        class="image-icon"
        v-else
        src="/img/template_play.png"
        alt=""
      />
      <!-- <i
        v-if="!ifPlaying(audioUrl)"
        class="font_family icon-play"
      ></i>
      <i
        v-else
        class="font_family icon-stop"
      ></i> -->
    </div>
    <div
      v-if="!none"
      class="option-wrap"
      ref="optionWrap"
    >
      <div
        v-if="audioMode&&audioUrl&&!ifPlaying(audioUrl)&&!ifLoading"
        class="option-item vm"
        @click="togglePlay(audioUrl)"
      >
        <img
          class="vm"
          src="/img/template_satrt_action.png"
          alt=""
        >
        <span class="vm font14">{{showTime}}</span>
      </div>
      <div
        v-if="audioMode&&audioUrl&&ifPlaying(audioUrl)&&!ifLoading"
        @click="togglePlay(audioUrl)"
        class="option-item vm"
      >
        <img
          class="vm"
          src="/img/template_close_action.png"
          alt=""
        >
        <span class="vm">{{showTime}}</span>
      </div>
      <div
        v-if="ifLoading"
        class="option-item vm"
      >
        <img
          class="vm"
          src="/img/loading.gif"
          alt=""
        >
        <span class="vm fon14 gray">上传中</span>
      </div>
      <div
        v-if="audioMode&&audioUrl&&!ifLoading"
        class="option-item vm"
        @click="delAudio()"
      >
        <img
          class="vm"
          src="/img/template_delete_action.png"
          alt=""
        >
        <span class="vm fon14 red">音频删除</span>
      </div>
      <div
        v-if="audioMode&&!audioUrl&&!ifLoading"
        @click="emitEvent('clickUpload')"
        class="option-item vm"
      >
        <Upload
          accept=".mp3"
          :before-upload="beforeUpload"
          :show-upload-list="false"
          :on-success="uploadSuccess"
          class="hidden-upload"
          :action="audioAction"
          :headers="{Authorization:'Bearer ' + getLSUserData().access_token}"
        >
        </Upload>
        <img
          class="vm"
          src="/img/template_audio_normal.png"
          alt=""
        >
        <span class="vm">音频上传</span>
      </div>
      <div
        v-if="show"
        class="option-item vm"
        @click="emitEvent('clickShow')"
      >
        <img
          class="vm"
          src="/img/template_visible_action.png"
          alt=""
        >
        <span class="vm">显示</span>
      </div>
      <div
        v-if="hide"
        class="option-item vm"
        @click="emitEvent('clickHide')"
      >
        <img
          class="vm"
          src="/img/template_invisible_action.png"
          alt=""
        >
        <span class="vm">隐藏</span>
      </div>
      <div
        v-if="add"
        class="option-item vm"
        @click="emitEvent('addEvent')"
      >
        <i class="vm font_family icon-template_add_normal_"></i>
        <span class="vm">添加</span>
      </div>
      <div
        v-if="batchAdd"
        class="option-item vm"
        @click="batchAddEvent"
      >
        <i class="vm font_family icon-template_add_normal_"></i>
        <span class="vm">批量添加</span>
      </div>
      <div
        v-if="clear"
        class="option-item vm"
        @click="emitEvent('clear')"
      >
        <img
          class="vm"
          src="/img/template_delete_action.png"
          alt=""
        >
        <span class="vm red">清空</span>
      </div>
      <div
        v-if="preview"
        class="option-item vm"
        @click="previewEvent"
      >
        <i class="vm font_family icon-search"></i>
        <span class="vm">预览</span>
      </div>
      <Modal
        loading
        ref="addModal"
        v-model="addModalVisible"
        :title="`批量添加${ifAddAnswer?'参考答案':'机评参考'}`"
        :mask-closable="false"
        @on-ok="addModalOk"
        @on-visible-change="addModalVisibleChange"
      >
        <Form
          ref="formValidate"
          :model="modalData"
          :rules="rules"
        >
          <FormItem prop="answer">
            <Input
              type="textarea"
              :rows="8"
              v-model="modalData.answer"
              :placeholder="'必须按照以下格式批量添加：\nHello, world.\nHow are you!\nHow do you do!\nWhat time is it?'"
            ></Input>
          </FormItem>
        </Form>
      </Modal>
      <Modal
        class="edit-paper-preview-modal"
        ref="previewModal"
        v-model="previewModalVisible"
      >
        <div
          v-if="typeof preview!=='string'"
          class="arr-text"
        >
          <div
            class="item"
            v-for="(v,i) in preview"
          >
            <span class="weight">{{i+1}}. </span>{{v.Content}}
          </div>
        </div>
      </Modal>
    </div>
    <div>
      <slot></slot>
    </div>
  </Tooltip>
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


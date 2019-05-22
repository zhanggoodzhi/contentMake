<template>
  <Tooltip
    class="hover-box-wrap template-hover-border gray-border input-box"
    :class="{red:error,active:_uid==paperFocusInput,disabled:$route.params.type==='prop'||disabled}"
    :content="error"
    :disabled="!error"
    @click.native="clickInput"
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
      class="option-wrap"
      v-if="ifShowOption"
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
        <span class="vm font14">{{showTime}}</span>
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
        @click="delAudio"
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
          :before-upload="beforeUpload"
          accept=".mp3"
          :show-upload-list="false"
          :on-success="uploadAudioSuccess"
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
        v-if="preview&&inputValue"
        class="option-item vm"
        @click="previewModalVisible=true"
      >
        <img
          class="vm"
          src="/img/template_visible_action.png"
          alt=""
        >
        <span class="vm">预览</span>
      </div>
      <div
        v-if="singleSwitch"
        class="option-item colorText vm"
        :class="{unselected:switchType[0]==='text'}"
        @click="changeType(['text'])"
      >
        <!-- <img
          class="vm"
          :src="switchType[0]==='text'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont small font_family icon-text"></i>
        <span class="vm">文字</span>
      </div>
      <div
        v-if="singleSwitch"
        class="option-item colorText vm"
        :class="{unselected:switchType[0]==='image'}"
        @click="changeType(['image'])"
      >
        <!-- <img
          class="vm"
          :src="switchType[0]==='image'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont font_family icon-picture"></i>
        <span class="vm">图片</span>
      </div>
      <div
        v-if="doubleSwitch"
        class="option-item colorText vm"
        :class="{unselected:switchType[0]==='text'}"
        @click="changeType(['text',switchType[1]])"
      >
        <!-- <img
          class="vm"
          :src="switchType[0]==='text'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont small font_family icon-text"></i>
        <span class="vm">选项文字</span>
      </div>
      <div
        v-if="doubleSwitch"
        class="option-item colorText vm"
        :class="{unselected:switchType[0]==='image'}"
        @click="changeType(['image',switchType[1]])"
      >
        <!-- <img
          class="vm"
          :src="switchType[0]==='image'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont font_family icon-picture"></i>
        <span class="vm">选项图片</span>
      </div>
      <Modal
        class="edit-paper-preview-modal"
        ref="previewModal"
        v-model="previewModalVisible"
      >
        <div
          class="text"
          v-html="repalceBr(inputValue)"
        >
        </div>
      </Modal>
    </div>
    <div
      v-if="doubleSwitch"
      class="option-wrap left-option"
    >
      <div
        class="option-item colorText vm"
        :class="{unselected:switchType[1]=='row'}"
        @click="changeType([switchType[0],'row'])"
      >
        <!-- <img
          class="vm"
          :src="switchType[1]==='row'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont font_family icon-crosswise"></i>
        <span class="vm">选项横排</span>
      </div>
      <div
        class="option-item colorText vm"
        :class="{unselected:switchType[1]=='col'}"
        @click="changeType([switchType[0],'col'])"
      >
        <!-- <img
          class="vm"
          :src="switchType[1]==='col'?'/img/template_visible_action.png':'/img/template_invisible_action.png'"
          alt=""
        > -->
        <i class="iconfont font_family icon-lengthways"></i>
        <span class="vm">选项竖排</span>
      </div>
    </div>
    <!-- igonre-click：当input被禁用的时候，firfox是不支持点击和focus事件的，用样式忽略点击事件 -->
    <input
      :disabled="$route.params.type==='prop'||disabled"
      v-if="ifShowInput"
      class="paper-hover-input"
      :class="{'paper-name':paperName,'ignore-click':$route.params.type==='prop'||disabled}"
      type="text"
      :placeholder="placeholder"
      :value="inputValue"
      ref="input"
      @focus="inputFocus"
      @input="emitEvent('changeInput',$event.target.value)"
    >
    <!-- <Input
      :disabled="$route.params.type==='prop'||disabled"
      :autosize="{minRows: 1}"
      v-if="ifShowTextarea"
      class="auto-textarea"
      type="textarea"
      ref="input"
      :placeholder="placeholder"
      :value="inputValue"
      @on-focus="inputFocus"
      @on-blur="active=false"
      @on-change="emitEvent('changeInput',$event.target.value)"
    ></Input> -->
    <Input
      :disabled="$route.params.type==='prop'||disabled"
      :autosize="{minRows: oneLineTextArea?1:2,maxRows:6}"
      v-if="ifShowTextarea"
      class="auto-textarea"
      :class="{'ignore-click':$route.params.type==='prop'||disabled}"
      type="textarea"
      ref="input"
      :placeholder="placeholder"
      :value="inputValue"
      @on-focus="inputFocus"
      @on-change="emitEvent('changeInput',$event.target.value)"
    ></Input>
    <div
      v-if="singleSwitch&&switchType[0]==='image'&&!imgUrl"
      class="edit-paper-upload"
    >
      <Upload
        class="center"
        :on-success="uploadImgSuccess"
        accept=".jpg,.png,.jpeg"
        :show-upload-list="false"
        type="drag"
        :action="imgAction"
        :headers="{Authorization:'Bearer ' + getLSUserData().access_token}"
      >
        <div class="img-wrap">
          <img
            src="/img/template_image.png"
            alt=""
          >
        </div>
        <p class="font14">上传图片</p>
        <p class="suggest">最大尺寸建议：550*260</p>
      </Upload>
    </div>
    <div
      v-if="singleSwitch&&switchType[0]==='image'&&imgUrl"
      class="img-show-wrap"
      :class="{disabled:$route.params.type==='prop'}"
      @click="delImage"
    >
      <div class="bg"></div>
      <!-- <img
        class="del"
        src="/img/template_image.png"
        alt=""
      > -->
      <div class="del">
        <i class="font_family icon-template_delete_normal"></i>
      </div>
      <div
        class="image"
        :style="{'background-image':getImgUrl}"
      >
      </div>
    </div>
  </Tooltip>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers("global");
const editPaperVuex = createNamespacedHelpers("editPaper");
import { secondToMin } from '@/plugins/utils';
export default {
  // audioMode:是否有音频模式（未上传，已上传，播放中）
  // audioUrl:音频路径
  // playing：播放中
  // preview:预览
  // error:错误提示
  // switch:图片文字切换
  // doubleSwitch横排竖排以及图片文字切换
  // switchType: image,text,row,col 数组形式
  // paperName:试卷名专用Input
  // imgUrl: 切换成图片形式时，图片的路径
  // onLineTextArea:是否是一开始单行的textarea
  props: ['audioMode', 'audioUrl', 'disabled', 'error',
    'paperName', 'preview', 'placeholder', 'textarea',
    'inputValue', 'singleSwitch', 'doubleSwitch',
    'switchType', 'imgUrl', 'oneLineTextArea'],
  data() {
    return {
      ifLoading: false,
      previewModalVisible: false
    }
  },
  created() {
    this.ifLoading = true;
    this.loadAudio(this.audioUrl).then((audioTime) => {
      if (audioTime) {
        this.$emit('audioLoaded', Math.ceil(audioTime));
      }
      this.ifLoading = false;
    }, () => {
      this.ifLoading = false;
    });
  },
  computed: {
    ...mapGetters(['ifPlaying']),
    ...editPaperVuex.mapState(['paperFocusInput']),
    ...mapState(['audioTime', 'audioLoadTimeMap']),
    ifShowOption() {
      if (!this.audioMode && !this.singleSwitch && !this.doubleSwitch) {
        return false;
      }
      return true;
    },
    showTime() {
      if (!this.audioLoadTimeMap[this.audioUrl]) {
        return 0;
      }
      return this.secondToMin(Math.ceil(this.audioLoadTimeMap[this.audioUrl].time))
    },
    imgAction() {
      return (
        window.API_URL + "/api/CommonProcess/uploadResource?resourceType=1"
      );
    },
    ifUploadImgShow() {
      if (this.imgUrl) {
        return true;
      }
    },
    ifShowInput() {
      if (this.singleSwitch) {
        if (this.switchType[0] === 'text' && !this.textarea) {
          return true;
        }
      } else {
        if (!this.textarea) {
          return true;
        }
      }
      return false;
    },
    ifShowTextarea() {
      if (this.singleSwitch) {
        if (this.switchType[0] === 'text' && this.textarea) {
          return true;
        }
      } else {
        if (this.textarea) {
          return true;
        }
      }
      return false;
    },
    audioAction() {
      return window.API_URL + '/api/CommonProcess/uploadResource?resourceType=2';
    },
    getImgUrl() {
      return `url(${this.imgUrl})`
    }
  },
  watch: {
    audioUrl(value, old) {
      this.ifLoading = true;
      this.loadAudio(value).then((audioTime) => {
        if (audioTime) {
          this.$emit('audioLoaded', Math.ceil(audioTime));
        }
        this.ifLoading = false;
      }, () => {
        this.ifLoading = false;
      });
    }
  },
  methods: {
    ...mapActions(['togglePlay', 'loadAudio', 'stopAudio']),
    ...editPaperVuex.mapMutations(['changePaperFocusInput']),
    beforeUpload() {
      this.ifLoading = true;
    },
    forceFocus() {
      this.$refs.input.focus();
    },
    inputFocus() {
      console.log('focusInput');
      this.changePaperFocusInput(this._uid);
      this.$emit('focus');
    },
    clickInput() {
      if (this.$route.params.type === 'prop' || this.disabled) {
        console.log('clickDiv');
        this.$emit('focus');
      }
    },
    // getAudioDuration() {
    //   if (!this.audioUrl || this.audioUrl === window.API_URL) {
    //     return;
    //   }
    //   const audioElement = new Audio(this.audioUrl);
    //   audioElement.addEventListener("loadedmetadata", (e) => {
    //     this.audioTime = secondToMin(Math.floor(audioElement.duration));
    //   });
    // },
    emitEvent(str, value) {
      this.$emit(str, value);
    },
    delAudio() {
      this.stopAudio();
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          this.$emit('delAudio');
        }
      });
    },
    delImage() {
      if (this.disabled || this.$route.params.type === 'prop') {
        return;
      }
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          this.$emit('delImage');
        }
      });
    },
    uploadImgSuccess(res) {
      if (res.Success) {
        this.$emit('uploadImgSuccess', res);
      }
    },
    uploadAudioSuccess(res) {
      if (res.Success) {
        this.$emit('uploadAudioSuccess', res);
      }
    },
    changeType(type) {
      this.$emit('changeType', type);
    },
    repalceBr(text) {
      if (null != text && text.length > 0) {
        return text.replace(/\n/g, "<Br/>");
      }
      return "";
    }
  }
}
</script>

<style lang="less" scoped>
.disabled.hover-box-wrap {
  border: 1px solid #e5e5e5 !important;
  .audio-icon {
    display: block !important;
  }
  .edit-paper-upload {
    display: none !important;
  }
  .option-wrap {
    display: none !important;
  }
  .bg {
    display: none !important;
  }
  .del {
    display: none !important;
  }
  .img-show-wrap {
    cursor: auto;
  }
}
.unselected {
  color: #999999 !important;
  span {
    color: #999999 !important;
  }
}
div.hover-box-wrap.active.input-box {
  border: 1px solid #2493f8;
}
.audio-icon {
  position: absolute;
  z-index: 1;
  right: 11px;
  top: 8px;
  img {
    width: 30px;
    height: 30px;
  }
}
.paper-name {
  text-align: center;
  font-weight: bold;
  background: #f7f7f7;
  font-size: 20px;
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
    border: 1px solid #2493f8;
    border-bottom: 0;
    position: absolute;
    top: -23px;
    right: -1px;
    display: none;
    background: #f7fbff;
    &.left-option {
      right: 186px;
    }
    .option-item {
      line-height: 14px;
      display: inline-block;
      padding: 3px 10px;
      border-right: 1px solid #c5dff6;
      position: relative;
      cursor: pointer;
      &.colorText {
        color: #2493f8;
      }
      .unselected {
      }
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
.edit-paper-upload {
  .center {
    .img-wrap {
      text-align: center;
      img {
        width: 59px;
        height: 40px;
      }
    }
    .font14 {
      color: #2493f8;
      padding-right: 5px;
      margin-top: 0px;
    }
    .suggest {
      color: #999999;
      margin-top: 0px;
    }
  }
}
.img-show-wrap {
  text-align: center;
  position: relative;
  cursor: pointer;
  &.disabled {
    cursor: initial;
    .bg {
      display: none !important;
    }
    .del {
      display: none !important;
    }
  }
  &:hover {
    .bg {
      display: block;
    }
    .del {
      display: block;
    }
  }
  .del {
    display: none;
    color: white;
    position: absolute;
    width: 28px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #e6413a;
    border-radius: 50%;
    i {
      font-size: 13px;
    }
  }
  .bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: none;
  }
  .image {
    display: inline-block;
    width: 550px;
    height: 260px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.iconfont {
  font-size: 14px;
  vertical-align: middle;
  margin-right: 5px;
  &.small {
    font-size: 12px;
    vertical-align: -1px;
  }
}
</style>
<style lang="less">
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
.paper-hover-input {
  display: block;
  border: 0 !important;
  box-shadow: none !important;
  outline: none;
  background-color: transparent;
  padding: 6px 30px 6px 10px;
  width: 100%;
  font-size: 16px!important;
  background: white;
  text-align: left;
  .textarea {
    min-height: 42px;
  }
}
.input-box {
  .auto-textarea {
    textarea {
      font-size: 16px !important;
    }
  }
}
.edit-paper-upload {
  .ivu-upload-drag {
    padding: 40px 0;
    border: 0 !important;
  }
}
</style>


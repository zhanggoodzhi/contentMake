<template>
  <Tooltip
    class="hover-box-wrap template-hover-border gray-border input-box"
    :class="{red:error,disabled:$route.params.type==='prop'||disabled}"
    :content="error"
    :disabled="!error"
  >
    <div
      v-if="!imgUrl"
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
        <p class="suggest">最大尺寸建议：550*340</p>
      </Upload>
    </div>
    <div
      v-if="imgUrl"
      class="img-show-wrap"
      :class="{disabled:$route.params.type==='prop'}"
      @click="delImage"
    >
      <div class="bg"></div>
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
  // error:错误提示
  // imgUrl: 切换成图片形式时，图片的路径
  props: ['disabled', 'error', 'imgUrl'],
  data() {
    return {
      ifLoading: false,
      previewModalVisible: false
    }
  },
  created() {
  
  },
  computed: {
    ...editPaperVuex.mapState(['paperFocusInput']),
    ...mapState(['audioTime', 'audioLoadTimeMap']),
    ifShowOption() {
      if (!this.audioMode && !this.singleSwitch && !this.doubleSwitch) {
        return false;
      }
      return true;
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
    getImgUrl() {
      return `url(${this.imgUrl})`
    }
  },
  methods: {
    emitEvent(str, value) {
      this.$emit(str, value);
    },
    delImage() {
       if (this.disabled||this.$route.params.type==='prop') {
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
    }
  }
}
</script>

<style lang="less" scoped>
.disabled {
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
  .img-show-wrap{
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
  z-index: 1;
  position: absolute;
  right: 15px;
  top: 5px;
  img {
    width: 20px;
    height: 20px;
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
      line-height: 13px;
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
    height: 340px;
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
  font-size: 14px;
  background: white;
  text-align: left;
  .textarea {
    min-height: 42px;
  }
}
.edit-paper-upload {
  .ivu-upload-drag {
    padding: 40px 0;
    border: 0 !important;
  }
}
</style>


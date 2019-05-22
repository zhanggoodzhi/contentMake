<template>
  <div
    class="box-wrap font14"
    :class="{'template-box-preview':$route.params.type==='preview'}"
    v-bar
  >
    <div class="box-inner">
      <div class="big-top">
        <span class="gray">标签：</span>
        <span class="tag">{{getTag}}</span>
        <div class="right">
          <span class="gray">总分：</span>
          <span>{{getTotalScore}} 分</span>
        </div>
      </div>
      <div @click="changeQuestionIndex(-1)">
        <Tooltip
          v-if="!($route.params.type==='preview'&&option.pageIndex!==-1)"
          :disabled="!getEditTemplateValidateError('templateNameOrDiscription',-1,-1)"
          :content="getEditTemplateValidateError('templateNameOrDiscription',-1,-1)"
          class="template-header template-hover-border gray-border"
          :class="{red:getEditTemplateValidateError('templateNameOrDiscription',-1,-1),disabled:$route.params.type==='prop'||$route.params.type==='preview'}"
        >
          <div class="title-wrap">
            <input
              :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
              :class="{'ignore-click':$route.params.type==='prop'||$route.params.type==='preview'}"
              @focus="setTrue"
              class="title no-border"
              type="text"
              ref="templateName"
              :value="option.templateData.TemplateName"
              @input="changeTemplateName"
              placeholder="请输入模板名称"
            />
          </div>
          <div class="discription-wrap">
            <Input
              :autosize="{minRows: 1}"
              :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
              :class="{'ignore-click':$route.params.type==='prop'||$route.params.type==='preview'}"
              class="auto-textarea"
              type="textarea"
              placeholder="添加模板描述"
              :value="option.templateData.TemplateDescribe"
              @on-change="changeTemplateDescribe"
              @on-focus="setTrue"
            ></Input>
          </div>
        </Tooltip>
      </div>
      <HoverBox
        v-if="ifFirstOrBlank"
        :audioMode="true"
        :audioUrl="getAudioUrl"
        @del="delAudio"
        @audioLoaded="changeBackgroundSeconds($event)"
        @uploadSuccess="uploadAudioSuccess"
        class="template-content gray-border"
      >
        <div class="index">{{renderTemplateIndex}}</div>
        <HoverBox
          v-if="option.pageIndex==-1"
          :show="option.templateData.IsPaperNameShow?false:true"
          :hide="option.templateData.IsPaperNameShow?true:false"
          @clickShow="changePaperNameShow(true)"
          @clickHide="changePaperNameShow(false)"
          class="paper-name"
          :class="paperClass"
        >
          <span class="text">试卷名称</span>
        </HoverBox>
        <div
          v-if="!ifUploadImgShow"
          class="template-default-page-upload"
        >
          <Upload
            :class="{'disabled':$route.params.type==='prop'||$route.params.type==='preview'}"
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
            <p class="suggest">最大尺寸建议：790*504</p>
          </Upload>
        </div>
        <div
          v-else
          class="img-show-wrap"
          :class="{disabled:$route.params.type==='prop'||$route.params.type==='preview'}"
          @click="delBigImg"
        >
          <div class="bg"></div>
          <div class="del">
            <i class="font_family icon-template_delete_normal"></i>
          </div>
          <img
            class="image"           
            :src="getImgUrl"
            alt=""
          >
        </div>
      </HoverBox>
      <div
        v-else
        class="template-content solid"
      >
        <div class="index">{{option.pageIndex+2}}</div>
        <!-- <DefaultArea
        v-if="option.pageIndex!==-1"
         :option="option"
         :changeOption="changeOption"
        ></DefaultArea> -->
        <component
          v-if="option.pageIndex!==-1"
          :is="getAreaComponent"
          :option="option"
          :changeOption="changeOption"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
import HoverBox from "@/components/HoverBox";
import deepClone from "clone";
import { uploadResource } from "@/plugins/service";
import DefaultArea from "@/components/editTemplate/box/DefaultArea";
import * as AreaComponent from "@/components/editTemplate/box/areas";
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  props: ["option", "changeOption"],
  components: {
    ...areaObj,
    HoverBox,
    DefaultArea
  },
  data() {
    return {
      // 区分音频加载是手动上传过后还页面刷新加载的
      ifClikUpload: false
    };
  },
  mounted() {
    this.$nextTick(()=>{
      this.$refs.templateName.focus();
    });
  },
  computed: {
    getTotalScore() {
      var totalScore = 0;
      this.option.templateData.TemplateAreaViewModels.forEach(area => {
        if (area.TemplateQuestionViewModels != null) {
          area.TemplateQuestionViewModels.forEach(question => {
            if (question.TemplateContentViewModels != null) {

              question.TemplateContentViewModels.forEach(content => {

                totalScore = totalScore + content.Score;
              });
            }
          });
        }
      });
      //update by yijun.chen at 2019.02.21
      return this.formatNum(totalScore, 2);
      //return totalScore;
    },
    paperClass() {
      if (this.$route.params.type === 'preview') {
        return {
          show: true
        }
      }
      return {
        hide: !this.option.templateData.IsPaperNameShow,
        show: this.option.templateData.IsPaperNameShow
      }
    },
    getError(str) {
      if (this.option.templateName.error.find(v => v.name === str)) {
        return true;
      }
      return false;
    },
    getAreaComponent() {
      const index = this.option.pageIndex;
      const area = this.option.templateData.TemplateAreaViewModels[index];
      // 题型页(数组形式)
      if (area.TemplateQuestionViewModels) {
        // 具体题型页
        if (area.TemplateQuestionViewModels.length) {
          return "Area" + area.AreaType;
        }
        // 默认题型页
        return "DefaultArea";
      }
    },
    templateNameVal() {
      const index = this.option.pageIndex;
      if (index == -1) {
        return this.option.templateData.TemplateName;
      } else {
        return this.option.templateData.TemplateAreaViewModels[index]
          .TemplateName;
      }
    },
    templateDiscriptionVal() {
      const index = this.option.pageIndex;
      if (index == -1) {
        return this.option.templateData.TemplateDescribe;
      } else {
        return this.option.templateData.TemplateAreaViewModels[index]
          .TemplateDescribe;
      }
    },
    getImgUrl() {
      const index = this.option.pageIndex;
      if (index == -1 && this.option.templateData.BackgroundImageID) {
        const url =
          window.API_URL +
          this.option.templateData.BackgroundImagePath;
        return url;
      } else if (
        index !== -1 &&
        this.option.templateData.TemplateAreaViewModels[index].BackgroundImageID
      ) {
        const url =
          window.API_URL +
          this.option.templateData.TemplateAreaViewModels[
            index
          ].BackgroundImagePath;
        return url;
      }
      return false;
    },
    getAudioUrl() {
      const index = this.option.pageIndex;
      if (index == -1 && this.option.templateData.BackgroundAudioID) {
        const url =
          window.API_URL +
          this.option.templateData.BackgroundAudioPath;
        return url;
      } else if (
        index !== -1 &&
        this.option.templateData.TemplateAreaViewModels[index]
          .TitleBackgroundAudioID
      ) {
        const url =
          window.API_URL +
          this.option.templateData.TemplateAreaViewModels[
            index
          ].TitleBackgroundAudioPath;
        return url;
      }
      return false;
      // const index = this.option.pageIndex;
      // if (index == -1 && this.option.templateData.BackgroundAudioDuration) {
      //   return this.option.templateData.BackgroundAudioDuration;
      // }
      // if (index !== -1 && this.option.templateData.TemplateAreaViewModels[index].BackgroundAudioDuration) {
      //   return this.option.templateData.TemplateAreaViewModels[index].BackgroundAudioDuration;
      // }
      // return false;
    },
    imgAction() {
      return (
        window.API_URL + "/api/CommonProcess/uploadResource?resourceType=1"
      );
    },
    ifFirstOrBlank() {
      // 空白页TemplateQuestionViewModels为null，刚创建的题型页，TemplateQuestionViewModels为空数组
      const index = this.option.pageIndex;
      if (
        index == -1 ||
        !this.option.templateData.TemplateAreaViewModels[index]
          .TemplateQuestionViewModels
      ) {
        return true;
      }
      return false;
    },
    ifUploadImgShow() {
      const index = this.option.pageIndex;
      if (index == -1 && this.option.templateData.BackgroundImageID) {
        return true;
      }
      if (
        index !== -1 &&
        this.option.templateData.TemplateAreaViewModels[index].BackgroundImageID
      ) {
        return true;
      }
      return false;
    },
    renderTemplateIndex() {
      const index = this.option.pageIndex;
      if (index == -1) {
        return 1;
      } else {
        return index + 1;
      }
    },
    getTag() {
      const cityArr = this.option.templateData.CityVMs.map(v => {
        return v.CityName;
      });
      const year = this.option.templateData.Year;
      if (year && cityArr.length) {
        return year + '/' + cityArr.join('/');
      } else if (year) {
        return year;
      } else if (cityArr.length) {
        return cityArr.join('/');
      } else {
        return '无'
      }
    }
  },
  methods: {
    //add by yijun.chen at 2019.02.21
    formatNum(f, digit) {
      var m = Math.pow(10, digit);
      var value = parseInt(f * m, 10) / m;
      return value.toString();
    },
    changeDefaultProp(prop, value) {
      const newData = deepClone(this.option);
      newData.templateData[prop] = value;
      this.changeOption(newData);
    },
    setTrue() {
      this.editTemplateValidateError("templateNameOrDiscription", '', -1, -1);
    },
    changeQuestionIndex(index) {
      const newData = deepClone(this.option);
      newData.questionIndex = index;
      this.changeOption(newData);
    },
    getAudioDuration(url) {
      return new Promise(resolve => {
        const audioElement = new Audio(url);
        let duration;
        audioElement.addEventListener("loadedmetadata", function (_event) {
          duration = audioElement.duration;
          resolve(duration);
        });
      });
    },
    uploadAudioSuccess(res) {
      this.ifClikUpload = true;
      const id = res.ResourceID;
      const index = this.option.pageIndex;
      const newData = deepClone(this.option);
      if (index == -1) {
        newData.templateData.BackgroundAudioID = id;
        newData.templateData.BackgroundAudioPath = res.ResourcePath;
      } else {
        newData.templateData.TemplateAreaViewModels[
          index
        ].TitleBackgroundAudioID = id;
        newData.templateData.TemplateAreaViewModels[
          index
        ].TitleBackgroundAudioPath = res.ResourcePath;
      }
      this.changeOption(newData);
    },
    uploadImgSuccess(res) {
      if (res.Success) {
        const id = res.ResourceID;
        const index = this.option.pageIndex;
        const newData = deepClone(this.option);
        if (index == -1) {
          newData.templateData.BackgroundImageID = id;
          newData.templateData.BackgroundImagePath = res.ResourcePath;
        } else {
          newData.templateData.TemplateAreaViewModels[
            index
          ].BackgroundImageID = id;
          newData.templateData.TemplateAreaViewModels[
            index
          ].BackgroundImagePath = res.ResourcePath;
        }
        this.changeOption(newData);
      }
    },
    changeTemplateName(e) {
      const value = e.target.value;
      const newData = deepClone(this.option);
      newData.templateData.TemplateName = value;
      this.changeOption(newData);
    },
    changeTemplateDescribe(e) {
      const value = e.target.value;
      const newData = deepClone(this.option);
      newData.templateData.TemplateDescribe = value;
      this.changeOption(newData);
    },
    changePaperNameShow(bool) {
      const newData = deepClone(this.option);
      newData.templateData.IsPaperNameShow = bool;
      this.changeOption(newData);
    },
    delBigImg() {
      if (this.$route.params.type === 'prop' || this.$route.params.type === 'preview') {
        return;
      }
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          const index = this.option.pageIndex;
          const newData = deepClone(this.option);
          if (index == -1) {
            newData.toDeleteMediaArr.push(newData.templateData.BackgroundImageID);
            newData.templateData.BackgroundImageID = "";
            newData.templateData.BackgroundImagePath = "";
          } else {
            newData.toDeleteMediaArr.push(newData.templateData.TemplateAreaViewModels[index]
              .BackgroundImageID);
            newData.templateData.TemplateAreaViewModels[
              index
            ].BackgroundImageID = "";
            newData.templateData.TemplateAreaViewModels[
              index
            ].BackgroundImagePath = "";
          }
          this.changeOption(newData);
        }
      });
    },
    changeBackgroundSeconds(s) {
      if (!this.ifClikUpload) {
        return;
      }
      this.ifClikUpload = false;
      // 考前须知
      if (this.option.pageIndex == -1) {
        this.changeDefaultProp('BackgroundAudioTotalSeconds', s);
      } else {
        const index = this.option.pageIndex;
        const newData = deepClone(this.option);
        if (!s) {
          setTimeout(() => {
            newData.templateData.TemplateAreaViewModels[index].DisplaySeconds = 0;
            this.changeOption(newData);
          }, 0);
        }
        newData.templateData.TemplateAreaViewModels[index].DisplaySeconds = s;
        this.changeOption(newData);
      }
    },
    delAudio() {
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          const index = this.option.pageIndex;
          const newData = deepClone(this.option);
          if (index == -1) {
            newData.toDeleteMediaArr.push(newData.templateData.BackgroundAudioID);
            newData.templateData.BackgroundAudioID = "";
            newData.templateData.BackgroundAudioPath = "";
          } else {
            newData.toDeleteMediaArr.push(newData.templateData.TemplateAreaViewModels[index]
              .TitleBackgroundAudioID);
            newData.templateData.TemplateAreaViewModels[
              index
            ].TitleBackgroundAudioID = "";
            newData.templateData.TemplateAreaViewModels[
              index
            ].TitleBackgroundAudioPath = "";
          }
          this.changeOption(newData);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.disabled.template-hover-border {
  border: 1px solid #e5e5e5 !important;
}
.no-border {
  width: 743px;
  text-align: center;
}
.box-wrap {
  border: solid 1px #e5e5e5;
  padding: 10px 0px;
  padding-bottom: 40px;
  width: 787px;
  float: left;
  height: 100%;
  text-align: center;
  .box-inner {
    text-align: left;
    // width: 745px;
    padding: 0 10px;
    display: inline-block;
  }
  .big-top {
    font-size: 14px;
    position: relative;
    width: 100%;
    .gray {
      vertical-align: top;
    }
    .tag {
      vertical-align: top;
      display: inline-block;
      width: 615px;
    }
    .right {
      padding-right: 8px;
      vertical-align: top;
      float: right;
    }
  }
  .template-header {
    margin-top: 10px;
    background-color: #f5f5f5;
    text-align: center;
    .title-wrap {
      .title {
        padding: 14px 10px;
        color: #333333 !important;
        font-size: 24px !important;
        font-weight: bold !important;
      }
    }
    .discription-wrap {
      border-top: dashed 1px #e5e5e5;
      .auto-textarea {
        min-height: 44px !important;
        padding: 0 !important;
      }
      .discription {
        height: 42px;
        padding: 12px 10px;
        text-align: left;
      }
    }
  }
  .template-content {
    background: #f5f5f5;
    margin-top: 10px;
    padding: 30px 10px 80px 10px;
    position: relative;
    &.solid {
      border: solid 1px #e5e5e5;
    }
    .index {
      background-color: #e6e6e6;
      border: solid 1px #e6e6e6;
      position: absolute;
      left: 0;
      top: 0;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border: solid 1px #e5e5e5;
    }
    .paper-name {
      margin-top: 10px;
      padding: 10px 0;
      text-align: center;
      .text {
        font-size: 18px;
        font-weight: bold;
      }
      &.hide {
        background-color: #e3e6e8;
        border: solid 1px #dfe3e5;
        .text {
          color: #b8bfc3;
        }
      }
      &.show {
        background-color: #e4eaf5;
        border: solid 1px #e1e6ed;
        .text {
          color: #333333;
        }
      }
    }
    .template-default-page-upload {
      padding: 50px 0;
      text-align: center;
      .center {
        width: 395px;
        display: inline-block;
        .img-wrap {
          text-align: center;
          img {
            width: 59px;
            height: 40px;
          }
        }
        .font14 {
          padding-right: 5px;
          color: #2493f8;
          margin-top: 6px;
        }
        .suggest {
          color: #999999;
          margin-top: 4px;
        }
      }
    }
    .img-show-wrap {
      text-align: center;
      margin-top: 15px;
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
        max-width:790px;
        max-height: 504px;      
        display: inline-block;
      }
    }
  }
}
.gray {
  color: #999999;
}
</style>
<style lang="less">
.template-header {
  .discription-wrap {
    textarea.ivu-input {
      background: transparent;
      min-height: 44px !important;
      font-size: 14px !important;
    }
  }
}
.template-default-page-upload {
  .ivu-upload-drag {
    padding: 80px 0 !important;
  }
}
.template-box-preview {
  .hover-question > .question-content {
    padding: 0;
    .content-text {
      background-color: #f4f6f9 !important;
    }
    .active-content-wrap {
      border-bottom: 1px solid #e4e4e4;
      margin-bottom: 0;
      &.bg {
        background-color: #f4f6f9 !important;
      }
      span {
        font-size: 14px;
      }
      &:last-child {
        border-bottom: 0;
      }
    }
    .hover-box-wrap{
      margin-bottom:0;
    }
    .active-content-option {
      margin-bottom: 10px;
    }
  }
}
</style>



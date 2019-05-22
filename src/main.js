import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store";
import iView from "iview";
import deepClone from "clone";
import VTooltip from 'v-tooltip'
import "./theme.less";
import "@/assets/iconfont/iconfont.css";
import "@/assets/iconfont/iconfont.js";
import Vuebar from 'vuebar';
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(Vuebar);
Vue.use(VTooltip)

Vue.mixin({
  computed: {
    imgAction() {
      return window.API_URL + "/api/CommonProcess/uploadResource?resourceType=1"
    },
  },
  methods: {
    ...mapMutations(['changeRedConfirmModalVisible', 'changeRedConfirmModalCb', 'changeRedConfirmModalContent']),
    // 类似$Modal.confirm 传入content和onOk函数
    showRedConfirmModal(config) {
      this.changeRedConfirmModalVisible(true);
      this.changeRedConfirmModalCb(config.onOk);
      this.changeRedConfirmModalContent(config.content);
    },
    ifComplexArea(areaType) {
      if (Number(areaType) == 25) {
        return true;
      }
      return false;
    },
    // 数字转中文大写
    transFormIndexToChinese(num) {
      let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
      let unit = ["", "十", "百", "千", "万"];
      num = parseInt(num);
      let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
        }
        return newNum;
      }
      let overWan = Math.floor(num / 10000);
      let noWan = num % 10000;
      if (noWan.toString().length < 4) noWan = "0" + noWan;
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    // 本来slice去掉了个/，现在后端已经移除
    getSliceUrl(url) {
      if (url) {
        return window.API_URL + url;
      }
      return false;
    },
    replaceEnterByBr(text) {
      if (null != text && text.length > 0) {
        return text.replace(/\n/g, "<Br/>");
      }
      return "";
    },
    // 改question层数据
    changeEditPaperQuestionProp(i, si, prop, value) {

      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[i].PaperQuestionViewModels[si][prop] = value;
      this.changePaperData(newData);
    },
    changeEditPaperContentProp(i, si, ssi, prop, value) {
      const newData = deepClone(this.paperData);
      console.log(newData, "changeEditPaperContentProp----newData");
      newData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi][prop] = value;
      this.changePaperData(newData);
    },
    changeEditPaperContentOptionProp(i, si, ssi, sssi, prop, value) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentOptionViewModels[sssi][
        prop
      ] = value;
      this.changePaperData(newData);
    },
    changeEditPaperContentAnswerProp(i, si, ssi, sssi, prop, value) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentAnswerViewModels[sssi][
        prop
      ] = value;
      this.changePaperData(newData);
    },
    changeEditPaperContentRefTextProp(i, si, ssi, sssi, prop, value) {
      const newData = deepClone(this.paperData);
      newData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi].PaperContentRefTextViewModels[sssi][
        prop
      ] = value;
      this.changePaperData(newData);
    },
    getEditTemplateValidateError(name, pIndex, qIndex, cIndex) {
      const newData = deepClone(this.option);
      let findItem;
      if (cIndex == undefined) {
        findItem = newData.error.find(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex
        );
      } else {
        findItem = newData.error.find(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex &&
            v.contentIndex === cIndex
        );
      }
      if (findItem) {
        return findItem.text;
      }
      return "";
    },
    editTemplateValidateError(name, text, pIndex, qIndex, cIndex) {
      const newData = deepClone(this.option);
      if (cIndex == undefined) {
        const findItem = newData.error.find(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex
        );
        const findIndex = newData.error.findIndex(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex
        );
        if (!text) {
          //没错
          if (findItem) {
            // 没错且存在
            newData.error.splice(findIndex, 1);
          }
        } else {
          // 有错
          if (!findItem) {
            newData.error.push({
              text,
              name,
              pageIndex: pIndex,
              questionIndex: qIndex
            });
          } else {
            // 有错且存在
            newData.error[findIndex].text = text;
          }
        }
      } else {
        const findItem = newData.error.find(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex &&
            v.contentIndex === cIndex
        );
        const findIndex = newData.error.findIndex(
          v =>
            v.name === name &&
            v.pageIndex === pIndex &&
            v.questionIndex === qIndex &&
            v.contentIndex === cIndex
        );
        if (!text) {
          //没错
          if (findItem) {
            // 没错且存在
            newData.error.splice(findIndex, 1);
          }
        } else {
          // 有错
          if (!findItem) {
            newData.error.push({
              text,
              name,
              pageIndex: pIndex,
              questionIndex: qIndex,
              contentIndex: cIndex
            });
          } else {
            // 有错且存在
            newData.error[findIndex].text = text;
          }
        }
      }
      this.changeOption(newData);
    },
    getEditPaperValidateError(name, i, si, ssi, sssi) {
      const error = deepClone(this.error);
      const findItem = error.find(
        v =>
          v.name === name &&
          v.i === i &&
          v.si === si &&
          v.ssi === ssi &&
          v.sssi === sssi
      );
      if (findItem) {
        console.log("findItem.text", findItem.text);
        return findItem.text;
      }

      return "";
    },
    ifadmin() {
      const data = this.getLSUserData();
      console.log("data.userType",data.userType);
      if (data && data.userType == '4') {
        return true;
      }
      return false;
    },
    ifkaola() {
      const data = this.getLSUserData();
      // return true;
      if (data && data.userType !== '4' && data.userType !== '5') {
        return true;
      }
      return false;
    },
    pushTemplateDeleteMedia(id) {
      const newData = deepClone(this.option);
      newData.toDeleteMediaArr.push(id);
      this.changeOption(newData);
    },
    // userType:    内容商管理员：4，内容编辑：5
    getLSUserData() {
      const str = localStorage.getItem('contentProduceSystemUserData');
      if (!str) {
        return null;
      }
      return JSON.parse(str);
    },
    // 秒转成分
    secondToMin(result) {
      let m = Math.floor(result / 60);
      let s = Math.floor(result % 60);
      if (m < 10) {
        m = '0' + m;
      }
      if (s < 10) {
        s = '0' + s;
      }
      return (result = m + ':' + s);
    },
    editPaperValidateError(name, text, i, si, ssi, sssi) {
      const error = deepClone(this.error);
      const findItem = error.find(
        v =>
          v.name === name &&
          v.i === i &&
          v.si === si &&
          v.ssi === ssi &&
          v.sssi === sssi
      );
      const findIndex = error.findIndex(
        v =>
          v.name === name &&
          v.i === i &&
          v.si === si &&
          v.ssi === ssi &&
          v.sssi === sssi
      );
      if (!text) {
        //没错
        if (findItem) {
          // 没错且存在
          error.splice(findIndex, 1);
        }
      } else {
        // 有错
        if (!findItem) {
          error.push({
            text,
            name,
            i,
            si,
            ssi,
            sssi
          });
        } else {
          // 有错且存在
          error[findIndex].text = text;
        }
      }
      this.changeError(error);
    },
    formatAreaType(t) {
      const type = Number(t);
      switch (type) {
        case 1:
          return "听后选择";
        case 2:
          return "听短文答题";
        case 3:
          return "朗读短文";
        case 4:
          return "短文跟读";
        case 5:
          return "听力选图";
        case 6:
          return "句子仿读";
        case 7:
          return "情景问答";
        case 8:
          return "故事复述";
        case 9:
          return "看图说话";
        case 10:
          return "话题简述";
        case 11:
          return "情景反应";
        case 12:
          return "情景问答";
        case 13:
          return "朗读句子";
        case 14:
          return "快速应答";
        case 15:
          return "视频朗读";
        case 16:
          return "跟读与模仿";
        case 17:
          return "模仿朗读";
        case 18:
          return "听对话回答问题";
        case 19:
          return "信息转述";
        case 20:
          return "情景对话";
        case 21:
          return "短文复述";
        case 22:
          return "听对话或独白回答问题";
        case 23:
          return "情景提问";
        case 24:
          return "单词音标认读";
        case 25:
          return "听后记录并转述信息";
        case 26:
          return "信息转述与询问";
        case 27:
          return "听对话后填空";

        case 101:
          return "朗读短文（小学）";
        case 102:
          return "听后回答（小学）";
        case 103:
          return "看图描述（小学）";
        case 104:
          return "看图回答（小学）";
      }
    },
    substringIntelligentize(str, length) {
      if (str.length > length) {
        return str.substring(0, length) + "...";
      }

      return str.substring(0, length);
    }
  }
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// closest方法兼容
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

<template>
  <div
    class="paper-max-wrap"
    ref="content"
  >
    <div
      v-if="$route.params.type==='prop'"
      class="head-wrap"
    >
      <div
        class="img-wrap vm"
        @click="back()"
      >
        <span class=" back-icon font_family icon-common_back"></span>
      </div>
      <span class="title vm"> 编辑试卷内容</span>
      <span class="yellow"> (只可设置属性)</span>
      <div
        v-if="paperData"
        class="option-wrap abm clearfix"
      >
        <div
          class="option-item"
          @click="()=>{save(null,1)}"
        >
          <i class="save option-icon font_family icon-common_save"></i>
          <span class="font14 vm">保存</span>
        </div>
        <div
          class="option-item"
          @click="preview"
        >
          <i class="preview option-icon font_family icon-common_preview"></i>
          <span class="font14 vm">预览</span>
        </div>
      </div>
    </div>
    <div
      v-else
      class="head-wrap"
    >
      <span
        class="title back vm"
        @click="goSelectTemplate()"
      >重新选择模板</span>
      <span class="title vm">> 编辑试卷内容</span>
      <div
        v-if="paperData"
        class="option-wrap abm clearfix"
      >
        <div
          class="option-item"
          @click="clearArea"
        >
          <i class="clear option-icon font_family icon-common_delete"></i>
          <span class="font14 vm">清空试题</span>
        </div>
        <div
          class="option-item"
          @click="()=>{finish()}"
        >
          <i class="finish option-icon font_family icon-common_finish
"></i>
          <span class="font14 vm">{{paperData.Status==201||ifkaola()?'提交审核':'完成' }}</span>
        </div>
        <div
          v-if="paperData.Status!==2&&paperData.Status!==201"
          class="option-item"
          @click="()=>{save(null,1)}"
        >
          <i class="save option-icon font_family icon-common_save"></i>
          <span class="font14 vm">保存</span>
        </div>
        <div
          class="option-item"
          @click="preview"
        >
          <i class="preview option-icon font_family icon-common_preview"></i>
          <span class="font14 vm">预览</span>
        </div>
      </div>
    </div>
    <div
      id="edit-paper-content"
      class="content clearfix"
    >
      <div
        v-if="paperData"
        class="box-wrap"
      >
        <div class="center">
          <PaperBox></PaperBox>
        </div>
      </div>
      <div
        v-if="paperData"
        class="property-wrap"
        :style="{left:LeftWidth+'px'}"
        :class="{'first-style':!ifChangeStyle}"
      >
        <div
          class="bar-component"
          :style="{'height':propertyHeight+'px'}"
          v-bar
        >
          <div>
            <PaperProperty></PaperProperty>
            <AreaBasket v-if="paperData.PaperAreaViewModels.length&&$route.params.type!=='prop'"></AreaBasket>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaperBox from "@/components/editPaper/PaperBox";
import deepClone from "clone";
import PaperProperty from "@/components/editPaper/PaperProperty/index";
import AreaBasket from "@/components/editPaper/AreaBasket";
import {
  GeneratePaper,
  UpdatePaper,
  deleteResource,
  GetPaper,
  CopyPaper,
  UpdatePaperPreview,
  CleanPaper,
  UpdatePaperAttribute
} from "@/plugins/service";
import { createNamespacedHelpers } from "vuex";
import { debounce, throttle } from "lodash";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
const globalVuex = createNamespacedHelpers("global");
export default {
  components: {
    PaperBox,
    AreaBasket,
    PaperProperty
  },
  data() {
    return {
      propertyHeight: 700,
      LeftWidth: 0,
      ifChangeStyle: false
    };
  },
  created() {
    //判断是否复制试卷
    console.log("重新加载组件");
    this.resetEditPaperState();
    if (this.$route.params && this.$route.params.type == "copy") {
      this.copyPaper(this.$route.params.paperId);
    } else {
      this.getPaperDetail();
    }
    /* this.getPaperDetail(); */
    this.resetDeleteMediaArr();
  },
  mounted() {
    this.propertyHeight = window.innerHeight - 240;
    this.LeftWidth =
      document.querySelector("#edit-paper-content").offsetLeft + 820;
    const resizeEvent = () => {
      this.$nextTick(() => {
        this.LeftWidth =
          document.querySelector("#edit-paper-content").offsetLeft + 820;
        this.propertyHeight = window.innerHeight - 240;
      });
    };
    const scrollEvent = e => {
      this.$nextTick(() => {
        if (window.scrollY > 172) {
          this.ifChangeStyle = true;
        } else {
          this.ifChangeStyle = false;
        }
      });
    };
    window.onresize = debounce(resizeEvent, 200);
    window.onscroll = scrollEvent;
  },
  beforeDestroy() {
    window.onresize = null;
    window.onscroll = null;
  },
  computed: {
    ...mapState([
      "paperData",
      "areaIndex",
      "questionIndex",
      "error",
      "toDeleteMediaArr"
    ]),
    ...globalVuex.mapState(["PaperTypeList"])
  },
  methods: {
    ...globalVuex.mapMutations(["changeGloabLoadingVisible"]),
    ...mapMutations([
      "changePaperData",
      "changeAreaIndex",
      "changeQuestionIndex",
      "changeError",
      "resetDeleteMediaArr",
      'resetEditPaperState'
    ]),
    ...globalVuex.mapActions(["reloadRoute"]),
    back() {
      this.$router.back();
    },
    preview() {
      const cb = id => {
        const routerData = this.$router.resolve({
          name: "paperPreview",
          params: {
            paperId:
              this.paperData.Status == 3 && this.$route.params.type !== "prop"
                ? id
                : this.paperData.PaperID,
            type: "preview"
          }
        });
        window.open(routerData.href, "_blank");
      };
      //待验收或待审核列表，只能完成
      if (this.paperData.Status == 2 || this.paperData.Status == 201) {
        this.finish(cb);
        return;
      }
      this.save(cb, this.paperData.Status, true);
    },
    clearArea() {
      this.$Modal.confirm({
        content: "你确定要清空本试卷的所有试题内容吗？",
        onOk: () => {
          CleanPaper({
            PaperID: this.paperData.PaperID,
            TemplateID: this.paperData.TemplateID
          }).then(d => {
            const newData = this.addIfImageData(d.ResponseData);
            this.changeAreaIndex(-1);
            this.changeQuestionIndex(-1);
            this.changePaperData(newData);
            this.removeError();
          });
        }
      });
    },
    validatePaper() {
      this.validatePaperName();
      this.paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          if (v.AreaType == 1) {
            //选择题
            this.validateQuestionRefTextAndAudio(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentAnswerViewModelsLength(i, si, ssi, true);
              ssv.PaperContentOptionViewModels.forEach((sssv, sssi) => {
                this.validateContentOptionContentAndImage(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 27) {
            //填空题
            this.validateQuestionRefTextAndAudio(i, si);
            this.validateQuestionTextAndImage(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentAnswerViewModelsLength(i, si, ssi);
            });
          } else if (v.AreaType == 3) {
            //朗读短文
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentTextAndAudio(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 22) {
            //听对话或独白回答问题
            this.validateQuestionRefTextAndAudio(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentText(i, si, ssi);
              this.validateContentRefTextViewModelsLength(i, si, ssi);
              this.validateContentAnswerViewModelsLength(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
              ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
                this.validateContentAnswer(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 101) {
            //短文朗读
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentTextAndAudio(i, si, ssi);
              this.validateContentRefTextViewModelsLength(i, si, ssi);
              // this.validateContentAnswerViewModelsLength(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
              // ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
              //   this.validateContentAnswer(i, si, ssi, sssi);
              // });
            });
          } else if (v.AreaType == 102) {
            //听后回答
            // this.validateQuestionPromptOfPaperAndAudio(i, si);
            this.validateQuestionRefTextAndAudio(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentRefTextViewModelsLength(i, si, ssi);

              // this.validateContentText(i, si, ssi);
              // this.validateContentAnswerViewModelsLength(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
              ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
                this.validateContentAnswer(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 103) {
            //看图描述
            // this.validateQuestionPromptOfPaperAndAudio(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              this.validateContentRefTextViewModelsLength(i, si, ssi);
              // this.validateContentAnswerViewModelsLength(i, si, ssi);

              this.validateContentImage(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
              ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
                this.validateContentAnswer(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 104) {
            //看图回答
            this.validateQuestionImage(i, si);
            sv.PaperContentViewModels.forEach((ssv, ssi) => {
              // this.validateContentTextAndAudio(i, si, ssi);
              this.validateContentTextAndAudio(i, si, ssi);
              this.validateContentRefTextViewModelsLength(i, si, ssi);
              this.validateContentAnswerViewModelsLength(i, si, ssi);
              ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                this.validateContentRefText(i, si, ssi, sssi);
              });
              ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
                this.validateContentAnswer(i, si, ssi, sssi);
              });
            });
          } else if (v.AreaType == 25) {
            //听后记录并转述信息
            if (si == 0) {
              //第一节
              this.validateQuestionRefTextAndAudio(i, si);
              this.validateQuestionTextAndImage(i, si);
              sv.PaperContentViewModels.forEach((ssv, ssi) => {
                this.validateContentAnswerViewModelsLength(i, si, ssi);
              });
            } else {
              // 第二节
              sv.PaperContentViewModels.forEach((ssv, ssi) => {
                this.validateContentTips(i, si, ssi);
                this.validateContentRefTextViewModelsLength(i, si, ssi);
                this.validateContentAnswerViewModelsLength(i, si, ssi);
                ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
                  this.validateContentRefText(i, si, ssi, sssi);
                });
                ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
                  this.validateContentAnswer(i, si, ssi, sssi);
                });
              });
            }
          }
        });
      });
    },
    ifAnswerError(errorItem, validateData) {
      for (
        let i = 0;
        i <
        this.paperData.PaperAreaViewModels[errorItem.AreaIndex]
          .PaperQuestionViewModels[errorItem.QuestionIndex]
          .PaperContentViewModels[errorItem.ContentIndex]
          .PaperContentAnswerViewModels.length;
        i++
      ) {
        if (
          this.findAnswerInErrors(
            errorItem.AreaIndex,
            errorItem.QuestionIndex,
            errorItem.ContentIndex,
            i,
            validateData
          )
        ) {
          return true;
        }
      }
    },
    findAnswerInErrors(i, si, ssi, sssi, validateData) {
      for (const item of validateData.AnswerTextResults) {
        if (
          item.AreaIndex == i &&
          item.QuestionIndex == si &&
          item.ContentIndex == ssi &&
          item.AnswerIndex == sssi &&
          this.errorItemHasError(item)
        ) {
          return true;
        }
      }
      return false;
    },
    errorItemHasError(item) {
      for (const v of item.ItemCheckResult) {
        if (!v.Result) {
          return true;
        }
      }
      return false;
    },
    formatIdx(d) {
      const newItem = deepClone(d);
      const areaType = this.paperData.PaperAreaViewModels[newItem.AreaIndex]
        .AreaType;
      if (areaType == 25) {
        if (newItem.QuestionIndex == 1) {
          const firstQuestionContentLength = this.paperData.PaperAreaViewModels[
            newItem.AreaIndex
          ].PaperQuestionViewModels[0].PaperContentViewModels.length;
          newItem.ContentIndex =
            newItem.ContentIndex - firstQuestionContentLength;
        }
      }
      return newItem;
    },
    backValidate(validateData) {
      validateData.RefTextResults.forEach(v => {
        if (this.errorItemHasError(v)) {
          this.editPaperValidateError(
            "ContentRefTextSplit",
            v.ItemCheckResult,
            v.AreaIndex,
            v.QuestionIndex,
            v.ContentIndex,
            v.RefTextIndex
          );
        }
      });
      validateData.AnswerTextResults.forEach(v => {
        // 参考答案用/分隔的题型，特殊处理
        if (
          this.paperData.PaperAreaViewModels[v.AreaIndex].type == 25 &&
          v.QuestionIndex == 0
        ) {
          if (this.ifAnswerError(v, validateData)) {
            this.editPaperValidateError(
              "ContentAnswerTextSplit",
              v.ItemCheckResult,
              v.AreaIndex,
              v.QuestionIndex,
              v.ContentIndex,
              v.AnswerIndex
            );
          }
        } else if (this.paperData.PaperAreaViewModels[v.AreaIndex].type == 27) {
          if (this.ifAnswerError(v, validateData)) {
            this.editPaperValidateError(
              "ContentAnswerTextSplit",
              v.ItemCheckResult,
              v.AreaIndex,
              v.QuestionIndex,
              v.ContentIndex,
              v.AnswerIndex
            );
          }
        } else {
          if (this.errorItemHasError(v)) {
            this.editPaperValidateError(
              "ContentAnswerTextSplit",
              v.ItemCheckResult,
              v.AreaIndex,
              v.QuestionIndex,
              v.ContentIndex,
              v.AnswerIndex
            );
          }
        }
      });
      validateData.FuenteTextualResults.forEach(v => {
        if (this.errorItemHasError(v)) {
          this.editPaperValidateError(
            "QuestionRefTextSplit",
            v.ItemCheckResult,
            v.AreaIndex,
            v.QuestionIndex
          );
        }
      });
    },
    validateContentTips(i, si, ssi) {
      const { Tips } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      let text;
      if (!Tips || !Tips.trim()) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("ContentTips", text, i, si, ssi);
    },
    validateQuestionTextAndImage(i, si) {
      const { ifImage, Text, ImageID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si];
      let text;
      if (ifImage && !ImageID) {
        text = "此处内容为必填哦！";
      } else if (!ifImage && (!Text || !Text.trim())) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("QuestionTextAndImage", text, i, si);
    },
    validateContentRefText(i, si, ssi, sssi) {
      const { Content } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[
        ssi
      ].PaperContentRefTextViewModels[sssi];
      let text;
      if (!Content || !Content.trim()) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("ContentRefText", text, i, si, ssi, sssi);
    },
    validateContentAnswer(i, si, ssi, sssi) {
      const { Content } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[
        ssi
      ].PaperContentAnswerViewModels[sssi];
      let text;
      if (!Content || !Content.trim()) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("ContentAnswer", text, i, si, ssi, sssi);
    },
    validateContentOptionContentAndImage(i, si, ssi, sssi) {
      const { ifImage } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      const { Content, ImageID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[
        ssi
      ].PaperContentOptionViewModels[sssi];
      let text;
      if (ifImage && !ImageID) {
        text = "此处内容为必填哦！";
      } else if (!ifImage && (!Content || !Content.trim())) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError(
        "ContentOptionContentAndImage",
        text,
        i,
        si,
        ssi,
        sssi
      );
    },
    validateContentAnswerViewModelsLength(i, si, ssi, ifOption) {
      const {
        PaperContentAnswerViewModels
      } = this.paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi];
      let text;
      if (
        !PaperContentAnswerViewModels.length ||
        (PaperContentAnswerViewModels.length === 1 &&
          !PaperContentAnswerViewModels[0].Content.trim())
      ) {
        text = ifOption ? "缺少正确答案！" : "缺少参考答案！";
      }
      this.editPaperValidateError(
        "PaperContentAnswerViewModelsLength",
        text,
        i,
        si,
        ssi
      );
    },
    validateContentRefTextViewModelsLength(i, si, ssi) {
      const {
        PaperContentRefTextViewModels
      } = this.paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
        si
      ].PaperContentViewModels[ssi];
      let text;
      if (!PaperContentRefTextViewModels.length) {
        text = "缺少机评参考！";
      }
      this.editPaperValidateError(
        "PaperContentRefTextViewModelsLength",
        text,
        i,
        si,
        ssi
      );
    },
    validateContentImage(i, si, ssi) {
      const { ImageID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      let text;
      if (!ImageID) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("ContentImage", text, i, si, ssi);
    },
    validateQuestionImage(i, si) {
      const { ImageID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si];
      let text;
      if (!ImageID) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("QuestionImage", text, i, si);
    },
    validateQuestionPromptOfPaperAndAudio(i, si) {
      const {
        PromptOfPaper,
        PromptOfPaperAudio
      } = this.paperData.PaperAreaViewModels[i].PaperQuestionViewModels[si];
      let text;
      if (!PromptOfPaper || !PromptOfPaper.trim()) {
        text = "此处内容为必填哦！";
      } else if (!PromptOfPaperAudio) {
        text = "缺少背景音频！";
      }
      this.editPaperValidateError("PromptOfPaperAndAudio", text, i, si);
    },
    validateQuestionRefTextAndAudio(i, si) {
      const { RefText, AudioID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si];
      let text;
      if (!RefText || !RefText.trim()) {
        text = "此处内容为必填哦！";
      } else if (!AudioID) {
        text = "缺少背景音频！";
      }
      this.editPaperValidateError("QuestionRefTextAndAudio", text, i, si);
    },
    validateContentText(i, si, ssi) {
      const { Text } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      let text;
      if (!Text || !Text.trim()) {
        text = "此处内容为必填哦！";
      }
      this.editPaperValidateError("ContentText", text, i, si, ssi);
    },
    validateContentTextAndAudio(i, si, ssi) {
      const { Text, AudioID } = this.paperData.PaperAreaViewModels[
        i
      ].PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      let text;
      if (!Text || !Text.trim()) {
        text = "此处内容为必填哦！";
      } else if (!AudioID) {
        text = "缺少音频！";
      }
      this.editPaperValidateError("ContentTextAndAudio", text, i, si, ssi);
    },
    validatePaperName() {
      const PaperName = this.paperData.PaperName;
      let text;
      if (!PaperName || !PaperName.trim()) {
        text = "请输入试卷名称！";
      } else if (PaperName.trim().length > 30) {
        text = "您输入的试卷名称超出长度，最多30个字符！";
      }
      this.editPaperValidateError("PaperName", text);
    },
    removeError() {
      return new Promise(resolve => {
        this.changeError([]);
        setTimeout(() => {
          resolve();
        });
      });
    },
    deleleMedia() {
      console.log("待删除文件", this.toDeleteMediaArr);
      // deleteResource().then((d) => {
      //   if (d.Success) {

      //   }
      // });
    },
    async save(cb, status, ifPreview) {
      const newData = { ...this.paperData };
      await this.removeError();
      // this.validatePaper();
      this.validatePaperName();
      newData.Status = status;
      if (this.$route.params.type === "prop") {
        newData.Status = this.paperData.Status;
      }
      const removeIfImageData = this.removeIfImageData(newData);
      const removeSavedQuestionData = this.removeSavedQuestionData(
        removeIfImageData
      );
      const addContentAnswerAndRefTextData = this.addContentAnswerAndRefTextIndex(
        removeSavedQuestionData
      );
      console.log('324234234', this.paperData.Status);
      this.$nextTick(() => {
        if (this.error.length) {
          console.log("error", this.error);
          this.$Modal.error({
            content: "试卷内容尚不完整，无法提交验收，请继续编辑补充完整！",
            okText: "我知道了"
          });
          return;
        }
        this.changeGloabLoadingVisible(true);
        let ajaxName;
        if (this.$route.params.type === "prop") {
          // 生成新试卷ID的保存
          ajaxName = UpdatePaperAttribute;
        } else if (ifPreview) {
          // 不校验单词的保存
          ajaxName = UpdatePaperPreview;
        } else {
          ajaxName = UpdatePaper;
        }
        ajaxName(addContentAnswerAndRefTextData).then(d => {
          this.changeGloabLoadingVisible(false);
          if (d.ResponseCode === 0 || d.Success) {
            this.$Message.success(d.State || "保存成功");
            this.deleleMedia();
            // this.$router.push({
            //   name: 'paperToDo'
            // });
            // 原来的试卷状态为已发布
            console.log('后', this.paperData.Status);
            if (
              this.paperData.Status == 3 &&
              this.$route.params.type !== "prop"
            ) {
              this.$router.replace({
                name: "editPaper",
                params: {
                  // 由于后端原因，paperPreview和updatePaper返回新ID的字段不一样
                  paperId: d.ResponseMark || d.ResultData
                }
              });
              this.reloadRoute();
            }
            if (cb) {
              cb(d.ResponseMark || d.ResultData);
              return;
            }
          } else if (d.State === "您输入的试卷名称已存在") {
            this.editPaperValidateError("PaperName", "您输入的试卷名称已存在");
          }
        });
      });
    },
    // 从列表跳过来直接校验
    async FromListValidate(cb) {
      const newData = { ...this.paperData };
      await this.removeError();
      this.validatePaper();
      newData.Status = 2;
      const removeIfImageData = this.removeIfImageData(newData);
      const removeSavedQuestionData = this.removeSavedQuestionData(
        removeIfImageData
      );
      const addContentAnswerAndRefTextData = this.addContentAnswerAndRefTextIndex(
        removeSavedQuestionData
      );
      const trimContentAnswerAndContentRefTextData = this.trimContentAnswerAndContentRefTextData(
        addContentAnswerAndRefTextData
      );
      this.$nextTick(() => {
        if (this.error.length) {
          console.log("error", this.error);
          return;
        }
        this.changeGloabLoadingVisible(true);
        UpdatePaper(trimContentAnswerAndContentRefTextData).then(d => {
          this.changeGloabLoadingVisible(false);
          if (d.ResponseCode === 0) {
            this.$Message.success("完成成功");
            this.deleleMedia();
            if (this.paperData.Status == 201 || this.ifkaola()) {
              this.$router.push({
                name: "papertoVerify"
              });
            } else {
              this.$router.push({
                name: "papertoBeRelease"
              });
            }
            if (cb) {
              cb();
              return;
            }
          }
          if (d.ResponseCode !== 0) {
            const validateData = this.formatValidateDataIndex(d.ResponseData);
            this.backValidate(validateData);
          }
        });
      });
    },
    async finish(cb) {
      const newData = { ...this.paperData };
      await this.removeError();
      this.validatePaper();
      newData.Status = 2;
      if (this.paperData.Status == 201 || this.ifkaola()) {
        newData.Status = 201;
      }
      const removeIfImageData = this.removeIfImageData(newData);
      const removeSavedQuestionData = this.removeSavedQuestionData(
        removeIfImageData
      );
      const addContentAnswerAndRefTextData = this.addContentAnswerAndRefTextIndex(
        removeSavedQuestionData
      );
      const trimContentAnswerAndContentRefTextData = this.trimContentAnswerAndContentRefTextData(
        addContentAnswerAndRefTextData
      );
      this.$nextTick(() => {
        if (this.error.length) {
          console.log("error", this.error);
          this.$Modal.error({
            content: "试卷内容尚不完整，无法提交验收，请继续编辑补充完整！",
            okText: "我知道了"
          });
          return;
        }
        const confirmOk = () => {
          this.changeGloabLoadingVisible(true);
          UpdatePaper(trimContentAnswerAndContentRefTextData).then(d => {
            this.changeGloabLoadingVisible(false);
            if (d.ResponseCode === 0) {
              this.$Message.success("完成成功");
              this.deleleMedia();
              if (this.paperData.Status == 201 || this.ifkaola()) {
                this.$router.push({
                  name: "papertoVerify"
                });
              } else {
                this.$router.push({
                  name: "papertoBeRelease"
                });
              }
              if (cb) {
                cb();
                return;
              }
            }
            if (d.ResponseCode !== 0) {
              const validateData = this.formatValidateDataIndex(d.ResponseData);
              this.backValidate(validateData);
            }
          });
        };
        if (this.paperData.Status == 2) {
          confirmOk();
        } else {
          this.$Modal.confirm({
            content: "你确定本试卷已经编辑完毕，可以提交验收了吗？",
            onOk: () => {
              confirmOk();
            }
          });
        }
      });
    },
    formatValidateDataIndex(d) {
      const data = deepClone(d);
      data.AnswerTextResults.forEach((v, i) => {
        if (v.AreaIndex !== -1) {
          data.AnswerTextResults[i].AreaIndex = v.AreaIndex - 1;
        }
        if (v.QuestionIndex !== -1) {
          // 后端question用的Idx有排序，估前端在后端校验上的question也用Idx
          data.AnswerTextResults[i].QuestionIndex = v.QuestionIndex;
        }
        if (v.ContentIndex !== -1) {
          // 后端content用的Idx有排序，估前端在后端校验上的content也用Idx
          data.AnswerTextResults[i].ContentIndex = v.ContentIndex;
        }
        if (v.AnswerIndex !== -1) {
          data.AnswerTextResults[i].AnswerIndex = v.AnswerIndex - 1;
        }
        if (v.RefTextIndex !== -1) {
          data.AnswerTextResults[i].RefTextIndex = v.RefTextIndex - 1;
        }
      });
      data.RefTextResults.forEach((v, i) => {
        if (v.AreaIndex !== -1) {
          data.RefTextResults[i].AreaIndex = v.AreaIndex - 1;
        }
        if (v.QuestionIndex !== -1) {
          data.RefTextResults[i].QuestionIndex = v.QuestionIndex;
        }
        if (v.ContentIndex !== -1) {
          data.RefTextResults[i].ContentIndex = v.ContentIndex;
        }
        if (v.AnswerIndex !== -1) {
          data.RefTextResults[i].AnswerIndex = v.AnswerIndex - 1;
        }
        if (v.RefTextIndex !== -1) {
          data.RefTextResults[i].RefTextIndex = v.RefTextIndex - 1;
        }
      });
      data.FuenteTextualResults.forEach((v, i) => {
        if (v.AreaIndex !== -1) {
          data.FuenteTextualResults[i].AreaIndex = v.AreaIndex - 1;
        }
        if (v.QuestionIndex !== -1) {
          data.FuenteTextualResults[i].QuestionIndex = v.QuestionIndex;
        }
        if (v.ContentIndex !== -1) {
          data.FuenteTextualResults[i].ContentIndex = v.ContentIndex;
        }
        if (v.AnswerIndex !== -1) {
          data.FuenteTextualResults[i].AnswerIndex = v.AnswerIndex - 1;
        }
        if (v.RefTextIndex !== -1) {
          data.FuenteTextualResults[i].RefTextIndex = v.RefTextIndex - 1;
        }
      });
      return data;
    },
    goSelectTemplate() {
      this.$Modal.confirm({
        content:
          "重新选择模板后，将会清空当前编辑的试卷内容！<br/>你确定要重新选择模板吗？",
        onOk: () => {
          this.$router.push({
            name: "selectTemplate"
          });
        }
      });
    },
    addIfImageData(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          if (sv.ImageID) {
            paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
              si
            ].ifImage = true;
          }
          sv.PaperContentViewModels.forEach((ssv, ssi) => {
            if (
              ssv.PaperContentOptionViewModels.length &&
              ssv.PaperContentOptionViewModels[0].ImageID
            ) {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ifImage = true;
            }
          });
        });
      });
      return paperData;
    },
    addContentAnswerAndRefTextIndex(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          sv.PaperContentViewModels.forEach((ssv, ssi) => {
            ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].PaperContentAnswerViewModels[
                sssi
              ].Idx = sssi + 1;
            });
            ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].PaperContentRefTextViewModels[
                sssi
              ].Idx = sssi + 1;
            });
          });
        });
      });
      return paperData;
    },
    trimContentAnswerAndContentRefTextData(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          sv.PaperContentViewModels.forEach((ssv, ssi) => {
            ssv.PaperContentAnswerViewModels.forEach((sssv, sssi) => {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].PaperContentAnswerViewModels[
                sssi
              ].Content = sssv.Content.trim();
            });
            ssv.PaperContentRefTextViewModels.forEach((sssv, sssi) => {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].PaperContentRefTextViewModels[
                sssi
              ].Content = sssv.Content.trim();
            });
          });
        });
      });
      return paperData;
    },
    removeSavedQuestionData(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          delete paperData.PaperAreaViewModels[i].PaperQuestionViewModels[si]
            .savedQuestionData;
        });
      });
      return paperData;
    },
    removeIfImageData(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          if (sv.ifImage) {
            paperData.PaperAreaViewModels[i].PaperQuestionViewModels[si].Text =
              "";
          } else {
            paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
              si
            ].ImageID = "";
            paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
              si
            ].ImagePath = "";
          }
          delete paperData.PaperAreaViewModels[i].PaperQuestionViewModels[si]
            .ifImage;
          sv.PaperContentViewModels.forEach((ssv, ssi) => {
            if (ssv.ifImage) {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ResourceType = 2;
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[
                ssi
              ].PaperContentOptionViewModels.forEach((sssv, sssi) => {
                paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                  si
                ].PaperContentViewModels[ssi].PaperContentOptionViewModels[
                  sssi
                ].Content = "";
              });
            } else {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ResourceType = 1;
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[
                ssi
              ].PaperContentOptionViewModels.forEach((sssv, sssi) => {
                paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                  si
                ].PaperContentViewModels[ssi].PaperContentOptionViewModels[
                  sssi
                ].ImageID = "";
                paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                  si
                ].PaperContentViewModels[ssi].PaperContentOptionViewModels[
                  sssi
                ].ImagePath = "";
              });
            }
            delete paperData.PaperAreaViewModels[i].PaperQuestionViewModels[si]
              .PaperContentViewModels[ssi].ifImage;
          });
        });
      });
      return paperData;
    },
    getPaperDetail() {
      const templateId = this.$route.params.templateId;
      const paperId = this.$route.params.paperId;
      if (templateId) {
        GeneratePaper(templateId).then(d => {
          const newData = this.addIfImageData(d.ResponseData);
          // 创建的时候，默认选择模拟试卷
          if (this.PaperTypeList && this.PaperTypeList.length) {
            newData.PaperTypeID = this.PaperTypeList[0].PaperTypeID;
          }
          this.changePaperData(newData);
        });
        return;
      }
      if (paperId) {
        GetPaper(paperId).then(d => {
          const newData = this.addIfImageData(d.ResponseData);
          this.changePaperData(newData);
          this.$nextTick(async () => {
            if (this.$route.params && this.$route.params.type == "validate") {
              // 进入页面直接检测拼写错误
              await this.removeError();
              this.FromListValidate();
            }
          });
        });
        return;
      }
      // return;
      const paperData = {
        PaperID: "string",
        TemplateID: "string",
        PaperName: "string",
        BackgroundAudioID: "string",
        BackgroundImageID: "string",
        BackgroundAudioTotalSeconds: 0,
        AudioPlayTimes: 0,
        TotalScore: 0,
        SpeakingScore: 0,
        ListeningScore: 0,
        TotalExamTime: 0,
        DisplaySeconds: 0,
        PaperTypeID: "",
        MaterialID: "",
        GradeID: "",
        Year: 0,
        CreateTime: "2019-01-03T01:48:27.350Z",
        CreateUserID: "string",
        CreateUserName: "string",
        UpdateTime: "2019-01-03T01:48:27.350Z",
        UpdateUserID: "string",
        Status: 0,
        PaperAreaViewModels: [
          {
            AreaID: "string",
            PaperID: "string",
            AreaType: 1,
            AreaTitle: "一、听后选择",
            IsAreaTitleShow: true,
            AreaPrompt:
              " 本部分共有6道小题，每小题你将听到一段对话，每段对话听两遍。在听每段对话前，你将有5秒钟的时间阅读题目，听完后,你将有5秒钟的时间在屏幕上选出你认为最合适最合适的备选答案。",
            IsAreaPromptShow: true,
            BackgroundImageID: "string",
            TitleBackgroundAudioID: "string",
            TitleBackgroundAudioPath: "string",
            TitleBackgroundAudioTotalSeconds: 0,
            PromptBackgroundAudioID: "string",
            PromptBackgroundAudioPath: "string",
            PromptBackgroundAudioTotalSeconds: 0,
            Idx: 0,
            TotalScore: 0,
            AudioPlayTimes: 0,
            PaperQuestionViewModels: [
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string",
                AreaID: "string",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string",
                Text: "",
                Prompt: "string",
                Tips: "string",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                // "ifImage": false,
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                AudioSeconds: 0,
                RefText: "string",
                PromptAudioID: "string",
                TipsAudioID: "string",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperAbilitys: [],
                PaperContentViewModels: [
                  {
                    Difficulty: "",
                    PaperAbilitys: [],
                    ContentID: "string",
                    QuestionID: "string",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string",
                    AudioID: "string",
                    VideoID: "string",
                    Tips: "string",
                    Text: "string",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [],
                    PaperContentOptionViewModels: [
                      {
                        OptionID: "string1",
                        ContentID: "string",
                        Idx: 1,
                        Content: "aadf",
                        ImageID: "",
                        ImagePath: ""
                      },
                      {
                        OptionID: "string2",
                        ContentID: "string",
                        Idx: 2,
                        Content: "abb",
                        ImageID: "",
                        ImagePath: ""
                      },
                      {
                        OptionID: "string3",
                        ContentID: "string",
                        Idx: 3,
                        Content: "svcccc",
                        ImageID: "",
                        ImagePath: ""
                      }
                    ],
                    PaperContentRefTextViewModels: []
                  }
                ]
              }
            ]
          },
          {
            AreaID: "string23333",
            PaperID: "string23333",
            AreaType: 25,
            AreaTitle: "二、听后记录并转述",
            IsAreaTitleShow: true,
            AreaPrompt: "听后记录并转述的Prompt",
            IsAreaPromptShow: true,
            BackgroundImageID: "string",
            TitleBackgroundAudioID: "string",
            TitleBackgroundAudioPath: "string",
            TitleBackgroundAudioTotalSeconds: 0,
            PromptBackgroundAudioID: "string",
            PromptBackgroundAudioPath: "string",
            PromptBackgroundAudioTotalSeconds: 0,
            Idx: 0,
            TotalScore: 0,
            AudioPlayTimes: 0,
            PaperQuestionViewModels: [
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string",
                AreaID: "string",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string",
                Text: "",
                Prompt: "string",
                Tips: "string",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                // "ifImage": false,
                PaperAbilitys: [],
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                AudioSeconds: 0,
                RefText: "string",
                PromptAudioID: "string",
                TipsAudioID: "string",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperContentViewModels: [
                  {
                    ContentID: "string",
                    QuestionID: "string",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string",
                    AudioID: "string",
                    VideoID: "string",
                    Tips: "string",
                    Text: "string",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [
                      {
                        ContentID: "string",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string",
                        Content: "578"
                      }
                    ],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: []
                  },
                  {
                    ContentID: "string2",
                    QuestionID: "string2",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string2",
                    AudioID: "string2",
                    VideoID: "string2",
                    Tips: "string2",
                    Text: "string2",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string2",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [
                      {
                        ContentID: "string2",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string2",
                        Content: "578"
                      }
                    ],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: []
                  }
                ]
              },
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string4",
                AreaID: "string4",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string4",
                Text: "",
                Prompt: "第二节算得上",
                Tips: "string4",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                // "ifImage": false,
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                PaperAbilitys: [],
                AudioSeconds: 0,
                RefText: "string4",
                PromptAudioID: "string4",
                TipsAudioID: "string4",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperContentViewModels: [
                  {
                    ContentID: "string4",
                    QuestionID: "string4",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string4",
                    AudioID: "",
                    AudioPath: "",
                    VideoID: "string4",
                    Tips: "string4",
                    Text: "string4",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string4",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: [
                      {
                        ContentID: "string3",
                        Content: "aad33333f"
                      },
                      {
                        ContentID: "string3",
                        Content: "aa2132df"
                      },
                      {
                        ContentID: "string3",
                        Content: "523432478"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            AreaID: "string2",
            PaperID: "string2",
            AreaType: 27,
            AreaTitle: "二、填空题",
            IsAreaTitleShow: true,
            AreaPrompt: "填空题的Prompt",
            IsAreaPromptShow: true,
            BackgroundImageID: "string",
            TitleBackgroundAudioID: "string",
            TitleBackgroundAudioPath: "string",
            TitleBackgroundAudioTotalSeconds: 0,
            PromptBackgroundAudioID: "string",
            PromptBackgroundAudioPath: "string",
            PromptBackgroundAudioTotalSeconds: 0,
            Idx: 0,
            TotalScore: 0,
            AudioPlayTimes: 0,
            PaperQuestionViewModels: [
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string",
                AreaID: "string",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string",
                Text: "",
                Prompt: "string",
                Tips: "string",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                // "ifImage": false,
                PaperAbilitys: [],
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                AudioSeconds: 0,
                RefText: "string",
                PromptAudioID: "string",
                TipsAudioID: "string",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperContentViewModels: [
                  {
                    ContentID: "string",
                    QuestionID: "string",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string",
                    AudioID: "string",
                    VideoID: "string",
                    Tips: "string",
                    Text: "string",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [
                      {
                        ContentID: "string",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string",
                        Content: "578"
                      }
                    ],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: []
                  },
                  {
                    ContentID: "string2",
                    QuestionID: "string2",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string2",
                    AudioID: "string2",
                    VideoID: "string2",
                    Tips: "string2",
                    Text: "string2",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string2",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [
                      {
                        ContentID: "string2",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string2",
                        Content: "578"
                      }
                    ],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: []
                  }
                ]
              }
            ]
          },
          {
            AreaID: "string3",
            PaperID: "string3",
            AreaType: 22,
            AreaTitle: "三、听对话或独白回答问题",
            IsAreaTitleShow: true,
            AreaPrompt: "听对话或独白回答问题33333333333333333333333333",
            IsAreaPromptShow: true,
            BackgroundImageID: "string3",
            TitleBackgroundAudioID: "string3",
            TitleBackgroundAudioPath: "string3",
            TitleBackgroundAudioTotalSeconds: 0,
            PromptBackgroundAudioID: "string3",
            PromptBackgroundAudioPath: "string3",
            PromptBackgroundAudioTotalSeconds: 0,
            Idx: 0,
            TotalScore: 0,
            AudioPlayTimes: 0,
            PaperQuestionViewModels: [
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string3",
                AreaID: "string3",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string3",
                Text: "",
                Prompt: "听第一段对话，回答第1-2两个问题。",
                Tips: "string3",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                PaperAbilitys: [],
                // "ifImage": false,
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                AudioSeconds: 0,
                RefText: "string3",
                PromptAudioID: "string3",
                TipsAudioID: "string3",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperContentViewModels: [
                  {
                    ContentID: "string3",
                    QuestionID: "string3",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string3",
                    AudioID: "",
                    AudioPath: "",
                    VideoID: "string3",
                    Tips: "string3",
                    Text: "string3",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string3",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [
                      {
                        ContentID: "string3",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string3",
                        Content: "aadf"
                      },
                      {
                        ContentID: "string3",
                        Content: "578"
                      }
                    ],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: [
                      {
                        ContentID: "string3",
                        Content: "aad33333f"
                      },
                      {
                        ContentID: "string3",
                        Content: "aa2132df"
                      },
                      {
                        ContentID: "string3",
                        Content: "523432478"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            AreaID: "string4",
            PaperID: "string4",
            AreaType: 3,
            AreaTitle: "四。朗读短文",
            IsAreaTitleShow: true,
            AreaPrompt: "朗读短文444444444",
            IsAreaPromptShow: true,
            BackgroundImageID: "string4",
            TitleBackgroundAudioID: "string4",
            TitleBackgroundAudioPath: "string4",
            TitleBackgroundAudioTotalSeconds: 0,
            PromptBackgroundAudioID: "string4",
            PromptBackgroundAudioPath: "string4",
            PromptBackgroundAudioTotalSeconds: 0,
            Idx: 0,
            TotalScore: 0,
            AudioPlayTimes: 0,
            PaperQuestionViewModels: [
              {
                PaperQuestionAbilitys: [],
                QuestionID: "string4",
                AreaID: "string4",
                PrepareSeconds: 0,
                AnswerSeconds: 0,
                PreSubmitMaxSeconds: 0,
                Title: "string4",
                Text: "",
                Prompt: "",
                Tips: "string4",
                AudioPlayTimes: 0,
                Idx: 0,
                AudioID: "",
                AudioPath: "",
                // "ifImage": false,
                ImageID: "",
                ImagePath: "",
                NewScreen: true,
                PaperAbilitys: [],
                AudioSeconds: 0,
                RefText: "string4",
                PromptAudioID: "string4",
                TipsAudioID: "string4",
                Score: 0,
                PromptAudioSeconds: 0,
                Difficulty: "",
                PaperContentViewModels: [
                  {
                    ContentID: "string4",
                    QuestionID: "string4",
                    PrepareSeconds: 0,
                    AnswerSeconds: 0,
                    AudioPlayTimes: 0,
                    ImageID: "string4",
                    AudioID: "",
                    AudioPath: "",
                    VideoID: "string4",
                    Tips: "string4",
                    Text: "string4",
                    Idx: 0,
                    ChooseType: 1,
                    Layout: 1, // 1 row 2 col
                    // "ifImage": false,
                    Score: 2,
                    ResourceType: 0,
                    RefText: "string4",
                    AudioSeconds: 0,
                    PreSubmitSeconds: 0,
                    PaperContentAnswerViewModels: [],
                    PaperContentOptionViewModels: [],
                    PaperContentRefTextViewModels: [
                      {
                        ContentID: "string3",
                        Content: "aad33333f"
                      },
                      {
                        ContentID: "string3",
                        Content: "aa2132df"
                      },
                      {
                        ContentID: "string3",
                        Content: "523432478"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      };
      this.changePaperData(paperData);
    },
    //复制试卷
    async copyPaper(id) {
      const d = await CopyPaper(id);
      const newData = this.addIfImageData(d.ResponseData);
      this.changePaperData(newData);
    }
  }
};
</script>

<style lang="less" scoped>
.head-wrap {
  margin-bottom: 15px;
  position: relative;
  background-color: #ffffff;
  border: solid 1px #e5e5e5;
  padding: 18px 25px 18px 20px;
  .img-wrap {
    display: inline-block;
    cursor: pointer;
    padding: 0 5px;
    transition: all 0.2s;
    &:hover {
      opacity: 0.8;
    }
    .back-icon {
      color: #2493f8;
      // display: block;
      // width: 10px;
      // height: 17px;
    }
  }
  .title {
    color: #333;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
    &.back {
      color: #2493f8;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .yellow {
    vertical-align: middle;
    color: #fe890c;
  }
  .option-wrap {
    right: 20px;
    .option-item {
      cursor: pointer;
      float: left;
      margin-left: 17px;
      &:hover {
        opacity: 0.8;
      }
      .option-icon {
        font-size: 30px;
        color: #2493f8;
        vertical-align: middle;
        margin-right: 7px;
        &.clear {
          color: #ff463d;
        }
        &.finish {
          color: #39ba11;
        }
        &.save {
          color: #2493f8;
        }
        &.preview {
          color: #ff8a00;
        }
      }
    }
  }
}
.content {
  .box-wrap {
    background: white;
    padding: 17px 0;
    text-align: center;
    float: left;
    width: 821px;
    border: solid 1px #e5e5e5;
    .center {
      padding: 0 10px;
      display: inline-block;
      text-align: left;
      width: 820px;
    }
  }
  .property-wrap {
    transition: all 0.25s;
    background: white;
    border-left: 0;
    border-top: 0;
    position: fixed;
    top: 0;
    right: 6px;
    text-align: center;
    width: 377px;
    opacity: 1;
    &.first-style {
      position: static;
      float: right;
    }
    .bar-component {
      border: solid 1px #e5e5e5;
    }
  }
}
.box-wrap-scroll {
  // float: left;
  // height: 100%;
  // width: 821px;
  // border: solid 1px #e5e5e5;
}
.property-wrap-scroll {
}
</style>




<template>
  <div
    class="hover-question template-box"
    @click="changeQuestionIndex(qIndex)"
    :class="[{disabled:$route.params.type==='prop'||$route.params.type==='preview'||$route.params.type==='lock',selected:option.questionIndex===qIndex,'error':(ifQuestionError&&option.questionIndex!=qIndex)},((option.questionIndex===qIndex)?'selected-div':'')]"
  >
    <div class="options">
      <div
        v-if="qIndex!==0"
        class="to-next-page"
        @click="toNextPage"
      >
        换页显示
      </div>
      <div
        v-if="qIndex===0&&!ifComplexArea(option.templateData.TemplateAreaViewModels[option.pageIndex].AreaType)&&option.templateData.TemplateAreaViewModels[option.pageIndex].SmallIndex>1"
        class="to-next-page"
        @click="toPrePage"
      >
        取消换页
      </div>
      <div
        v-if="ifShowCopy(option.templateData.TemplateAreaViewModels[option.pageIndex])"
        class="copy"
        @click="copyInputShow=!copyInputShow;addInputShow=false"
      >
        复制
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="copyInputShow"
          class="template-box-number-input-wrap clearfix copy-mode"
        >
          <InputNumber
            :min="1"
            :max="99"
            :precision="0"
            class="number-input"
            v-model="copyNumber"
          ></InputNumber>
          <div
            class="number-btn"
            @click="copyQuestion()"
          >确定</div>
        </div>
      </transition>
      <div
        class="del-icon"
        @click="delQuestion()"
      >
        <Icon
          class="abmc"
          type="md-close"
        />
      </div>
      <div
        v-if="ifShowCopy(option.templateData.TemplateAreaViewModels[option.pageIndex])"
        class="add-icon"
        @click="addInputShow=!addInputShow;copyInputShow=false;"
      >
        <Icon
          class="abmc"
          type="md-add"
        />
      </div>
      <transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="addInputShow"
          class="template-box-number-input-wrap"
        >
          <div class="clearfix">
            <InputNumber
              :precision="0"
              :min="1"
              :max="99"
              class="number-input"
              v-model="number"
            ></InputNumber>
            <div
              class="number-btn"
              @click="addQuestion()"
            >确定</div>
          </div>
        </div>
      </transition>
    </div>
    <HoverBox
      v-if="(option.templateData.TemplateAreaViewModels[option.pageIndex
      ].AreaType == 101) || (option.templateData.TemplateAreaViewModels[
        option.pageIndex
      ].AreaType == 102) "
      :audioMode="true"
      :error="getEditTemplateValidateError('PromptAudioID',option.pageIndex,option.questionIndex)"
      :audioUrl="getFormatUrl(option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[qIndex].PromptAudioPath)"
      @del="delPromptAudio"
      class="prompt hover-question-hover-box"
      @uploadSuccess="($event)=>{editTemplateValidateError('PromptAudioID', '', option.pageIndex, i);uploadPromptAudioSuccess($event)}"
    >
      <Input
        :autosize="{minRows: 1}"
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        class="auto-textarea"
        type="textarea"
        placeholder="提示文本"
        :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[qIndex].Prompt"
        @on-change="changeQuestionPrompt"
      ></Input>
    </HoverBox>

    <HoverBox
      v-else
      :audioMode="true"
      :audioUrl="getFormatUrl(option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[qIndex].PromptAudioPath)"
      @del="delPromptAudio"
      class="prompt hover-question-hover-box"
      @uploadSuccess="uploadPromptAudioSuccess"
    >
      <Input
        :autosize="{minRows: 1}"
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        class="auto-textarea"
        type="textarea"
        placeholder="提示文本"
        :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[qIndex].Prompt"
        @on-change="changeQuestionPrompt"
      ></Input>
    </HoverBox>

    <div class="question-content">
      <slot></slot>
    </div>

  </div>
</template>
<script>
import HoverBox from "@/components/HoverBox";
import {
  changeAreaProp,
  changeQuestionProp,
  getFormatUrl
} from "@/plugins/utils";
import { bus, rankListenQuestion } from "@/plugins/bus";
import { copyResource } from "@/plugins/service";
import deepClone from "clone";
export default {
  props: ["option", "changeOption", "qIndex"],
  components: {
    HoverBox
  },

  data() {
    return {
      selectedDiv: false,
      number: 1,
      copyNumber: 1,
      addInputShow: false,
      copyInputShow: false
    };
  },
  computed: {
    ifQuestionError() {
      const question = this.option.templateData.TemplateAreaViewModels[
        this.option.pageIndex
      ].TemplateQuestionViewModels[this.qIndex];
      for (let i = 0; i < this.option.error.length; i++) {
        if (
          this.option.error[i].pageIndex === this.option.pageIndex &&
          this.option.error[i].questionIndex === this.qIndex
        ) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    getFormatUrl: getFormatUrl,
    changeQuestionIndex(index) {
      //   console.log(this.option.questionIndex,index);
      //  this.selectedDiv = (this.option.questionIndex === index);
      const newData = deepClone(this.option);
      newData.questionIndex = index;
      this.changeOption(newData);
    },
    delPromptAudio() {
      this.showRedConfirmModal({
        content: "确定要删除吗？",
        onOk: () => {
          const pageIndex = this.option.pageIndex;
          const questionIndex = this.option.questionIndex;
          this.pushTemplateDeleteMedia(
            this.option.templateData.TemplateAreaViewModels[pageIndex]
              .TemplateQuestionViewModels[questionIndex].PromptAudioID
          );
          changeQuestionProp(this, {
            PromptAudioID: "",
            PromptAudioPath: ""
          });
        }
      });
    },
    uploadPromptAudioSuccess(res) {
      const pageIndex = this.option.pageIndex;
      const questionIndex = this.option.questionIndex;
      const id = res.ResourceID;
      const url = res.ResourcePath;
      changeQuestionProp(this, {
        PromptAudioID: id,
        PromptAudioPath: url
      });
    },
    changeQuestionPrompt(e) {
      changeQuestionProp(this, {
        Prompt: e.target.value
      });
    },
    ifDelSplitAreaOne(index) {
      const newData = deepClone(this.option);
      const areaArr = newData.templateData.TemplateAreaViewModels;
      if (areaArr[index].SmallIndex !== 1) {
        return false;
      }
      if (!areaArr[index + 2]) {
        return true;
      }
      if (areaArr[index + 2].SmallIndex < 2) {
        return true;
      }
      return false;
    },
    ifDelSplitAreaTwo(index) {
      const newData = deepClone(this.option);
      const areaArr = newData.templateData.TemplateAreaViewModels;
      if (areaArr[index].SmallIndex !== 2) {
        return false;
      }
      if (!areaArr[index + 1]) {
        return true;
      }
      if (areaArr[index + 1].SmallIndex !== 3) {
        return true;
      }
      return false;
    },
    delSplitArea() {
      const newData = deepClone(this.option);
      const index = newData.pageIndex;
      newData.pageIndex = newData.pageIndex - 1;
      const areaArr = newData.templateData.TemplateAreaViewModels;
      if (this.ifDelSplitAreaOne(index)) {
        newData.templateData.TemplateAreaViewModels[index + 1].SmallIndex = 0;
      } else if (this.ifDelSplitAreaTwo(index)) {
        newData.templateData.TemplateAreaViewModels[index - 1].SmallIndex = 0;
      } else {
        for (let i = 1; ; i++) {
          if (
            !areaArr[index + i] ||
            areaArr[index + i].SmallIndex == 0 ||
            areaArr[index + i].SmallIndex == 1
          ) {
            break;
          }
          newData.templateData.TemplateAreaViewModels[index + i].SmallIndex =
            areaArr[index + i].SmallIndex - 1;
        }
      }
      newData.questionIndex = -1;
      newData.templateData.TemplateAreaViewModels.splice(index, 1);
      this.changeOption(newData);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    delTwoArea() {
      const newData = deepClone(this.option);
      const index = newData.pageIndex;
      if (newData.templateData.TemplateAreaViewModels[index].SmallIndex == 1) {
        newData.templateData.TemplateAreaViewModels[index].SmallIndex = 0;
        newData.templateData.TemplateAreaViewModels[index].AreaType = 0;
        newData.templateData.TemplateAreaViewModels[
          index
        ].TemplateQuestionViewModels.splice(this.qIndex, 1);
        newData.templateData.TemplateAreaViewModels.splice(index + 1, 1);
        newData.pageIndex = newData.pageIndex;
      } else {
        newData.templateData.TemplateAreaViewModels[index - 1].SmallIndex = 0;
        newData.templateData.TemplateAreaViewModels[index].AreaType = 0;
        newData.templateData.TemplateAreaViewModels[
          index - 1
        ].TemplateQuestionViewModels.splice(this.qIndex, 1);
        newData.templateData.TemplateAreaViewModels.splice(index, 1);
        newData.pageIndex = newData.pageIndex - 1;
      }
      this.changeOption(newData);
    },
    delQuestion() {
      this.showRedConfirmModal({
        content: "确定要删除吗？",
        onOk: () => {
          this.$nextTick(() => {
            const pageIndex = this.option.pageIndex;
            const newData = deepClone(this.option);
            if (
              this.ifComplexArea(
                newData.templateData.TemplateAreaViewModels[pageIndex].AreaType
              )
            ) {
              // 复杂题型
              this.delTwoArea();
              return;
            }
            if (
              newData.templateData.TemplateAreaViewModels[pageIndex]
                .SmallIndex !== 0 &&
              this.qIndex === 0
            ) {
              this.delSplitArea();
              return;
            }
            newData.templateData.TemplateAreaViewModels[
              pageIndex
            ].TemplateQuestionViewModels.splice(this.qIndex, 1);
            if (this.qIndex <= newData.questionIndex) {
              newData.questionIndex = newData.questionIndex - 1;
            }
            this.changeOption(newData);
            this.$nextTick(() => {
              bus.$emit(rankListenQuestion);
            });
          });
        }
      });
    },
    addQuestion() {
      this.addInputShow = false;
      this.$nextTick(() => {
        const pageIndex = this.option.pageIndex;
        const newData = deepClone(this.option);
        for (let i = 0; i < this.number; i++) {
          const newQuestion = {
            QuestionID: "",
            TemplateID: this.option.templateId,
            AreaID: "",
            TotalContentCount: 0,
            ContentAudioPlayTimes: 0,
            ReadingSeconds: 0,
            PrepareSeconds: 0,
            AnswerSeconds: 0,
            PreSubmitMaxSeconds: 0,
            Prompt: "",
            PromptAudioID: "",
            PromptAudioPath: "",
            PromptAudioSeconds: 0,
            Tips: "",
            TipsAudioID: "",
            TipsAudioPath: "",
            AudioPlayTimes: 0,
            Idx: 0,
            ChooseItem: 0,
            Score: 0.0,
            NewScreen: false,
            TemplateContentViewModels: [
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                Score: 0.0
              }
            ]
          };
          if (
            this.ifComplexArea(
              newData.templateData.TemplateAreaViewModels[pageIndex].AreaType
            )
          ) {
            const area1 = deepClone(
              newData.templateData.TemplateAreaViewModels[pageIndex - 1]
            );
            const newArea2 = {
              AreaType: area1.AreaType,
              AreaTitle: this.addDescIndex(area1.AreaType, i),
              AreaTypeDesc: this.addDescIndex(area1.AreaType, i),
              SmallIndex: 2,
              IsAreaTitleShow: true,
              IsAreaPromptShow: true,
              Index: new Date().toString() + Math.random(),
              TemplateQuestionViewModels: [
                {
                  QuestionID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  TotalContentCount: 0,
                  ContentAudioPlayTimes: 0,
                  ReadingSeconds: 0,
                  PrepareSeconds: 0,
                  AnswerSeconds: 0,
                  PreSubmitMaxSeconds: 0,
                  Prompt: "",
                  PromptAudioID: "",
                  PromptAudioPath: "",
                  PromptAudioSeconds: 0,
                  Tips: "",
                  TipsAudioID: "",
                  TipsAudioPath: "",
                  AudioPlayTimes: 0,
                  Idx: 0,
                  ChooseItem: 0,
                  Score: 0.0,
                  NewScreen: false,
                  TemplateContentViewModels: [
                    {
                      ContentID: "",
                      TemplateID: this.option.templateId,
                      AreaID: "",
                      QuestionID: "",
                      ChooseItem: 0,
                      Score: 0.0
                    }
                  ]
                }
              ]
            };
            const newArea1 = deepClone({
              ...newArea2,
              SmallIndex: 1,
              Index: new Date().toString() + Math.random()
            });
            newArea1.TemplateQuestionViewModels[0].TemplateContentViewModels = [
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                ChooseItem: 0,
                Score: 0.0,
                Idx: 1
              },
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                ChooseItem: 0,
                Score: 0.0,
                Idx: 2
              },
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                ChooseItem: 0,
                Score: 0.0,
                Idx: 3
              },
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                ChooseItem: 0,
                Score: 0.0,
                Idx: 4
              },
              {
                ContentID: "",
                TemplateID: this.option.templateId,
                AreaID: "",
                QuestionID: "",
                ChooseItem: 0,
                Score: 0.0,
                Idx: 5
              }
            ];
            newData.templateData.TemplateAreaViewModels.splice(
              this.option.pageIndex + 2 * i + 1,
              0,
              newArea1,
              newArea2
            );
          } else {
            // 选择题选项默认3个
            if (
              newData.templateData.TemplateAreaViewModels[pageIndex].AreaType ==
              1
            ) {
              newQuestion.TemplateContentViewModels[0].ChooseItem = 3;
            }
            // 填空题5个content
            if (
              newData.templateData.TemplateAreaViewModels[pageIndex].AreaType ==
              27
            ) {
              newQuestion.TemplateContentViewModels = [
                {
                  ContentID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  QuestionID: "",
                  ChooseItem: 0,
                  Score: 0.0,
                  Idx: 1
                },
                {
                  ContentID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  QuestionID: "",
                  ChooseItem: 0,
                  Score: 0.0,
                  Idx: 2
                },
                {
                  ContentID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  QuestionID: "",
                  ChooseItem: 0,
                  Score: 0.0,
                  Idx: 3
                },
                {
                  ContentID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  QuestionID: "",
                  ChooseItem: 0,
                  Score: 0.0,
                  Idx: 4
                },
                {
                  ContentID: "",
                  TemplateID: this.option.templateId,
                  AreaID: "",
                  QuestionID: "",
                  ChooseItem: 0,
                  Score: 0.0,
                  Idx: 5
                }
              ];
            }
            newData.templateData.TemplateAreaViewModels[
              pageIndex
            ].TemplateQuestionViewModels.splice(
              this.qIndex + 1,
              0,
              newQuestion
            );
          }
        }
        this.changeOption(newData);
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
      });
    },
    getIdAndPath(resData) {
      if (resData.ResultData) {
        const arr = resData.ResultData.split(",");
        if (arr.length == 2) {
          return {
            id: arr[0],
            path: arr[1]
          };
        }
      }
      return false;
    },
    async copyQuesionMedia(q) {
      const question = deepClone(q);
      question.QuestionID = "";
      question.AreaID = "";
      question.TemplateContentViewModels.forEach((v, i) => {
        question.TemplateContentViewModels[i].AreaID = "";
        question.TemplateContentViewModels[i].QuestionID = "";
        question.TemplateContentViewModels[i].ContentID = "";
      });
      if (question.PromptAudioID) {
        const data = await copyResource(question.PromptAudioID);
        const copyMedia = this.getIdAndPath(data);
        if (copyMedia) {
          question.PromptAudioID = copyMedia.id;
          question.PromptAudioPath = copyMedia.path;
        }
      }
      return question;
    },
    copyQuestion() {
      this.copyInputShow = false;
      this.$nextTick(async () => {
        const pageIndex = this.option.pageIndex;
        const newData = deepClone(this.option);

        // 复杂题型复制两个area
        // 复杂题型，复制两个area
        if (
          this.ifComplexArea(
            newData.templateData.TemplateAreaViewModels[pageIndex].AreaType
          )
        ) {
          for (let i = 0; i < this.copyNumber; i++) {
            const area1 = deepClone(
              newData.templateData.TemplateAreaViewModels[pageIndex - 1]
            );
            const area2 = deepClone(
              newData.templateData.TemplateAreaViewModels[pageIndex]
            );
            area1.AreaID = "";
            area1.AreaTitle = this.addDescIndex(area1.AreaType, i);
            area1.AreaTypeDesc = this.addDescIndex(area1.AreaType, i);
            area1.Index = new Date().toString() + Math.random();
            area2.AreaID = "";
            area2.AreaTitle = this.addDescIndex(area2.AreaType, i);
            area2.AreaTypeDesc = this.addDescIndex(area2.AreaType, i);
            area2.Index = new Date().toString() + Math.random();
            if (area1.BackgroundImageID) {
              const resData = await copyResource(area1.BackgroundImageID);
              const copyMedia = this.getIdAndPath(resData);
              if (copyMedia) {
                area1.BackgroundImageID = copyMedia.id;
                area1.BackgroundImagePath = copyMedia.path;
              }
            }
            if (area1.PromptBackgroundAudioID) {
              const resData = await copyResource(area1.PromptBackgroundAudioID);
              const copyMedia = this.getIdAndPath(resData);
              if (copyMedia) {
                area1.PromptBackgroundAudioID = copyMedia.id;
                area1.BackgroundImagePath = copyMedia.path;
              }
            }
            if (area1.TitleBackgroundAudioID) {
              const resData = await copyResource(area1.TitleBackgroundAudioID);
              const copyMedia = this.getIdAndPath(resData);
              if (copyMedia) {
                area1.TitleBackgroundAudioID = copyMedia.id;
                area1.TitleBackgroundAudioPath = copyMedia.path;
              }
            }
            area1.TemplateQuestionViewModels[0] = await this.copyQuesionMedia(
              area1.TemplateQuestionViewModels[0]
            );
            area2.TemplateQuestionViewModels[0] = await this.copyQuesionMedia(
              area2.TemplateQuestionViewModels[0]
            );
            newData.templateData.TemplateAreaViewModels.splice(
              this.option.pageIndex + 2 * i + 1,
              0,
              area1,
              area2
            );
          }
        } else {
          // const question = deepClone(newData.templateData.TemplateAreaViewModels[pageIndex].TemplateQuestionViewModels[this.qIndex]);
          // question.QuestionID = '';
          // question.AreaID = '';
          // question.TemplateContentViewModels.forEach((v, i) => {
          //   question.TemplateContentViewModels[i].AreaID = '';
          //   question.TemplateContentViewModels[i].QuestionID = '';
          //   question.TemplateContentViewModels[i].ContentID = '';
          // });
          for (let i = 0; i < this.copyNumber; i++) {
            // const newQuestion = deepClone(question);
            // if (newQuestion.PromptAudioID) {
            //   const data = await copyResource(newQuestion.PromptAudioID);
            //   //update by yijun.chen at 2019.03.11
            //   if (data.ResultData) {
            //     const arr = data.ResultData.split(",");
            //     if (arr.length == 2) {
            //       newQuestion.PromptAudioID = arr[0];//data.ResultData;
            //       newQuestion.PromptAudioPath = arr[1];//newQuestion.PromptAudioPath + '#' + i;
            //     }
            //   }
            // }
            const newQuestion = await this.copyQuesionMedia(
              newData.templateData.TemplateAreaViewModels[pageIndex]
                .TemplateQuestionViewModels[this.qIndex]
            );
            newData.templateData.TemplateAreaViewModels[
              pageIndex
            ].TemplateQuestionViewModels.splice(
              this.qIndex + 1,
              0,
              newQuestion
            );
          }
        }
        this.changeOption(newData);
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
      });
    },
    addDescIndex(type, index) {
      const title = this.formatAreaType(type);
      let count = 0;
      for (
        let i = 0;
        i < this.option.templateData.TemplateAreaViewModels.length;
        i++
      ) {
        if (
          this.option.templateData.TemplateAreaViewModels[i].SmallIndex < 2 &&
          this.option.templateData.TemplateAreaViewModels[i]
            .TemplateQuestionViewModels
        ) {
          count++;
        }
        if (this.option.pageIndex === i) {
          break;
        }
      }
      return this.transFormIndexToChinese(count + 1 + index) + "、" + title;
    },
    toPrePage() {
      this.$nextTick(() => {
        const newData = deepClone(this.option);
        const pageIndex = newData.pageIndex;
        newData.templateData.TemplateAreaViewModels[
          pageIndex - 1
        ].TemplateQuestionViewModels.push(
          ...newData.templateData.TemplateAreaViewModels[pageIndex]
            .TemplateQuestionViewModels
        );
        this.changeOption(newData);
        this.$nextTick(() => {
          this.delSplitArea();
        });
      });
    },
    ifShowCopy(v) {
      const areaArr = this.option.templateData.TemplateAreaViewModels;
      if (!this.ifComplexArea(v.AreaType)) {
        return true;
      }
      if (
        !areaArr[this.option.pageIndex + 1] ||
        areaArr[this.option.pageIndex + 1].SmallIndex == 0 ||
        areaArr[this.option.pageIndex + 1].SmallIndex == 1
      ) {
        return true;
      }
      return false;
    },
    toNextPage() {
      this.$nextTick(() => {
        const pageIndex = this.option.pageIndex;
        const newData = deepClone(this.option);
        const newArea = deepClone(
          newData.templateData.TemplateAreaViewModels[pageIndex]
        );
        newArea.TemplateQuestionViewModels = newArea.TemplateQuestionViewModels.slice(
          this.qIndex
        );
        newArea.Index = new Date().toString() + Math.random();
        newData.questionIndex = 0;
        if (newArea.SmallIndex === 0) {
          newArea.SmallIndex = 2;
          newData.templateData.TemplateAreaViewModels.splice(
            pageIndex + 1,
            0,
            newArea
          );
          newData.templateData.TemplateAreaViewModels[
            pageIndex
          ].TemplateQuestionViewModels = newData.templateData.TemplateAreaViewModels[
            pageIndex
          ].TemplateQuestionViewModels.slice(0, this.qIndex);
          newData.templateData.TemplateAreaViewModels[pageIndex].SmallIndex = 1;
          this.changeOption(newData);
        } else {
          newData.templateData.TemplateAreaViewModels[
            pageIndex
          ].TemplateQuestionViewModels = newData.templateData.TemplateAreaViewModels[
            pageIndex
          ].TemplateQuestionViewModels.slice(0, this.qIndex);
          const areaArr = newData.templateData.TemplateAreaViewModels;
          for (let i = 1; ; i++) {
            if (
              !areaArr[pageIndex + i] ||
              areaArr[pageIndex + i].SmallIndex == 0 ||
              areaArr[pageIndex + i].SmallIndex == 1
            ) {
              break;
            }
            newData.templateData.TemplateAreaViewModels[
              pageIndex + i
            ].SmallIndex = areaArr[pageIndex + i].SmallIndex + 1;
          }
          newArea.SmallIndex = newArea.SmallIndex + 1;
          newData.templateData.TemplateAreaViewModels.splice(
            pageIndex + 1,
            0,
            newArea
          );
          this.changeOption(newData);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.hover-question {
  margin-top: 14px;
  position: relative;
  border: 1px solid transparent;
  &.selected-div {
    // border: solid 1px #2493f8 !important;
    .prompt.template-hover-border {
      border-color: #2493f8;
    }
    .question-content {
      border-color: #2493f8;
      border: 1px solid #2493f8;
    }
  }
  &.error {
    .prompt.template-hover-border {
      border-color: #ff0300;
    }
    .question-content {
      border-color: #ff0300;
    }
  }
  &.disabled {
    .options {
      display: none !important;
    }
    .question-content {
      border-color: #e5e5e5 !important;
      background: white !important;
      border: 1px solid #2493f8;
    }
  }
  &.disabled.selected {
    border: 1px solid #2493f8;
  }
  .options {
    display: none;
  }
  &:hover {
    .options {
      display: block;
    }
    .question-content {
      border-color: #2493f8;
      border: 1px solid #2493f8;
      background: #f7fbff;
    }
    .prompt {
      border: dashed 1px #2d8cf0;
    }
  }
  .question-content {
    background: #f7f7f7;
    padding: 20px 0;
    border: solid 1px #c1def7;
    border-top: 0;
  }
  .to-next-page {
    z-index: 2;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(36, 147, 248, 0.3);
    border-radius: 12px;
    border: solid 1px #ff8a00;
    color: #ff8a00;
    padding: 2px 10px;
    cursor: pointer;
    bottom: -10px;
    left: 21px;
    &:hover {
      background-color: #ff8a00;
      color: white;
    }
  }
  .copy {
    z-index: 5;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(36, 147, 248, 0.3);
    border-radius: 12px;
    border: solid 1px #2493f8;
    color: #2493f8;
    padding: 2px 10px;
    cursor: pointer;
    bottom: -12px;
    right: 90px;
    &:hover {
      background-color: #2493f8;
      color: white;
    }
  }
  .del-icon {
    position: absolute;
    background-color: #ff0000;
    z-index: 4;
    box-shadow: 0px 1px 4px 0px rgba(255, 0, 0, 0.3);
    color: white;
    width: 17px;
    height: 17px;
    font-size: 14px;
    border-radius: 50%;
    cursor: pointer;
    right: -8px;
    top: -8px;
    &:hover {
      background-color: #e30202;
    }
  }
  .add-icon {
    z-index: 5;
    position: absolute;
    background-color: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(36, 147, 248, 0.3);
    border-radius: 12px;
    border: solid 1px #2493f8;
    color: #2493f8;
    font-size: 16px;
    cursor: pointer;
    bottom: -10px;
    right: 21px;
    width: 54px;
    height: 24px;
    &:hover {
      background-color: #2493f8;
      color: white;
    }
  }
}
</style>
<style lang="less">
.hover-question.template-box:hover {
  .active-content-wrap {
    background-color: #ebf1f7;
  }
}
.hover-question.template-box.disabled {
  .active-content-wrap {
    background-color: white !important;
  }
}
.template-box-number-input-wrap {
  position: absolute;
  z-index: 3;
  right: -21px;
  bottom: -78px;
  padding: 35px 0px 35px 70px;
  &.copy-mode {
    right: 40px;
  }
  .ivu-input-number-input-wrap {
    height: 100%;
    line-height: 25px;
    input {
      line-height: 25px;
      height: 100%;
    }
  }
  .number-input {
    float: left;
    border-radius: 0;
    border: solid 1px #2493f8 !important;
    box-shadow: none !important;
    border-right: 0 !important;
    width: 50px;
    height: 25px;
    .ivu-input-number-handler-wrap {
      display: none;
    }
  }
  .number-btn {
    float: left;
    background-color: #f7fbff;
    width: 45px;
    height: 25px;
    text-align: center;
    cursor: pointer;
    line-height: 25px;
    border: solid 1px #2493f8 !important;
    color: #2493f8;
    background-color: #f7fbff;
    border-left-color: #c5dff6 !important;
    &:hover {
      background-color: #2493f8;
      color: white;
    }
  }
}

// .selected-div{
//     border: solid 1px #2493f8 !important;

//     // .question-content{
//     //    border:none;
//     // }
//     // .template-hover-border{
//     //   border-color:#ff0300;
//     // }
// }
</style>



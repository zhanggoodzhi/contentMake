/* 听后回答 */
<template>
  <div>
    <TitleAndPrompt
      :option="option"
      :changeOption="changeOption"
    ></TitleAndPrompt>
    <HoverQuestion
      v-for="(v,i) in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels"
      :key="i"
      :qIndex="i"
      :option="option"
      class="question question-no-header"
      :changeOption="changeOption"
    >
      <div
        v-for="sv in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels"
        class="active-content-wrap"
      >
        <p><span>{{sv.rankListenIndex}}.</span><span class="gray">（分值：{{sv.Score}}）</span></p>
      </div>

      <HoverBox
        :audioMode="true"
        :error="getEditTemplateValidateError('PromptAudioID',option.pageIndex,option.questionIndex)"
        :audioUrl="getFormatUrl(option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].PromptAudioPath)"
        @del="delPromptAudio"
        class="tips tips-input"
        @uploadSuccess="($event)=>{editTemplateValidateError('PromptAudioID', '', option.pageIndex, i);uploadPromptAudioSuccess($event);}"
      >
        <Input
          :autosize="{minRows: 1}"
          class="auto-textarea"
          type="textarea"
          :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
          :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].Prompt"
          @on-change="changeQuestionReadEndTips"
          placeholder="读题结束提示文本"
        ></Input>
      </HoverBox>

      <HoverBox
        :audioMode="true"
        :error="getEditTemplateValidateError('TipsAudioID',option.pageIndex,option.questionIndex)"
        :audioUrl="getFormatUrl(option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TipsAudioPath)"
        @del="delTipsAudio"
        class="tips end-tips-input"     
        @uploadSuccess="($event)=>{editTemplateValidateError('TipsAudioID', '', option.pageIndex, i);uploadTipsAudioSuccess($event);}"
      >
        <Input
          :autosize="{minRows: 1}"
          class="auto-textarea"
          type="textarea"
          :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
          :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].Tips"
          @on-change="changeQuestionReadyWriteTips"
          placeholder="开始答题提示文本"
        ></Input>
      </HoverBox>

      <!-- <Input
        :autosize="{minRows: 1}"
        class="auto-textarea"
        type="textarea"
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].Prompt"
        @on-change="changeQuestionReadEndTips"
        placeholder="读题结束提示文本"></Input>
        <Input
        :autosize="{minRows: 1}"
        class="auto-textarea end-tips-input"
        type="textarea"
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].Tips"
         @on-change="changeQuestionReadyWriteTips"
        placeholder="准备答题提示文本"></Input> -->
    </HoverQuestion>
  </div>
</template>
<script>
import HoverBox from "@/components/HoverBox";
import HoverQuestion from "@/components/editTemplate/box/HoverQuestion";
import TitleAndPrompt from "@/components/editTemplate/box/TitleAndPrompt";
import {
  changeAreaProp,
  changeQuestionProp,
  getFormatUrl
} from "@/plugins/utils";
import deepClone from "clone";
export default {
  props: ["option", "changeOption"],
  components: {
    HoverBox,
    TitleAndPrompt,
    HoverQuestion
  },
  created() {
  },
  data() {
    return {
      getFormatUrl: getFormatUrl
    };
  },
  computed: {},
  methods: {
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



    

    delTipsAudio() {
      this.showRedConfirmModal({
        content: "确定要删除吗？",
        onOk: () => {
          const pageIndex = this.option.pageIndex;
          const questionIndex = this.option.questionIndex;
          this.pushTemplateDeleteMedia(
            this.option.templateData.TemplateAreaViewModels[pageIndex]
              .TemplateQuestionViewModels[questionIndex].TipsAudioID
          );
          changeQuestionProp(this, {
            TipsAudioID: "",
            TipsAudioPath: ""
          });
        }
      });
    },
    uploadTipsAudioSuccess(res) {
      const pageIndex = this.option.pageIndex;
      const questionIndex = this.option.questionIndex;
      const id = res.ResourceID;
      const url = res.ResourcePath;
      changeQuestionProp(this, {
        TipsAudioID: id,
        TipsAudioPath: url
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
    changeQuestionReadEndTips(e) {
      changeQuestionProp(this, {
        Prompt: e.target.value
      });
    },
    changeQuestionReadyWriteTips(e) {
      changeQuestionProp(this, {
        Tips: e.target.value
      });
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  .active-content-wrap {
    background-color: #ededed;
    padding: 30px 15px;
    margin-bottom: 20px;
    .gray {
      color: #97a0a8;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  // .template-hover-border{
  //   display: none !important;
  // }
}

.tips-input {
  margin: 0px -1px 0px -1px;
}
.end-tips-input {
  margin-bottom: -20px;
  margin: 0px -1px -21px -1px;
  border-top: 1px dashed #57a3f3;
}
.red-end-tips-input {
  border-top: 1px dashed #c1def7;
}
</style>

<style lang="less">
.question-no-header {
  border-top: solid 1px;
  .question-content {
    border: solid 1px #2493f8;
  }
  .hover-question-hover-box {
    display: none !important;
  }
}
</style>

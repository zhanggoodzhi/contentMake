/*朗读短文（小学）*/
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
      <div class="active-content-wrap">
        <p><span>图片提示</span></p>
      </div>
      <div
        v-for="sv in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels"
        class="active-content-wrap"
      >
        <p style="text-align:left">{{i+1}}.<span
            class="gray"
            v-show="sv.Score != 0"
          >（分值：{{sv.Score}}）</span></p>
      </div>

      <HoverBox
        :audioMode="true"
        :error="getEditTemplateValidateError('PromptAudioID',option.pageIndex,option.questionIndex)"
        :audioUrl="getFormatUrl(option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].PromptAudioPath)"
        @del="delPromptAudio"
        class="tips end-tips-input"
        @uploadSuccess="($event)=>{editTemplateValidateError('PromptAudioID', '', option.pageIndex, i);uploadPromptAudioSuccess($event);}"
      >
        <Input
          :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
          :value="option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].Prompt"
          :autosize="{minRows: 1}"
          class="auto-textarea"
          type="textarea"
          @on-change="changeQuestionEndTips"
          placeholder="准备结束提示文本"
        ></Input>
      </HoverBox>
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
export default {
  props: ["option", "changeOption"],
  components: {
    HoverBox,
    TitleAndPrompt,
    HoverQuestion
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
    changeQuestionEndTips(e) {
      changeQuestionProp(this, {
        Prompt: e.target.value
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
    text-align: center;
    .gray {
      color: #97a0a8;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.end-tips-input {
  margin-bottom: -20px;
  margin: 0px -1px -21px -1px;
  border-top: 1px dashed #c1def7;
}
</style>
<style lang="less">
.question-no-header {
  .hover-question-hover-box {
    display: none !important;
  }
}
</style>



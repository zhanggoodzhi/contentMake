/* 看图回答 */
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
      class="question"
      :changeOption="changeOption"
    >
      <div class="active-content-wrap">
        <p class="center"><span>图片提示</span></p>
      </div>
      <div
        v-for="sv in option.templateData.TemplateAreaViewModels[option.pageIndex].TemplateQuestionViewModels[i].TemplateContentViewModels"
        class="active-content-wrap"
      >
        <p><span>{{sv.rankListenIndex}}.</span></p>
      </div>
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
          @on-change="changeQuestionTips"
          placeholder="准备结束提示文本"
        ></Input>
      </HoverBox>
    </HoverQuestion>
  </div>
</template>
<script>
import HoverBox from '@/components/HoverBox';
import HoverQuestion from '@/components/editTemplate/box/HoverQuestion';
import TitleAndPrompt from '@/components/editTemplate/box/TitleAndPrompt';
import { changeAreaProp, changeQuestionProp, getFormatUrl } from '@/plugins/utils'
import deepClone from 'clone';
export default {
  props: ['option', 'changeOption'],
  components: {
    HoverBox,
    TitleAndPrompt,
    HoverQuestion
  },

  data() {
    return {
      getFormatUrl: getFormatUrl
    }
  },
  computed: {
  },
  methods: {
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
    changeQuestionTips(e) {
      changeQuestionProp(this, {
        Tips: e.target.value
      });
    },
  }
}
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
    .center {
      text-align: center;
    }
  }
}
.end-tips-input {
  margin: 0px -1px -21px -1px;
  border: 1px dashed #2493f8;
}
</style>


<template>
  <div @click="changeQuestionIndex(-1)">
    <HoverBox
      v-if="!($route.params.type==='preview'&&!option.templateData.TemplateAreaViewModels[currentPageIndex].IsAreaTitleShow)"
      :audioMode="true"
      :audioUrl="getTitleAudioUrl"
      @del="delTitleAudio"
      @uploadSuccess="uploadTitleAudioSuccess"
      :class="areaNameClass"
    >
      <input
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        class="hover-input"
        :class="{'ignore-click':$route.params.type==='prop'||$route.params.type==='preview'}"
        type="text"
        placeholder="标题"
        :value="option.templateData.TemplateAreaViewModels[currentPageIndex].AreaTitle"
        @input="changeAreaTitle"
      >
    </HoverBox>
    <HoverBox
      v-if="!(($route.params.type==='preview'&&!option.templateData.TemplateAreaViewModels[currentPageIndex].IsAreaPromptShow)||option.templateData.TemplateAreaViewModels[option.pageIndex].SmallIndex>1)"
      :audioMode="true"
      :audioUrl="getPromptAudioUrl"
      @del="delPromptAudio"
      class="prompt"
      @uploadSuccess="uploadPromptAudioSuccess"
      :class="areaDescClass"
    >
      <Input
        :autosize="{minRows: 1}"
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        class="auto-textarea"
        :class="{'ignore-click':$route.params.type==='prop'||$route.params.type==='preview'}"
        type="textarea"
        placeholder="答题指导"
        :value="option.templateData.TemplateAreaViewModels[currentPageIndex].AreaPrompt"
        @on-change="changeAreaPrompt"
      ></Input>
      <!-- <textarea
        :disabled="$route.params.type==='prop'||$route.params.type==='preview'"
        class="hover-input"
        type="text"
        placeholder="答题指导"
        :value="option.templateData.TemplateAreaViewModels[currentPageIndex].AreaPrompt"
        @input="changeAreaPrompt"
      ></textarea> -->
    </HoverBox>
  </div>
</template>
<script>
import HoverBox from '@/components/HoverBox';
import { changeAreaProp } from '@/plugins/utils'
import deepClone from 'clone';
export default {
  props: ['option', 'changeOption'],
  components: {
    HoverBox
  },

  data() {
    return {

    }
  },
  computed: {
    // 如果换页了，area里的属性只用smallIndex=1里面的。
    currentPageIndex() {
      const area = this.option.templateData.TemplateAreaViewModels[this.option.pageIndex];
      if (area.SmallIndex > 1) {
        for (let i = 1; ; i++) {
          if (this.option.pageIndex - i < 0) {
            return 0;
          }
          if (this.option.templateData.TemplateAreaViewModels[this.option.pageIndex - i].SmallIndex == 1) {
            return this.option.pageIndex - i;
          }
        }
      }
      return this.option.pageIndex;
    },
    areaNameClass() {
      if (this.$route.params.type === 'preview') {
        return {
          show: true
        }
      }
      return {
        hide: !this.option.templateData.TemplateAreaViewModels[this.currentPageIndex].IsAreaTitleShow,
        show: this.option.templateData.TemplateAreaViewModels[this.currentPageIndex].IsAreaTitleShow
      }
    },
    areaDescClass() {
      if (this.$route.params.type === 'preview') {
        return {
          show: true
        }
      }
      return {
        hide: !this.option.templateData.TemplateAreaViewModels[this.currentPageIndex].IsAreaPromptShow,
        show: this.option.templateData.TemplateAreaViewModels[this.currentPageIndex].IsAreaPromptShow
      }
    },
    getTitleAudioUrl() {
      const index = this.currentPageIndex;
      if (this.option.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioID) {
        const url = window.API_URL + this.option.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioPath
        return url;
      }
      return false;
    },
    getPromptAudioUrl() {
      const index = this.currentPageIndex;
      if (this.option.templateData.TemplateAreaViewModels[index].PromptBackgroundAudioID) {
        const url = window.API_URL + this.option.templateData.TemplateAreaViewModels[index].PromptBackgroundAudioPath
        return url;
      }
      return false;
    },
  },
  methods: {
    changeQuestionIndex(index) {
      const newData = deepClone(this.option);
      newData.questionIndex = index;
      this.changeOption(newData);
    },
    changeAreaProp(prop, value) {
      const index = this.currentPageIndex;
      const newData = deepClone(this.option);
      newData.templateData.TemplateAreaViewModels[index][prop] = value;
      this.changeOption(newData);
    },
    delTitleAudio() {
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          const index = this.currentPageIndex;
          const newData = deepClone(this.option);
          newData.toDeleteMediaArr.push(newData.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioID);
          newData.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioID = '';
          newData.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioPath = '';
          this.changeOption(newData);
        }
      });
    },
    changeTitleShow(bool) {
      changeAreaProp(this, {
        IsAreaTitleShow: bool
      });
    },
    changePromptShow(bool) {
      this.$nextTick(() => {
        this.changeAreaProp('IsAreaPromptShow', bool);
      });
    },
    uploadTitleAudioSuccess(res) {
      const id = res.ResourceID;
      //  const index = this.currentPageIndex;
      // const newData = deepClone(this.option);
      // newData.templateData.TemplateAreaViewModels[index].TitleBackgroundAudioID = id;
      // this.changeOption(newData);
      this.changeAreaProp('TitleBackgroundAudioID', id);
      setTimeout(() => {
        this.changeAreaProp('TitleBackgroundAudioPath', res.ResourcePath);
      });
    },
    delPromptAudio() {
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          const index = this.currentPageIndex;
          const newData = deepClone(this.option);
          newData.toDeleteMediaArr.push(newData.templateData.TemplateAreaViewModels[index].PromptBackgroundAudioID);
          newData.templateData.TemplateAreaViewModels[index].PromptBackgroundAudioID = '';
          newData.templateData.TemplateAreaViewModels[index].PromptBackgroundAudioPath = '';
          this.changeOption(newData);
        }
      });
    },
    uploadPromptAudioSuccess(res) {
      const id = res.ResourceID;
      this.changeAreaProp('PromptBackgroundAudioID', id);
      setTimeout(() => {
        this.changeAreaProp('PromptBackgroundAudioPath', res.ResourcePath);
      });
    },
    changeAreaTitle(e) {
      const value = e.target.value;
      this.changeAreaProp('AreaTitle', value);
    },
    changeAreaPrompt(e) {
      const value = e.target.value;
      this.changeAreaProp('AreaPrompt', value);
    }
  }
}
</script>

<style lang="less" scoped>
.hover-box-wrap.disabled {
  textarea.hover-input {
    margin-top: -1px;
  }
}
</style>


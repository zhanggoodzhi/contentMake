<template>
  <div
    class="fixed template-max-wrap"
    ref="content"
    :style="{'height':minHeight+'px'}"
  >

    <Head
      @SaveDataClick="UpdateTemplate"
      @preview="preview"
    ></Head>
    <div class="content clearfix">
      <Aside
        :option="option"
        :changeOption="changeOption"
      ></Aside>
      <div class="main clearfix">
        <Box
          :option="option"
          :changeOption="changeOption"
        ></Box>
        <Property
          :option="option"
          :changeOption="changeOption"
        ></Property>
      </div>
    </div>
  </div>
</template>

<script>
import deepClone from "clone";
import Head from "@/components/editTemplate/Head";
import Aside from "@/components/editTemplate/Aside";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations, mapActions } = createNamespacedHelpers(
  "global"
);
import Box from "@/components/editTemplate/box/Index";
import Property from "@/components/editTemplate/property/Index";
import { GetTemplate, UpdateTemplate, CopyTemplate } from "@/plugins/service";
import { bus, rankListenQuestion } from "@/plugins/bus";

import { getUserData } from "@/plugins/utils";
export default {
  components: {
    Head,
    Aside,
    Box,
    Property
  },
  created() {
    // 编辑模板页的状态type：  prop:只允许编辑属性，copy:模板复制，lock：不允许更改大小题，选项数量，空：正常编辑,validate:进入页面后直接校验
    console.log("editTemplate", this.option.templateData);
    this.option.templateData.CreateUserID = this.userDetail.UserID;
    console.log("当前路由", this.$route);
    if (this.$route.params && this.$route.params.type == "copy") {
      this.copyTemplate(this.option.templateId);
    } else {
      if (this.option.templateId) {
        this.getTemplateInfo(this.option.templateId);
      } else {
        const userData = getUserData();
        this.option.templateData.Year = new Date().getFullYear(); //默认当前年
        if (userData.zoneIDs) {
          this.option.templateData.CityVMs = this.cityIDsAnCityNamesTransform(
            userData.zoneIDs,
            userData.zoneNames
          ); // by GM
        }
      }
    }
    this.option.toDeleteMediaArr = [];
    console.log("绑定");
    bus.$on(rankListenQuestion, () => {
      this.rankListenQuestion();
    });
  },
  mounted() {
    this.figureHeight();
  },
  computed: {
    ...mapState(["userDetail", "Ability"])
  },
  beforeDestroy() {
    console.log("解绑");
    bus.$off(rankListenQuestion);
  },
  data() {
    return {
      minHeight: 0,
      option: {
        // 待删除的文件（保存或完成时删掉）
        toDeleteMediaArr: [],
        /**
         * 校验出错的数组 {name:'',text:'',pageIndex:-1,questionIndex:-1}
         * templateNameOrDiscriptionError,
         *
         * */
        error: [],
        pageIndex: -1,
        questionIndex: -1,
        templateData: {
          TemplateName: "",
          TemplateDescribe: "",
          PaperName: "",
          IsPaperNameShow: false,
          BackgroundAudioID: "",
          BackgroundAudioPath: "",
          BackgroundAudioTotalSeconds: 5,
          BackgroundImageID: "",
          BackgroundImagePath: "",
          AudioPlayTimes: 1,
          DisplaySeconds: 0,
          TemplateFinishPercent: 100,
          IsShowDisplay: true,
          TotalScore: 0,
          SpeakingScore: 0,
          ListeningScore: 0,
          Status: 0,
          Year: "",
          CityVMs: [],
          CreateTime: "",
          CreateUserID: "",
          UpdateTime: "",
          UpdateUserID: "",
          TemplateAreaViewModels: []
        },
        // templateData: {
        //   "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //   "TemplateName": "四个题型模板Copy1",
        //   "TemplateDescribe": "模板描述111",
        //   "PaperName": "",
        //   "IsPaperNameShow": false,
        //   "BackgroundAudioID": "",
        //   "BackgroundAudioPath": "",
        //   "BackgroundAudioTotalSeconds": 0,
        //   "BackgroundImageID": "23d23b8420b24dcfbd351d9703284a8f",
        //   "BackgroundImagePath": "/resources/pic/20190103/8414c6eb8e4d494b80aa695d5235dbc9.jpg",
        //   "AudioPlayTimes": 0,
        //   "DisplaySeconds": 0,
        //   "IsShowDisplay": true,
        //   "TemplateFinishPercent": 100.0,
        //   "TotalScore": 12.0,
        //   "SpeakingScore": 11.0,
        //   "ListeningScore": 1.0,
        //   "Status": 1,
        //   "Year": 2018,
        //   "CityVMs": [{
        //     "CityID": "53",
        //     "CityName": "淮安市"
        //   }, {
        //     "CityID": "56",
        //     "CityName": "南通市"
        //   }],
        //   "CreateTime": "2019-01-03T16:03:33",
        //   "CreateUserID": "c68e053786994757896ce579b8ddb9df",
        //   "CreateNickName": null,
        //   "UpdateTime": "2019-01-03T16:03:33",
        //   "UpdateUserID": "c68e053786994757896ce579b8ddb9df",
        //   "TemplateAreaViewModels": [{
        //     "AreaID": "2812c47caa4e4a7084ca0b2031e1ddec",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": -1,
        //     "AreaTypeDesc": "空白页",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "",
        //     "IsAreaPromptShow": false,
        //     "Index": 0,
        //     "Idx": 0,
        //     "SmallIndex": 0,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 10,
        //     "PromptBackgroundAudioID": null,
        //     "PromptBackgroundAudioPath": null,
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": null
        //   }, {
        //     "AreaID": "2f4422eb85eb41ff9d0dadb031b2f0cd",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 1,
        //     "AreaTypeDesc": "听力选答",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "一、选择题",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "选择题答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 1,
        //     "Idx": 1,
        //     "SmallIndex": 0,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "5c1219323fbd4faf8f84afb89b82e76b",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "2f4422eb85eb41ff9d0dadb031b2f0cd",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 2,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 2,
        //       "AnswerSeconds": 2,
        //       "PreSubmitMaxSeconds": 0,
        //       "Prompt": "选择题提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "aea9cad85b184411a6db8664fe59c9a1",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "2f4422eb85eb41ff9d0dadb031b2f0cd",
        //         "QuestionID": "5c1219323fbd4faf8f84afb89b82e76b",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }]
        //     }]
        //   }, {
        //     "AreaID": "ccdb861645874dd790050e0e62c4be7b",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 22,
        //     "AreaTypeDesc": "听对话或独白回答问题",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "二、听对话或独白回答问题",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "听对话或独白回答问题答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 21,
        //     "Idx": 21,
        //     "SmallIndex": 0,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "7bfc76bd8aac4eba9558fbab50bd3a4b",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "ccdb861645874dd790050e0e62c4be7b",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 2,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 3,
        //       "AnswerSeconds": 4,
        //       "PreSubmitMaxSeconds": 5,
        //       "Prompt": "听对话或独白回答问题提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "2d42d09a24884cf7ac5b8d895d11b485",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "ccdb861645874dd790050e0e62c4be7b",
        //         "QuestionID": "7bfc76bd8aac4eba9558fbab50bd3a4b",
        //         "ChooseItem": 3,
        //         "Score": 2.0
        //       }, {
        //         "ContentID": "3e42fd3232cb4284b75174f256782c1e",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "ccdb861645874dd790050e0e62c4be7b",
        //         "QuestionID": "7bfc76bd8aac4eba9558fbab50bd3a4b",
        //         "ChooseItem": 3,
        //         "Score": 2.0
        //       }]
        //     }]
        //   }, {
        //     "AreaID": "23313608ec5d483fbe7bf2b7dac2da26",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 3,
        //     "AreaTypeDesc": "朗读短文",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "三、朗读短文",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "朗读短文答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 311,
        //     "Idx": 311,
        //     "SmallIndex": 0,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "6f4e169e30c44b838e85ca07c3f859e5",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "23313608ec5d483fbe7bf2b7dac2da26",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 0,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 3,
        //       "AnswerSeconds": 4,
        //       "PreSubmitMaxSeconds": 5,
        //       "Prompt": "朗读短文提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "fbfd2fc32e834d448d9a1be955891795",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "23313608ec5d483fbe7bf2b7dac2da26",
        //         "QuestionID": "6f4e169e30c44b838e85ca07c3f859e5",
        //         "ChooseItem": 3,
        //         "Score": 2.0
        //       }]
        //     }]
        //   }, {
        //     "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 25,
        //     "AreaTypeDesc": "听后记录并转述描述",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "听后记录并转述",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "听后记录并转述答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 88,
        //     "Idx": 88,
        //     "SmallIndex": 1,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 2,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 10,
        //       "AnswerSeconds": 10,
        //       "PreSubmitMaxSeconds": 10,
        //       "Prompt": "提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "171a114164cd468cac8bf301c8a72ff7",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "6d22d39f0a0e43bcbf95d64a49d331b5",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "798ab5a11a8845a2ae892dec836c7196",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "e7a86418770a48ab8aec59976df192a9",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "ffd5ef7c914e432d8b0b23823c24f57d",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }]
        //     }]
        //   }, {
        //     "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 25,
        //     "AreaTypeDesc": "听后记录并转述描述",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "听后记录并转述",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "听后记录并转述答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 999,
        //     "Idx": 999,
        //     "SmallIndex": 2,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 2,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 10,
        //       "AnswerSeconds": 10,
        //       "PreSubmitMaxSeconds": 10,
        //       "Prompt": "提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "171a114164cd468cac8bf301c8a72ff7",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "6d22d39f0a0e43bcbf95d64a49d331b5",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "798ab5a11a8845a2ae892dec836c7196",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "e7a86418770a48ab8aec59976df192a9",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "ffd5ef7c914e432d8b0b23823c24f57d",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }]
        //     }]
        //   },
        //    {
        //     "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //     "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //     "AreaType": 27,
        //     "AreaTypeDesc": "听对话后填空(北京)",
        //     "TotalQuestionCount": 0,
        //     "AreaTitle": "四、填空题",
        //     "IsAreaTitleShow": false,
        //     "AreaPrompt": "填空题答题指导",
        //     "IsAreaPromptShow": false,
        //     "Index": 4,
        //     "Idx": 4,
        //     "SmallIndex": 0,
        //     "SectionType": 0,
        //     "DisplaySeconds": 0,
        //     "TitleBackgroundAudioID": "",
        //     "TitleBackgroundAudioPath": "",
        //     "TitleBackgroundAudioTotalSeconds": 0,
        //     "PromptBackgroundAudioID": "",
        //     "PromptBackgroundAudioPath": "",
        //     "PromptBackgroundAudioTotalSeconds": 0,
        //     "AudioPlayTimes": 1,
        //     "BackgroundImageID": "",
        //     "BackgroundImagePath": "",
        //     "TotalScore": 0.0,
        //     "NewScreen": false,
        //     "TemplateQuestionViewModels": [{
        //       "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //       "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //       "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //       "TotalContentCount": 0,
        //       "ContentAudioPlayTimes": 2,
        //       "ReadingSeconds": 0,
        //       "PrepareSeconds": 10,
        //       "AnswerSeconds": 10,
        //       "PreSubmitMaxSeconds": 10,
        //       "Prompt": "填空题提示文本",
        //       "PromptAudioID": "",
        //       "PromptAudioPath": "",
        //       "PromptAudioSeconds": 0,
        //       "Tips": "",
        //       "TipsAudioID": "",
        //       "TipsAudioPath": "",
        //       "AudioPlayTimes": 0,
        //       "Idx": 0,
        //       "ChooseItem": 0,
        //       "Score": 0.0,
        //       "NewScreen": false,
        //       "TemplateContentViewModels": [{
        //         "ContentID": "171a114164cd468cac8bf301c8a72ff7",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "6d22d39f0a0e43bcbf95d64a49d331b5",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "798ab5a11a8845a2ae892dec836c7196",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "e7a86418770a48ab8aec59976df192a9",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }, {
        //         "ContentID": "ffd5ef7c914e432d8b0b23823c24f57d",
        //         "TemplateID": "6d016a0c17eb4203b7a1b8fae77b7874",
        //         "AreaID": "d9c131c87190434e88fd73c499e9c37b",
        //         "QuestionID": "372cbe8e4b944be7b5312429358f5f06",
        //         "ChooseItem": 3,
        //         "Score": 1.0
        //       }]
        //     }]
        //   }
        //   ]
        // },
        templateId: this.$route.params.id
      }
    };
  },
  methods: {
    //处理地区id 和地区name
    cityIDsAnCityNamesTransform(cityIDs, cityNames) {
      console.log(cityIDs, "cityIDs");
      const IDs = cityIDs.split(",");
      const names = cityNames.split(",");

      const index = IDs.length;
      let cityArr = [];
      for (let i = 0; i < index; i++) {
        cityArr.push({ CityID: IDs[i], CityName: names[i] });
      }
      return cityArr;
    },

    ...mapMutations(["changeGloabLoadingVisible"]),
    ...mapActions(["reloadRoute"]),
    figureHeight() {
      const currentHeight = this.$refs.content.scrollHeight;
      const minHeight = window.innerHeight - 17 - 78 - 66;
      if (currentHeight < minHeight) {
        this.minHeight = minHeight;
      } else {
        this.minHeight = currentHeight;
      }
    },
    async getTemplateInfo(id) {
      const d = await GetTemplate(id);
      console.log("ResponseData", d.ResponseData);
      this.option.templateData = d.ResponseData;
      this.$nextTick(async () => {
        if (this.$route.params && this.$route.params.type == "validate") {
          // 进入页面直接检测拼写错误
          await this.removeError();
          this.finishValidate();
        }
      });
      console.log("ResponseData------", this.option.templateData);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    async copyTemplate(id) {
      const d = await CopyTemplate(id);
      this.option.templateData = d.ResponseData;
      this.option.templateData.TemplateID = "";
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    changeOption(data) {
      this.option = data;
    },
    rankListenQuestion() {
      console.log("触发排序");
      const newOption = deepClone(this.option);
      let listenCount = 0;
      newOption.templateData.TemplateAreaViewModels.forEach((v, i) => {
        let areaCount = 0;
        // 选择题或填空题(听力题)
        if (!v.TemplateQuestionViewModels) {
        } else if (v.AreaType == 1 || v.AreaType == 27) {
          v.TemplateQuestionViewModels.forEach((sv, si) => {
            sv.TemplateContentViewModels.forEach((ssv, ssi) => {
              listenCount++;
              newOption.templateData.TemplateAreaViewModels[
                i
              ].TemplateQuestionViewModels[si].TemplateContentViewModels[
                ssi
              ].rankListenIndex = listenCount;
            });
          });
        } else {
          v.TemplateQuestionViewModels.forEach((sv, si) => {
            sv.TemplateContentViewModels.forEach((ssv, ssi) => {
              areaCount++;
              newOption.templateData.TemplateAreaViewModels[
                i
              ].TemplateQuestionViewModels[si].TemplateContentViewModels[
                ssi
              ].rankListenIndex = areaCount;
            });
          });
        }
      });
      this.changeOption(newOption);
    },

    validateScore() {
      let text = "分值必须大于0";
      if (this.option.templateData.TemplateAreaViewModels.length > 0) {
        this.option.templateData.TemplateAreaViewModels.forEach((v, i) => {
          if (
            v.TemplateQuestionViewModels &&
            v.TemplateQuestionViewModels.length > 0
          ) {
            v.TemplateQuestionViewModels.forEach((sv, si) => {
              sv.TemplateContentViewModels.forEach((ssv, ssi) => {
                const { Score } = ssv;
                if (!Score) {
                  this.editTemplateValidateError(
                    "ContentScore",
                    text,
                    i,
                    si,
                    ssi
                  );
                }
              });
            });
          }
        });
      }
    },
    validateAudio() {
      let text = "请上传音频";
      if (this.option.templateData.TemplateAreaViewModels.length > 0) {
        this.option.templateData.TemplateAreaViewModels.forEach((v, i) => {
          console.log(
            " v.TemplateQuestionViewModels ",
            v.TemplateQuestionViewModels
          );
          if (
            v.TemplateQuestionViewModels &&
            v.TemplateQuestionViewModels.length > 0
          ) {
            v.TemplateQuestionViewModels.forEach((sv, si) => {
              if (v.AreaType == 102 || v.AreaType == 103) {
                const { PromptAudioID } = sv;
                if (!PromptAudioID) {
                  this.editTemplateValidateError("PromptAudioID", text, i, si);
                }
              }
              if (v.AreaType == 104 || v.AreaType == 102 || v.AreaType == 101) {
                // 看图回答
                const { TipsAudioID } = sv;
                if (!TipsAudioID) {
                  this.editTemplateValidateError("TipsAudioID", text, i, si);
                }
              }
            });
          }
        });
      }
    },
    validateTimes() {
      let text = "秒数必须大于0";
      let text2 = "遍数必须大于0";
      const {
        BackgroundAudioTotalSeconds,
        DisplaySeconds,
        IsShowDisplay
      } = this.option.templateData;
      if (!BackgroundAudioTotalSeconds) {
        this.editTemplateValidateError(
          "BackgroundAudioTotalSeconds",
          text,
          -1,
          -1
        );
      }
      if (!DisplaySeconds && IsShowDisplay) {
        this.editTemplateValidateError("DisplaySeconds", text, -1, -1);
      }
      this.option.templateData.TemplateAreaViewModels.forEach((v, i) => {
        // 空白页
        if (!v.TemplateQuestionViewModels) {
          if (!v.DisplaySeconds) {
            this.editTemplateValidateError(
              "DisplaySeconds",
              text,
              i,
              -1
            );
          }
        } else {
          v.TemplateQuestionViewModels.forEach((sv, si) => {
            const {
              PrepareSeconds,
              AnswerSeconds,
              PreSubmitMaxSeconds,
              AudioPlayTimes
            } = sv;
            // 目前非选择题都有提前提交最大时长
            // update by yijun.chen at 2019.03.08 不校验提前提交最大时长
            /* if (v.AreaType !== 1 && !PreSubmitMaxSeconds) {
              this.editTemplateValidateError(
                "PreSubmitMaxSeconds",
                text,
                i,
                si
              );
            } */
            if (v.AreaType == 1 || v.AreaType == 102 || v.AreaType == 104) {
              if (!AudioPlayTimes) {
                this.editTemplateValidateError("AudioPlayTimes", text2, i, si);
              }
            }
            if (!AnswerSeconds) {
              this.editTemplateValidateError("AnswerSeconds", text, i, si);
            }
            if (!PrepareSeconds) {
              this.editTemplateValidateError("PrepareSeconds", text, i, si);
            }
          });
        }
      });
    },
    removeError() {
      return new Promise(resolve => {
        this.option.error = [];
        setTimeout(() => {
          resolve();
        });
      });
    },
    finishValidate() {
      this.validateNameOrDisc();
      this.validateAudio();
      this.validateScore();
      this.validateTimes();
    },
    async UpdateTemplate(status) {
      await this.removeError();
      console.log("此时的error", this.option.error);
      if (status == 1) {
        this.validateNameOrDisc();
      }
      // 完成时，校验所有时间，不能为0
      if (status == 2) {
        this.finishValidate();
      }
      this.save(status, id => {
        if (status == 1) {
          // 若是新建
          if (!this.$route.params.id) {
            this.$router.replace({
              name: "editTemplate",
              params: {
                id: id
              }
            });
            this.reloadRoute();
          }
        } else {
          this.$router.push({ name: "templateComplete" });
        }
      });
    },
    getIdx(arr, index) {
      for (let i = 1; ; i++) {
        if (arr[index - i].SmallIndex == 1) {
          return arr[index - i].Idx;
        }
      }
    },
    save(status, cb, ifPreview) {
      setTimeout(() => {
        let text;
        if (ifPreview) {
          text = "预览";
        } else if (status == 2) {
          text = "完成";
        } else {
          text = "保存";
        }
        if (this.option.error.length) {
          this.$Modal.error({
            content: `模板内容尚不完整，无法${text}，请继续编辑补充完整！`,
            okText: "我知道了"
          });
          console.log(this.option.error);

          this.changeGloabLoadingVisible(false);
          return;
        }
        if (status == 2) {
          this.$Modal.confirm({
            content: "你确定本模板已经编辑完毕，可以用来制作试卷了吗？",
            onOk: () => {
              const newData = deepClone(this.option);
              let arr = [];
              newData.templateData.TemplateAreaViewModels.forEach((v, i) => {
                arr.push(v);
                arr[i].Index = i + 1;
                if (arr[i].SmallIndex > 1) {
                  arr[i].Idx = this.getIdx(arr, i);
                } else {
                  arr[i].Idx = i + 1;
                }
              });
              newData.templateData.TemplateAreaViewModels = arr;
              newData.templateData.Status = status;

              this.changeGloabLoadingVisible(true);
              UpdateTemplate(newData.templateData).then(d => {
                this.changeGloabLoadingVisible(false);
                if (d.Success) {
                  console.log("待删除文件数组", this.option.toDeleteMediaArr);
                  cb();
                  this.$Message.success(d.State);
                }
              });
            }
          });
          return;
        }
        const newData = deepClone(this.option);
        let arr = [];
        newData.templateData.TemplateAreaViewModels.forEach((v, i) => {
          arr.push(v);
          arr[i].Index = i + 1;
          if (arr[i].SmallIndex > 1) {
            arr[i].Idx = this.getIdx(arr, i);
          } else {
            arr[i].Idx = i + 1;
          }
        });
        newData.templateData.TemplateAreaViewModels = arr;
        newData.templateData.Status = status;
        UpdateTemplate(newData.templateData).then(d => {
          this.changeGloabLoadingVisible(false);
          if (d.Success) {
            console.log("待删除文件数组", this.option.toDeleteMediaArr);
            cb(d.ResultData);
            this.$Message.success(d.State);
          }
        });
      });
    },
    validateNameOrDisc() {
      const templateName = this.option.templateData.TemplateName;
      const templateDescribe = this.option.templateData.TemplateDescribe;
      let text;
      if (!templateName || templateName.trim() === "") {
        text = "请输入模板名称！";
      } else if (templateName.trim().length > 20) {
        text = "您输入的模板名称超出长度，最多20个字符！";
      } else if (templateName.trim().length > 20) {
        text = "您输入的模板名称已存在！";
      } else if (templateDescribe.trim().length > 200) {
        text = "您输入的模板描述超出长度，最多200个字符！";
      }
      this.editTemplateValidateError("templateNameOrDiscription", text, -1, -1);
    },
    async preview() {
      //by gm
      this.changeGloabLoadingVisible(true);
      await this.removeError();
      console.log("此时的error", this.option.error);
      this.validateNameOrDisc();
      this.save(
        1,
        id => {
          if (!this.$route.params.id) {
            this.$router.replace({
              name: "editTemplate",
              params: {
                id: id
              }
            });
            this.reloadRoute();
          }
          setTimeout(() => {
            this.changeGloabLoadingVisible(false);
            let routeData = this.$router.resolve({
              name: "templatePreview",
              params: {
                id: id,
                type: "preview"
              }
            });
            window.open(routeData.href);
          });
        },
        true
      );
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  position: relative;
  height: calc(100% - 62px - 15px);
  .main {
    margin-left: 10px;
    float: left;
    height: 100%;
    background-color: #ffffff;
  }
}
</style>
<style lang="less">
.head-ml {
  .collapse-title {
    margin-left: 21px !important;
  }
}
</style>


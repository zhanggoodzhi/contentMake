<template>
  <div class="main">
    <AreaPreviewCollapse
      :title="paperArea.AreaTitle"
      :paperArea="paperArea"
    >
      <div class="area-item-content">
        <div class="area-des" v-show="paperArea.AreaPrompt">{{paperArea.AreaPrompt}}</div>
        <div class="area-body">
          <div v-for="question in paperArea.PaperQuestionViewModels">
            <div class="question-promt">{{question.Prompt}}</div>
            <img
              class="tips-image"
              v-if="question.ImagePath && question.ImagePath.length > 0"
              :src="getSliceUrl(question.ImagePath)"
            />
            <div
              class="question-promt"
              v-else
            >{{question.Text}}</div>
            <div class="operate-bar">
              <span
                v-show="question.AudioPath.length > 0"
                class="play-button"
                @click="clickPlay(question.AudioPath)"
              ><i
                  class=" font-icon font_family icon-pause"
                  v-if="isPlaying(question.AudioPath)"
                ></i>
                <i
                  class=" font-icon font_family icon-play_"
                  v-else
                ></i>原文播放</span>
              <span
                class="show-original-button"
                @click="showAllArticle(question)"
              ><i class=" font-icon font_family icon-text1"></i>查看原文</span>
            </div>
            <div v-for="areaContent in question.PaperContentViewModels">
              <div class="question-title">
                {{areaContent.Idx}}.{{areaContent.Text}}
              </div>
              <RadioGroup
                :vertical="areaContent.Layout != 1"
                :value="getAnswer(areaContent)"
                class="custom-radio"
                v-if="areaContent.ResourceType==0 || areaContent.ResourceType==1"
              >

                <Radio
                  disabled
                  :label="option.OptionID"
                  v-for="(option,index) in areaContent.PaperContentOptionViewModels"
                  :key="index"
                >
                  <Tooltip
                    :content="option.Content"
                    placement="top-start"
                    max-width="700"
                  >
                    <span>{{getIndex(index)}}.&nbsp;</span>
                    <span
                      class="ellipsis"
                      :class="(areaContent.Layout == 1)?'layout-h':'layout-v'"
                    >{{option.Content}}</span>

                  </Tooltip>
                </Radio>

              </RadioGroup>

              <RadioGroup
                :vertical="areaContent.Layout != 1"
                :value="getAnswer(areaContent)"
                class="custom-radio"
                v-else
              >
                <div>
                  <div style="padding: 20px">
                    <Radio
                      disabled
                      :label="option.OptionID"
                      v-for="(option,index) in areaContent.PaperContentOptionViewModels"
                      :key="index"
                      class="image-group"
                    >
                      <span>{{getIndex(index)}}.&nbsp;</span>
                      <img
                        class="option-image"
                        :src="getSliceUrl(option.ImagePath)"
                      />
                    </Radio>
                  </div>
                </div>
              </RadioGroup>

              <div class="checked-point">

                <i class=" answer-point-icon font_family icon-konwledge"></i>
                考查知识点:
                <span>{{getCheckPointString(areaContent.PaperContentAbilityViewModels)}}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AreaPreviewCollapse>
  </div>
</template>
<script>
import AreaPreviewCollapse from "@/components/PaperPreviewComponents/areaPreviewCollapse";
import { createNamespacedHelpers } from "vuex";
const { mapGetters, mapActions } = createNamespacedHelpers("global");
export default {
  created() {
  },
  props: ["paperArea"],
  components: {
    AreaPreviewCollapse
  },
  computed: {
    ...mapGetters(["ifPlaying"])
  },
  data() {
    return {};
  },

  methods: {
    getIndex(value) {
      if (value == 0) {
        return "A";
      } else if (value == 1) {
        return "B";
      } else if (value == 2) {
        return "C";
      } else if (value == 3) {
        return "D";
      } else if (value == 4) {
        return "E";
      } else if (value == 4) {
        return "F";
      }
    },
    clickPlay(url) {
      this.togglePlay(window.API_URL + url);
    },
    isPlaying(url) {
      return this.ifPlaying(window.API_URL + url);
    },
    ...mapActions(["togglePlay"]),
    changeArrow() {
      this.arrowState = !this.arrowState;
    },
    //获取正确答案选项
    getAnswer(item) {
      if (item.PaperContentAnswerViewModels.length > 0) {
        const answerContent = item.PaperContentAnswerViewModels[0];
        for (const element of item.PaperContentOptionViewModels) {
          if (element.OptionID == answerContent.Content) {
            return element.OptionID;
          }
        }
      }
    },
    //查看全文
    showAllArticle(question) {
      this.$emit("showAllArticle", question);
    },
    getCheckPointString(paperContentAbilitys) {
      let names = new Array();
      paperContentAbilitys.forEach(element => {
        names.push(element.Name);
      });
      return names.join("、");
    }
  }
};
</script>
<style lang="less">
.image-group {
  height: 130px !important;
  .ivu-radio-wrapper {
    height: auto;
  }
  .option-image {
    width: 150px;
    height: 112px;
  }
}
</style>

<style lang="less" scoped>
.area-item-content {
  font-size: 14px;
  .area-des {
    padding: 14px 21px;
    border-bottom: solid 1px #e5e5e5;
  }
  .area-body {
    position: relative;
    padding: 21px;
    .question-promt{
      padding: 10px 0;
    }
    .tips-image {
      width: 400px;
      height: 300px;
    }
    .operate-bar {
      float: right;
      font-size: 14px;
      padding: 10px 0;
      .play-button {
        cursor: pointer;
      }
      .show-original-button {
        cursor: pointer;
      }
    }
    .question-title {
      font-size: 16px;
      // padding: 10px 0;
      width: 730px;
    }
    .custom-radio {
      padding: 4px 0;
    }
    .checked-point {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;

      .answer-point-icon {
        color: #2493f8;
        font-size: 14px;
      }
    }
  }
}

.font-icon {
  color: #2493f8;
  font-size: 14px;
  margin: 0 10px;
}

.layout-v {
  display: inline-block;
  width: 833px;
  vertical-align: middle;
}
.layout-h {
  display: inline-block;
  max-width: 200px;
  vertical-align: middle;
}
</style>


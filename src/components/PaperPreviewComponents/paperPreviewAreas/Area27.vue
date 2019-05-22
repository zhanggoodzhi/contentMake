<template>
  <div class="main">
    <AreaPreviewCollapse :title="paperArea.AreaTitle" :paperArea="paperArea">
      <div class="area-item-content">
        <div class="area-des">{{paperArea.AreaPrompt}}</div>
        <div class="area-body">
          <div v-for="question in paperArea.PaperQuestionViewModels">
            <div class="question-promt">{{question.Prompt}}</div>
            <img class="question-img" v-if="question.ImagePath && question.ImagePath.length > 0" :src="getSliceUrl(question.ImagePath)"/>
            <div class="question-promt" v-else>{{question.Text}}</div>
            <!-- <img
              class="question-img"
              :src="getSliceUrl(question.ImagePath)"
            /> -->
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
                <span>{{areaContent.Idx}}.&nbsp;__________</span>

              </div>

              <div class="answer">
                <i class=" answer-point-icon font_family icon-answre"></i>
                参考答案:
                <span>{{getAnswerString(areaContent.PaperContentAnswerViewModels)}}</span>
              </div>

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
    clickPlay(url) {
      this.togglePlay(window.API_URL + url);
    },
    isPlaying(url){
      return this.ifPlaying(window.API_URL + url);
    },
    ...mapActions(["togglePlay"]),
    changeArrow() {
      this.arrowState = !this.arrowState;
    },
    //查看全文
    showAllArticle(paperArea) {
      this.$emit("showAllArticle", paperArea);
    },
    getAnswerString(paperContentAnswerViewModels) {
      let answers = new Array();
      paperContentAnswerViewModels.forEach(element => {
        answers.push(element.Content);
      });
      return answers.join("/");
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
    .question-img {
      width: 400px;
      height: 300px;
      // background-color: red;
    }
    .question-title {
      padding: 10px 0;
    }
    .operate-bar {
      float: right;
      .play-button {
        cursor: pointer;
      }
      .show-original-button {
        cursor: pointer;
      }
      // position: absolute;
      // top: 21px;
      // right: 21px;
    }
    .answer {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;
      border-bottom: solid 1px #f2f4f9;
      .answer-point-icon {
        color: #2493f8;
        font-size: 14px;
      }
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
</style>


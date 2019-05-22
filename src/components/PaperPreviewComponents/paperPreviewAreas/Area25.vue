
<template>
  <div class="main">
    <AreaPreviewCollapse
      :title="paperArea.AreaTitle"
      :paperArea="paperArea"
    >
      <div class="area-item-content" >
        <div class="area-des" v-show="paperArea.AreaPrompt">{{paperArea.AreaPrompt}}</div>

        <div class="area-body">
          <div v-for="(question,questionIdnex) in paperArea.PaperQuestionViewModels">
            <div
              class="operate-bar"
              v-if="question.Idx == 1"
            >

              <p style="float: left"><b>{{question.Prompt}}</b></p>
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
            <div
              class="operate-bar"
              v-if="question.Idx == 2"
            >

              <p style="float: left"><b>{{question.Prompt}}</b></p>
              <span
                v-show="paperArea.PaperQuestionViewModels[0].AudioPath.length > 0"
                class="play-button"
                @click="clickPlay(paperArea.PaperQuestionViewModels[0].AudioPath + '#')"
              >
                <i
                  class=" font-icon font_family icon-pause"
                  v-if="isPlaying(paperArea.PaperQuestionViewModels[0].AudioPath + '#')"
                ></i>
                <i
                  class=" font-icon font_family icon-play_"
                  v-else
                ></i>原文播放</span>
              <span
                class="show-original-button"
                @click="showAllArticle(paperArea.PaperQuestionViewModels[0])"
              ><i class=" font-icon font_family icon-text1"></i>查看原文</span>
            </div>

            <img
              class="question-img"
              v-if="question.ImagePath && question.ImagePath.length > 0"
              :src="getSliceUrl(question.ImagePath)"
            />
            <div
              class="question-promt"
              v-else
            >{{question.Text}}</div>

            <div class="question">
              <!-- <div><img 
                  v-if="question.ImagePath.length > 0"
                  class="question-img"
                  :src="getSliceUrl(question.ImagePath)"
                /></div> -->
              <div v-for="areaContent in question.PaperContentViewModels">
                <div class="question-title">
                  <span v-if="questionIdnex == 0">{{areaContent.Idx}}.________</span>
                  <span v-else>{{areaContent.Tips}}</span>

                </div>

                <div
                  class="answer"
                  v-if="questionIdnex == 0"
                >
                  <i class=" answer-point-icon font_family icon-answre"></i>
                  参考答案:
                  <span>{{getAnswerString(areaContent.PaperContentAnswerViewModels)}}</span>
                </div>
                <div
                  class="answer"
                  v-else
                >
                  <i class=" answer-point-icon font_family icon-answre"></i>
                  参考答案:
                  <ul>
                    <li
                      class="left-space"
                      v-for="answer in areaContent.PaperContentAnswerViewModels"
                    ><span>{{answer.Content}}</span></li>
                  </ul>
                  <!-- <div
                    class="left-space"
                    v-for="answer in areaContent.PaperContentAnswerViewModels"
                  >{{answer.Content}}</div> -->
                </div>

                <!-- 该题型 question 1 没有机评参考 -->
                <div
                  class="reference"
                  v-if="questionIdnex != 0"
                >
                  <i class=" answer-point-icon font_family icon-computer"></i>
                  机评参考:
                  <ul>
                    <li
                      class="left-space"
                      v-for="paperContentRefText in areaContent.PaperContentRefTextViewModels"
                    >
                      <span>{{paperContentRefText.Content}}</span></li>
                  </ul>
                  <!-- <div
                    class="left-space"
                    v-for="paperContentRefText in areaContent.PaperContentRefTextViewModels"
                  >{{paperContentRefText.Content}}</div> -->
                </div>
                <div class="checked-point">
                  <i class=" answer-point-icon font_family icon-konwledge"></i>
                  考察知识点:
                  <span>{{getCheckPointString(areaContent.PaperContentAbilityViewModels)}}</span>
                </div>
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
  created() {},
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
    isPlaying(url) {
      return this.ifPlaying(window.API_URL + url);
    },
    ...mapActions(["togglePlay"]),
    changeArrow() {
      this.arrowState = !this.arrowState;
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
    },
    getAnswerString(paperContentAnswerViewModels) {
      let answers = new Array();
      paperContentAnswerViewModels.forEach(element => {
        answers.push(element.Content);
      });
      return answers.join("/");
    }
  }
};
</script>

<style lang="less" scoped>
.area-item-content {
  font-size: 14px;
  .area-des {
    padding: 14px 20px;
    // border-bottom: solid 1px #e5e5e5;
  }

  .area-body {
    position: relative;
    // padding: 21px;
    .question {
      padding: 21px;
      // .question-img {
      //   width: 400px;
      //   height: 300px;
      //   // background-color: red;
      // }
    }
    .question-img {
      padding: 20px;
      width: 400px;
      height: 300px;
      // background-color: red;
    }
    .question-title {
      // padding: 10px;
      font-size: 16px;
    }
    .answer {
      font-size: 14px;
      padding: 16px 10px;
      background-color: #f8fafd;
      border-bottom: solid 1px #f2f4f9;
    }
    .operate-bar {
      text-align: right;

      border-bottom: solid 1px #e5e5e5;
      border-top: solid 1px #e5e5e5;
      padding: 14px 21px;
      .play-button {
        cursor: pointer;
      }
      .show-original-button {
        cursor: pointer;
      }
    }
    // .operate-bar {
    //   float: right;
    //   // position: absolute;
    //   // top: 21px;
    //   // right: 21px;
    // }
    .reference {
      border: solid 1px #f2f4f9;
      background-color: #f8fafd;
      padding: 10px;
    }
    .checked-point {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;
    }
  }
}

.font-icon {
  color: #2493f8;
  font-size: 14px;
  margin: 0 10px;
}
.answer-point-icon {
  color: #2493f8;
  font-size: 14px;
}
li {
  margin-left: 30px;
  list-style: square;
  color: #a3a3a3;
  font-size: 11px;
  span {
    color: #444;
    font-size: 16px;
  }
}
</style>


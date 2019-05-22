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
            <div class="area-des">{{question.PromptOfPaper}}</div>
            <!-- <img
              class="image"
              v-if="question.ImagePath && question.ImagePath.length > 0"
              :src="getSliceUrl(question.ImagePath)"
            />
            <div
              class="question-promt"
              v-else
            >{{question.Text}}</div> -->

            <div class="content-body">
              <div v-for="areaContent in question.PaperContentViewModels">

                <!-- <div class="question-title">{{areaContent.Idx}}.
                  {{areaContent.Text}}
                </div> -->
                <img
                  class="image"
                  v-if="areaContent.ImagePath && areaContent.ImagePath.length > 0"
                  :src="getSliceUrl(areaContent.ImagePath)"
                />
                <div
                  class="question-promt"
                  v-else
                >{{areaContent.Text}}</div>

                <div class="area-des2">{{areaContent.Tips}}</div>

                <div class="answer">
                  <i class=" answer-point-icon font_family icon-answre"></i>
                  参考答案:
                  <ul>
                    <li v-for="paperContentAnswer in areaContent.PaperContentAnswerViewModels">
                      <span>{{paperContentAnswer.Content}}</span>
                    </li>
                  </ul>
                  <!-- <span>{{getAnswerString(areaContent.PaperContentAnswerViewModels)}}</span> -->
                </div>

                <!-- <div class="reference">
                  <i class=" answer-point-icon font_family icon-computer"></i>
                  机评参考:
                  <ul>
                    <li v-for="paperContentRefText in areaContent.PaperContentRefTextViewModels">
                      {{paperContentRefText.Content}}
                    </li>
                  </ul>
                </div> -->

                <div class="checked-point">
                  <i class=" answer-point-icon font_family icon-konwledge"></i>
                  考查知识点:
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
  created() {
  },
  computed: {
    ...mapGetters(["ifPlaying"])
  },
  props: ["paperArea"],
  components: {
    AreaPreviewCollapse
  },
  data() {
    return {
      hideArr: []
    };
  },
  methods: {
    toggleHideTitle(i, si) {
      for (let k = 0; k < this.hideArr.length; k++) {
        if (this.hideArr[k].i === i && this.hideArr[k].si === si) {
          this.hideArr.splice(k, 1);
          return;
        }
      }
      this.hideArr.push({
        i: i,
        si: si
      });
    },
    ifHide(i, si) {
      return this.hideArr.find(v => v.i === i && v.si === si);
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
    padding: 14px 21px 0 21px;
    // border-bottom: solid 1px #e5e5e5;
  }
   .area-des2 {
    padding: 14px 21px;
    // border-bottom: solid 1px #e5e5e5;
  }

  .operate-bar {
    text-align: right;

    border-bottom: solid 1px #e5e5e5;
    padding: 14px;
    .play-button {
      cursor: pointer;
    }
    .show-original-button {
      cursor: pointer;
    }
  }
  .area-body {
    // padding: 21px;
    .content-body {
      padding: 21px;
    }
    .question-title {
      font-size: 16px;
      padding: 10px 0;
    }
    .answer {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;
      border-bottom: solid 1px #f2f4f9;
    }
    .reference {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;
      border-bottom: solid 1px #e5e5e5;
    }
    .checked-point {
      font-size: 14px;
      padding: 10px;
      background-color: #f8fafd;
    }
  }
}
.eye {
  width: 25px;
  height: 13px;
  display: inline-block;
}
.image {
  margin-top: 10px;
  margin-left: 10px;
  max-width: 100%;
  height: auto;
}
.answer-point-icon {
  color: #2493f8;
  font-size: 14px;
}
.font-icon {
  color: #2493f8;
  font-size: 14px;
  margin: 0 10px;
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


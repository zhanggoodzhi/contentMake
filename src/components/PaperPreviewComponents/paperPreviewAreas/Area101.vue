<template>
  <div class="main">
    <AreaPreviewCollapse
      :title="paperArea.AreaTitle"
      :paperArea="paperArea"
    >
      <div class="area-item-content">
        <!-- <div class="area-des">{{paperArea.AreaPrompt}}</div> -->
        <div class="area-body">
          <div v-for="question in paperArea.PaperQuestionViewModels">

            <div
              class="question-title"
              v-show="question.Prompt.length > 0"
            >{{question.Prompt}}</div>
            <img
              v-if="question.ImagePath && question.ImagePath.length > 0"
              :src="getSliceUrl(question.ImagePath)"
            />
            <div
              class="question-promt"
              v-else
              v-show="question.Text.length > 0"
            >{{question.Text}}</div>

            <div v-for="areaContent in question.PaperContentViewModels">
              <div class="operate-bar">
                <span
                  v-show="areaContent.AudioPath.length > 0"
                  class="play-button"
                  @click="clickPlay(areaContent.AudioPath)"
                ><i
                    class=" font-icon font_family icon-pause"
                    v-if="isPlaying(areaContent.AudioPath)"
                  ></i>
                  <i
                    class=" font-icon font_family icon-play_"
                    v-else
                  ></i>原文播放</span>
              </div>
              <div class="question-title question-promt">
                {{areaContent.Text}}
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
    showAllArticle(paperArea) {
      this.$emit("showAllArticle", paperArea);
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
    .question-promt {
      padding: 10px 0;
    }
    .question-title {
      font-size: 16px;
    }
    .operate-bar {
      // float: right;
      text-align: right;
      .play-button {
        cursor: pointer;
      }
      // position: absolute;
      // top: 21px;
      // right: 21px;
    }
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


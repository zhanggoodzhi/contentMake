
<template>
  <div class="question-content">
    <div v-for="(item,i) in question.PaperQuestionList">
      <div>
        <img
          class="image"
          :src="getSliceUrl(item.ImagePath)"
          alt=""
        >
      </div>

      <!-- <div class="question-des">{{item.Prompt}}</div> -->
      <div v-for="(contentItem,si) in item.PaperContentViewModels">
        <!-- <div class="question-des">{{contentItem.Text}}</div> -->
        <div class="question-answer">
          <div class="content-title">
            <span>{{contentItem.Idx}}.&nbsp;{{ifHide(i,si)?'':contentItem.Text}}</span>
            <span
              style="float:right;font-size:14px;cursor: pointer;"
              class="play-button"
              @click="toggleHideTitle(i,si)"
            >
              <i
                class=" font-icon font_family icon-password_visible"
                v-if="ifHide(i,si)"
              ></i>
              <i
                class="font-icon font_family icon-password_invisible"
                v-else
              ></i>{{ifHide(i,si)?'显示题干':'隐藏题干'}}
            </span>
            <span
              style="float:right;font-size:14px;cursor: pointer;"
              v-show="contentItem.AudioPath && contentItem.AudioPath.length > 0"
              class="play-button"
              @click="togglePlay(getSliceUrl(contentItem.AudioPath))"
            >
              <i
                class=" font-icon font_family icon-pause"
                v-if="ifPlaying(getSliceUrl(contentItem.AudioPath))"
              ></i>
              <i
                class=" font-icon font_family icon-play_"
                v-else
              ></i>音频播放
            </span>
          </div>
          <div class="answer-explain">
            <i class=" answer-point-icon font_family icon-answre"></i>参考答案:
            <ul class="font16">
              <li v-for="paperContentAnswer in contentItem.PaperContentAnswerViewModels">
                <span>{{paperContentAnswer.Content}}</span>
              </li>
            </ul>
            <!-- <div style="padding-left: 20px">{{paperContentAnswer.Content}}</div> -->
          </div>
          <div class="answer-explain">
            <i class=" answer-point-icon font_family icon-konwledge"></i>考查知识点:
            <span>{{getCheckPointString(contentItem.PaperContentAbilityViewModels)}}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
/*选择题 */
import { createNamespacedHelpers } from "vuex";
const {
  mapState,
  mapMutations,
  mapGetters,
  mapActions
} = createNamespacedHelpers("global");
import deepClone from "clone";
import { UpdateUserPaperQuestion } from "@/plugins/service";
export default {
  props: ["question", "OperateType"],
  computed: {
    ...mapState(["userDetail"]),
    ...mapGetters(["ifPlaying"])
  },
  components: {},
  data() {
    return {
      hideArr: []
    };
  },
  methods: {
    ...mapActions(["togglePlay"]),
    replaceBr(text) {
      return text.replace(/\n/g, "<Br/>");
    },
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
.question-content {
  padding: 10px;
  .image {
    max-width: 100%;
    height: auto;
  }
  .question-des {
    line-height: 26px;
    padding: 7px 10px;
    font-size: 16px;
    color: #444444;
  }
  .original-des {
    font-size: 14px;
    color: #444444;
  }
  .question-answer {
    padding: 10px;
    .content-title {
      padding-bottom: 10px;
      font-size: 16px;
    }
    .answer-title {
      font-size: 14px;
      color: #333333;
    }
    .options {
      padding: 10px 0;
      .option-item {
        display: inline-block;
        padding-right: 20px;
      }
    }
    .answer-des {
      font-size: 16px;
      padding: 10px;
      border-bottom: solid 1px #e1e4eb;
    }
    .answer-explain {
      color: #666;
      span {
        color: #4444;
      }
      font-size: 14px;
      padding: 14px 12px;
      background-color: #e6eaf0;

      border-bottom: solid 1px #e1e4eb;
      .answer-point-icon {
        margin-right: 5px;
        color: #2493f8;
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }
}
.play-button {
  font-size: 14px;
  i {
    font-size: 12px;
    color: #2493f8;
    margin-right: 5px;
  }
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




<template>
  <div>
    <div v-bind:class="ifBeChoose? 'questionSelect' : 'question' ">
      <div class="question-title">
        <div
          class="copy"
          v-if="!ifBeChoose"
          @click="CopyClick"
        >
          复制
        </div>
        <div
          v-if="ifBeChoose"
          class="cancelselect"
          @click="SelectClick()"
        >
          取消选取
        </div>
        <div
          v-else
          class="select"
          @click="SelectClick()"
        >
          选取
        </div>
      </div>
      <div class="question-content">
        <div v-if="questionData.Content && questionData.Content.length">
          <div v-for="cont in questionData.Content">
            <!-- text如何显示 显示文字、图片、视频 -->
            <div
              v-if="questionData.ImagePath && questionData.ImagePath!=''"
              class="text"
            >
              <img
                :src="questionData.ImagePath"
                alt=""
              >
            </div>
            <div
              v-else
              class="text"
            >
              {{cont.Text}}
            </div>

            <div v-if="cont.Option && cont.Option.length">
              <div
                class="option"
                v-for="option in cont.Option"
              >
                <span>{{option.OptionID}}&nbsp;</span>
                <img
                  class="option-image"
                  v-if="null != option.ImagePath && option.ImagePath.length > 0"
                  :src="getSliceUrl(option.ImagePath)"
                />
                <span v-else>{{option.Content}}</span>

              </div>
            </div>
          </div>
        </div>

        <div
          class="reftextDiv"
          v-if="questionData.RefText && questionData.RefText!=''"
        >
          <QuestionCollapse
            title="听力原文"
            :isselect="ifBeChoose"
          >
            <div class="reftext">
              {{questionData.RefText}}
            </div>
          </QuestionCollapse>
        </div>
        <div class="ability">
          <span class="ability-title">考查能力：</span>
          <span class="ability-content">{{questionData.Ability}}</span>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import { DuplicateQuestion } from "@/plugins/service";
import QuestionCollapse from "@/components/QuestionCollapse";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import deepClone from "clone";
export default {
  props: ["questionData"],
  components: {
    QuestionCollapse
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapState([
      "paperData",
      "areaIndex",
      "questionIndex",
      "searchBasketParams",
      "resultQuestionBasket"
    ]),
    // 判断是否被选取
    ifBeChoose() {
      for (const v of this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels) {
        if (v.TrackQuestionID === this.questionData.PaperQuestion.QuestionID) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    ...mapMutations(["changePaperData"]),
    //复制
    CopyClick() {
      this.QuestionCopy("1");
    },
    //选取
    SelectClick() {
      if (!this.ifBeChoose) {
        //选取
        this.QuestionCopy("2");
      } else {
        //取消选取
        this.QuestionCopy("3");
      }
    },
    //复制的时候改变 当前光标定位题的内容
    //注意QuestionID 和 ContentID还是要用之前的
    QuestionCopy(type) {
      //取消复制
      if (type == "3") {
        const newData = deepClone(this.paperData);
        const getRelatedQuestionIndex = this.getRelatedQuestionIndex();
        newData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[getRelatedQuestionIndex] = newData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[getRelatedQuestionIndex].savedQuestionData;
        //更改试卷内容
        this.changePaperData(newData);
      } else {
        //复制一份数据用于取消选取的时候赋值
        //获取复制之后资源文件数组
        const param = {
          QuestionSummaryID: this.questionData.QuestionSummaryID
        }
        DuplicateQuestion(param).then(d => {
          //    const responseData = d.ResponseData;
          // const nData=deepClone(this.paperData);
          const qData = deepClone(this.questionData);//对象之间赋值 必须重新copy一份出来
          console.log('试题篮数据',qData);
          const nData = deepClone(this.paperData);
          const responseData = d.ResponseData;
          const areatype = nData.PaperAreaViewModels[this.areaIndex].AreaType;
          //之前的questionid不能变       
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex] = qData.PaperQuestion;
          // 将初始数据保存下来，取消选取用
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].savedQuestionData = this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex];
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].QuestionID = this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].QuestionID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperID = this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].AreaID = this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].AreaID;
          //替换之前的资源文件id
          const audioid = nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].AudioID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].AudioID = this.GetNewResourceID(audioid, responseData);
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].AudioPath = this.GetNewResourcePath(audioid, responseData);
          const iamgeid = nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].ImageID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].ImageID = this.GetNewResourceID(iamgeid, responseData);
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].ImagePath = this.GetNewResourcePath(iamgeid, responseData);
          const promptaudioid = nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PromptAudioID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PromptAudioID = this.GetNewResourceID(promptaudioid, responseData);
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PromptAudioPath = this.GetNewResourcePath(promptaudioid, responseData);
          const tipsaudioid = nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].TipsAudioID;
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].TipsAudioID = this.GetNewResourceID(tipsaudioid, responseData);
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].TipsAudioPath = this.GetNewResourcePath(tipsaudioid, responseData);
          //遍历content
          nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels.forEach((content, index) => {
            //获取原来的content
            //弃用Idx来查找content 这样会因为Idx不一致导致无法复制或者选取  只根据数组的顺序来复制和选取
            var oldcontent = this.GetOldContent(index);//this.GetOldContent(content.Idx);
            if(oldcontent!=null){
                content.ContentID = oldcontent.ContentID;
            content.PaperID = oldcontent.PaperID;
            content.QuestionID = oldcontent.QuestionID;
            const iamgeid = content.ImageID;
            content.ImageID = this.GetNewResourceID(iamgeid, responseData);
            content.ImagePath = this.GetNewResourcePath(iamgeid, responseData);
            const audioid = content.AudioID;
            content.AudioID = this.GetNewResourceID(audioid, responseData);
            content.AudioPath = this.GetNewResourcePath(audioid, responseData);
            const videoid = content.VideoID;
            content.VideoID = this.GetNewResourceID(videoid, responseData);
            content.VideoPath = this.GetNewResourcePath(videoid, responseData);

            //遍历答案 此处复制逻辑已由后端处理 直接取
             content.PaperContentOptionViewModels.forEach(option => {
              if (areatype != 1) {
                 option.OptionID = "";
                //选择题的选项还是用当前试卷的
                //option.OptionID = this.GetOldOptionID(oldcontent, option.Idx);
              } 
              option.ContentID = oldcontent.ContentID;
              const iamgeid = option.ImageID;
              option.ImageID = this.GetNewResourceID(iamgeid, responseData);
              option.ImagePath = this.GetNewResourcePath(iamgeid, responseData);
            });

            content.PaperContentAnswerViewModels.forEach(answer => {
              if (areatype != 1) {//选择题特殊处理 用之前的ID
                answer.AnswerID = "";//answer
                //answer.AnswerID = this.GetOldAnswerID(oldcontent, answer.Idx);
              } 
              answer.ContentID = oldcontent.ContentID;
              const audioid = answer.AudioID;
              answer.AudioID = this.GetNewResourceID(audioid, responseData);
              answer.AudioPath = this.GetNewResourcePath(audioid, responseData);
            });
           
            content.PaperContentRefTextViewModels.forEach(reftext => {
              reftext.RefTextID = "";
              reftext.ContentID = oldcontent.ContentID;
            });
            nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels[index] = content;
            } 
            console.log(nData);
          });
          //如果是选取
          if (type == "2") {
            nData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].TrackQuestionID = this.questionData.PaperQuestion.QuestionID;
          }
          this.changePaperData(this.addIfImageData(nData));
        });
      }
    },
    // 给选择题加上是图片还是文字的字段
    addIfImageData(d) {
      const paperData = deepClone(d);
      paperData.PaperAreaViewModels.forEach((v, i) => {
        v.PaperQuestionViewModels.forEach((sv, si) => {
          if (sv.ImageID) {
            paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
              si
            ].ifImage = true;
          }
          sv.PaperContentViewModels.forEach((ssv, ssi) => {
            if (
              ssv.PaperContentOptionViewModels.length &&
              ssv.PaperContentOptionViewModels[0].ImageID
            ) {
              paperData.PaperAreaViewModels[i].PaperQuestionViewModels[
                si
              ].PaperContentViewModels[ssi].ifImage = true;
            }
          });
        });
      });
      return paperData;
    },
    //通过旧的资源文件ID获取新的资源文件ID
    GetNewResourceID(oldid, list) {
      for (const Resource of list) {
        if (Resource.OriginalResourceID == oldid) {
          return Resource.ResourceID;
        }
      }
      return "";
    },
    GetNewResourcePath(oldid, list) {
      for (const Resource of list) {
        if (Resource.OriginalResourceID == oldid) {
          return Resource.ResourcePath;
        }
      }
      return "";
    },
    GetOldContent(index) {
      const data = deepClone(this.paperData);
      if(index<data.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels.length){
          return data.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels[index];
      }else{
        //返回空的
         return null;
      }
      
      
      /* for (const content of data.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[this.questionIndex].PaperContentViewModels) {
        if (content.Idx == idx) {
          return content;
        }
      } */
    },
    //获取当前试卷的option 仅仅用于选择题
    GetOldOptionID(content, idx) {
      const data = deepClone(content);
      for (const option of data.PaperContentOptionViewModels) {
        if (option.Idx == idx) {
          return option.OptionID;
        }
      }
    },
    //获取当前试卷的answer 仅仅用于选择题
    GetOldAnswerID(content, idx) {
      const data = deepClone(content);
      for (const answer of data.PaperContentAnswerViewModels) {
        if (answer.Idx == idx) {
          return answer.AnswerID;
        }
      }
    },
    getRelatedQuestionIndex() {
      for (let i = 0; i < this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels.length; i++) {
        if (this.paperData.PaperAreaViewModels[this.areaIndex].PaperQuestionViewModels[i].TrackQuestionID === this.questionData.PaperQuestion.QuestionID) {
          return i;
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  background-color: #fff;
  border: solid 1px #e5e5e5;
  //padding-top: 20px;
  width: 100%;
  margin-bottom: 10px;

  .question-title {
    border-bottom: solid 1px #e5e5e5;
    position: relative;
    height: 40px;
    background-color: #f5f8fc;
    .copy {
      cursor: pointer;
      position: absolute;
      //top: -25px;
      right: 45px;
      width: 27px;
      height: 12px;
      //background-color: #2493f8;
      color: #007ef1;
      line-height: 40px;
      text-align: center;
    }
    .select {
      cursor: pointer;
      position: absolute;
      //top: -25px;
      right: 10px;
      width: 27px;
      height: 12px;
      //background-color: #fd9822;
      color: #fb7c00;
      line-height: 40px;
      text-align: center;
    }
    .cancelselect {
      cursor: pointer;
      position: absolute;
      right: 10px;
      width: 50px;
      height: 12px;
      color: #fb7c00;
      line-height: 40px;
      text-align: center;
    }
  }

  .question-content {
    padding: 10px;

    .text {
      font-family: Arial-BoldMT;
      font-size: 16px;
      line-height: 28px;
      color: #333333;
    }
    .option {
      font-family: ArialMT;
      font-size: 14px;
      color: #333333;
      line-height: 28px;
      .option-image {
        width: 200px;
      }
    }

    .reftextDiv {
    }
    .reftext {
      padding: 5px;
      /* width: 325px; */
    }

    .ability {
      margin-top: 5px;

      .ability-title {
        font-size: 12px;
        color: #999999;
      }
      .ability-content {
        font-size: 12px;
        color: #666666;
      }
    }
  }

  &:hover {
    border: solid 1px #2493f8;
  }
}

.questionSelect {
  background-color: #f7f7f7;
  border: solid 1px #e5e5e5;
  //padding-top: 20px;
  margin-bottom: 10px;
  width: 100%;

  .question-title {
    border-bottom: solid 1px #e5e5e5;
    position: relative;
    height: 40px;
    background-color: #f5f8fc;
    .copy {
      cursor: pointer;
      position: absolute;
      right: 45px;
      width: 27px;
      height: 12px;
      color: #007ef1;
      line-height: 40px;
      text-align: center;
    }
    .select {
      cursor: pointer;
      position: absolute;
      right: 10px;
      width: 27px;
      height: 12px;
      color: #fb7c00;
      line-height: 40px;
      text-align: center;
    }
    .cancelselect {
      cursor: pointer;
      position: absolute;
      right: 10px;
      width: 50px;
      height: 12px;
      color: #fb7c00;
      line-height: 40px;
      text-align: center;
    }
  }

  .question-content {
    padding: 10px;

    .text {
      font-family: Arial-BoldMT;
      font-size: 16px;
      line-height: 28px;
      color: #999999;
    }
    .option {
      font-family: ArialMT;
      font-size: 14px;
      color: #999999;
      line-height: 28px;
      .option-image {
        width: 200px;
      }
    }

    .reftextDiv {
      background-color: #f7f7f7;
    }
    .reftext {
      padding: 5px;
      width: 325px;
      background-color: #f7f7f7;
    }

    .ability {
      margin-top: 5px;

      .ability-title {
        font-size: 12px;
        color: #999999;
      }
      .ability-content {
        font-size: 12px;
        color: #666666;
      }
    }
  }

  &:hover {
    border: solid 1px #2493f8;
  }
}
</style>




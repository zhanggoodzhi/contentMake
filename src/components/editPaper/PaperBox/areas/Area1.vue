/* 选择题 */
<template>
  <div class="area-content">
    <div
      v-for="(sv,si) in area.PaperQuestionViewModels"
      :key="sv.QuestionID"
      class="question-wrap"
      :class="{'question-disabled':ifBeChoose(sv)}"
    >
      <p class="font14 prompt">{{sv.Prompt}}</p>
      <InputBox
        :disabled="ifBeChoose(sv)"
        v-if="!getEditPaperValidateError('QuestionRefTextSplit',aIndex,sv.Idx)"
        :error="getEditPaperValidateError('QuestionRefTextAndAudio',aIndex,si)"
        @focus="()=>{selectQuestion(si);editPaperValidateError('QuestionRefTextAndAudio', '', aIndex, si);}"
        class="mt"
        :textarea="true"
        :inputValue="sv.RefText"
        :audioMode="true"
        :audioUrl="getSliceUrl(sv.AudioPath)"
        @delAudio="delAudio(si)"
        :preview="true"
        @uploadAudioSuccess="($event)=>{uploadAudioSuccess(si,$event);editPaperValidateError('QuestionRefTextAndAudio', '', aIndex, si);}"
        placeholder="听力原文"
        @changeInput="changeEditPaperQuestionProp(aIndex,si, 'RefText', $event)"
      >
      </InputBox>
      <div
        v-else
        @click="editPaperValidateError('QuestionRefTextSplit', '', aIndex, sv.Idx);"
        class="color-text-wrap mt"
      >
        <PopWords
          validateName="QuestionRefTextSplit"
          :i="aIndex"
          :si="si"
          :siIdx="sv.Idx"
          :cb="t=>changeEditPaperQuestionProp(aIndex,si, 'RefText', t)"
        ></PopWords>
      </div>
      <InputBox
        :disabled="ifBeChoose(sv)"
        @focus="selectQuestion(si)"
        class="mt"
        :textarea="true"
        :singleSwitch="true"
        :switchType="sv.ifImage?['image']:['text']"
        @changeType="changeQuestionSwitchType(si,$event)"
        :imgUrl="getSliceUrl(sv.ImagePath)"
        @uploadImgSuccess="uploadImgSuccess(si,$event)"
        @delImage="delQuestionImage(si,sv)"
        :inputValue="sv.Text"
        placeholder="题目内容文本"
        @changeInput="changeEditPaperQuestionProp(aIndex,si, 'Text', $event)"
      >
      </InputBox>
      <div
        v-for="(ssv,ssi) in sv.PaperContentViewModels"
        :key="ssv.ContentID"
        class="content-wrap mt"
      >
        <div class="head clearfix">
          <div class="index">{{ssv.Idx}}.</div>
          <div class="content-text">
            <InputBox
              :disabled="ifBeChoose(sv)"
              @focus="selectQuestion(si)"
              class="mt edit-paper-bold"
              :textarea="true"
              :doubleSwitch="true"
              :oneLineTextArea="true"
              :switchType="getContentSwitchType(si,ssi)"
              @changeType="changeContentSwitchType(si,ssi,$event)"
              :inputValue="ssv.Text"
              placeholder="题干内容"
              @changeInput="changeEditPaperContentProp(aIndex,si,ssi, 'Text', $event)"
            >
            </InputBox>
          </div>
        </div>
        <div class="option">
          <RadioGroup
            :class="{'horizon':ssv.Layout==1?true:false}"
            class="custom-radio"
            @on-change="selectOption(si,ssi,ssv,$event)"
            :value="ssv.PaperContentAnswerViewModels.length?ssv.PaperContentAnswerViewModels[0].Content:''"
          >
            <div
              v-for="(sssv,sssi) in ssv.PaperContentOptionViewModels"
              :key="sssv.OptionID"
              class="item-wrap"
              :class="(ssv.Layout==1)?'':'custom-radio-v'"
            >
              <Poptip
                class="area1-poptip"
                trigger="hover"
                word-wrap
                content="勾选为正确选项"
              >
                <Radio
                  :disabled="$route.params.type==='prop'||ifBeChoose(sv)"
                  :label="sssv.OptionID"
                >
                  <span
                    class="abc"
                    :class="{'col-image':ssv.ifImage&&ssv.Layout===2}"
                  >{{getABC(sssi+1)}}.</span>
                </Radio>
              </Poptip>
              <div
                class="option-text-wrap"
                v-if="!ssv.ifImage"
              >
                <InputBox
                  :disabled="ifBeChoose(sv)"
                  :error="getEditPaperValidateError('ContentOptionContentAndImage',aIndex,si,ssi,sssi)||getEditPaperValidateError('PaperContentAnswerViewModelsLength',aIndex,si,ssi)"
                  @focus="()=>{selectQuestion(si);editPaperValidateError('ContentOptionContentAndImage', '',aIndex,si,ssi,sssi);editPaperValidateError('PaperContentAnswerViewModelsLength', '',aIndex,si,ssi)}"
                  :inputValue="sssv.Content"
                  placeholder="选项"
                  @changeInput="changeEditPaperContentOptionProp(aIndex,si,ssi,sssi, 'Content', $event)"
                >
                </InputBox>
              </div>
              <div
                class="option-img-wrap"
                v-if="ssv.ifImage"
              >
                <HoverBox
                  :none="true"
                  :error="getEditPaperValidateError('ContentOptionContentAndImage',aIndex,si,ssi,sssi)||getEditPaperValidateError('PaperContentAnswerViewModelsLength',aIndex,si,ssi)"
                  class="gray-border"
                >
                  <div
                    v-if="!sssv.ImageID"
                    class="edit-paper-option-upload"
                  >
                    <Upload
                      :on-success="(ref)=>{uploadOptionImgSuccess(si,ssi,sssi,ref);editPaperValidateError('ContentOptionContentAndImage', '',aIndex,si,ssi,sssi);editPaperValidateError('PaperContentAnswerViewModelsLength', '',aIndex,si,ssi)}"
                      accept=".jpg,.png,.jpeg"
                      :show-upload-list="false"
                      type="drag"
                      :action="imgAction"
                      :headers="{Authorization:'Bearer ' + getLSUserData().access_token}"
                    >
                      <div class="img-wrap">
                        <img
                          src="/img/template_image.png"
                          alt=""
                        >
                      </div>
                    </Upload>
                  </div>
                  <div
                    v-if="sssv.ImageID"
                    class="img-show-wrap"
                    @click="delOptionImage(si,ssi,sssi,sssv)"
                  >
                    <div class="bg"></div>
                    <div class="del">
                      <i class="font_family icon-template_delete_normal"></i>
                    </div>
                    <div
                      class="image"
                      :style="{'background-image':getBackgroundImgUrl(sssv.ImagePath)}"
                    >
                    </div>
                  </div>
                </HoverBox>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("editPaper");
import PopWords from '@/components/editPaper/PaperBox/PopWords'
import InputBox from '@/components/InputBox'
import HoverBox from "@/components/HoverBox";
import deepClone from 'clone';
export default {
  props: ['aIndex', 'getQuestionBasket'],
  components: {
    InputBox,
    HoverBox,
    PopWords,
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapState(['paperData', 'areaIndex', 'questionIndex', 'error']),
    imgAction() {
      return (
        window.API_URL + "/api/CommonProcess/uploadResource?resourceType=1"
      );
    },
    area() {
      return this.paperData.PaperAreaViewModels[this.aIndex];
    }
  },
  methods: {
    ...mapMutations(['changePaperData', 'changeAreaIndex', 'changeQuestionIndex', 'changeError', 'pushDeleteMedia']),
    selectQuestion(si) {
      this.changeAreaIndex(this.aIndex);
      this.changeQuestionIndex(si);
      //切换试题篮
      this.getQuestionBasket();
    },
    async delAudio(si) {
      this.pushDeleteMedia(this.area.PaperQuestionViewModels[si].AudioID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', '');
    },
    async delQuestionImage(si, sv) {
      this.pushDeleteMedia(sv.ImageID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', '');
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', '');
    },
    delOptionImage(si, ssi, sssi, sssv) {
      this.showRedConfirmModal({
        content: '确定要删除吗？',
        onOk: () => {
          this.pushDeleteMedia(sssv.ImageID);
          this.changeEditPaperContentOptionProp(this.aIndex, si, ssi, sssi, 'ImageID', '');
          this.changeEditPaperContentOptionProp(this.aIndex, si, ssi, sssi, 'ImagePath', '');
        }
      });
    },
    getABC(index) {
      if (index == 1) {
        return 'A';
      }
      if (index == 2) {
        return 'B';
      }
      if (index == 3) {
        return 'C';
      }
      if (index == 4) {
        return 'D';
      }
    },
    uploadAudioSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'AudioPath', ref.ResourcePath);
    },
    uploadImgSuccess(si, ref) {
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImageID', ref.ResourceID);
      this.changeEditPaperQuestionProp(this.aIndex, si, 'ImagePath', ref.ResourcePath);
    },
    uploadOptionImgSuccess(si, ssi, sssi, ref) {
      this.changeEditPaperContentOptionProp(this.aIndex, si, ssi, sssi, 'ImageID', ref.ResourceID);
      this.changeEditPaperContentOptionProp(this.aIndex, si, ssi, sssi, 'ImagePath', ref.ResourcePath);
    },
    changeQuestionSwitchType(si, arr) {
      if (arr[0] === 'text') {
        this.changeEditPaperQuestionProp(this.aIndex, si, 'ifImage', false);
      } else {
        this.changeEditPaperQuestionProp(this.aIndex, si, 'ifImage', true);
      }
    },
    getBackgroundImgUrl(url) {
      return `url(${this.getSliceUrl(url)})`
    },
    selectOption(si, ssi, ssv, value) {
      const selectOption = ssv.PaperContentOptionViewModels.find(v => v.OptionID === value);
      this.editPaperValidateError('PaperContentAnswerViewModelsLength', '',this.aIndex,si,ssi);
      this.changeEditPaperContentProp(this.aIndex, si, ssi, 'PaperContentAnswerViewModels', [{
        ContentID: selectOption.ContentID,
        Content: selectOption.OptionID
      }]);
    },
    getContentSwitchType(si, ssi) {
      let type = [];
      const content = this.area.PaperQuestionViewModels[si].PaperContentViewModels[ssi];
      if (content.ifImage) {
        type.push('image');
      } else {
        type.push('text');
      }
      if (content.Layout == 1) {
        type.push('row');
      } else {
        type.push('col');
      }
      return type;
    },
    changeContentSwitchType(si, ssi, arr) {
      if (arr[0] === 'text') {
        this.changeEditPaperContentProp(this.aIndex, si, ssi, 'ifImage', false);
      } else {
        this.changeEditPaperContentProp(this.aIndex, si, ssi, 'ifImage', true);
      }
      if (arr[1] === 'row') {
        this.changeEditPaperContentProp(this.aIndex, si, ssi, 'Layout', 1);
      } else {
        this.changeEditPaperContentProp(this.aIndex, si, ssi, 'Layout', 2);
      }
    },
    ifBeChoose(sv) {
      return !!sv.TrackQuestionID
    }
  }
}
</script>

<style lang="less" scoped>
.color-text-wrap {
  font-size: 14px;
  min-height: 48px;
  max-height: 120px;
  overflow-y: auto;
  padding: 6px 30px 6px 10px;
  border: 1px dashed #ff1d1c;
  background: white;
}
.color-span.red {
  color: #ff1d1c;
}
.area-content {
  padding: 16px;
  background: #f7f7f7;
  .question-wrap {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
    .mt {
      margin-top: 15px;
      &:first-child {
        margin-top: 0;
      }
    }
    .content-wrap {
      background: white;
      padding: 16px 12px;
      .head {
        .index {
          color: #333333;
          font-weight: bold;
          font-size: 18px;
          float: left;
          width: 27px;
        }
        .content-text {
          float: left;
          width: 679px;
        }
      }
      .option {
        margin-top: 12px;
        padding-left: 28px;
        .custom-radio {
          .item-wrap-v {
            width: 100%;
          }

          .item-wrap {
            margin-bottom: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
          .abc {
            position: absolute;
            top: -1px;
            font-size: 16px;
            display: inline-block;
            width: 15px;
            vertical-align: middle;
            &.col-image {
              vertical-align: top;
            }
          }
          .option-text-wrap {
            margin-left: 20px;
            width: 178px;
            display: inline-block;
            vertical-align: middle;
          }

          .option-text-wrap-v {
            width: 660px;
          }
          .option-text-wrap-h {
            width: 178px;
          }
          .option-img-wrap {
            width: 132px;
            height: 110px;
            vertical-align: top;
            display: inline-block;
            .edit-paper-option-upload {
              .img-wrap {
                text-align: center;
                img {
                  width: 30px;
                  height: 20px;
                }
              }
            }
            .img-show-wrap {
              width: 130px;
              height: 108px;
              text-align: center;
              position: relative;
              cursor: pointer;
              &.disabled {
                cursor: initial;
                .bg {
                  display: none !important;
                }
                .del {
                  display: none !important;
                }
              }
              &:hover {
                .bg {
                  display: block;
                }
                .del {
                  display: block;
                }
              }
              .del {
                display: none;
                color: white;
                position: absolute;
                width: 28px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background: #e6413a;
                border-radius: 50%;
                i {
                  font-size: 13px;
                }
              }
              .bg {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                display: none;
              }
              .image {
                width: 100%;
                height: 100%;
                background-size: cover;
                margin-bottom: -5px;
              }
            }
          }
          &.horizon {
            .item-wrap {
              float: left;
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
<style  lang="less">
.custom-radio {
  .ivu-radio-wrapper:last-child {
    margin-right: 0;
  }
}
.edit-paper-option-upload {
  .ivu-upload-drag {
    border: 0 !important;
    padding: 42px 52px;
  }
}
.edit-paper-bold {
  textarea {
    font-weight: bold;
  }
}
.area1-poptip {
  .ivu-poptip-popper {
    min-width: 0;
  }
}
</style>
<style lang="less">
.custom-radio-v {
  .option-text-wrap {
    width: 638px !important;
  }
  .input-box {
    width: 100%;
  }
}
</style>



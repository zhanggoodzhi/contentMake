<template>
  <div class="aside">
    <div class="title-wrap">
      <div class="rect vm">
      </div>
      <span class="title vm">模板结构</span>
      <span
        v-if="$route.params.type!=='prop'&&$route.params.type!=='preview'&&$route.params.type!=='lock'"
        class="yellow vm"
      >（可拖拽排序）</span>
    </div>
    <div
      class="scroll-bar"
      v-bar
    >
      <div
        class="content"
        ref="content"
        @dragstart="hidePopover"
      >
        <div class="content-center">
          <div
            class="page-item cannotoperate clearfix"
            :class="{'active':option.pageIndex==-1,'error':ifFirstError()}"
          >
            <div class="index-wrap">
              <span>1</span>
            </div>
            <div class="box-wrap">
              <div
                v-show="addWrapIndex==-1"
                class="add-wrap"
              >
                <div class="add-inner">
                  <div class="triangle"></div>
                  <p
                    class="item"
                    @click="addBlank(-1)"
                  >
                    <span class="add-icon">+</span>
                    <span class="vm">空白页</span>
                  </p>
                  <p
                    class="item"
                    @click="addArea(-1)"
                  >
                    <span class="add-icon">+</span>
                    <span class="vm">题型页</span>
                  </p>
                </div>
              </div>
              <div
                v-if="$route.params.type!=='prop'&&$route.params.type!=='preview'&&$route.params.type!=='lock'"
                class="add-btn template-aside-add-btn"
                @click="addWrapIndex==-1?addWrapIndex=null:addWrapIndex=-1"
              >
                <img
                  src="/img/template_add.png"
                  alt=""
                >
              </div>
              <div
                class="box"
                @click="changeIndex(-1)"
              >
                <div class="box-inner">
                  <span>考前须知</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <draggable
          class="content-center pb"
          v-model="dragList"
          :move="moveEvent"
          :options="{filter:'.cannotmove',direction:'vertical'}"
          @end="end"
        >
          <transition-group>
            <div
              v-for="(v,i) in dragList"
              :key="v.Index"
              class="page-item clearfix"
              :ref="'btn'+i"
              :class="{'active':option.pageIndex==i,'error':ifAreaError(i),'cannotmove':(v.SmallIndex!==0&&v.SmallIndex!==1)||$route.params.type==='prop'||$route.params.type==='preview'||$route.params.type==='lock'}"
            >
              <div class="index-wrap">
                <span>{{i+2}}</span>
              </div>
              <div class="box-wrap">
                <div
                  v-show="addWrapIndex==i"
                  class="add-wrap"
                >
                  <div class="add-inner">
                    <div class="triangle"></div>
                    <p
                      class="item"
                      @click="addBlank(i)"
                    >
                      <span class="add-icon">+</span>
                      <span class="vm">空白页</span>
                    </p>
                    <p
                      class="item"
                      @click="addArea(i)"
                    >
                      <span class="add-icon">+</span>
                      <span class="vm">题型页</span>
                    </p>
                  </div>
                </div>
                <div
                  v-if="ifShowAddWrap(i)"
                  class="add-btn template-aside-add-btn"
                  @click="clickAdd(i)"
                >
                  <img
                    src="/img/template_add.png"
                    alt=""
                  >
                </div>
                <div
                  class="box"
                  @click="changeIndex(i)"
                >
                  <div class="box-inner">
                    <span :title="option.templateData.TemplateAreaViewModels[currentPageIndex(i)].AreaTitle">{{getPageName(option.templateData.TemplateAreaViewModels[currentPageIndex(i)].AreaTitle,currentPageIndex(i))}}{{getSmallIndex(i)}}</span>
                  </div>
                </div>
              </div>
              <img
                v-if="$route.params.type!=='prop'&&$route.params.type!=='preview'&&$route.params.type!=='lock'"
                @click="del(i)"
                class="del-icon"
                src="/img/template_close_hover2.png"
                alt=""
              >
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import deepClone from 'clone';
import { bus, rankListenQuestion } from "@/plugins/bus";
export default {
  props: ['option', 'changeOption'],
  components: {
    draggable,
  },
  created() {
    document.querySelector('body').addEventListener('click', this.setAddArapIndexNull);
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('click', this.setAddArapIndexNull);
  },
  data() {
    return {
      addWrapIndex: null,
      ifDragSmallIndex: false,
      dragData: null,
      moveArr: []
    }
  },
  computed: {
    dragList: {
      get() {
        return this.option.templateData.TemplateAreaViewModels;
      },
      set(value) {
        const newData = deepClone(this.option);
        newData.templateData.TemplateAreaViewModels = value;
        this.changeOption(newData);
      }
    },
  },
  methods: {
    setAddArapIndexNull(e) {
      if (e.target.closest('.template-aside-add-btn')) {
        return;
      }
      this.addWrapIndex = null;
    },
    // 如果换页了，area里的属性只用smallIndex=1里面的。
    currentPageIndex(pageIndex) {
      const area = this.option.templateData.TemplateAreaViewModels[pageIndex];
      if (area.SmallIndex > 1) {
        for (let i = 1; ; i++) {
          if (pageIndex - i < 0) {
            return 0;
          }
          if (this.option.templateData.TemplateAreaViewModels[pageIndex - i].SmallIndex == 1) {
            return pageIndex - i;
          }
        }
      }
      return pageIndex;
    },
    ifFirstError() {
      for (let i = 0; i < this.option.error.length; i++) {
        if (this.option.error[i].pageIndex === -1) {
          return true;
        }
      }
      return false;
    },
    ifAreaError(pageIndex) {
      for (let i = 0; i < this.option.error.length; i++) {
        if (this.option.error[i].pageIndex === pageIndex) {
          return true;
        }
      }
      return false;
    },
    ifShowAddWrap(originIndex) {
      if (this.$route.params.type !== 'prop' && this.$route.params.type !== 'preview' && this.$route.params.type !== 'lock') {
        const areaArr = this.option.templateData.TemplateAreaViewModels;
        if (areaArr[originIndex].SmallIndex === 0) {
          return true;
        }
        if (!areaArr[originIndex + 1] || areaArr[originIndex + 1].SmallIndex == 0 || areaArr[originIndex + 1].SmallIndex == 1) {
          return true;
        }
      }
      return false;
    },
    end(e) {
      this.showPopover();
      if (!this.ifDragSmallIndex) {
        this.$nextTick(() => {
          bus.$emit(rankListenQuestion);
        });
        return;
      }
      const newData = deepClone(this.option);
      const dragData = this.dragData;
      const areaArr = newData.templateData.TemplateAreaViewModels;
      const moveArr = this.moveArr;
      // 拖动第一个分页，后面的分页跟着动
      // console.log('开始', newData.templateData.TemplateAreaViewModels.map(v => v.AreaTitle + v.SmallIndex),'移动数组',moveArr.map(v => v.AreaTitle + v.SmallIndex));
      for (let i = 0; i < areaArr.length; i++) {
        let v = areaArr[i];
        if (moveArr.find(sv => sv.Index == v.Index)) {
          newData.templateData.TemplateAreaViewModels.splice(i, moveArr.length);
          break;
        }
      }
      // console.log('第一步', newData.templateData.TemplateAreaViewModels.map(v => v.AreaTitle + v.SmallIndex));
      for (let i = 0; i < areaArr.length; i++) {
        let v = areaArr[i];
        if (dragData.Index == v.Index) {
          newData.templateData.TemplateAreaViewModels.splice(i + 1, 0, ...moveArr);
          break;
        }
      }
      // console.log('最后', newData.templateData.TemplateAreaViewModels.map(v => v.AreaTitle + v.SmallIndex));
      this.changeOption(newData);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    moveEvent(e) {
      const originIndex = e.draggedContext.index;
      const futureIndex = e.draggedContext.futureIndex;
      const relatedIndex = e.relatedContext.index;
      const dragData = e.draggedContext.element;
      const relatedData = e.relatedContext.element;
      const direction = this.getDirection(originIndex, futureIndex, relatedIndex, e);
      if (!direction) {
        return false;
      }
      // console.log('移动', originIndex, futureIndex, relatedIndex, dragData.SmallIndex, relatedData.SmallIndex);
      const relatedSmallIndex = relatedData.SmallIndex;
      const dragSmallIndex = dragData.SmallIndex;

      if (dragSmallIndex !== 1 && dragSmallIndex !== 0) {// 除了第一个分页不给拖动
        return false;
      } else {
        if (relatedSmallIndex !== 0) {
          //向上滑且是第一个分页
          if (direction === 'top' && relatedSmallIndex === 1) {
          } else if (direction === 'bottom' && this.ifLastSmallIndex(relatedIndex, relatedData)) {//向下滑且是最后一个分页
          } else {
            return false;
          }
        }
        if (dragSmallIndex == 1) {// 拖动分页第一个节点
          this.ifDragSmallIndex = true;
          this.dragData = dragData;
          const newData = deepClone(this.option);
          const areaArr = newData.templateData.TemplateAreaViewModels;
          const moveArr = [];
          for (let i = 1; ; i++) {
            if (!areaArr[originIndex + i] || areaArr[originIndex + i].SmallIndex == 0 || areaArr[originIndex + i].SmallIndex == 1) {
              break;
            }
            moveArr.push(areaArr[originIndex + i]);
          }
          this.moveArr = moveArr;
          return;
        }
      }
      this.ifDragSmallIndex = false;
    },
    ifLastSmallIndex(relatedIndex, relatedData) {
      const SmallIndex = relatedData.SmallIndex;
      if (!this.option.templateData.TemplateAreaViewModels[relatedIndex + 1]) {
        // console.log('最后一个节点');
        return true;
      }
      if (this.option.templateData.TemplateAreaViewModels[relatedIndex + 1].SmallIndex === 0 || this.option.templateData.TemplateAreaViewModels[relatedIndex + 1].SmallIndex === 1) {
        // console.log('最后一个分页');
        return true;
      }
      return false;
    },
    getDirection(originIndex, futureIndex, relatedIndex, e) {
      if (relatedIndex === undefined) {
        console.log('无相关index', originIndex, futureIndex, relatedIndex, e);
        return false;
      }
      if (futureIndex == relatedIndex) {//正常拖动
        if (originIndex > futureIndex) {
          console.log('向上');
          return 'top';
        } else if (originIndex < futureIndex) {
          console.log('向下');
          return 'bottom';
        }
      } else {//相对起点反向拖动
        if (futureIndex > relatedIndex) {
          console.log('向下');
          return 'bottom'
        } else if (futureIndex < relatedIndex) {
          console.log('向上');
          return 'top'
        }
      }
      return false;
      console.log('方向判断异常', originIndex, futureIndex, relatedIndex);
    },
    getSmallIndex(i) {
      const SmallIndex = this.option.templateData.TemplateAreaViewModels[i].SmallIndex;
      if (SmallIndex) {
        return `(${SmallIndex})`;
      }
      return '';
    },
    renderPageName(i) {
      const area = this.option.templateData.TemplateAreaViewModels[i];
      const questions = area.TemplateQuestionViewModels;
      if (!questions) {
        return '空白页'
      }
      if (!questions.length) {
        return '题型页'
      }
      return this.formatAreaType(area.AreaType)
    },
    hidePopover() {
      this.$refs.content.classList.add('no-popover');
      this.addWrapIndex = null;
    },
    showPopover() {
      this.$refs.content.classList.remove('no-popover');
      // console.log('显示');
    },
    changeIndex(index) {
      console.log('点击',index);
      const newData = deepClone(this.option);
      newData.pageIndex = index;
      // 具体题型页，默认选中第一页
      if (index !== -1 && this.option.templateData.TemplateAreaViewModels[index].TemplateQuestionViewModels && this.option.templateData.TemplateAreaViewModels[index].TemplateQuestionViewModels.length) {
        newData.questionIndex = 0;
      } else {
        newData.questionIndex = -1;
      }
      this.changeOption(newData);
    },
    addBlank(index) {
      const newData = deepClone(this.option);
      newData.templateData.TemplateAreaViewModels.splice(index + 1, 0, {
        "AreaID": "",
        "TemplateID": this.option.templateId,
        "AreaType": -1,
        "AreaTypeDesc": "",
        "TotalQuestionCount": 0,
        "AreaTitle": "",
        "AreaPrompt": "",
        Index: new Date().toString() + Math.random(),
        "Idx": 0,
        SmallIndex: 0,
        "SectionType": 0,
        "DisplaySeconds": 5,
        "TitleBackgroundAudioID": "",
        "TitleBackgroundAudioPath": "",
        'TitleBackgroundAudioTotalSeconds': 0,
        "PromptBackgroundAudioID": "",
        "PromptBackgroundAudioPath": "",
        'PromptBackgroundAudioTotalSeconds': 0,
        IsAreaTitleShow: true,
        IsAreaPromptShow: true,
        "AudioPlayTimes": 1,
        "BackgroundImageID": "",
        "BackgroundImagePath": "",
        "TotalScore": 0,
        "TemplateQuestionViewModels": null
      });
      newData.pageIndex = index + 1;
      this.changeOption(newData);
    },
    getPageName(name, i) {
      if (
        !this.option.templateData.TemplateAreaViewModels[i]
          .TemplateQuestionViewModels
      ) {
        return '空白页'
      }
      if (!this.option.templateData.TemplateAreaViewModels[i]
        .TemplateQuestionViewModels.length && !name) {
        return '题型页'
      }
      if (name.length > 24) {
        return name.slice(0, 24) + '...';
      }
      return name;
    },
    addArea(index) {
      const newData = deepClone(this.option);
      newData.templateData.TemplateAreaViewModels.splice(index + 1, 0, {
        "AreaID": "",
        "TemplateID": this.option.templateId,
        "AreaType": -1,
        "AreaTypeDesc": "",
        "TotalQuestionCount": 0,
        "AreaTitle": "",
        "AreaPrompt": "",
        Index: new Date().toString() + Math.random(),
        "Idx": 0,
        SmallIndex: 0,
        "SectionType": 0,
        "DisplaySeconds": 0,
        "TitleBackgroundAudioID": "",
        "TitleBackgroundAudioPath": "",
        'TitleBackgroundAudioTotalSeconds': 0,
        "PromptBackgroundAudioID": "",
        "PromptBackgroundAudioPath": "",
        'PromptBackgroundAudioTotalSeconds': 0,
        IsAreaTitleShow: true,
        IsAreaPromptShow: true,
        "AudioPlayTimes": 1,
        "BackgroundImageID": "",
        "BackgroundImagePath": "",
        "TotalScore": 0,
        "TemplateQuestionViewModels": []
      });
      newData.pageIndex = index + 1;
      this.changeOption(newData);
    },
    clickAdd(i) {
      if (this.addWrapIndex == i) {
        this.addWrapIndex = null;
      } else {
        this.addWrapIndex = i;
      }
      const dom = this.$refs['btn' + i][0];
      console.log(dom.offsetTop, this.$refs.content.scrollTop);
      const asideHeight = window.innerHeight - 279;
      const triggerTop = asideHeight - 180;
      console.log('asideHeight', asideHeight, 'triggerTop', triggerTop);
      if (dom.offsetTop - this.$refs.content.scrollTop > triggerTop) {
        console.log('生效');
        this.$refs.content.scrollTop = dom.offsetTop - triggerTop;
      }

    },
    delTwoArea(index) {
      const newData = deepClone(this.option);
      if (newData.templateData.TemplateAreaViewModels[index].SmallIndex == 1) {
        newData.templateData.TemplateAreaViewModels.splice(index, 2);
        if (index < newData.pageIndex) {
          newData.pageIndex = newData.pageIndex - 2;
        } else if (index == newData.pageIndex) {
          newData.pageIndex = newData.pageIndex - 1;
        }
      } else {
        newData.templateData.TemplateAreaViewModels.splice(index - 1, 2);
        if (index < newData.pageIndex) {
          newData.pageIndex = newData.pageIndex - 2;
        } else if (index == newData.pageIndex) {
          newData.pageIndex = newData.pageIndex - 2;
        } else if (index = newData.pageIndex + 1) {// 聚焦1，点击2
          newData.pageIndex = newData.pageIndex - 1;
        }
      }
      this.changeOption(newData);
      this.$nextTick(() => {
        bus.$emit(rankListenQuestion);
      });
    },
    ifDelSplitAreaOne(index) {
      const newData = deepClone(this.option);
      const areaArr = newData.templateData.TemplateAreaViewModels;
      if (areaArr[index].SmallIndex !== 1) {
        return false;
      }
      if (!areaArr[index + 2]) {
        return true;
      }
      if (areaArr[index + 2].SmallIndex < 2) {
        return true;
      }
      return false;
    },
    ifDelSplitAreaTwo(index) {
      const newData = deepClone(this.option);
      const areaArr = newData.templateData.TemplateAreaViewModels;
      if (areaArr[index].SmallIndex !== 2) {
        return false;
      }
      if (!areaArr[index + 1]) {
        return true;
      }
      if (areaArr[index + 1].SmallIndex !== 3) {
        return true;
      }
      return false;
    },
    del(index) {
      this.showRedConfirmModal({
        okText: "删除",
        content: '确定要删除吗？',//
        onOk: () => {
          const newData = deepClone(this.option);
          const areaArr = newData.templateData.TemplateAreaViewModels;
          if (this.ifComplexArea(areaArr[index].AreaType)) {// 复杂题型
            this.delTwoArea(index);
            return;
          }
          if (index <= newData.pageIndex) {
            newData.pageIndex = newData.pageIndex - 1;
          }
          if (areaArr[index].SmallIndex > 0) {
            if (this.ifDelSplitAreaOne(index)) {
              newData.templateData.TemplateAreaViewModels[index + 1].SmallIndex = 0;
            } else if (this.ifDelSplitAreaTwo(index)) {
              newData.templateData.TemplateAreaViewModels[index - 1].SmallIndex = 0;
            } else {
              for (let i = 1; ; i++) {
                if (!areaArr[index + i] || areaArr[index + i].SmallIndex == 0 || areaArr[index + i].SmallIndex == 1) {
                  break;
                }
                newData.templateData.TemplateAreaViewModels[index + i].SmallIndex = areaArr[index + i].SmallIndex - 1;
              }
            }
          }
          newData.templateData.TemplateAreaViewModels.splice(index, 1);
          newData.questionIndex = -1;
          this.$nextTick(() => {
            bus.$emit(rankListenQuestion);
          });
          this.changeOption(newData);
        }
      });
      // this.$Modal.confirm({
      //   content: "确定要删除吗?",
      //   okText: "删除",
      //   onOk: () => {
      //     const newData = deepClone(this.option);
      //     const areaArr = newData.templateData.TemplateAreaViewModels;
      //     if (areaArr[index].AreaType == 25) {// 复杂题型
      //       this.delTwoArea(index);
      //       return;
      //     }
      //     if (index <= newData.pageIndex) {
      //       newData.pageIndex = newData.pageIndex - 1;
      //     }
      //     if (areaArr[index].SmallIndex > 0) {
      //       if (this.ifDelSplitAreaOne(index)) {
      //         newData.templateData.TemplateAreaViewModels[index + 1].SmallIndex = 0;
      //       } else if (this.ifDelSplitAreaTwo(index)) {
      //         newData.templateData.TemplateAreaViewModels[index - 1].SmallIndex = 0;
      //       } else {
      //         for (let i = 1; ; i++) {
      //           if (!areaArr[index + i] || areaArr[index + i].SmallIndex == 0 || areaArr[index + i].SmallIndex == 1) {
      //             break;
      //           }
      //           newData.templateData.TemplateAreaViewModels[index + i].SmallIndex = areaArr[index + i].SmallIndex - 1;
      //         }
      //       }
      //     }
      //     newData.templateData.TemplateAreaViewModels.splice(index, 1);
      //     newData.questionIndex = -1;
      //     this.changeOption(newData);
      //   }
      // });
    }
  }
}
</script>

<style lang="less" scoped>
.aside {
  height: 100%;
  width: 159px;
  border: solid 1px #e5e5e5;
  float: left;
  .title-wrap {
    padding: 9px 0;
    background-color: #f5f5f5;
    .rect {
      display: inline-block;
      width: 3px;
      height: 14px;
      background-color: #2493f8;
    }
    .title {
      font-size: 14px;
      color: #333333;
      font-weight: bold;
      margin-left: 8px;
    }
  }
  .scroll-bar {
    height: calc(100% - 39px);
    background: white;
    text-align: center;
  }
  .content {
    &.no-popover {
      .add-btn {
        display: none !important;
      }
      .add-wrap {
        display: none !important;
      }
    }
    .content-center {
      display: inline-block;
      padding-right: 10px;
      &.pb {
        padding-bottom: 90px;
      }
      .page-item {
        cursor: move;
        position: relative;
        margin-top: 16px;
        &.error {
          .index-wrap {
            color: #ff0300;
          }
          .box-wrap {
            border-color: #ff0300;
            .box {
              border-color: #ff0300;
            }
          }
        }
        &.cannotoperate,
        &.cannotmove {
          cursor: initial;
        }
        &.cannotoperate:hover {
          .del-icon {
            display: none;
          }
        }
        &:hover {
          .index-wrap {
            color: #2493f8;
          }
          .box-wrap {
            border: solid 1px #2493f8;
            .box {
              border: solid 1px #2493f8;
            }
          }
          // .add-wrap {
          //   display: block;
          // }
          .add-btn {
            display: block;
          }
          .del-icon {
            display: block;
          }
        }
        &.active {
          .index-wrap {
            color: #2493f8;
          }
          .box-wrap {
            border: solid 1px #2493f8;
            .box {
              border: solid 1px #2493f8;
            }
          }
        }
        .add-wrap {
          z-index: 999;
          // display: none;
          width: 86px;
          position: absolute;
          top: 80px;
          left: 50%;
          padding: 10px 0;
          transform: translateX(-50%);
          text-align: center;
          .add-inner {
            background: white;
            padding: 5px 10px;
            border: solid 1px #cccccc;
          }
          .triangle {
            position: absolute;
            border-color: transparent;
            border-width: 0 7px 7px;
            top: 3px;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: #cccccc;
            border-style: solid;
            &::after {
              border-width: 7px;
              top: 1px;
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              border-style: solid;
              border-color: transparent;
              content: " ";
              border-top-width: 0;
              border-bottom-width: 7px;
              border-bottom-color: #fff;
            }
          }
          .item {
            cursor: pointer;
            transition: all 0.2s;
            &:hover {
              color: #2493f8;
            }
            .add-icon {
              margin-right: 3px;
              font-size: 20px;
              vertical-align: -3px;
              font-weight: bold;
            }
          }
        }
        .index-wrap {
          width: 15px;
          float: left;
          padding-right: 3px;
        }
        .box-wrap {
          border: 1px solid transparent;
          float: left;
          position: relative;
          .box {
            background-color: #f5f7fa;
            border: solid 1px #e4eaf2;
            width: 110px;
            height: 73px;
            .box-inner {
              position: absolute;
              width: 110px;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              padding: 0 5px;
              text-align: center;
            }
          }
        }
        .del-icon {
          width: 17px;
          height: 17px;
          cursor: pointer;
          transition: all 0.2s;
          position: absolute;
          right: -8px;
          top: -8px;
          display: none;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .yellow {
    color: #ff8a00;
  }
}
.add-btn {
  padding: 10px;
  position: absolute;
  bottom: -21px;
  z-index: 2;
  left: 27px;
  display: none;
  cursor: pointer;
}
.area-error {
}
</style>
<style lang="less">
// .no-popover {
//   .edit-template-aside-add-popover {
//     display: none;
//   }
// }
// .edit-template-aside-add-popover {
//   .ivu-poptip-body {
//     padding: 8px 0;
//   }
//   &.ivu-poptip-popper {
//     min-width: 0 !important;
//   }
//   .ivu-poptip-arrow {
//     border-bottom-color: #cccccc !important;
//   }
//   .ivu-poptip-inner {
//     border: solid 1px #cccccc;
//     box-shadow: none;
//   }
// }
</style>



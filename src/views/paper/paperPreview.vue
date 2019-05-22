<template>

  <div class="main">
    <Modal
      class="unique-modal"
      title="查看原文"
      v-model="showModel"
    >

      <!-- <p v-html="previewReftext">{{this.previewReftext}}</p> -->
      <p v-html="previewReftext"></p>
    </Modal>

    <div class="header">
      <div class="logo">
        <img src="/img/logo.png" />
        <div>试卷预览</div>
      </div>
      <span class="title">{{paperData.PaperName}}</span>

    </div>

    <div
      class="content"
      v-if="showLoading"
    >
      <Spin fix></Spin>
    </div>
    <div
      class="content"
      v-else
    >
      <div class="first-line top-10 clearfix">
        <span class="left-des">标签：<span class="des-content">{{paperLabel}}</span></span>
        <div class="right">
          <span class="right-des">总分：<span class="des-content">{{paperData.TotalScore}}</span></span>
        </div>
      </div>
      <div class="first-line">
        <span class="left-des">教材：</span> <span class="des-content">{{renderMaterial(paperData.MaterialID)}}</span>
        <div class="right">
          <span class="right-des">考试时长：</span> <span class="des-content">约{{paperData.TotalExamTime}}分钟</span>
        </div>
      </div>
      <div v-for="paperArea in paperData.PaperAreaViewModels">
        <component
          @showAllArticle="showAllArticle"
          class="area-item"
          :is="getAreaComponent(paperArea.AreaType)"
          :paperArea="paperArea"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const globalVuex = createNamespacedHelpers("global");
import { GetPaper } from "@/plugins/service";
import AreaPreviewCollapse from "@/components/PaperPreviewComponents/areaPreviewCollapse";
import * as AreaComponent from "@/components/PaperPreviewComponents/paperPreviewAreas";
const areaObj = {};
Object.keys(AreaComponent).forEach(v => {
  areaObj[v] = AreaComponent[v];
});
export default {
  created() {
    GetPaper(this.$route.params.paperId).then(data => {
      this.showLoading = false;
      if (data.ResponseCode != 0) return;
      this.paperData = data.ResponseData;
    });
  },
  mounted() {
    document
      .querySelector("body")
      .style.setProperty("padding-left", 0, "important");
  },
  computed: {
    ...globalVuex.mapState(["MaterialTree", "GradeList", "PaperTypeList"]),
    renderCity() {
      if (this.paperData.CityVMs) {
        return this.paperData.CityVMs.map(v => v.CityName).join("/");
      }
      return "无";
    },
    paperType() {
      if (
        this.PaperTypeList &&
        this.PaperTypeList.find(
          v => v.PaperTypeID === this.paperData.PaperTypeID
        )
      ) {
        return this.PaperTypeList.find(
          v => v.PaperTypeID === this.paperData.PaperTypeID
        ).PaperTypeName;
      }
      return "";
    },
    grade() {
      if (
        this.GradeList &&
        this.GradeList.find(v => v.GradeID === this.paperData.GradeID)
      ) {
        return this.GradeList.find(v => v.GradeID === this.paperData.GradeID)
          .GradeName;
      }
      return "";
    },
    paperLabel() {
      if (!this.PaperTypeList || !this.GradeList) {
        return "";
      }
      const year = this.paperData.Year;
      const city = this.renderCity;
      const arr = [];
      if (year) {
        arr.push(year);
      }
      if (city && city !== "无") {
        arr.push(city);
      }
      if (this.paperType) {
        arr.push(this.paperType);
      }
      if (this.grade) {
        arr.push(this.grade);
      }
      return arr.join("、");
    }
  },
  components: {
    AreaPreviewCollapse,
    ...areaObj
  },
  data() {
    return {
      previewReftext: "",
      showModel: false,
      showLoading: true,
      paperData: {}
    };
  },
  methods: {
    getAreaComponent(type) {
      return "Area" + type;
    },
    showAllArticle(question) {
      this.showModel = true;
      this.previewReftext = this.replaceBr(question.RefText);
    },
    replaceBr(text) {
      return text.replace(/\n/g, "<Br/>");
    },
    renderMaterial(id) {
      if (!this.MaterialTree) {
        return "";
      }
      let nodeArr = [];
      let formatStr;
      try {
        const searchChild = arr => {
          for (const v of arr) {
            if (v.children.length) {
              nodeArr.push(v);
              searchChild(v.children);
              nodeArr.splice(nodeArr.findIndex(sv => sv.id === v.id), 1);
            } else {
              if (v.id === id) {
                nodeArr.push(v);
                throw "GOT IT!";
              }
            }
          }
        };
        searchChild(this.MaterialTree);
      } catch (err) {
        formatStr = nodeArr.map(v => v.title).join(">");
      }
      return formatStr;
    }
  }
};
</script>
<style lang="less">
.unique-modal {
  .ivu-modal-close{
    top: 4px!important;
  }
  .ivu-modal-header{
    background: #f3f3f3;
    border-radius: 5px 5px 0 0;
    padding: 10px 16px!important;
  }
  .ivu-modal-footer {
    display: none;
  }
}
</style>
>
<style lang="less" scoped>
.header {
  position: relative;
  background-image: url("/img/bg_sjyl.png");
  background-size: 100% 168px;
  height: 168px;
  width: 100%;
  z-index: 0;
  text-align: center;
  .title {
    display: inline-block;
    color: white;
    font-size: 28px;
    margin: 31px auto;
  }
  .logo {
    position: absolute;
    display: inline-block;
    width: 96px;
    height: 28px;
    background-color: #ff8921;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    left: 100px;
    top: 3px;
    img {
      height: 16px;
      width: 16px;
      margin-top: 6px;
      margin-right: 5px;
    }
    div {
      display: inline-block;
      color: white;
      font-size: 14px;
      height: 28px;
      vertical-align: middle;
    }
  }
}
.content {
  position: relative;
  min-height: 500px;
  padding: 10px 21px;
  margin: -76px auto;
  width: 1000px;
  // height: 1000px;
  background-color: white;
  border: solid 1px #e5e5e5;
  border-radius: 6px;
  z-index: 10;
  .top-10{
    margin-top: 10px;
  }
  .first-line {
    font-size: 12px;
    padding-top: 0;
    .left-des {
      color: #999999;
      font-size: 14px;
    }
    .des-content {
      color: #666666;
      font-size: 14px;
    }
    .right {
      float: right;
      .right-des {
        color: #999999;
        font-size: 14px;
      }
    }
  }
  .area-item {
    margin-top: 20px;
  }
}
</style>



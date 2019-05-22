<template>
  <div class="body-item">
    <div class="head">
      <img
        class="left-icon vm"
        src="/img/label1.png"
        alt
      >
      <div class="head-item">
        <span class="bold font16 vm">{{itemData.TemlateName}}</span>
        <div class="margin-right-4">
          <i class="vm font-icon font_family icon-template_list_zf"></i>
          <span class="vm">总分：</span>
          <span class="bold font14 vm">{{itemData.TotoalScore}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div>
        <div class="template-content">
          <div class="template-describte">
            <span class="gray font14 vm">{{itemData.TemlateDescribte}}</span>
          </div>
          <ul class="area-item">
            <li
              class="font14 vm span-text template-item"
              v-for="(item,i) in itemData.TemplateItems"
              :key="i"
            >
              <span class="bold font12 margin-right-2">{{item.AreaTitle}}</span>
              <span class="font12"> {{item.AreaDescribte}}</span>
            </li>
          </ul>
        </div>
        <div class="button-content">
          <Button
            class="button-preview"
            @click="previewTemplate(itemData.TemplateID)"
          >预览</Button>
          <Button
            @click="useTemplate(itemData.TemplateID)"
            type="primary"
          >使用此模板</Button>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() { },
  computed: {},
  methods: {
    previewTemplate(templateID) {
      // this.$router.push({
      //   name: "templatePreview",
      //   params: {
      //     id: templateID,
      //     type: "preview"
      //   }
      // });
     const routerData = this.$router.resolve({
        name: "templatePreview",
        params: {
          id: templateID,
          type: "preview"
        }
      });
      window.open(routerData.href, "_blank");


    },
    useTemplate(templateID) {
      this.$router.push({
        name: "editPaper",
        params: {
          templateId: templateID
        }
      });
    }
  },
  props: ["itemData"]
};
</script>

<style lang="less" scoped>
.body-item {
  border: solid 1px #e5e5e5;
  border-radius: 6px;
  background-color: #ffffff;
  margin-left: 24px;
  margin-top: 20px;
  transition: all 0.5s;
  &:hover {
    border: solid 1px #9bcaf4;
  }
  .head {
    position: relative;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    background-color: #f6f6f6;
    padding: 10px;
    .left-icon {
      width: 22px;
      height: 25px;
      position: absolute;
      transform: translateY(-43%);
      top: 50%;
      left: -4px;
    }
    .option-icon {
      margin-right: 3px;
      width: 12px;
      height: 12px;
    }
  }
  .content {
    position: relative;
    padding: 16px 28px 30px 28px;
  }
}
.head-item {
  padding-left: 17px;
  padding-right: 10px;
}
.gray {
  color: #999999;
}
.margin-right-2 {
  margin-right: 2px;
}
.margin-right-4 {
  float: right;
  line-height: 21px;
  padding-right: 4px;
  .font-icon {
    font-size: 14px;
    color: #a3a3a3;
    margin-right: 10px;
  }
}
.template-content {
  float: left;
}
.button-content {
  right: 20px;
  position: absolute;
  bottom: 10px;
  // float: right;
  //  margin-top: 3.5%;
}
.button-preview {
  margin-right: 10px;
  color: #2493f8;
}
.template-describte {
  padding-bottom: 17px;
}
.template-item {
  line-height: 24px;
  span{
    vertical-align: 1px;
  }
}
.bold {
  font-weight: bold;
}
.area-item {
  li {
    margin-left: 17px;
    list-style: unset;
  }
}
</style>


<template>
  <div class="head-wrap">
    <div
      v-if="$route.params.type!=='preview'"
      class="img-wrap vm"
      @click="back()"
    >
      <span class=" back-icon font_family icon-common_back"></span>
    </div>
    <span
      v-if="$route.params.type!=='preview'"
      class="title vm"
    >编辑模板内容<span
        v-if="$route.params.type==='lock'"
        class="font12 yellow vm"
      >（题型结构已锁定，不可编辑）</span><span
        v-if="$route.params.type==='prop'"
        class="font12 yellow vm"
      >（只可设置属性）</span></span>
    <span
      v-else
      class="title vm"
    >模板预览</span>
    <div
      v-if="$route.params.type!=='preview'"
      class="option-wrap abm clearfix"
    >
      <div
        class="option-item"
        v-if="$route.params.type!=='prop'"
        @click="SaveData(2)"
      >
        <i class="finish option-icon font_family icon-template_list_finish"></i>
        <span class="font14 vm">完成</span>
      </div>
      <div
        class="option-item"
        @click="SaveData(1)"
      >
        <i class="save option-icon font_family icon-common_save"></i>
        <span class="font14 vm">保存</span>
      </div>
      <div
        class="option-item"
        @click="preview"
      >
        <i class="preview option-icon font_family icon-common_preview"></i>
        <span class="font14 vm">预览</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["templateData"],
  data() {
    return {};
  },
  created() {},
  methods: {
    back() {
      this.$router.back();
    },
    SaveData: function(status) {
      this.$emit("SaveDataClick", status);
    },
    preview() {
      this.$emit("preview");
    }
  }
};
</script>

<style lang="less" scoped>
.head-wrap {
  margin-bottom: 15px;
  position: relative;
  background-color: #ffffff;
  border: solid 1px #e5e5e5;
  padding: 18px 25px 18px 20px;
  .img-wrap {
    display: inline-block;
    cursor: pointer;
    padding: 0 5px;
    transition: all 0.2s;
    &:hover {
      opacity: 0.8;
    }
    .back-icon {
      color: #2493f8;
      // display: block;
      // width: 10px;
      // height: 17px;
    }
  }
  .title {
    color: #333333;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
  }
  .option-wrap {
    right: 20px;
    .option-item {
      cursor: pointer;
      float: left;
      margin-left: 17px;
      &:hover {
        opacity: 0.8;
      }
      .option-icon {
        font-size: 30px;
        margin-right: 7px;
        vertical-align: middle;
        color: #2493f8;
        &.finish {
          color: #39ba11;
        }
        &.save {
          color: #2493f8;
        }
        &.preview {
          color: #ff8a00;
        }
      }
    }
  }
}
.yellow {
  color: #ff8a00;
}
</style>


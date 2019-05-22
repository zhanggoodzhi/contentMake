<template>
  <div
    id="app"
    class="h100"
  >
    <router-view />
  </div>
</template>
<style lang="less">
#app {
  color: #333;
  font-family: Arial, Microsoft YaHei, sans-serif !important;
}
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, Microsoft YaHei, sans-serif !important;
}
@media screen and (min-width: 1200px) {
  html body {
    padding-left: calc(100vw - 100%) !important;
    padding-right: 0 !important;
    background: #f6f6f6;
  }
}
p,
form,
img,
ul,
ol,
li,
dl,
dt,
dd {
  margin: 0;
  padding: 0;
  border: 0;
}
li {
  list-style-type: none;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.vm {
  vertical-align: middle;
}
.tc {
  text-align: center;
}
.font14 {
  font-size: 14px;
}
.font15 {
  font-size: 15px;
}
.font16 {
  font-size: 16px;
}
.font12 {
  font-size: 12px;
}
.h100 {
  height: 100%;
}
.w100 {
  width: 100%;
}
.abm {
  position: absolute;
  transform: translateY(-50%);
  top: 50%;
}
.abmc {
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
}
a {
  transition: all 0.2s !important;
}
.big-custom-tab-wrap {
  .tab-header {
    margin-bottom: -1px;
    position: relative;
    .tab-header-right {
      position: absolute;
      right: 0px;
      top: 20px;
      transform: translateY(-50%);
      font-size: 14px;
      width: 104px;
    }
    .tab-item {
      border: solid 1px #e5e5e5;
      border-right: 0;
      font-size: 16px;
      padding: 14px 0px;
      width: 150px;
      text-align: center;
      float: left;
      cursor: pointer;
      background-color: #f1f0f0;
      &:last-child {
        border-right: solid 1px #e5e5e5;
      }
      &.active {
        padding-top: 12px;
        background: white;
        border-top: 3px solid #2493f8;
        font-weight: bold;
        color: #2493f8;
        border-bottom: 1px solid white;
      }
      &:hover {
        background: white;
        color: #2493f8;
      }
    }
  }
  .tab-content {
    min-height: calc(100% - 54px);
    padding: 19px 27px;
    background-color: #ffffff;
    border: solid 1px #e5e5e5;
  }
}

@media screen and (max-width: 1400px) {
  .main-body {
    .tab-content {
      min-height: 440px;
      &.fixed {
        height: 440px;
      }
    }
  }
}
@media screen and (min-width: 1400px) {
  .main-body {
    .tab-content {
      min-height: 754px;
      &.fixed {
        height: 754px;
      }
    }
  }
}
// 这个属性导致字段模糊
.ivu-select-dropdown {
  will-change: auto !important;
}
.ivu-form-item-error-tip::before {
  content: "!";
  display: inline-block;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  color: white;
  background: red;
  border-radius: 50%;
  font-weight: bold;
  margin-right: 5px;
}
.more-large {
  &.ivu-input-wrapper-large .ivu-input-prefix i,
  &.ivu-input-wrapper-large .ivu-input-suffix i {
    line-height: 48px !important;
  }
  .ivu-input-large {
    height: 48px !important;
  }
  &.ivu-btn-large {
    padding: 10px 15px !important;
    span {
      font-size: 18px;
    }
  }
}
.ivu-select-dropdown {
  .ivu-dropdown-menu {
    min-width: auto !important;
  }
  border-radius: 0 !important;
  .ivu-dropdown-item {
    transition: all 0.2s;
    &:hover {
      background: white !important;
      span {
        color: #2591f6;
      }
    }
  }
}
.spin-wrap {
  padding: 100px 0;
  text-align: center;
  .spin {
    display: inline-block;
  }
}
// 模态框样式修改
div.ivu-modal {
  margin: 0;
}
.ivu-modal-wrap {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
input.ivu-input.ivu-input-with-prefix {
  padding-left: 32px;
}
.ivu-modal-wrap.red-confirm {
  .ivu-modal-close {
    display: none;
  }
  .ivu-btn-primary {
    color: #fff;
    background-color: #f9645c;
    border-color: #f9645c;
    &:hover {
      background-color: #f84e45;
      border-color: #f84e45;
    }
  }
}
.ivu-modal-footer,
.ivu-modal-confirm-footer {
  text-align: center !important;
  .ivu-btn-text {
    border: solid 1px #cbcbcd;
    padding-left: 21px;
    padding-right: 21px;
    min-width: 100px;
    &:hover {
      border-color: #2493f8;
    }
  }
  .ivu-btn-primary {
    padding-left: 21px;
    padding-right: 21px;
    min-width: 100px;
  }
}
.ivu-modal-confirm-footer {
  margin-left: -20px;
  margin-right: -20px;
  border-top: 1px solid #eaeef0;
  padding-top: 15px;
}
.ivu-modal-confirm-body {
  // word-break: keep-all;
  text-align: center;
  padding-left: 0 !important;
  font-size: 14px;
  color: #666666!important;
  &::before {
    display: inline-block;
    font-family: "font_family";
    content: "\e663";
    color: #f9645c;
    font-size: 30px;
    margin-top: 15px;
    margin-bottom: 5px;
  }
}
// 无边框的Input
.no-border {
  border: 0 !important;
  box-shadow: none !important;
  outline: none;
  background-color: transparent;
}
// hover-box下的input
.hide.hover-box-wrap {
  border: 1px dashed #e5e5e5 !important;
  .hover-input {
    background-color: #e9ecf0;
    color: #83878a !important;
  }
  .auto-textarea {
    textarea.ivu-input {
      background-color: #e9ecf0;
      color: #83878a !important;
    }
  }
}
.template-max-wrap {
  .hover-input {
    font-size: 14px !important;
  }
  .auto-textarea {
    textarea {
      min-height: 45px !important;
      padding: 10px !important;
      font-size: 14px !important;
    }
  }
}
.hover-input {
  display: block;
  border: 0 !important;
  box-shadow: none !important;
  outline: none;
  background-color: transparent;
  padding: 12px 30px 12px 10px;
  width: 100%;
  background: white;
  text-align: left;
}
// input::-webkit-input-placeholder {
//   color: #999999;
// }
// input::-moz-placeholder {
//   /* Mozilla Firefox 19+ */
//   color: #999999;
// }
// input:-moz-placeholder {
//   /* Mozilla Firefox 4 to 18 */
//   color: #999999;
// }
// input:-ms-input-placeholder {
//   /* Internet Explorer 10-11 */
//   color: #999999;
// }
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: #999999 !important;
}
input:-moz-placeholder,
textarea:-moz-placeholder {
  color: #999999 !important;
}
input::-moz-placeholder,
textarea::-moz-placeholder {
  color: #999999 !important;
}
input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  color: #999999 !important;
}
.template-hover-border {
  border: dashed 1px #c1def7;
  &.red {
    border-color: #ff0300 !important;
  }
  &.gray-border {
    border: dashed 1px #e5e5e5;
  }
  &:hover {
    border: dashed 1px #2d8cf0;
  }
}
.ivu-tooltip.template-hover-border {
  display: block !important;
  .ivu-tooltip-rel {
    display: block !important;
    position: static !important;
  }
  .ivu-tooltip-popper {
    animation-duration: 0s !important;
    .ivu-tooltip-arrow {
      border-bottom-color: #fe1514 !important;
    }
    .ivu-tooltip-inner {
      background: #fe1514 !important;
    }
  }
}
.ivu-tooltip.input-number-tooltip {
  &.score-inputnumber {
    .ivu-input-number {
      width: 50px;
    }
  }
  &.error {
    .ivu-input-number {
      border: 1px solid #ed4014;
    }
  }
  .ivu-input-number {
    width: 60px;
  }
  .ivu-tooltip-rel {
    display: block !important;
    position: static !important;
  }
  .ivu-tooltip-popper {
    animation-duration: 0s !important;
    .ivu-tooltip-arrow {
      border-bottom-color: #fe1514 !important;
    }
    .ivu-tooltip-inner {
      background: #fe1514 !important;
    }
  }
}
div.ivu-form-item-error-tip {
  color: #ff0000;
}
.ivu-upload {
  &.disabled {
    display: none !important;
  }
}
.template-max-wrap {
  .property-wrap {
    .ivu-select-disabled {
      .ivu-select-selection {
        background-color: white !important;
        border: 0 !important;
        cursor: initial !important;
        color: #333 !important;
      }
      .ivu-tag-checked {
        .ivu-icon-ios-close {
          display: none;
        }
      }
    }
    .ivu-input-number-disabled {
      border: 0 !important;
      .ivu-input-number-input-wrap {
        background-color: white !important;
        .ivu-input-number-input {
          color: #333 !important;
          background-color: white !important;
          cursor: initial !important;
          text-align: center;
        }
      }
    }
  }
}
.auto-textarea {
  textarea {
    border: none !important;
    box-shadow: none !important;
    font-size: 14px !important;
    color: #333 !important;
    padding: 6px 30px 6px 10px;
    overflow: auto !important;
  }
  .ivu-input[disabled] {
    background: white;
    cursor: initial !important;
  }
}
.custom-radio {
  .ivu-radio-checked .ivu-radio-inner {
    background-color: #2d8cf0;
    &::after {
      width: 4px;
      height: 8px;
      left: 4px;
      top: 1px;
      border: 2px solid #fff;
      border-top: 0;
      border-left: 0;
      border-radius: 0;
      background-color: #2d8cf0;
      transform: rotate(45deg) scale(1);
    }
  }
}
.ignore-click {
  pointer-events: none;
}
// 树选择插件样式
.vue-treeselect__control {
  border-radius: 4px;
  height: 32px !important;
}
.vue-treeselect__single-value {
  padding: 0 2px !important;
  font-size: 14px;
  line-height: 30px;
}
.vue-treeselect__input {
  font-size: 14px !important;
  line-height: 30px !important;
}
.vue-treeselect__placeholder {
  color: #999999 !important;
  font-size: 14px !important;
  padding: 0 2px !important;
  line-height: 30px !important;
}
.vue-treeselect--open-below {
  .vue-treeselect__control-arrow-container::after {
    display: inline-block;
    font-family: "font_family";
    content: "\e66c";
    transform: scale(0.36) translateX(-10px);
    font-size: 15px;
    color: #958fa5;
    transition: all 0.2s ease-in-out;
  }
  .vue-treeselect__control-arrow-container {
    svg {
      display: none;
    }
  }
}
.vue-treeselect--open {
  .vue-treeselect__control-arrow-container::after {
    transform: rotateZ(-180deg) scale(0.36) translateX(6px) !important;
  }
}
.ivu-select-disabled .ivu-select-placeholder {
  line-height: 33px !important;
}
.vue-treeselect__input-container {
  padding: 0 2px !important;
}
.vue-treeselect--has-value .vue-treeselect__multi-value {
  margin-bottom: 0 !important;
}
.vue-treeselect__multi-value {
  min-height: 30px !important;
  font-size: 14px;
}
.vue-treeselect__multi-value-item-container {
  padding-top: 3px !important;
}
.vue-treeselect--multi .vue-treeselect__input {
  padding: 0 !important;
  margin: 0 !important;
}
// 多选select large样式调整
.ivu-select-large.ivu-select-multiple .ivu-tag {
  vertical-align: -11px;
}

.ivu-select-large.ivu-select-multiple .ivu-select-input {
  height: 36px !important;
}
// 自定义滚动条样式
.vb > .vb-dragger {
  z-index: 5;
  width: 12px;
  right: 0;
}

.vb > .vb-dragger > .vb-dragger-styler {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transform: rotate3d(0, 0, 0, 0);
  transform: rotate3d(0, 0, 0, 0);
  -webkit-transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  transition: background-color 100ms ease-out, margin 100ms ease-out,
    height 100ms ease-out;
  background-color: rgba(152, 152, 152, 0.1);
  margin: 5px 5px 5px 0;
  border-radius: 20px;
  height: calc(100% - 10px);
  display: block;
}

.vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(152, 152, 152, 0.3);
}

.vb > .vb-dragger:hover > .vb-dragger-styler {
  background-color: rgba(152, 152, 152, 0.5);
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(152, 152, 152, 0.5);
  margin: 0px;
  height: 100%;
}

.vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
  background-color: rgba(152, 152, 152, 0.5);
}
// 全局form样式调整
.ivu-form label.ivu-form-item-label {
  font-size: 14px;
  color: #666;
}
input.ivu-input {
  font-size: 14px;
  padding: 6px 7px;
  height: 36px;
  color: #333;
}
textarea.ivu-input {
  font-size: 14px;
  color: #333;
}
.ivu-select-single .ivu-select-selection {
  height: 34px;
  .ivu-select-placeholder {
    color: #999999 !important;
    font-size: 14px !important;
  }
}
div.ivu-select .ivu-select-selection span.ivu-select-selected-value {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
}
.edit-paper-vue-poptip {
  background: white;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
  border: solid 1px #cccccc;
  .item {
    cursor: pointer;
    padding: 5px 15px;
    &:hover {
      background: #f2f2f2;
    }
  }
  .ignore {
    padding: 0 10px;
    .inner {
      padding: 5px 0;
      border-top: 1px solid #eee;
    }
  }
}
</style>

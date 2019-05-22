<template>
  <Tooltip
    class="hover-box-wrap template-hover-border gray-border index-delete-input"
    :class="{red:error||$slots.default,active:active,disabled:$route.params.type==='prop'||disabled}"
    :content="error"
    :disabled="!error"
    @click.native="clickInput"
  >
    <div
      v-if="!noDel"
      @click="emitEvent('del')"
      class="del-wrap"
    >
      <Icon
        type="md-close"
        class="del"
      />
    </div>
    <div class="index"><span class="abmc font14">{{index}}</span></div>
    <div class="input-wrap">
      <Input
        v-if="!$slots.default"
        :disabled="$route.params.type==='prop'||disabled"
        :autosize="{minRows: 4}"
        class="auto-textarea"
        type="textarea"
        :placeholder="placeholder"
        :value="inputValue"
        @on-focus="inputFocus"
        @on-blur="active=false"
        @on-change="emitEvent('changeInput',$event.target.value)"
      ></Input>
      <div
        @click="colorTextClick"
        v-else
        class="color-text-wrap"
      >
        <slot></slot>
      </div>
    </div>
  </Tooltip>
</template>
<script>
export default {
  props: ['index', 'placeholder', 'inputValue', 'error', 'noDel', 'disabled'],
  data() {
    return {
      active: false
    }
  },
  created() {

  },
  methods: {
    colorTextClick() {
      this.$emit('colorTextClick');
    },
    clickInput() {
      if (this.$route.params.type === 'prop' || this.disabled) {
        this.$emit('focus');
      }
    },
    inputFocus() {
      this.active = true;
      this.$emit('focus');
    },
    emitEvent(str, value) {
      this.$emit(str, value);
    }
  }
}
</script>

<style lang="less" scoped>
.unselected {
  color: #999999 !important;
}
.disabled {
  border: 1px solid #e5e5e5 !important;
  .option-wrap {
    display: none !important;
  }
  .del-wrap {
    display: none !important;
  }
}
.active {
  border: 1px solid #2493f8 !important;
}
.index-delete-input {
  position: relative;
  &:hover {
    .del-wrap {
      display: block;
    }
  }
}
.index {
  background: #f2f2f2;
  position: absolute;
  top: 0;
  text-align: center;
  bottom: 0;
  left: 0;
  width: 30px;
  display: inline-block;
  .font14 {
    font-weight: bold;
  }
}
.input-wrap {
  padding-left: 30px;
}
.color-text-wrap {
  font-size: 14px;
  min-height: 96px;
  padding: 6px 30px 6px 10px;
}
.del-wrap {
  display: none;
  position: absolute;
  right: -8px;
  top: -10px;
  width: 18px;
  height: 18px;
  background: red;
  border-radius: 50%;
  z-index: 2;
  cursor: pointer;
  &:hover {
    background: #f55;
  }
  .del {
    position: absolute;
    left: 2px;
    top: 2px;
    font-size: 14px;
    color: white;
  }
}
</style>
<style lang="less">
.index-delete-input {
  .auto-textarea textarea {
    font-size: 16px !important;
  }
}
</style>



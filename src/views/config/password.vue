<template>
  <div class="info-wrap psd-set-wrap">
    <div class="center-wrap">
      <Form
        ref="form"
        class="form"
        :model="formData"
        :rules="rules"
      >
        <FormItem prop="oldPsd">
          <Input
            size="large"
            class="more-large"
            :type="oldPsdShow?'text':'password'"
            v-model="formData.oldPsd"
            placeholder="原密码"
          >
          <i
            slot="prepend"
            class="font_family icon-login_password"
          ></i>
          <i
            slot="append"
            class="font_family eye"
            :class="{'icon-password_visible':oldPsdShow,'icon-password_invisible':!oldPsdShow, 'offset-left':oldPsdShow}"
            @click="oldPsdShow=!oldPsdShow"
          ></i>
          </Input>
        </FormItem>
        <!-- <FormItem prop="oldPsd">
          <Input
            size="large"
            class="more-large"
            prefix="ios-lock-outline"
            type="password"
            v-model="formData.oldPsd"
            placeholder="原密码"
          ></Input>
        </FormItem> -->
        <FormItem prop="newPsd">
          <Input
            size="large"
            class="more-large"
            :type="newPsdShow?'text':'password'"
            v-model="formData.newPsd"
            placeholder="新密码"
          >
          <i
            slot="prepend"
            class="font_family icon-login_password"
          ></i>
          <i
            slot="append"
            class="font_family eye icon-password-visible"
            :class="{'icon-password_visible':newPsdShow,'icon-password_invisible':!newPsdShow,'offset-left':newPsdShow}"
            @click="newPsdShow=!newPsdShow"
          ></i>
          </Input>
        </FormItem>
        <!-- <FormItem prop="newPsd">
          <Input
            size="large"
            class="more-large"
            prefix="ios-lock-outline"
            type="password"
            v-model="formData.newPsd"
            placeholder="新密码"
          ></Input>
        </FormItem> -->
        <FormItem prop="reNewPsd">
          <Input
            size="large"
            class="more-large"
            :type="reNewPsdShow?'text':'password'"
            v-model="formData.reNewPsd"
            placeholder="确认密码"
          >
          <i
            slot="prepend"
            class="font_family icon-login_password"
          ></i>
          <i
            slot="append"
            class="font_family eye"
            :class="{'icon-password_visible':reNewPsdShow,'icon-password_invisible':!reNewPsdShow,'offset-left':reNewPsdShow}"
            @click="reNewPsdShow=!reNewPsdShow"
          ></i>
          </Input>
        </FormItem>
        <!-- <FormItem prop="reNewPsd">
          <Input
            size="large"
            class="more-large"
            prefix="ios-lock-outline"
            type="password"
            v-model="formData.reNewPsd"
            placeholder="确认密码"
          ></Input>
        </FormItem> -->
      </Form>
      <Button
        style="margin-top:3px;"
        type="primary"
        long
        size="large"
        @click="save"
        class="more-large"
      >保存修改</Button>
    </div>
  </div>
</template>

<script>
import { updateUserPassWordInfo } from "@/plugins/service";
import { getUserData } from "@/plugins/utils";

export default {
  data() {
    return {
      formData: {
        oldPsd: "",
        newPsd: "",
        reNewPsd: ""
      },
      oldPsdShow: false,
      newPsdShow: false,
      reNewPsdShow: false,
      userData: "",
      rules: {
        oldPsd: [
          {
            required: true,
            transform: value => (value ? value.trim() : ""),
            message: "请输入原密码！",
            trigger: "blur"
          }
        ],
        newPsd: [{ validator: this.validateNewPsd, trigger: "blur" }],
        reNewPsd: [{ validator: this.validateReNewPsd, trigger: "blur" }]
      }
    };
  },
  created() {
    this.userData = getUserData();
  },
  methods: {
    validateNewPsd(rule, value, callback) {
      if (value === "" || value.trim() === "") {
        return callback(new Error("请输入新密码！"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("您输入的新密码长度必须为6~12个字符！"));
      } else {
        callback();
      }
    },
    validateReNewPsd(rule, value, callback) {
      if (value === "" || value.trim() === "") {
        return callback(new Error("请输入确认密码！"));
      } else if (value !== this.formData.newPsd) {
        callback(new Error("您输入的新密码与确认密码不一致！"));
      } else {
        callback();
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateUserPassWordInfo({
            UserID: this.userData.userID,
            CurrentPassWord: this.formData.oldPsd.trim(),
            PassWord: this.formData.newPsd.trim(),
            PassWordConfirm: this.formData.reNewPsd.trim()
          }).then(d => {
            if (d.success) {
              this.$Message.success("修改成功");
              this.getUserDetail();
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.info-wrap {
  text-align: center;
  height: 100%;
  position: relative;
  .center-wrap {
    position: absolute;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding-bottom: 50px;
    width: 352px;
    .headicon {
      display: inline-block;
      border-radius: 50%;
      background-color: #ffffff;
      border: solid 1px #7ebffb;
      box-shadow: 0 0 10px #7ebffb;
      font-size: 48px;
      color: #2493f8;
      text-align: center;
      width: 120px;
      height: 120px;
      line-height: 120px;
    }
    .role {
      margin-top: 10px;
      font-size: 14px;
      color: #999999;
    }
    .form {
      margin-top: 30px;
    }
  }
}
</style>
<style lang="less">
.psd-set-wrap {
  input {
    border-left: 0 !important;
    border-right: 0 !important;
    box-shadow: none !important;
    &:hover,
    &:focus {
      border-color: #dcdee2;
    }
    transition: all 0s;
  }
  .ivu-input-group-prepend {
    background: white;
    // border: 0 !important;
  }
  .ivu-input-group-append {
    background: white;
    // border: 0 !important;
  }
}
.eye {
  font-size: 11px !important;
  cursor: pointer;
  color: #999;
}
.offset-left {
  padding-right: 2px !important;
}
</style>


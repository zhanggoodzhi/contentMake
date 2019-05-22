<template>
  <div
    class="bg"
    :style="{height:height+'px'}"
  >
    <div class="center">
      <div class="tc title-wrap">
        <img
          class="kaola_logo"
          src="/img/logo2.png"
          alt=""
        >
        <span class="vm">英语听说校园版内容制作系统</span>
      </div>
      <div class="tc">
        <div class="login-form-wrap">
          <Form
            ref="loginForm"
            class="form"
            :model="form"
            :rules="rules"
          >
            <FormItem prop="phone">
              <Input
                size="large"
                class=" more-large"
                v-model="form.phone"
                placeholder="手机号码"
              >
              <i
                slot="prepend"
                class="font_family icon-login_tel"
              ></i>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                size="large"
                @on-enter="handleSubmit"
                class="more-large"
                :type="passwordShow?'text':'password'"
                v-model="form.password"
                placeholder="登录密码"
              >
              <i
                slot="prepend"
                class="font_family icon-login_password"
              ></i>
              <i
                slot="append"
                class="font_family eye"
                :class="{'icon-password_visible':passwordShow,'icon-password_invisible':!passwordShow}"
                @click="passwordShow=!passwordShow"
              ></i>
              </Input>
            </FormItem>
            <FormItem>
              <Button
                class="more-large btn"
                size="large"
                @click="handleSubmit"
                type="warning"
                long
              >登录</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div class="footer tc clearfix">
      <p>苏ICP备14027754号-3 苏州驰声信息科技有限公司 Copyright © 2016-2019 All Rights Reserved</p>
      <p>苏公网安备 32059002001978号</p>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/plugins/service";

export default {
  beforeRouteEnter(to, from, next) {
    localStorage.removeItem("userData");
    next();
  },
  data() {
    return {
      height: window.innerHeight,
      form: {
        phone: "13962179406",
        password: "demo",
        // phone: "",
        // password: ""
      },
      rules: {
        phone: [{ validator: this.validatePhone, trigger: "blur" }],
        password: [
          {
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }
        ]
      },
      passwordShow: false
    };
  },
  created() {
    localStorage.removeItem("contentProduceSystemUserData");
  },
  methods: {
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入手机号码"));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback("手机号格式不正确");
      } else {
        callback();
      }
    },
    handleSubmit() {
      this.form.phone = this.trim(this.form.phone);
      this.form.password = this.trim(this.form.password);
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          getToken({
            username: this.form.phone + "$paperdesign",
            password: this.form.password,
            grant_type: "password",
            clientid: "self"
          }).then(data => {
            localStorage.setItem("isRefreshed", "0");
            localStorage.setItem("queueRefreshTokenID", "");
            if (data) {
              localStorage.setItem(
                "contentProduceSystemUserData",
                JSON.stringify(data)
              );
              this.$router.push("/");
            }
          });
        }
      });
    },
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
  }
};
</script>

<style scoped lang="less">
.eye {
  font-size: 11px;
  cursor: pointer;
}
.bg {
  background-color: #1680f0;
  position: relative;
  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .title-wrap {
      img {
        width: 190px;
        height: 49px;
        vertical-align: -16px;
      }
      span {
        display: inline-block;
        font-size: 32px;
        margin-left: 20px;
        color: white;
      }
      margin-bottom: 40px;
    }
    .login-form-wrap {
      padding: 64px 70px;
      width: 500px;
      border-radius: 8px;
      border: solid 1px #58afff;
      background: rgba(58, 149, 247, 0.5);
      display: inline-block;
      .btn {
        margin-top: 3px;
      }
    }
  }
}
.footer {
  bottom: 0;
  left: 0;
  right: 0;
  padding: 35px 0;
  position: absolute;
  font-size: 12px;
  color: #9fd2ff;
}
</style>
<style lang="less">
.login-form-wrap {
  .ivu-form-item-error-tip {
    color: white;
    &::before {
      background-color: #f9645c;
    }
  }
  input {
    border: 0 !important;
    box-shadow: none !important;
  }
  .ivu-input-group-prepend {
    background: white;
    border: 0 !important;
  }
  .ivu-input-group-append {
    background: white;
    border: 0 !important;
  }
}
</style>



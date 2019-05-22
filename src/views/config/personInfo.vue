<template>
  <div class="info-wrap">
    <div class="center-wrap">
      <div class="tc">
        <div class="headicon">
          <span style="display:inline-block;">
            {{headFont}}
          </span>
        </div>
        <p class="role">
          {{getRole}}
        </p>
      </div>
      <Form
        ref="form"
        class="form"
        :model="formData"
        :rules="rules"
      >
        <FormItem prop="name">
          <Input
            size="large"
            class="more-large"
            prefix="ios-person-outline"
            v-model="formData.name"
            placeholder="真实姓名"
          ></Input>
        </FormItem>
        <FormItem prop="phone">
          <Input
            size="large"
            class="more-large"
            prefix="ios-phone-portrait"
            v-model="formData.phone"
            placeholder="手机号码"
          ></Input>
        </FormItem>
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
import { createNamespacedHelpers } from "vuex";
const { mapState, mapMutations } = createNamespacedHelpers("global");
import { userdetail, updateUserInfoForPaperDesign, updateUserPassWordInfo } from "@/plugins/service";
import { getUserData } from '@/plugins/utils';
import { bus, updateLayoutUserDetailEvent } from '@/plugins/bus';
export default {
  data() {
    return {
      userData: '',
      formData: {
        name: '',
        phone: '',
      },
      rules: {
        name: [
          { validator: this.validateName, trigger: 'blur' }
        ],
        phone: [
          { validator: this.validatePhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.userData = getUserData();
    this.getUserDetail();
  },
  computed: {
    ...mapState(['userDetail']),
    getRole() {
      if (this.userData.userRole == '3') {
        return '内容商管理员'
      } else if (this.userData.userRole == '4') {
        return '内容编辑'
      }
    },
    headFont() {
      const name = this.formData.name;
      if (!name) {
        return '';
      }
      return name[name.length - 1]
    }
  },
  methods: {
    ...mapMutations([
      "changeUserDetail",
    ]),
    getUserDetail() {
      userdetail({ userID: this.userData.userID }).then(data => {
        // 更新头部账号图标
        this.changeUserDetail(data);
        this.formData.name = data.NickName;
        this.formData.phone = data.PhoneNumber;
      });
    },
    validateName(rule, value, callback) {
      if (!value||!value.trim()) {
        return callback(new Error('请输入真实姓名！'));
      } else if (value.length > 15) {
        callback('您输入的真实姓名超出长度，最多15个字符！');
      } else {
        callback();
      }
    },
    validatePhone(rule, value, callback) {
      if (!value) {
        return callback(new Error('请输入手机号码！'));
      } else if (!/^1[34578]\d{9}$/.test(value)) {
        callback('您输入的手机号码格式不正确！');
      } else {
        callback();
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          updateUserInfoForPaperDesign({
            UserID: this.userData.userID,
            UserName: this.formData.name,
            PhoneNumber: this.formData.phone
          }).then(d => {
            if (d.success) {
              this.$Message.success('修改成功');
              this.getUserDetail();
            }
          })
        }
      });
    }
  }
}
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

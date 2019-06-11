<template>
  <div class="register-container">
    <div class="register-form">
      <img class="login-logo" :src="`${STATIC_IMAGE}logo.png`" alt="">
      <h3 class="title">忘记密码</h3>
      <el-form ref="forgotPwdForm" :model="forgotPwdForm" :rules="forgotPwdRules" label-position="left">
        <el-form-item prop="phone">
          <el-input v-model="forgotPwdForm.phone" name="phone" type="text" @input="disabledBtn" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model.number="forgotPwdForm.code" class="verify-code" name="code" type="text" @input="disabledBtn" placeholder="请输入验证码 " />
          <el-button class="get-code" v-if="!btn" :disabled="!btn">{{time}}s后重新获取</el-button>
          <el-button class="get-code" @click="sendcode" v-if="btn">获取验证码</el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="forgotPwdForm.password" name="password" type="password" @input="disabledBtn" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model="forgotPwdForm.rePassword" name="rePassword" type="password" @input="disabledBtn" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item class="forgot-btn">
          <el-button type="primary" style="width:100%;font-size:16px;" @click.native.prevent="doChangePwd" :disabled="disabled">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { smscodeFun, validateCodeFun, forgetPwdFun } from '@/service/resetPwd';
import { validatPhone, validatPwd } from '@/utils/validate';
export default {
  name: 'forgotPwd',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else if (!validatPhone(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (!validatPwd(value)) {
        callback(new Error('密码6-20位，支持英文字母和数字'));
      } else {
        callback();
      }
    };
    const validateRePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (!validatPwd(value)) {
        callback(new Error('密码6-20位，支持英文字母和数字'));
      } else if (value !== this.forgotPwdForm.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      forgotPwdForm: {
        phone: '',
        code: '',
        password: '',
        rePassword: ''
      },
      timer: null,
      time: 0,
      btn: true,
      disabled: true,
      forgotPwdRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', type: 'number', message: '验证码必须为数字值' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      }
    };
  },
  methods: {
    disabledBtn() {
      if (this.forgotPwdForm.phone && this.forgotPwdForm.code && this.forgotPwdForm.password && this.forgotPwdForm.rePassword) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    validatePhone() {
      if (this.forgotPwdForm.phone === '') {
        this.$Message.error('请输入手机号码');
        return false;
      } else if (!validatPhone(this.forgotPwdForm.phone)) {
        this.$Message.error('请输入正确手机号码');
        return false;
      }
      return true;
    },
    async sendcode() {
      if (this.validatePhone()) {
        smscodeFun({ phone: this.forgotPwdForm.phone, mark: false });
        this.time = 60;
        this.btn = false;
        this.countdown();
      }
    },
    countdown() {
      this.btn = false;
      this.timer = setInterval(() => {
        if (--this.time <= 0) {
          clearInterval(this.timer);
          this.btn = true;
        }
      }, 1000);
    },
    doChangePwd() {
      this.$refs.forgotPwdForm.validate(valid => {
        if (valid) {
          let payload = Object.assign({}, { phone: this.forgotPwdForm.phone, code: this.forgotPwdForm.code });
          validateCodeFun(payload).then(res => {
            let payload = Object.assign({}, { password: this.forgotPwdForm.password, phone: this.forgotPwdForm.phone, code: this.forgotPwdForm.code });
            forgetPwdFun(payload).then(() => {
              this.$router.push({ name: 'login' });
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.register-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;
    .el-input__inner {
      width: 100% !important;
      background: #fff !important;
      -webkit-appearance: none !important;
      padding-left: 12px !important;
      color: #171a2e;
      height: 40px;
      border-radius: 4px !important;
    }
  }
  .verify-code {
    width: 252px !important;
    float: left;
  }
  .get-code {
    width: 102px !important;
    margin-left: 8px;
    padding: 12px 0;
  }
  .forgot-btn {
    .el-form-item__content {
      button {
        height: 40px;
      }
    }
  }
  .el-checkbox {
    margin-right: 8px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@//styles/variables.scss';
.register-container {
  height: 100%;
  width: 100%;
  background-color: $regbg;
  position: relative;
  .login-logo {
    position: absolute;
    top: -43px;
    left: 50%;
    transform: translateX(-50%);
  }
  .register-form {
    width: 420px;
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    max-width: 100%;
    padding: 35px 26px 60px 26px;
    margin: 120px auto;
    border-radius: 12px;
    border: 3px solid #f5f5f5;
    h4 {
      font-weight: normal;
      font-size: 16px;
      margin-bottom: 24px;
    }
  }
  .title {
    font-size: 33px;
    font-weight: 400;
    color: $text-title;
    padding: 42px 0 69px 0;
    text-align: center;
  }
}
</style>


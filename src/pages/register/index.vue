<template>
  <div class="register-container">
    <div class="register-form">
      <img class="login-logo" src="https://qiekj-static.oss-cn-shanghai.aliyuncs.com/merchant-pc/images/logo.png" alt="">
      <h3 class="title">注册账户</h3>
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-position="left">
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" name="phone" type="text" @input="disabledBtn" placeholder="请输入手机号为登录账号" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="registerForm.code" class="verify-code" name="code" type="text" @input="disabledBtn" placeholder="请输入验证码" />
          <el-button class="get-code" v-if="!btn" :disabled="!btn">{{time}}s后重新获取</el-button>
          <el-button class="get-code" @click="sendcode" v-if="btn">获取验证码</el-button>
        </el-form-item>
        <el-form-item prop="invitationCode">
          <el-input v-model="registerForm.invitationCode" @input="disabledBtn" placeholder="请输入邀请码" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerForm.password" type="password" @input="disabledBtn" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model="registerForm.rePassword" type="password" @input="disabledBtn" placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="registerForm.name" @input="disabledBtn" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item class="area" prop="areaIds">
          <Area v-model="registerForm.areaIds" @getAreaName="getAreaName" size="small" default-option="不限" />
        </el-form-item>
        <el-form-item prop="userAgreement">
          <el-checkbox v-model="registerForm.userAgreement" @change="disabledBtn"></el-checkbox>我已阅读并同意<span class="agreement" @click="userAgreementVisible=true">《用户协议》</span>
        </el-form-item>
        <el-form-item class="reg-btn">
          <el-button type="primary" style="width:100%;font-size:16xp;" @click.native.prevent="handleRegister" :disabled='disabled'>注 册</el-button>
          <span class="to-login">
            <router-link to="/login">使用已有帐户登录</router-link>
          </span>
        </el-form-item>
      </el-form>
      <el-dialog title="运营商注册协议" :visible.sync="userAgreementVisible" :center="true" width="60%" height="400">
        <user-agreement></user-agreement>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { smscodeFun, checkPhoneFun, checkRegCodeFun, saveRegisterInfoFun } from '@/service/resetPwd';
import { validatPhone, validatPwd, validatInviteCode } from '@/utils/validate';
import Area from '@/components/Area';
import userAgreement from './userAgreement';
export default {
  name: 'register',
  components: {
    Area,
    userAgreement
  },
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
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    const validateInviteCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邀请码'));
      } else if (!validatInviteCode(value)) {
        callback(new Error('请输入正确的邀请码'));
      } else {
        callback();
      }
    };
    const validateAres = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('请输入选择省市区'));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        phone: '',
        code: '',
        invitationCode: '',
        password: '',
        rePassword: '',
        name: '',
        userAgreement: false,
        areaIds: [],
        address: ''
      },
      timer: null,
      time: 0,
      btn: true,
      disabled: true,
      registerRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        code: [{ required: true, trigger: 'blur', message: '验证码必须为数字值' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRePassword }],
        invitationCode: [{ required: true, trigger: 'blur', validator: validateInviteCode }],
        name: [{ required: true, trigger: 'blur', message: '请填写姓名' }, { pattern: /^[\u4e00-\u9fa5a-zA-Z]{2,20}$/, message: '姓名2-20个字符，支持中文和英文', trigger: 'blur' }],
        userAgreement: [{ required: true, trigger: 'blur', message: '请同意用户协议' }],
        areaIds: [{ required: true, trigger: 'blur', type: 'array', validator: validateAres }]
      },
      userAgreementVisible: false
    };
  },
  methods: {
    disabledBtn() {
      if (this.registerForm.phone && this.registerForm.code && this.registerForm.invitationCode && this.registerForm.password && this.registerForm.rePassword && this.registerForm.name && this.registerForm.userAgreement && this.registerForm.areaIds.length >= 3) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    validatePhone() {
      if (this.registerForm.phone === '') {
        this.$Message.error('请输入手机号码');
        return false;
      } else if (!validatPhone(this.registerForm.phone)) {
        this.$Message.error('请输入正确手机号码');
        return false;
      }
      return true;
    },
    async sendcode() {
      if (this.validatePhone()) {
        let res = await checkPhoneFun({ phone: this.registerForm.phone });
        if (res.exist) {
          this.$Message.error('该号码已注册，请更换手机号');
        } else {
          smscodeFun({ phone: this.registerForm.phone, mark: true });
          this.time = 60;
          this.btn = false;
          this.countdown();
        }
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
    getAreaName(data) {
      if (data.length > 0) {
        this.registerForm.address = data.join('');
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          let provinceId = this.registerForm.areaIds.length > 0 ? this.registerForm.areaIds[0] : null;
          let cityId = this.registerForm.areaIds.length > 0 ? this.registerForm.areaIds[1] : null;
          let districtId = this.registerForm.areaIds.length > 0 ? this.registerForm.areaIds[2] : null;
          if (provinceId && cityId && districtId) {
            let payload = Object.assign({}, { phone: this.registerForm.phone, code: this.registerForm.code, invitationCode: this.registerForm.invitationCode });
            checkRegCodeFun(payload).then(() => {
              let payload = {
                phone: this.registerForm.phone,
                name: this.registerForm.name,
                password: this.registerForm.password,
                provinceId: provinceId,
                cityId: cityId,
                districtId: districtId,
                invitationCode: this.registerForm.invitationCode,
                address: this.registerForm.address
              };
              saveRegisterInfoFun(payload).then(() => {
                this.$Message.success('注册成功');
                this.$router.push({ name: 'login' });
              });
            });
          } else {
            this.$Message.error('请选择省市区');
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    'registerForm.areaIds': {
      deep: true,
      handler: function(val) {
        val.length >= 3 ? (this.disabled = false) : (this.disabled = true);
      }
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
    width: 258px !important;
    float: left;
  }
  .get-code {
    width: 102px !important;
    margin-left: 8px;
    padding: 12px 0;
  }
  .reg-btn {
    .el-form-item__content {
      button {
        width: 180px !important;
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
  border-radius: 12px;
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
    padding: 77px 0 69px 0;
    text-align: center;
  }
  .to-login {
    color: $menuText;
    float: right;
  }
  .agreement {
    color: $menuText;
    cursor: pointer;
  }
}
</style>


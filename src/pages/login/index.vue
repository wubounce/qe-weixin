<template>
  <div class="login-container">
    <img class="login-bg" src="https://qiekj-static.oss-cn-shanghai.aliyuncs.com/merchant-pc/images/login_bg.png" alt="">
    <div class="login-form">
      <h3 class="title">企鹅商家管理平台</h3>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left">
        <img class="login-logo" src="https://qiekj-static.oss-cn-shanghai.aliyuncs.com/merchant-pc/images/logo.png" alt="">
        <h4>账户密码登录</h4>
        <img class="login-person" src="https://qiekj-static.oss-cn-shanghai.aliyuncs.com/merchant-pc/images/login_person.png" alt="">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" name="userName" type="text" placeholder="请输入用户名/手机号">
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" name="password" type="password" placeholder="请输入密码" @keyup.enter.native="handleLogin">
            <svg-icon slot="prefix" icon-class="password" />
          </el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button :loading="loading" type="primary" style="width:100%;font-size:16xp;" @click.native.prevent="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <div>
        <span class="register">
          <router-link to="/register">注册账户</router-link>
        </span>
        <span class="forget-pwd">
          <router-link to="/forgotpwd">忘记密码</router-link>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import JsEncrypt from 'jsencrypt';
import { removeToken } from '@/utils/auth';
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      loading: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    removeToken();
    localStorage.clear();
  },
  created() {},
  methods: {
    ...mapActions(['getUserInfo', 'getPermsInfo']),
    encryptSend(data) {
      let jsencrypt = new JsEncrypt();
      let publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAh/dHI4eSGQU55+WY2QIWguZ8got/aCairVO+8fMj6dHPWPb3AAhvfNZ7BrUaKUrPQqpt2QVRmV+UZp/bot6ukNEZMFMaSjGf4FFtRNbjIn+5jo8sC3rn6+9k2XNvAMydTDtU0P8Ebhbm1gg6O+gg+iRIAX3awWZajy2senYD7zSDguqyL8xuh6S9RG2wjPsN8LNuKd3klD1rw3kmX0Q672kSW6vm+GHzWun6jYaWac2w936NlvnbQI1P1lFjcgv0OgFBm/4yoLMhx6wZD9KTKG2S7wZRNmbzEaXyrTTdJ+Q1NE4+gqHCAFfHKrzB2zvY2I0v8QL7JLMpCevChRgEcwIDAQAB';
      jsencrypt.setPublicKey(publicKey);
      return jsencrypt.encrypt(data);
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          let userName = this.encryptSend(this.loginForm.userName);
          let password = this.encryptSend(this.loginForm.password);
          let payload = {
            password: password,
            userName: userName
          };
          this.$store
            .dispatch('Login', payload)
            .then(() => {
              this.getUserInfo().then(() => {
                this.getPermsInfo();
              });
              this.loading = false;
              this.$router.push({ path: this.redirect || '/' });
            })
            .catch(() => {
              this.loading = false;
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
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 100%;
    .el-input__inner {
      width: 100% !important;
      background: #fff !important;
      -webkit-appearance: none !important;
      padding-left: 36px !important;
      color: #171a2e;
      height: 40px;
      border-radius: 4px !important;
    }
  }
  .login-btn {
    .el-form-item__content {
      button {
        height: 40px;
      }
    }
  }
  .el-input__prefix {
    left: 15px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.login-container {
  height: 100%;
  width: 100%;
  // background-color: $regbg;
  background: linear-gradient(180deg, rgba(255, 252, 252, 1) 0%, rgba(255, 245, 245, 1) 100%);
  position: relative;
  border-radius: 12px;
  .login-bg {
    position: absolute;
    top: 250px;
    left: 50%;
    transform: translateX(-50%);
  }
  .svg-icon {
    margin-top: 13px;
  }
  .login-person {
    position: absolute;
    bottom: -68px;
    left: -89px;
  }
  .login-logo {
    position: absolute;
    top: -43px;
    left: 50%;
    transform: translateX(-50%);
  }
  .login-form {
    width: 420px;
    background: #fff;
    position: absolute;
    max-width: 100%;
    padding: 35px 26px 60px 26px;
    margin: 0 auto;
    top: 220px;
    left: 51%;
    transform: translateX(-50%);
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
  .register,
  .forget-pwd {
    color: $menuText;
    font-size: 14px;
  }
  .forget-pwd {
    float: right;
  }
}
</style>

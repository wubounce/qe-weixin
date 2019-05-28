<template>
  <div class="register-container">
    <div class="register-form">
      <img class="login-logo" :src="`${staticUrl}logo.png`" alt="">
      <h3 class="title">修改密码</h3>
      <el-form ref="changePwdForm" :model="changePwdForm" :rules="changePwdFormRules" label-position="left">
        <el-form-item prop="phone">
          <el-input name="phone" type="text" disabled :placeholder="'用户账号'+ changePwdForm.phone" />
        </el-form-item>
        <el-form-item prop="oldPassword">
          <el-input v-model="changePwdForm.oldPassword" name="oldPassword" type="password" placeholder="原密码" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="changePwdForm.password" name="password" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model="changePwdForm.rePassword" name="rePassword" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-form-item class="forgot-btn">
          <el-button type="primary" @click.native.prevent="doChangePwd">确 定</el-button>
          <el-button @click.native.prevent="cancelChangePwd">取 消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { updatePwdFun } from '@/service/resetPwd';
import { validatPwd } from '@/utils/validate';
import { getUserInfoInLocalstorage } from '@/utils/auth';
export default {
  name: 'changePwd',
  data() {
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
      } else if (value !== this.changePwdForm.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    return {
      staticUrl: process.env.VUE_APP_STATICURL,
      changePwdForm: {
        phone: '',
        oldPassword: '',
        password: '',
        rePassword: ''
      },
      changePwdFormRules: {
        oldPassword: [{ required: true, trigger: 'blur', message: '请输入原密码' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        rePassword: [{ required: true, trigger: 'blur', validator: validateRePassword }]
      }
    };
  },
  created() {
    this.changePwdForm.phone = getUserInfoInLocalstorage() ? getUserInfoInLocalstorage().phone : '';
  },
  methods: {
    doChangePwd() {
      this.$refs.changePwdForm.validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.changePwdForm);
          updatePwdFun(payload).then(res => {
            this.$Message.success('密码修改成功');
            this.$router.go(-1);
          });
        } else {
          return false;
        }
      });
    },
    cancelChangePwd() {
      this.$router.go(-1);
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
  .is-disabled .el-input__inner {
    background: rgba(249, 249, 249, 1) !important;
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
  .forgot-btn {
    .el-form-item__content {
      display: flex;
      button {
        height: 40px;
        flex: 1;
        font-size: 16px;
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


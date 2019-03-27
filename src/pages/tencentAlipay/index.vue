<template>
  <div class="login-container">
    <div class="login-form">
      <h3 class="title">申请代签约</h3>
      <div class="already-sign" v-if="isAlreadySign">
        您的账号已签约。
      </div>
      <el-form v-else ref="TencentAlipayForm" :model="TencentAlipayForm" :rules="TencentAlipayRules" label-position="left">
        <el-form-item prop="alipayAccount" label="支付宝账号">
          <el-input v-model="TencentAlipayForm.alipayAccount" name="alipayAccount" type="text" placeholder="请输入支付宝账号">
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="contactName" label="真实姓名">
          <el-input v-model="TencentAlipayForm.contactName" name="contactName" type="text" placeholder="请输入真实姓名">
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="contactMobile" label="手机号码">
          <el-input v-model="TencentAlipayForm.contactMobile" name="contactMobile" type="text" placeholder="请输入手机号码">
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </el-form-item>
        <el-form-item prop="contactEmail" label="邮箱">
          <el-input v-model="TencentAlipayForm.contactEmail" name="contactEmail" type="text" placeholder="请输入邮箱">
            <svg-icon slot="prefix" icon-class="user" />
          </el-input>
        </el-form-item>
        <el-form-item label="经营门店" class="form-item-m add-img" prop="shopPicUrl">
          <span style="color:#606266">上传<span style="color: rgb(239, 86, 87);">1</span>张店铺招牌照片，需清晰展示完整的招牌</span>
          <span style="margin-left:35px;float:left">
            <Upload v-model="TencentAlipayForm.shopPicUrl" />
          </span>
          <span class="qie-pic">
            <img src="static/image/qiezhaop.jpg" alt="企鹅共享洗衣" width="146" height="146">
            <span class="example">示例</span>
          </span>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button :loading="loading" type="primary" style="width:100%;font-size:16xp;" @click.native.prevent="handleTencentAlipay">确 定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { validatName, validatPhone, validatEmail } from "@/utils/validate";
import { handleOperatorAgentSignFun, completeAgentSign } from '@/service/login';
import Upload from "@/components/Upload";
export default {
  name: "Login",
  data () {
    const validateContactName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('姓名不能为空'));
      } else if (!validatName(value)) {
        callback(new Error("姓名只能输入中文"));
      } else {
        callback();
      }
    };
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else if (!validatPhone(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空'));
      } else if (!validatEmail(value)) {
        callback(new Error("请输入正确的邮箱"));
      } else {
        callback();
      }
    };
    return {
      TencentAlipayForm: {
        alipayAccount: "",
        contactName: "",
        contactMobile: "",
        contactEmail: "",
        rate: "",
        shopPicUrl: '',
      },
      TencentAlipayRules: {
        alipayAccount: [{ required: true, trigger: "blur", message: '请输入支付宝账号' }],
        contactName: [{ required: true, trigger: "blur", validator: validateContactName }],
        contactMobile: [{ required: true, trigger: "blur", validator: validatePhone }],
        contactEmail: [{ required: true, trigger: "blur", validator: validateEmail }],
        shopPicUrl: [{ required: true, trigger: "blur", message: '请上传门店照片' }],
      },
      isAlreadySign: false,
    };
  },
  components: {
    Upload,
  },
  created () {
    this.getCompleteAgentSign()
    this.param = new FormData();
  },
  methods: {
    async getCompleteAgentSign () {
      let res = await completeAgentSign()
      if (res) {
        this.isAlreadySign = true
      }
    },
    handleTencentAlipay () {//表单提交的事件
      this.$refs.TencentAlipayForm.validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.TencentAlipayForm)
          handleOperatorAgentSignFun(payload).then(_ => {
            this.$Message.success('提交成功');
          })
        }
      })

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
@import "~@/styles/variables.scss";
.login-container {
  height: 100%;
  width: 100%;
  background-color: $regbg;
  position: relative;
  border-radius: 12px;
  .login-form {
    width: 450px;
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    max-width: 100%;
    padding: 35px 26px 60px 26px;
    margin: 85px auto;
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
    padding: 5px 0 30px 0;
    text-align: center;
  }
  .qie-pic {
    display: inline-block;
    position: relative;
    margin-left: 8px;
    width: 148px;
    height: 148px;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
  }
  .example {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 24px;
    left: 0;
    text-align: center;
    background: #a8a8a8;
    color: #fff;
    line-height: 24px;
    font-size: 12px;
  }
  .already-sign {
    color: $menuText;
    width: 100%;
    text-align: center;
    height: 180px;
    line-height: 180px;
  }
}
</style>

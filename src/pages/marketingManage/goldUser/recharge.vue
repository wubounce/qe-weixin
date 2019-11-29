<template>
  <el-dialog :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <div slot="title">
      <span class="el-dialog__title" style="margin-right:8px;">充值金币</span>
      <el-tooltip placement="bottom-start" class="recharge-tip">
        <div slot="content" class="recharge_tooltip">
          <p>充值金币请注意以下规则：</p>
          <p>1.会员账号：需已注册企鹅平台用户账号；</p>
          <p>2.适用店铺：为运营商账号下的店铺，且已开通金币方案；</p>
          <p>3.充值金额：范围为0~9999，支持两位小数；</p>
          <p>4.金币本金：等于金币金额*100；</p>
          <p>5.赠送金币：范围为0~999900，不支持小数；</p>
          <p>6.充值金额和赠送金币不可同时为0。</p>
          <p>7.批量充值请以模板格式编辑上传的附件；</p>
          <p>8.批量充值时同一个店铺不可对同一用户重复充值。</p>
        </div>
        <svg-icon icon-class="zhibiaoshuoming" />
      </el-tooltip>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="个人充值" name="first">
        <el-form :model="rechargeForm" :rules="rechargeFormRules" ref="rechargeForm" label-width="125px" label-position="left" class="recharge-form">
          <el-form-item label="用户账号：" prop="phone">
            <el-select v-model.trim="rechargeForm.phone" filterable remote clearable :loading="loading" :remote-method="getUserList" placeholder="请填写用户手机号">
              <el-option v-for="(item,index) in userList" :key="index" :label="item.phone" :value="item.phone"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适用店铺：" prop="shopId">
            <el-select v-model="rechargeForm.shopId" filterable clearable placeholder="未选择">
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金币金额(元)：" prop="cashValue">
            <el-input v-model.trim="rechargeForm.cashValue" placeholder="请填写充值金额"></el-input>
          </el-form-item>
          <el-form-item label="金币本金(枚)：">{{rechargeForm.cashValue?rechargeForm.cashValue*exchangeRate:'' | numFormat}}</el-form-item>
          <el-form-item label="赠送金币(枚)：" prop="presentAmount">
            <el-input v-model.trim="rechargeForm.presentAmount" placeholder="请填写赠送金币"></el-input>
          </el-form-item>
          <el-form-item class="action">
            <el-button type="primary" @click="onHandleRecharge('rechargeForm')">确定</el-button>
            <el-button @click="resetForm('rechargeForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="批量充值" name="second">
        <el-upload class="upload-demo" ref="upload" action="#" :limit="1" :before-upload="beforeUpload">
          <div class="upload_template">
            <el-button slot="trigger" type="primary" class="upload_btn"><i class="el-icon-paperclip"></i>上传附件</el-button>
            <p class="download">
              <a href="https://static.qiekj.com/images/template/%E9%87%91%E5%B8%81%E6%89%B9%E9%87%8F%E5%85%85%E5%80%BC%E6%A8%A1%E6%9D%BF.xlsx" rel="external nofollow" download="模板">
                <svg-icon icon-class="daochu" class="daochu" /><span>下载模板</span>
              </a>
            </p>
            <div slot="tip" class="file_name" v-if="fileName">上传附件：{{fileName}}</div>
          </div>
        </el-upload>
        <div class="action">
          <el-button @click="modalClose">取消</el-button>
          <el-button type="primary" @click="submitUpload()">确定</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { tokenCoinListFun, getByPhoneFun, configTokenCoinFun, refillAndDeductFun } from '@/service/tokenCoin';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activeName: 'second',
      files: [],
      fileName: '',
      shopList: [],
      userList: [],
      exchangeRate: 100,
      rechargeForm: {
        phone: '',
        shopId: '',
        cashValue: '',
        presentAmount: ''
      },
      rechargeFormRules: {
        phone: [{ required: true, message: '请填写用户手机号码', trigger: 'change' }],
        shopId: [{ required: true, message: '请选择适用店铺', trigger: 'change' }],
        cashValue: [{ required: true, message: '请填写充值金额', trigger: 'blur' }, { pattern: /^(([1-9]|([1-9][0-9]{1,2}([0-8])?)|([1-9][0-8]{1,2}([0-9])?))(\.\d{0,2})?|0\.\d{0,2}|9999|9999.0|9999.00)$/, message: '充值金额请输入0~9999之间数字，最多两位小数', trigger: 'blur' }],
        presentAmount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^([0-9]|([1-9][0-9]*))$/;
              if (!value) {
                callback(new Error('请填写赠送金币'));
              } else if (!reg.test(value)) {
                callback(new Error('请填写0~999,900之间整数'));
              } else if (Number(value) > 999900) {
                callback(new Error('请填写0~999,900之间整数'));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },
  created() {
    this.getShopList();
    this.getTokenCoinConfig();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getTokenCoinConfig() {
      let res = await configTokenCoinFun();
      this.exchangeRate = res.exchangeRate || 100;
    },
    async getShopList() {
      let res = await tokenCoinListFun({ page: 1, pageSize: 999, isContainClose: 1 });
      let items = (res && res.items) || [];
      this.shopList = items.filter(item => item.isDelete === 0);
    },
    async getUserList(query) {
      if (query !== '') {
        this.loading = true;
        let payload = { phone: query };
        let res = await getByPhoneFun(payload);
        this.userList = this.options = res ? [{ phone: res.phone, id: res.id }] : {};
        this.loading = false;
      }
    },
    resetForm(formName) {
      this.modalClose();
    },
    onHandleRecharge(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = Object.assign({ type: 1 }, this.rechargeForm);
          payload.principalAmount = payload.cashValue * this.exchangeRate;
          refillAndDeductFun(payload).then(() => {
            setTimeout(() => {
              this.$Message.success('充值成功');
              this.$listeners.getGoldUserDataToTable && this.$listeners.getGoldUserDataToTable(); //若组件传递事件confirm则执行
              this.modalClose();
            }, 1000);
          });
        }
      });
    },
    beforeUpload(file) {
      this.files = file;
      const reg = /\.xlsx?$/i;
      const size = 5;
      if (!reg.test(file.name)) {
        this.$Message.warning('上传模板只能是 xls、xlsx格式!');
        return false;
      }
      if (file.size > 0 && file.size / 1024 / 1024 > size) {
        this.$Message.warning(`上传模板大小不能超过 ${size} MB!`);
        return false;
      }
      this.fileName = file.name;
      return false; // 返回false不会自动上传
    },
    submitUpload() {
      if (!this.fileName) {
        this.$Message.warning('请选择要上传的文件！');
        return false;
      }
      let formData = new FormData();
      formData.append('files[]', this.files);
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      this.$http.post('', formData, requestConfig).then(res => {
        this.$Message.success('上传成功');
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.recharge-form {
  padding-top: 24px;
}
.recharge_tooltip p {
  font-size: 14px;
  line-height: 20px;
}
.upload-demo,
/deep/ .el-upload {
  width: 100%;
}
.upload_template {
  text-align: center;
  font-size: 14px;
  margin: 50px 0;
}
.download a {
  color: $menuText;
}
.daochu {
  margin-right: 10px;
  color: $menuText;
  fill: $menuText;
}
.upload_btn {
  width: 140px;
  height: 63px;
  margin-bottom: 15px;
}
.file_name {
  margin-top: 20px;
}
.action {
  text-align: right;
  padding: 16px 0;
  border-top: 1px solid $under_line;
}
</style>

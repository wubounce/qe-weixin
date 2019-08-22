<template>
  <el-dialog title="充值金币" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
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
        presentAmount: [{ required: true, message: '请填写赠送金币', trigger: 'blur' }, { pattern: /^(([0-9])|([1-9]([0-9]{0,5})?)|([1-9]([0-9]{0,3})?[0]{0,2}))$/, message: '金币请填写0~999,900之间整数', trigger: 'blur' }, { pattern: /^[0-9]*$/, message: '金币请填写0~999,900之间整数', trigger: 'blur' }]
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.recharge-form {
  padding-top: 24px;
}
.action {
  text-align: right;
  padding: 16px 0;
  border-top: 1px solid $under_line;
}
</style>

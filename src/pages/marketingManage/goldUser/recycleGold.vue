<template>
  <el-dialog title="金币回收" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <el-form :model="recycleForm" :rules="recycleForm" ref="recycleRulesForm" label-width="125px" label-position="left" class="recharge-ruleForm">
      <el-form-item label="用户账号：">
        {{recycleForm.phone}}
      </el-form-item>
      <el-form-item label="适用店铺：">
        {{recycleForm.shopName}}
      </el-form-item>
      <el-form-item label="金币本金(枚)：" prop="totalAmount">
        <el-input v-model="recycleForm.totalAmount" :placeholder="restPresentAmount>0?`最多${restPresentAmount}金币`:`请填写金币本金`"></el-input>
      </el-form-item>
      <el-form-item label="赠送金币(枚)：" prop="presentAmount">
        <el-input v-model="recycleForm.presentAmount" :placeholder="restTotalAmount>0?`最多${restTotalAmount}金币`:`请填写赠送金币`"></el-input>
      </el-form-item>
      <el-form-item label="金币金额(元)：">
        {{recycleForm.totalAmount?recycleForm.totalAmount/exchangeRate:'' | numFormat}}
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="submitForm('recycleForm')">确定</el-button>
        <el-button @click="resetForm('recycleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { tokenCoinUsereFun, configTokenCoinFun, refillAndDeductFun } from '@/service/tokenCoin';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      restPresentAmount: 0,
      restTotalAmount: 0,
      exchangeRate: 100,
      recycleForm: {
        phone: '18311017120',
        userId: 'a67673d5-fd9d-4e02-820d-80415826a2e4',
        shopId: 'd36dc265-9a2d-43f6-ad1d-3cd26a34cd35',
        shopName: '联合大厦10楼',
        totalAmount: '',
        presentAmount: ''
      },
      recycleRulesForm: {
        totalAmount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请输入金币本金数目'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) <= 0 || Number(value) > this.restTotalAmount) {
                callback(new Error(`不能大于剩余的余额${this.restTotalAmount}`));
              } else {
                callback();
              }
            }
          }
        ],
        presentAmount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请输入赠送金币数目'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) <= 0 || Number(value) > this.restPresentAmount) {
                callback(new Error(`不能大于剩余的余额${this.restPresentAmount}`));
              } else if (Number(this.ruleForm.date) === 0 && Number(value) === 0) {
                callback(new Error('金币本金与赠送金币不可同时为0'));
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
    this.getTokenCoinConfig();
    this.tokenCoinUsereFun();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getTokenCoinConfig() {
      let res = await configTokenCoinFun();
      this.exchangeRate = res.exchangeRate || 100;
    },
    async tokenCoinUsereFun() {
      let payload = { searchUserId: this.recycleForm.userId, shopId: this.recycleForm.shopId };
      let res = await tokenCoinUsereFun(payload);
      this.restPresentAmount = (res && res.presentAmount) || 0;
      this.restTotalAmount = (res && res.totalAmount) || 0;
    },
    resetForm(formName) {
      this.modalClose();
    },
    onHandleRecharge(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = Object.assign({}, this.rechargeForm);
          payload.type = 2;
          payload.principalAmount = payload.totalAmount;
          refillAndDeductFun(payload).then(() => {
            this.$Message.success('回收成功');
            this.$listeners.getGoldUserDataToTable && this.$listeners.getGoldUserDataToTable(); //若组件传递事件confirm则执行
            this.modalClose();
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.recharge-ruleForm {
  padding-top: 24px;
}
.action {
  text-align: right;
  padding: 16px 0;
  border-top: 1px solid $under_line;
}
</style>

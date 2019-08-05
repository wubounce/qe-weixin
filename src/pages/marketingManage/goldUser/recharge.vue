<template>
  <el-dialog title="充值金币" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <el-form :model="rechargeForm" :rules="rechargeFormRules" ref="rechargeForm" label-width="125px" label-position="left" class="recharge-form">
      <el-form-item label="用户账号：" prop="name">
        <el-select v-model="rechargeForm.name" filterable remote clearable :loading="loading" :remote-method="getOperatorList" @change="changeOperator" placeholder="请填写用户手机号">
          <el-option v-for="item in operatorList" :key="item.id" :label="item.userName" :value="item.id" :ref="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用店铺：" prop="shopId">
        <el-select v-model="rechargeForm.shopId" filterable clearable placeholder="未选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金币金额(元)：" prop="date">
        <el-input v-model="rechargeForm.date" placeholder="请填写充值金额"></el-input>
      </el-form-item>
      <el-form-item label="金币本金(枚)：" prop="name">{{rechargeForm.date?rechargeForm.date*100:'' | numFormat}}</el-form-item>
      <el-form-item label="赠送金币(枚)：" prop="address">
        <el-input v-model="rechargeForm.address" placeholder="请填写赠送金币"></el-input>
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onHandleRecharge('rechargeForm')">确定</el-button>
        <el-button @click="resetForm('rechargeForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { delay } from '@/utils/tools';
import { shopListFun } from '@/service/report';
import { getByUserOperatornameFun } from '@/service/shop';
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
      operatorList: [{ userName: '', id: '' }],
      rechargeForm: {
        name: '',
        shopId: '',
        date: '',
        address: ''
      },
      rechargeFormRules: {
        name: [{ required: true, message: '请填写用户手机号码', trigger: 'blur' }],
        shopId: [{ required: true, message: '请选择适用店铺', trigger: 'blur' }],
        date: [{ required: true, message: '请填写充值金额', trigger: 'blur' }, { pattern: /^(([1-9][0-9]{1,3}|[1-9])(\.\d{1,2})?|0\.[1-9]{1,2})$/, message: '请填写1~9999之间数字', trigger: 'blur' }],
        address: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请填写赠送金币'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) <= 0 && Number(value) > 999900) {
                callback(new Error('请填写0~999,900之间数字'));
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
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    async getOperatorList(query) {
      if (query !== '') {
        this.loading = true;
        let payload = { username: query };
        let res = await getByUserOperatornameFun(payload);
        this.operatorList = res ? [{ userName: res.userName, id: res.id }] : [{ userName: '', id: '' }];
        this.loading = false;
      } else {
        this.operatorList = [{ userName: '', id: '' }];
      }
    },
    changeOperator(value) {
      this.rechargeForm.name = this.$refs[value][0].label || '';
    },
    resetForm(formName) {
      this.modalClose();
    },
    onHandleRecharge(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('hhhhh');
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

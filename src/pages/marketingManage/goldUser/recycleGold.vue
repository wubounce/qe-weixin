<template>
  <el-dialog title="金币回收" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <el-form :model="recycleForm" :rules="recycleRulesForm" ref="recycleForm" label-width="125px" label-position="left" class="recharge-recycleForm">
      <el-form-item label="用户账号：">
        {{ userInfo.phone }}
      </el-form-item>
      <el-form-item label="适用店铺：">
        {{ userInfo.shopName }}
      </el-form-item>
      <el-form-item label="金币本金(枚)：" prop="principalAmount">
        <el-input v-model.trim="recycleForm.principalAmount" :placeholder="userInfo.principalAmount > 0 ? `最多${userInfo.principalAmount}金币` : `请填写金币本金`"></el-input>
      </el-form-item>
      <el-form-item label="赠送金币(枚)：" prop="presentAmount">
        <el-input v-model.trim="recycleForm.presentAmount" :placeholder="userInfo.presentAmount > 0 ? `最多${userInfo.presentAmount}金币` : `请填写赠送金币`"></el-input>
      </el-form-item>
      <el-form-item label="金币金额(元)：">
        {{ recycleForm.principalAmount ? recycleForm.principalAmount / exchangeRate : '' | numFormat }}
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onHandleRecyle('recycleForm')">确定</el-button>
        <el-button @click="resetForm('recycleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { configTokenCoinFun, refillAndDeductFun } from '@/service/tokenCoin';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      restPresentAmount: 0,
      restPrincipalAmount: 0,
      exchangeRate: 100,
      recycleForm: {
        principalAmount: '',
        presentAmount: ''
      },
      recycleRulesForm: {
        principalAmount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请输入金币本金数目'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) > this.userInfo.principalAmount) {
                callback(new Error('金币本金数目超限'));
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
              } else if (Number(value) > this.userInfo.presentAmount) {
                callback(new Error('赠送金币数目超限'));
              } else if (Number(this.recycleForm.principalAmount) === 0 && Number(value) === 0) {
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
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getTokenCoinConfig() {
      let res = await configTokenCoinFun();
      this.exchangeRate = res.exchangeRate || 100;
    },
    resetForm(formName) {
      this.modalClose();
    },
    onHandleRecyle(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          this.$confirm('确认要回收用户金币吗?', '提示', {
            showClose: false,
            center: true
          }).then(() => {
            let payload = Object.assign({ type: 2, phone: this.userInfo.phone, shopId: this.userInfo.shopId }, this.recycleForm);
            refillAndDeductFun(payload).then(() => {
              this.modalClose();
              setTimeout(() => {
                this.$Message.success('回收成功');
                this.$listeners.getGoldUserDataToTable && this.$listeners.getGoldUserDataToTable(); //若组件传递事件confirm则执行
              }, 1000);
            });
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.recharge-recycleForm {
  padding-top: 24px;
}
.action {
  text-align: right;
  padding: 16px 0;
  border-top: 1px solid $under_line;
}
</style>

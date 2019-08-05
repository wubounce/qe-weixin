<template>
  <el-dialog title="金币回收" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" label-position="left" class="recharge-ruleForm">
      <el-form-item label="用户账号：">
        dfasdfsdfsdfddf
      </el-form-item>
      <el-form-item label="适用店铺：">
        dfasdfsdfsdfddf
      </el-form-item>
      <el-form-item label="金币本金(枚)：" prop="date">
        <el-input v-model="ruleForm.date" placeholder="请填写金币本金"></el-input>
      </el-form-item>
      <el-form-item label="赠送金币(枚)：" prop="address">
        <el-input v-model="ruleForm.address" placeholder="请填写赠送金币"></el-input>
      </el-form-item>
      <el-form-item label="金币金额(元)：">
        {{ruleForm.date?ruleForm.date/100:'' | numFormat}}
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseGold: 1500,
      basePresent: 1500,
      ruleForm: {
        date: 1500,
        address: 1500
      },
      rules: {
        date: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请输入金币本金数目'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) <= 0 || Number(value) > this.baseGold) {
                callback(new Error(`不能大于剩余的余额${this.baseGold}`));
              } else {
                callback();
              }
            }
          }
        ],
        address: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              let reg = /^[0-9]*$/;
              if (!value) {
                callback(new Error('请输入赠送金币数目'));
              } else if (!reg.test(value)) {
                callback(new Error('不支持输入小数点'));
              } else if (Number(value) <= 0 || Number(value) > this.basePresent) {
                callback(new Error(`不能大于剩余的余额${this.basePresent}`));
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
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    resetForm(formName) {
      this.modalClose();
    },
    submitForm(formName) {
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
.recharge-ruleForm {
  padding-top: 24px;
}
.action {
  text-align: right;
  padding: 16px 0;
  border-top: 1px solid $under_line;
}
</style>

<template>
  <el-dialog title="充值金币" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="457px">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" label-position="left" class="recharge-ruleForm">
      <el-form-item label="用户账号：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请填写用户手机号"></el-input>
      </el-form-item>
      <el-form-item label="适用店铺：" prop="region">
        <el-select v-model="ruleForm.region" filterable clearable placeholder="未选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="金币金额(元)：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请填写充值金额"></el-input>
      </el-form-item>
      <el-form-item label="金币本金(枚)：" prop="name">加加加啊</el-form-item>
      <el-form-item label="赠送金币(枚)：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请填写赠送金币"></el-input>
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
    },
    shopIds: {
      type: String,
      default: ''
    },
    shopList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      ruleForm: {
        name: '',
        region: ''
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }, { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        region: [{ required: true, message: '请选择活动区域', trigger: 'change' }]
      }
    };
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
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

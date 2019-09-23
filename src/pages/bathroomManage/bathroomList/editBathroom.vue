<template>
  <el-dialog title="编辑浴室" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="520px">
    <el-form ref="bathroomFrom" :model="bathroomFrom" :rules="bathroomFromRules" class="edit-bathroom-from" label-width="120px">
      <el-form-item label="浴室名称：" prop="bathroomName">
        <el-input v-model="bathroomFrom.bathroomName" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopIds">
        <el-select v-model="bathroomFrom.shopId" filterable clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约功能：" prop="reserve">
        <el-radio-group v-model="bathroomFrom.reserve" disabled>
          <el-radio :label="0">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预约时长(分钟)：">
        <span>10</span>
      </el-form-item>
      <el-form-item label="适用性别：" prop="gender">
        <el-radio-group v-model="bathroomFrom.gender">
          <el-radio :label="0">不限</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="违约惩罚：" prop="punishment">
        <el-radio-group v-model="bathroomFrom.punishment">
          <el-radio :label="0">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="pay-tip" v-show="bathroomFrom.punishment===0">
        <el-tooltip placement="bottom-start" class="gold-tip" content="持续放水最长时间">
          <svg-icon icon-class="zhibiaoshuoming" class="zhibiaoshuoming" />
        </el-tooltip>
        <el-form-item label="违约次数：" prop="breakNum">
          <el-input v-model.number="bathroomFrom.breakNum" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <div class="pay-tip" v-show="bathroomFrom.punishment===0">
        <el-tooltip placement="bottom-start" class="gold-tip" content="0代表永久禁止预约">
          <svg-icon icon-class="zhibiaoshuoming" class="zhibiaoshuoming reserve" />
        </el-tooltip>
        <el-form-item label="禁止预约(天)：" prop="breakDay">
          <el-input v-model.number="bathroomFrom.breakDay" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="bathroomFrom.status">
          <el-radio :label="0">营业中</el-radio>
          <el-radio :label="1">暂停营业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="浴室数量：">
        <span>10</span>
      </el-form-item>

      <el-form-item class="action">
        <el-button type="primary" @click="onSubmitAddOrEditMaketFrom('bathroomFrom')">确定</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { shopListFun } from '@/service/report';
export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    limitedDiscountId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shopList: [],
      bathroomFrom: {
        bathroomName: '',
        shopIds: '',
        reserve: '',
        gender: 0,
        punishment: 0,
        breakNum: '',
        breakDay: '',
        status: 0
      },
      bathroomFromRules: {
        bathroomName: [{ required: true, message: '请输入', trigger: 'blur' }],
        shopIds: [{ required: true, trigger: 'change', message: '请选择适用店铺' }],
        reserve: [{ required: true, trigger: 'change', message: '请选择预约功能' }],
        gender: [{ required: true, trigger: 'change', message: '请选择适用性别' }],
        punishment: [{ required: true, trigger: 'change', message: '请选择违约惩罚' }],
        status: [{ required: true, trigger: 'change', message: '请选择状态' }],
        breakNum: [{ required: true, message: '请输入梯度值', trigger: 'blur' }, { type: 'number', max: 9999, message: '请输入大于等于0的整数', trigger: 'blur' }],
        breakDay: [{ required: true, message: '请输入梯度值', trigger: 'blur' }, { type: 'number', max: 9999, message: '请输入大于等于0的整数', trigger: 'blur' }]
      },
      machineParentType: [],
      hasShop: true
    };
  },
  mounted() {
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
    onSubmitAddOrEditMaketFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(12323);
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.edit-bathroom-from {
  padding-top: 24px;
  padding-bottom: 24px;
  .action {
    padding-top: 16px;
    border-top: 1px solid $under_line;
    text-align: right;
  }
  /deep/ .el-input__inner {
    width: 300px !important;
  }
}
.pay-tip {
  position: relative;
  .zhibiaoshuoming {
    position: absolute;
    left: 7px;
    top: 9px;
    color: $menuText;
  }
  .reserve {
    left: -15px;
  }
}
</style>

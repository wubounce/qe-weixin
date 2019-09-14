<template>
  <el-dialog title="补偿券发放" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="540px" top="20px">
    <el-form ref="compensateFrom" :model="compensateFrom" :rules="compensateFormRules" class="add-shop-from" label-width="120px">
      <el-form-item label="发放用户：" class="shop-name">
        <span>{{compensateFrom.phone}}</span>
      </el-form-item>
      <el-form-item label="适用店铺：">
        <span>{{compensateFrom.shopName}}</span>
      </el-form-item>
      <el-form-item label="适用类型：" prop="parentTypeId">
        <el-select v-model="compensateFrom.parentTypeId" placeholder="请选择" v-if="machineParentTypeList.length>0">
          <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select placeholder="请选择" v-else>
          <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无适用类型</span>
        </el-select>
      </el-form-item>
      <el-form-item label="补偿金额(元)：" prop="compensateMoney">
        <el-input v-model="compensateFrom.compensateMoney" placeholder="请填写" maxlength="5"></el-input>
      </el-form-item>
      <el-form-item label="满减金额(元)：" prop="conditionMoney">
        <el-col :span="9">
          <el-input v-model="compensateFrom.conditionMoney" placeholder="请填写" maxlength="5"></el-input>
        </el-col>
        <el-col :span="15" style=" color: rgba(23, 26, 46, 0.45);">满{{compensateFrom.conditionMoney}}可用 </el-col>
      </el-form-item>
      <el-form-item label="有效期(天)：" prop="validDays">
        <el-col :span="9">
          <el-input v-model="compensateFrom.validDays" placeholder="请填写" maxlength="3"></el-input>
        </el-col>
        <el-col :span="15" style=" color: rgba(23, 26, 46, 0.45);">有效期至{{validDaysEnd}}</el-col>
      </el-form-item>
      <el-form-item label="发放数量(张)：" prop="compensateNumber">
        <span>{{compensateFrom.compensateNumber}}张</span>
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onSubmitCompensateFrom('compensateFrom')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { compensateFun } from '@/service/order';
import { getlistParentTypeFun } from '@/service/device';
import { validatPrice } from '@/utils/validate';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    initCompensateForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    const validateCompensateMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补偿金额不能为空'));
      } else if (!validatPrice(value)) {
        callback(new Error('补偿金额需大于0不超过99，支持两位小数'));
      } else if (Number(value) > this.compensateFrom.markPrice) {
        callback(new Error('补偿金额不能超过订单原价'));
      } else {
        callback();
      }
    };
    const validateConditionMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('满减金额不能为空'));
      } else if (!validatPrice(value)) {
        callback(new Error('满减金额需大于0不超过99，支持两位小数'));
      } else if (Number(value) !== 0 && Number(value) < Number(this.compensateFrom.compensateMoney)) {
        callback(new Error('满减金额不能小于补偿金额'));
      } else {
        callback();
      }
    };
    return {
      machineParentTypeList: [],
      compensateFrom: {
        parentTypeId: '',
        compensateMoney: '',
        conditionMoney: '',
        validDays: 7,
        compensateNumber: 1,
        memberId: '',
        shopName: '',
        orderNo: '',
        phone: '',
        markPrice: '',
        shopId: ''
      },
      compensateDialogVisible: false,
      compensateFormRules: {
        parentTypeId: [{ required: true, trigger: 'change', message: '请选择适用类型' }],
        compensateMoney: [{ trigger: 'blur', validator: validateCompensateMoney }],
        conditionMoney: [{ trigger: 'blur', validator: validateConditionMoney }],
        validDays: [{ required: true, message: '有效期不能为空', trigger: 'blur' }, { pattern: /^([1-9]\d{0,2})$/, message: '请输入1-999之间的数字，无小数', trigger: 'blur' }]
      }
    };
  },
  computed: {
    validDaysEnd: function() {
      return moment()
        .add(this.compensateFrom.validDays, 'days')
        .format('YYYY-MM-DD');
    }
  },
  mounted() {
    this.compensateFrom.parentTypeId = this.initCompensateForm.parentTypeId;
    this.compensateFrom.compensateMoney = this.initCompensateForm.markPrice;
    this.compensateFrom.conditionMoney = this.initCompensateForm.markPrice;
    this.compensateFrom.memberId = this.initCompensateForm.userId;
    this.compensateFrom.shopName = this.initCompensateForm.shopName;
    this.compensateFrom.orderNo = this.initCompensateForm.orderNo;
    this.compensateFrom.phone = this.initCompensateForm.phone;
    this.compensateFrom.markPrice = this.initCompensateForm.markPrice;
    this.compensateFrom.shopId = this.initCompensateForm.shopId;
    this.getmachineParentType(this.initCompensateForm.shopId);
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getmachineParentType(shopId = '') {
      //获取设备类型
      let res = await getlistParentTypeFun({ shopId: shopId });
      this.machineParentTypeList = res.length > 0 ? [{ id: '全部', name: '全部' }, ...res] : [];
      if (!this._.find(this.machineParentTypeList, { id: this.compensateFrom.parentTypeId })) {
        this.machineParentTypeList.push({ id: this.compensateFrom.parentTypeId, name: this.initCompensateForm.parentTypeName });
      }
    },
    onSubmitCompensateFrom(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = Object.assign({}, this.compensateFrom);
          payload.parentTypeId = payload.parentTypeId == '全部' ? '' : payload.parentTypeId;
          await compensateFun(payload);
          this.$Message.success('恭喜你，操作成功！');
          this.modalClose();
          this.$listeners.getOrderDataToTable && this.$listeners.getOrderDataToTable();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
  .action {
    padding-top: 16px;
    border-top: 1px solid $under_line;
    text-align: right;
  }
}
</style>

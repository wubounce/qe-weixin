<template>
  <el-dialog title="新增批量启动" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="540px">
    <el-form :model="addDeviceBatchStartForm" ref="addDeviceBatchStartForm" :rules="addDeviceBatchStartFormRules" class="batch-device-edit-wrap" label-position="left">
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="addDeviceBatchStartForm.shopId" placeholder="请选择" @change="changeBatchMachineype">
          <el-option v-for="(item,index) in shopBatchStartList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型：" prop="machineParentTypeId">
        <el-select v-model="addDeviceBatchStartForm.machineParentTypeId" placeholder="请选择" @change="changeBatchFuncionList">
          <el-option v-for="(item,index) in addBatchStartMachineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启动模式：" prop="standardFunctionId">
        <el-select v-model="addDeviceBatchStartForm.standardFunctionId" placeholder="请选择">
          <el-option v-for="(item,index) in addBatchStartFunctionList" :key="index" :label="item.functionName" :value="item.functionId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启动方式：" prop="standardFunctionAction">
        <el-radio-group v-model="addDeviceBatchStartForm.standardFunctionAction" @change="nowAndTimingStartAction">
          <el-radio :label="0">立即启动</el-radio>
          <el-radio :label="1">定时启动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="启动时间：" prop="startTime" class="add-batch-time" v-if="isNowAndTimingStartAction">
        <el-date-picker v-model="addDeviceBatchStartForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="batch-device-edit-action">
        <el-button type="primary" @click="onSubmitAddDeviceStart('addDeviceBatchStartForm')">保存</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { listShopBatchStartFun } from '@/service/device';
import { getFunctionListFun, addBatchStartFun } from '@/service/todoList';
import { getlistParentTypeFun } from '@/service/device';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //批量添加启动
      shopBatchStartList: [],
      addBatchStartMachineParentTypeList: [],
      addBatchStartFunctionList: [],
      isNowAndTimingStartAction: false,
      addDeviceBatchStartForm: {
        shopId: '',
        machineParentTypeId: '',
        standardFunctionId: '',
        standardFunctionAction: '',
        startTime: ''
      },
      addDeviceBatchStartFormRules: {
        shopId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        machineParentTypeId: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        standardFunctionId: [{ required: true, message: '请选择启动模式', trigger: 'change' }],
        standardFunctionAction: [{ required: true, message: '请选择启动方式', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
      }
    };
  },
  components: {},
  created() {
    this.getshopBatchStartList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getshopBatchStartList() {
      //获取批量添加店铺列表
      let res = await listShopBatchStartFun();
      this.shopBatchStartList = res;
    },
    async changeBatchMachineype(val) {
      //根据店铺获取一级类型
      let payload = { shopId: val, batchStart: true };
      let res = await getlistParentTypeFun(payload);
      this.addBatchStartMachineParentTypeList = res || [];
      this.addDeviceBatchStartForm.machineParentTypeId = '';
      this.addDeviceBatchStartForm.standardFunctionId = '';
    },
    async changeBatchFuncionList(val) {
      //根据店铺和一级类型获取启动模式
      let payload = { shopId: this.addDeviceBatchStartForm.shopId, machineParentTypeId: val };
      let res = await getFunctionListFun(payload);
      this.addBatchStartFunctionList = res || [];
      this.addDeviceBatchStartForm.standardFunctionId = '';
    },
    nowAndTimingStartAction(val) {
      val === 1 ? (this.isNowAndTimingStartAction = true) : (this.isNowAndTimingStartAction = false);
    },
    onSubmitAddDeviceStart(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.addDeviceBatchStartForm);
          addBatchStartFun(payload).then(() => {
            this.$message.success('添加成功');
            this.modalClose();
            this.$listeners.getBatchStartDataToTable && this.$listeners.getBatchStartDataToTable();
          });
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
.batch-device-edit-wrap {
  color: #8c8c8c;
  padding-top: 16px;
}
.add-batch-time /deep/ .el-input__inner {
  width: 220px !important;
  padding-left: 30px !important;
}
.batch-device-edit-action {
  border-top: 1px solid $under_line;
  padding-top: 16px;
  padding-bottom: 16px;
  text-align: right;
}
/deep/ .el-date-editor--datetime .el-icon-time:after {
  position: absolute;
  width: 160px !important;
  cursor: pointer;
}
</style>

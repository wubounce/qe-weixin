<template>
  <el-form :model="deviceEditForm" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
    <p class="device-type">设备类型：{{deviceEditForm.parentTypeName}}<span>|</span>设备型号：{{deviceEditForm.subTypeName}}</p>
    <el-form-item label="批量编辑选择：" class="check-batch-funtion">
      <el-radio-group v-model="checkBatchFuntion">
        <el-radio :label="1">功能设置</el-radio>
        <el-radio :label="2" v-if="deviceEditForm.parentTypeName === '洗衣机'">洗衣液属性</el-radio>
        <el-radio :label="3" v-if="deviceEditForm.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">其他属性</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-table :data="functionJson" style="width: 100%" v-if="checkBatchFuntion === 1">
      <el-table-column prop="functionName" label="功能"></el-table-column>
      <el-table-column prop="needMinutes" label="耗时/分钟" v-if="deviceEditForm.subTypeName !== '通用脉冲充电桩'">
        <template slot-scope="scope">
          <el-form-item :prop="'functionJson.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.needMinutes'>
            <el-input v-model="functionJson[scope.$index].needMinutes">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="functionPrice" label="原价/元">
        <template slot-scope="scope">
          <el-form-item :prop="'functionJson.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.functionPrice'>
            <el-input v-model="functionJson[scope.$index].functionPrice">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="functionCode" label="脉冲数" v-if="deviceEditForm.communicateType == 0">
        <template slot-scope="scope">
          <el-form-item :prop="'functionJson.' + scope.$index + '.functionCode'" :rules='deviceEditFormRules.functionCode'>
            <el-input v-model="functionJson[scope.$index].functionCode">
            </el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="ifOpenStatus" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="functionJson[scope.$index].ifOpenStatus">
          </el-switch>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="checkBatchFuntion === 2&&deviceEditForm.parentTypeName === '洗衣机'">
      <el-form-item label="洗衣液功能" prop="isOpenDetergent" class="edit-isOpenDetergent">
        <el-switch v-model="deviceEditForm.isOpenDetergentStatus">
        </el-switch>
      </el-form-item>
      <el-table :data="detergentJson" style="width: 100%">
        <el-table-column prop="functionName" label="功能"></el-table-column>
        <el-table-column prop="detergentLiquid" label="用量/ml">
          <template slot-scope="scope">
            <el-form-item :prop="'detergentJson.' + scope.$index + '.detergentLiquid'" :rules='deviceEditFormRules.detergentLiquid'>
              <el-input v-model="detergentJson[scope.$index].detergentLiquid">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="functionPrice" label="原价/元">
          <template slot-scope="scope">
            <el-form-item :prop="'detergentJson.' + scope.$index + '.detergentPrice'" :rules='deviceEditFormRules.detergentPrice'>
              <el-input v-model="detergentJson[scope.$index].detergentPrice">
              </el-input>
            </el-form-item>
          </template></el-table-column>
      </el-table>
    </div>
    <el-table :data="deviceEditForm.waterLevel" style="width: 100%" v-if="checkBatchFuntion === 3&&deviceEditForm.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">
      <el-table-column prop="functionName" label="属性名称">
        <template slot-scope="scope">
          <span>水位设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="needMinutes" label="属性值">
        <template slot-scope="scope">
          <el-form-item prop="waterLevel" class="edit-waterLevel">
            <el-select v-model="deviceEditForm.waterLevel" placeholder="请选择">
              <el-option v-for="(item,index) in waterLevelList" :key="index" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="functionPrice" label="属性说明">
        <template slot-scope="scope">
          <span>控制洗衣模式最大</span>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item class="action">
      <el-button type="primary" @click="onEditDecive('deviceEditForm')">确定</el-button>
      <el-button @click="resetForm('deviceEditForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import { getFunctionSetListFun, batchEditFun, batchEditDetergentFun } from '@/service/device';
export default {
  props: ['deviceEditdetailForm', 'visible'],
  data() {
    var validatorFunctionPrice = (rule, value, callback) => {
      let reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //可带二位小数的正整数
      if (!reg.test(value)) {
        return callback(new Error('最多保留2位小数'));
      } else if (Number(value) > 99) {
        return callback(new Error('请输入0-99之间的数字'));
      } else {
        callback();
      }
    };
    return {
      waterLevelList: [{ value: '1', name: '极低水位' }, { value: '2', name: '低水位' }, { value: '3', name: '中水位' }, { value: '4', name: '高水位' }],
      checkBatchFuntion: 1,
      deviceEditForm: this.deviceEditdetailForm,
      functionJson: [], //直接无法校验
      detergentJson: this.deviceEditdetailForm.detergentFunctionList,
      deviceEditFormRules: {
        machineName: [{ required: true, message: '请填写设备名称', trigger: 'blur' }],
        needMinutes: [{ required: true, message: '请填写耗时', trigger: 'blur' }, { pattern: /^([1-9]\d{0,3})$/, message: '请输入1-9999之间的数字', trigger: 'blur' }],
        functionPrice: [{ required: true, message: '请填写原价', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }],
        functionCode: [{ required: true, message: '请填写脉冲', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentLiquid: [{ required: true, message: '请填写用量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentPrice: [{ required: true, message: '请填写洗衣液价格', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }]
      }
    };
  },
  components: {},
  mounted() {},
  created() {
    this.getFunctionSetList();
  },
  methods: {
    async getFunctionSetList() {
      let payload = Object.assign({}, { subTypeId: this.deviceEditForm.subTypeId, shopId: this.deviceEditForm.shopId });
      let res = await getFunctionSetListFun(payload);
      this.functionJson = res.list;
      this.deviceEditForm.communicateType = res.communicateType;
      this.deviceEditForm.functionTempletType = res.functionTempletType;
      this.functionJson.forEach(item => {
        item.ifOpen === 0 ? (item.ifOpenStatus = true) : (item.ifOpenStatus = false);
      });
    },
    onEditDecive(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.checkBatchFuntion === 1 || this.checkBatchFuntion === 3) {
            let ifOpenLen = 0;
            this.functionJson.forEach(item => {
              if (item.ifOpenStatus === false) {
                item.ifOpen = 1;
                ifOpenLen = ifOpenLen + 1;
              } else {
                item.ifOpen = 0;
              }
            });
            if (ifOpenLen === this.functionJson.length) {
              this.$Message.error('请至少开启一项功能');
              return false;
            }
            let payload = Object.assign({}, { subTypeId: this.deviceEditForm.subTypeId, shopId: this.deviceEditForm.shopId, functionTempletType: this.deviceEditForm.functionTempletType, waterLevel: this.deviceEditForm.waterLevel });
            payload.functionJson = JSON.stringify(this.functionJson);
            batchEditFun(payload).then(() => {
              this.$Message.success('批量编辑成功');
              this.visible = false;
              this.$emit('closeBatchDeviceEdit', this.visible);
            });
          }
          if (this.checkBatchFuntion === 2) {
            this.deviceEditForm.isOpenDetergentStatus === true ? (this.deviceEditForm.isOpenDetergent = 1) : (this.deviceEditForm.isOpenDetergent = 0);
            let payload = Object.assign({}, { subTypeId: this.deviceEditForm.subTypeId, shopId: this.deviceEditForm.shopId, isOpenDetergent: this.deviceEditForm.isOpenDetergent });
            payload.detergentJson = JSON.stringify(this.detergentJson);
            batchEditDetergentFun(payload).then(() => {
              this.$Message.success('批量编辑成功');
              this.visible = false;
              this.$emit('closeBatchDeviceEdit', this.visible);
            });
          }
        } else {
          this.$Message.error('请填写完整信息');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.visible = false;
      this.$emit('closeBatchDeviceEdit', this.visible);
    }
  },
  watch: {
    deviceEditdetailForm: function(val) {
      this.deviceEditForm = val;
      this.deviceEditForm.functionJson = val.functionList; //直接无法校验
      this.deviceEditForm.detergentJson = val.detergentFunctionList;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.device-type {
  color: #8c8c8c;
  padding-top: 16px;
  span {
    padding: 0 25px;
  }
}
.check-batch-funtion {
  margin-top: 18px;
}
.action {
  text-align: right;
  padding: 16px 0 24px 0;
}
</style>

<template>
  <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
    <el-form-item prop="machineName" label="设备名称" label-width="80px" class="edit-device-name">
      <el-input v-model="deviceEditForm.machineName"></el-input>
    </el-form-item>
    <el-tabs v-model="deviceEditTab">
      <el-tab-pane label="功能设置" name="first">
        <div v-if="deviceEditForm.afterPay">
          <el-form-item label="价格设置：" prop="waterMachinePirce" class="water-machine-pirce">
            <div class="add-discount">
              <el-input v-model="deviceEditForm.waterMachinePirce" placeholder="例：1"></el-input>
              <span style="position: absolute;left: 220px;color:#bfbfbf;">元/升</span>
            </div>
          </el-form-item>
          <el-table :data="deviceEditForm.functionList" style="width: 100%">
            <el-table-column prop="functionName" label="出水口"></el-table-column>
            <el-table-column prop="ifOpenStatus" label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.ifOpenStatus">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <el-table :data="deviceEditForm.functionList" style="width: 100%" v-if="deviceEditForm.afterPay===false">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="needMinutes" label="耗时/分钟" v-if="deviceEditForm.subTypeName !== '通用脉冲充电桩'">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.needMinutes'>
                <el-input v-model="scope.row.needMinutes">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionPrice" label="原价/元">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.functionPrice'>
                <el-input v-model="scope.row.functionPrice">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionCode" label="脉冲数" v-if="deviceEditForm.communicateType == 0">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.functionCode'" :rules='deviceEditFormRules.functionCode'>
                <el-input v-model="scope.row.functionCode">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="ifOpenStatus" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.ifOpenStatus">
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="洗衣液设置" name="second" v-if="deviceEditForm.parentTypeName === '洗衣机'">
        <el-form-item label="洗衣液功能" prop="isOpenDetergent" class="edit-isOpenDetergent">
          <el-switch v-model="deviceEditForm.isOpenDetergentStatus">
          </el-switch>
        </el-form-item>
        <el-table :data="deviceEditForm.detergentFunctionList" style="width: 100%">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="detergentLiquid" label="用量/ml">
            <template slot-scope="scope">
              <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentLiquid'" :rules='deviceEditFormRules.detergentLiquid'>
                <el-input v-model="scope.row.detergentLiquid">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionPrice" label="原价/元">
            <template slot-scope="scope">
              <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentPrice'" :rules='deviceEditFormRules.detergentPrice'>
                <el-input v-model="scope.row.detergentPrice">
                </el-input>
              </el-form-item>
            </template></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="其他属性设置" name="third" v-if="deviceEditForm.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">
        <el-table :data="deviceEditForm.waterLevel" style="width: 100%">
          <el-table-column prop="functionName" label="属性名称">
            <template slot-scope="scope">
              <span>水位设置</span>
            </template>
          </el-table-column>
          <el-table-column prop="waterLevel" label="属性值">
            <template slot-scope="scope">
              <el-form-item prop="waterLevel" class="edit-waterLevel">
                <el-select v-model="scope.row.waterLevel" placeholder="请选择">
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
      </el-tab-pane>
    </el-tabs>
    <el-form-item class="action">
      <el-button type="primary" @click="onEditDecive('deviceEditForm')">确定</el-button>
      <el-button @click="resetForm('deviceEditForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import { deviceAddorEditFun } from '@/service/device';
export default {
  props: {
    deviceEditdetailForm: {
      type: Object,
      default: () => {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: null
    }
  },
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
      deviceEditTab: 'first',
      waterLevelList: [{ value: '1', name: '极低水位' }, { value: '2', name: '低水位' }, { value: '3', name: '中水位' }, { value: '4', name: '高水位' }],
      deviceEditForm: this.deviceEditdetailForm,
      deviceEditFormRules: {
        machineName: [{ required: true, message: '请填写设备名称', trigger: 'blur' }],
        needMinutes: [{ required: true, message: '请填写耗时', trigger: 'blur' }, { pattern: /^([1-9]\d{0,3})$/, message: '请输入1-9999之间的数字', trigger: 'blur' }],
        functionPrice: [{ required: true, message: '请填写原价', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }],
        waterMachinePirce: [{ required: true, message: '请填写价格', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }],
        functionCode: [{ required: true, message: '请填写脉冲', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentLiquid: [{ required: true, message: '请填写用量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentPrice: [{ required: true, message: '请填写洗衣液价格', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }]
      }
    };
  },
  components: {},
  mounted() {
    this.$set(this.deviceEditForm, 'waterMachinePirce', this.deviceEditForm.functionList[0].functionPrice || '');
  },
  methods: {
    onEditDecive(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ifOpenLen = 0;
          this.deviceEditForm.isOpenDetergentStatus === true ? (this.deviceEditForm.isOpenDetergent = 1) : (this.deviceEditForm.isOpenDetergent = 0);
          this.deviceEditForm.functionList.forEach(item => {
            if (item.ifOpenStatus === false) {
              item.ifOpen = 1;
              ifOpenLen = ifOpenLen + 1;
            } else {
              item.ifOpen = 0;
            }
            if (this.deviceEditForm.subTypeName === '彩亿KSQ_QIEKJ_01') {
              item.functionPrice = this.deviceEditForm.waterMachinePirce;
            }
          });
          if (ifOpenLen === this.deviceEditForm.functionList.length) {
            this.$Message.error('请至少开启一项功能');
            return false;
          }
          let payload = Object.assign({}, this.deviceEditForm);
          payload.functionJson = JSON.stringify(this.deviceEditForm.functionList);
          payload.detergentJson = JSON.stringify(this.deviceEditForm.detergentFunctionList);
          delete payload.functionList;
          delete payload.detergentFunctionList;
          deviceAddorEditFun(payload).then(() => {
            this.$Message.success('编辑成功');
            this.visible = false;
            this.$emit('closeDeviceEdit', this.visible);
          });
        } else {
          this.$Message.error('请填写完整信息');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.visible = false;
      this.$emit('closeDeviceEdit', this.visible);
    }
  },
  watch: {
    deviceEditdetailForm: function(val) {
      this.deviceEditForm = val;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.edit-device-name {
  padding-top: 16px;
}
.action {
  text-align: right;
  padding: 16px 0 24px 0;
}
.add-discount {
  display: flex;
}
</style>

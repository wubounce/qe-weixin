<template>
  <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
    <el-form-item prop="machineName" label="设备名称" label-width="80px" class="edit-device-name">
      <el-input v-model.trim="deviceEditForm.machineName"></el-input>
    </el-form-item>
    <el-tabs v-model="deviceEditTab">
      <el-tab-pane label="功能设置" name="first">
        <div v-if="deviceEditForm.notQuantitative">
          <el-form-item label="价格设置：" prop="waterAndChargeMachinePirce" class="water-machine-pirce">
            <div class="add-discount">
              <el-input v-model="deviceEditForm.waterAndChargeMachinePirce" placeholder="例：1"></el-input>
              <span style="position: absolute;left: 220px;color:#bfbfbf;">元/升</span>
            </div>
          </el-form-item>
          <el-table :data="deviceEditForm.functionList" style="width: 100%">
            <el-table-column prop="functionName" label="出水口"></el-table-column>
            <el-table-column prop="ifOpenStatus" label="状态" header-align="right" align="right">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.ifOpenStatus">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
          <p class="water-tip">1、关闭出水口开关用户则无法使用对应出水口接水 <br />2、此型号每个脉冲出水 1000 ml</p>
        </div>
        <div v-if="deviceEditForm.subTypeId === '435871915014357627'">
          <el-form-item label="充电单价：" prop="waterAndChargeMachinePirce">
            <div class="add-discount">
              <el-input v-model="deviceEditForm.waterAndChargeMachinePirce" disabled></el-input>
              <span style="position: absolute;left: 220px;color:#bfbfbf;">元/小时</span>
            </div>
          </el-form-item>
          <el-form-item label="可选时间范围：">
            <el-col :span="5">
              <el-select v-model="deviceEditForm.extraAttr.min" disabled placeholder="请选择">
                <el-option :label="deviceEditForm.extraAttr.min+'小时'" :value="deviceEditForm.extraAttr.min"></el-option>
              </el-select>
            </el-col>
            <el-col class="line" :span="1">-</el-col>
            <el-col :span="5">
              <el-select v-model="deviceEditForm.extraAttr.max" disabled placeholder="请选择">
                <el-option :label="deviceEditForm.extraAttr.max+'小时'" :value="deviceEditForm.extraAttr.max"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="单位刻度时间：" prop="waterAndChargeMachinePirce">
            <div class="add-discount">
              <el-select v-model="deviceEditForm.extraAttr.step" disabled placeholder="请选择">
                <el-option :label="deviceEditForm.extraAttr.step+'小时'" :value="deviceEditForm.extraAttr.step"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="推荐充电时间：" prop="waterAndChargeMachinePirce">
            <div class="add-discount">
              <el-select v-model="deviceEditForm.extraAttr.default" disabled placeholder="请选择">
                <el-option :label="deviceEditForm.extraAttr.default+'小时'" :value="deviceEditForm.extraAttr.default"></el-option>
              </el-select>
            </div>
          </el-form-item>
          <div class="charge-control">
            <h2>
              <span>充电功率范围 (瓦)</span>
              <span style="float:right">
                <el-tooltip content="用户充电时间=用户选择时间 × 充电功率对应时间系数" placement="top">
                  <svg-icon icon-class="zhibiaoshuoming" />
                </el-tooltip>
                时间系数
              </span>
            </h2>
            <ul>
              <li>
                <el-col :span="2">低功率</el-col>
                <el-col :span="1">1</el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="5">
                  <el-form-item prop="power1">
                    <el-input v-model="deviceEditForm.extraAttr.power1" disabled></el-input>
                  </el-form-item>
                </el-col>
                <span style="float:right">{{deviceEditForm.extraAttr.ratio1}}</span>
              </li>
              <li>
                <el-col :span="2">中功率</el-col>
                <el-col :span="1">{{deviceEditForm.extraAttr.power1?deviceEditForm.extraAttr.power1+1:''}}</el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="5">
                  <el-form-item prop="machineName">
                    <el-input v-model="deviceEditForm.extraAttr.power2" disabled></el-input>
                  </el-form-item>
                </el-col>
                <span style="float:right">{{deviceEditForm.extraAttr.ratio2}}</span>
              </li>
              <li>
                <el-col :span="2">高功率</el-col>
                <el-col :span="1">{{deviceEditForm.extraAttr.power2?deviceEditForm.extraAttr.power2+1:''}}</el-col>
                <el-col class="line" :span="1">-</el-col>
                <el-col :span="5">
                  <el-form-item prop="machineName">
                    <el-input v-model="deviceEditForm.extraAttr.power3" disabled></el-input>
                  </el-form-item>
                </el-col>
                <span style="float:right">{{deviceEditForm.extraAttr.ratio3}}</span>
              </li>
            </ul>
          </div>
          <el-table :data="deviceEditForm.functionList" style="width: 100%">
            <el-table-column prop="functionName" label="充电口"></el-table-column>
            <el-table-column prop="ifOpenStatus" label="状态" header-align="right" align="right">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.ifOpenStatus">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
          <p class="water-tip">关闭充电口开关用户则无法使用对应充电口充电</p>
        </div>
        <el-table :data="deviceEditForm.functionList" style="width: 100%" v-if="deviceEditForm.notQuantitative===false&&deviceEditForm.subTypeId !== '435871915014357627'">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="needMinutes" label="耗时/分钟" v-if="deviceEditForm.subTypeName !== '通用脉冲充电桩'">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.needMinutes'>
                <el-input v-model.trim="scope.row.needMinutes">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionPrice" label="原价/元">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.functionPrice'>
                <el-input v-model.trim="scope.row.functionPrice">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionCode" label="脉冲数" v-if="deviceEditForm.communicateType == 0">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.functionCode'" :rules='deviceEditFormRules.functionCode'>
                <el-input v-model.trim="scope.row.functionCode">
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
      <el-tab-pane label="洗衣液设置" name="second" v-if="deviceEditForm.isDetergent === 1">
        <el-form-item label="洗衣液功能" prop="isOpenDetergent" class="edit-isOpenDetergent">
          <el-switch v-model="deviceEditForm.isOpenDetergentStatus">
          </el-switch>
        </el-form-item>
        <el-table :data="deviceEditForm.detergentFunctionList" style="width: 100%">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="detergentLiquid" label="用量/ml">
            <template slot-scope="scope">
              <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentLiquid'" :rules='deviceEditFormRules.detergentLiquid'>
                <el-input v-model.trim="scope.row.detergentLiquid">
                </el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="functionPrice" label="原价/元">
            <template slot-scope="scope">
              <el-form-item :prop="'detergentFunctionList.' + scope.$index + '.detergentPrice'" :rules='deviceEditFormRules.detergentPrice'>
                <el-input v-model.trim="scope.row.detergentPrice">
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
        waterAndChargeMachinePirce: [{ required: true, message: '请填写价格', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }],
        functionCode: [{ required: true, message: '请填写脉冲', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentLiquid: [{ required: true, message: '请填写用量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentPrice: [{ required: true, message: '请填写洗衣液价格', trigger: 'blur' }, { validator: validatorFunctionPrice, trigger: 'blur' }]
      },
      powerRangeList: []
    };
  },
  components: {},
  created() {
    this.$set(this.deviceEditForm, 'waterAndChargeMachinePirce', this.deviceEditForm.functionList[0].functionPrice || 0);
    this.$set(this.deviceEditForm, 'extraAttr', this.deviceEditForm.functionList[0].extraAttr || {});
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
            if (this.deviceEditForm.notQuantitative === true) {
              //开水机充电桩
              item.functionPrice = this.deviceEditForm.waterAndChargeMachinePirce;
            }
          });
          if (ifOpenLen === this.deviceEditForm.functionList.length) {
            this.$Message.error('请至少开启一项功能');
            return false;
          }
          let payload = Object.assign({}, this.deviceEditForm);
          payload.functionJson = JSON.stringify(this.deviceEditForm.functionList);
          payload.detergentJson = JSON.stringify(this.deviceEditForm.detergentFunctionList);
          payload.extraAttr = payload.extraAttr ? JSON.stringify(payload.extraAttr) : '';
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
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate();
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
<style  rel="stylesheet/scss" lang="scss">
.charge-control .el-form-item {
  padding-top: 10px;
  margin-bottom: 0 !important;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
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
.water-tip {
  color: $menuText;
  line-height: 24px;
  padding-top: 16px;
}
.charge-control {
  padding-bottom: 24px;
  h2 {
    font-size: 14px;
    font-weight: 600;
    height: 54px;
    line-height: 54px;
    background: rgba(250, 250, 250, 1);
    border-radius: 4px 4px 0px 0px;
    border-bottom: 1px solid $under_line;
    padding: 0 10px;
    color: #262626;
  }
  li {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid $under_line;
    padding: 0 10px;
  }
}
</style>

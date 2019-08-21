<template>
  <el-dialog title="编辑设备" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
      <el-form-item prop="machineName" label="设备名称" label-width="80px" class="edit-device-name">
        <el-input v-model.trim="deviceEditForm.machineName"></el-input>
      </el-form-item>
      <el-tabs v-model="deviceEditTab">
        <el-tab-pane label="功能设置" name="first">
          <div v-if="deviceEditForm.parentTypeName === '饮水机'&&isBoiledWater(deviceEditForm.support)">
            <el-form-item label="价格设置：" prop="waterMachinePirce">
              <div class="add-discount">
                <el-input v-model.trim="deviceEditForm.waterMachinePirce" maxlength="6" placeholder="例：1"></el-input>
                <span style="position: absolute;left: 220px;color:#bfbfbf;">元/{{isSupportDosage(deviceEditForm.support)?'升':'秒'}}</span>
              </div>
            </el-form-item>
            <el-form-item label="单位流量：" prop="waterMachineNeedMinutes" v-if="isSupportDosage(deviceEditForm.support)">
              <div class="add-discount">
                <el-input v-model.trim="deviceEditForm.waterMachineNeedMinutes" maxlength="5" placeholder="例：1"></el-input>
                <span style="position: absolute;left: 220px;color:#bfbfbf;">ml</span>
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
            <p class="water-tip"><span v-if="isSupportDosage(deviceEditForm.support)">1、</span>关闭出水口开关用户则无法使用对应出水口接水 <br /><span v-if="isSupportDosage(deviceEditForm.support)">2、单位流量为设备流量计每转1圈的流量</span></p>
          </div>
          <div v-if="deviceEditForm.subTypeId === '435871915014357627'">
            <el-form-item label="充电单价：" prop="chargeMachinePirce">
              <div class="add-discount">
                <el-input v-model.trim="deviceEditForm.chargeMachinePirce" maxlength="4"></el-input>
                <span style="position: absolute;left: 235px;color:#bfbfbf;">元/小时</span>
              </div>
            </el-form-item>
            <el-form-item label="可选时间范围：">
              <el-col :span="5">
                <el-select v-model="deviceEditForm.extraAttr.min" placeholder="请选择">
                  <el-option v-for="item in chargeTimeMax" v-show="item>=chargeTimeMin" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="5">
                <el-select v-model="deviceEditForm.extraAttr.max" placeholder="请选择">
                  <el-option v-for="item in chargeTimeMax" v-show="item>=chargeTimeMin" :key="item" :label="item" :value="item"></el-option>
                </el-select>
                <span style="position: absolute;left: 410px;color:#bfbfbf;">小时</span>
              </el-col>
            </el-form-item>
            <el-form-item label="单位刻度时间：">
              <div class="add-discount">
                <el-select v-model="deviceEditForm.extraAttr.step" placeholder="请选择">
                  <el-option label="0.5" :value="0.5"></el-option>
                  <el-option label="1" :value="1"></el-option>
                </el-select>
                <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
              </div>
            </el-form-item>
            <el-form-item label="推荐充电时间：">
              <div class="add-discount">
                <el-select v-model="deviceEditForm.extraAttr.default" placeholder="请选择">
                  <el-option v-for="item in ((1 / deviceEditForm.extraAttr.step) * deviceEditForm.extraAttr.max)" v-show="(item*deviceEditForm.extraAttr.step)>=deviceEditForm.extraAttr.min" :key="item" :label="(item*deviceEditForm.extraAttr.step)" :value="item*deviceEditForm.extraAttr.step"></el-option>
                </el-select>
                <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
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
                    <el-form-item prop="extraAttr.power1">
                      <el-input v-model.trim="deviceEditForm.extraAttr.power1"></el-input>
                    </el-form-item>
                  </el-col>
                  <span style="float:right">{{deviceEditForm.extraAttr.ratio1}}</span>
                </li>
                <li>
                  <el-col :span="2">中功率</el-col>
                  <el-col :span="1">{{deviceEditForm.extraAttr.power1 | getBeginPower}}</el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="5">
                    <el-form-item prop="extraAttr.power2">
                      <el-input v-model.trim="deviceEditForm.extraAttr.power2"></el-input>
                    </el-form-item>
                  </el-col>
                  <span style="float:right">
                    <el-form-item prop="extraAttr.ratio2">
                      <el-input v-model.trim="deviceEditForm.extraAttr.ratio2" maxlength="3"></el-input>
                    </el-form-item>
                  </span>
                </li>
                <li>
                  <el-col :span="2">高功率</el-col>
                  <el-col :span="1">{{deviceEditForm.extraAttr.power2 | getBeginPower}}</el-col>
                  <el-col class="line" :span="1">-</el-col>
                  <el-col :span="5">
                    <el-form-item prop="extraAttr.power3">
                      <el-input v-model.trim="deviceEditForm.extraAttr.power3"></el-input>
                    </el-form-item>
                  </el-col>
                  <span style="float:right">
                    <el-form-item prop="extraAttr.ratio3">
                      <el-input v-model.trim="deviceEditForm.extraAttr.ratio3" maxlength="3"></el-input>
                    </el-form-item>
                  </span>
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
          <el-table :data="deviceEditForm.functionList" style="width: 100%" v-if="isBoiledWater(deviceEditForm.support)===false&&deviceEditForm.subTypeId !== '435871915014357627'">
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
                  <el-input v-model.trim="scope.row.functionCode" maxlength="2">
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
                  <el-input v-model.trim="scope.row.detergentLiquid" maxlength="2">
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
        </el-tab-pane>
      </el-tabs>
      <el-form-item class="action">
        <el-button type="primary" @click="onEditDecive('deviceEditForm')">确定</el-button>
        <el-button @click="resetForm('deviceEditForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { deviceAddorEditFun } from '@/service/device';
import { validatNum } from '@/utils/validate';
import waterMixin from './waterMixin';
export default {
  mixins: [waterMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    deviceEditdetailForm: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    var validatorPower1 = (rule, value, callback) => {
      if (value <= 1) {
        return callback(new Error('功率必须大于1'));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error('功率必须为数字值,无小数'));
      } else {
        callback();
      }
    };
    var validatorPower2 = (rule, value, callback) => {
      let power = this.$options.filters.getBeginPower(this.deviceEditForm.extraAttr.power1);
      if (value <= power) {
        return callback(new Error(`功率必须大于${power}`));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error('功率必须为数字值,无小数'));
      } else {
        callback();
      }
    };
    var validatorPower3 = (rule, value, callback) => {
      let power = this.$options.filters.getBeginPower(this.deviceEditForm.extraAttr.power2);
      if (value <= power) {
        return callback(new Error(`功率必须大于${power}`));
      } else if (value > this.deviceEditForm.extraAttr.maxPower) {
        return callback(new Error(`请填写正确的功率范围数值`));
      } else if (!validatNum(value)) {
        callback(new Error('功率必须为数字值,无小数'));
      } else {
        callback();
      }
    };
    var validatorWterMachinePirce = (rule, value, callback) => {
      let reg1 = /^(([1-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0)$/;
      let reg2 = /^(([1-9]|[1-9][0-8])(\.\d{0,3})?|(([1-8][0-9])(\.\d{0,3})?)|0\.[1-9]{0,3}|99|99.0)$/;
      if ((this.deviceEditForm.support & 2) === 2) {
        if (!reg2.test(value)) {
          return callback(new Error(`请输入0-99之间的数字,最多保留3位小数`));
        } else {
          callback();
        }
      } else {
        if (!reg1.test(value)) {
          return callback(new Error(`请输入0-99之间的数字,最多保留2位小数`));
        } else {
          callback();
        }
      }
    };
    return {
      deviceEditTab: 'first',
      waterLevelList: [{ value: '1', name: '极低水位' }, { value: '2', name: '低水位' }, { value: '3', name: '中水位' }, { value: '4', name: '高水位' }],
      deviceEditForm: this.deviceEditdetailForm,
      deviceEditFormRules: {
        machineName: [{ required: true, message: '请填写设备名称', trigger: 'blur' }],
        needMinutes: [{ required: true, message: '请填写耗时', trigger: 'blur' }, { pattern: /^([1-9]\d{0,3})$/, message: '请输入1-9999之间的数字', trigger: 'blur' }],
        waterMachineNeedMinutes: [{ required: true, message: '请填写单位流量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,3})$/, message: '请输入1-9999之间的数字，无小数', trigger: 'blur' }],
        functionPrice: [{ required: true, message: '请填写原价', trigger: 'blur' }, { pattern: /^(([1-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0)$/, message: '请输入0-99之间的数字,最多保留2位小数', trigger: 'blur' }],
        waterMachinePirce: [{ required: true, message: '请填写价格', trigger: 'blur' }, { validator: validatorWterMachinePirce, trigger: 'blur' }],
        chargeMachinePirce: [{ required: true, message: '请填写价格', trigger: 'blur' }, { pattern: /^[0-4]{1}([.]{1}[0-9]{1,2})?$/, message: '充电单价不能超过5，支持小数点后两位', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请填写脉冲', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentLiquid: [{ required: true, message: '请填写用量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentPrice: [{ required: true, message: '请填写洗衣液价格', trigger: 'blur' }, { pattern: /^(([1-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0)$/, message: '请输入0-99之间的数字,最多保留2位小数', trigger: 'blur' }],
        'extraAttr.power1': [{ required: true, message: '请填写功率', trigger: 'blur' }, { validator: validatorPower1, trigger: 'blur' }],
        'extraAttr.power2': [{ required: true, message: '请填写功率', trigger: 'blur' }, { validator: validatorPower2, trigger: 'blur' }],
        'extraAttr.power3': [{ required: true, message: '请填写功率', trigger: 'blur' }, { validator: validatorPower3, trigger: 'blur' }],
        'extraAttr.ratio2': [{ required: true, message: '请填写系数', trigger: 'blur' }, { pattern: /^([0-1]\.[1-9])$/, message: '请输入0.1-1之间的数字，最多保留1位小数', trigger: 'blur' }],
        'extraAttr.ratio3': [{ required: true, message: '请填写系数', trigger: 'blur' }, { pattern: /^([0-1]\.[1-9])$/, message: '请输入0.1-1之间的数字，最多保留1位小数', trigger: 'blur' }]
      },
      //充电时间选择
      chargeTimeMax: 0,
      chargeTimeMin: 0,
      chargeTimeStep: 0
    };
  },
  components: {},
  filters: {
    getBeginPower(val) {
      return val ? +val + 1 : val;
    }
  },
  created() {
    this.$set(this.deviceEditForm, 'waterMachinePirce', this.deviceEditForm.functionList[0].functionPrice || 0);
    this.$set(this.deviceEditForm, 'waterMachineNeedMinutes', this.deviceEditForm.functionList[0].needMinutes || 0);
    this.$set(this.deviceEditForm, 'chargeMachinePirce', this.deviceEditForm.functionList[0].functionPrice || 0);
    this.$set(this.deviceEditForm, 'extraAttr', this.deviceEditForm.functionList[0].extraAttr || {});
    if (this.deviceEditForm.subTypeId === '435871915014357627') {
      let extraAttr = this.deviceEditForm.functionList.length > 0 ? (this.deviceEditForm.functionList[0].extraAttr ? this.deviceEditForm.functionList[0].extraAttr : {}) : {};
      let tmpext = Object.assign({}, extraAttr);
      this.chargeTimeMax = tmpext.max || 0;
      this.chargeTimeMin = tmpext.min || 0;
      this.chargeTimeStep = tmpext.step || 0;
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
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
            if (this.deviceEditForm.parentTypeName === '饮水机' && this.isBoiledWater(this.deviceEditForm.support)) {
              //开水机
              item.functionPrice = this.deviceEditForm.waterMachinePirce;
              item.needMinutes = this.deviceEditForm.waterMachineNeedMinutes;
            }
            if (this.deviceEditForm.subTypeId === '435871915014357627') {
              //充电桩
              item.functionPrice = this.deviceEditForm.chargeMachinePirce;
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
            this.modalClose();
            this.$listeners.getDeviceDataToTable && this.$listeners.getDeviceDataToTable(); //若组件传递事件confirm则执行
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
      this.modalClose();
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
.charge-control /deep/ .el-form-item {
  padding-top: 10px;
  margin-bottom: 0 !important;
}
</style>

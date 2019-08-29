<template>
  <el-dialog title="批量编辑设备" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <el-form :model="deviceEditForm" :rules="deviceEditFormRules" ref="deviceEditForm" label-position="left" class="device-edit-wrap">
      <div class="base">
        <p class="device-type">设备类型：{{deviceEditForm.parentTypeName}}<span>|</span>设备型号：{{deviceEditForm.subTypeName}}</p>
        <el-form-item label="批量编辑选择：" class="check-batch-funtion">
          <el-radio-group v-model="checkBatchFuntion">
            <el-radio :label="1">功能设置</el-radio>
            <el-radio :label="2" v-if="deviceEditForm.isDetergent === 1">洗衣液属性</el-radio>
            <el-radio :label="3" v-if="deviceEditForm.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">其他属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="checkBatchFuntion === 1">
          <!-- 饮水机 -->
          <el-table :data="deviceEditForm.functionList" key="waterfunctionList" v-if="deviceEditForm.parentTypeName === '饮水机'&&isBoiledWater(deviceEditForm.support)" style="width: 100%">
            <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
            <el-table-column prop="needMinutes" :label="configVO.time.title" v-if="configVO.time.available">
              <template slot-scope="scope">
                <div v-if="configVO.time.join">
                  <el-form-item v-if="scope.$index===0" :prop="'functionList.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.waterMachineNeedMinutes'>
                    <el-input v-model.trim="scope.row.needMinutes" maxlength="8">
                    </el-input>
                  </el-form-item>
                  <span v-else>{{getRestNeedMinutes(scope.row)}}</span>
                </div>
                <el-form-item v-else :prop="'functionList.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.waterMachineNeedMinutes'>
                  <el-input v-model.trim="scope.row.needMinutes" maxlength="8">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="functionPrice" :label="configVO.price.title" v-if="configVO.price.available">
              <template slot-scope="scope">
                <div v-if="configVO.price.join">
                  <el-form-item v-if="scope.$index===0" :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.waterMachinePirce'>
                    <el-input v-model.trim="scope.row.functionPrice" maxlength="6">
                    </el-input>
                  </el-form-item>
                  <span v-else>{{getRestFunctionPrice(scope.row)}}</span>
                </div>
                <el-form-item v-else :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.waterMachinePirce'>
                  <el-input v-model.trim="scope.row.functionPrice" maxlength="6">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.open.available">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.ifOpenStatus">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
          <!-- 充电桩 -->
          <div v-if="deviceEditForm.isQuantifyCharge === 1">
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
            <el-form-item label="单位刻度时间：" prop="step">
              <div class="add-discount">
                <el-select v-model="deviceEditForm.extraAttr.step" placeholder="请选择">
                  <el-option label="0.5" :value="0.5"></el-option>
                  <el-option label="1" :value="1"></el-option>
                </el-select>
                <span style="position: absolute;left: 235px;color:#bfbfbf;">小时</span>
              </div>
            </el-form-item>
            <el-form-item label="推荐充电时间：" prop="default">
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
                  <el-col :span="1">{{deviceEditForm.extraAttr.power1| getBeginPower}}</el-col>
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
                  <el-col :span="1">{{deviceEditForm.extraAttr.power2| getBeginPower}}</el-col>
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
              <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
              <el-table-column prop="functionPrice" :label="configVO.price.title" v-if="configVO.price.available">
                <template slot-scope="scope">
                  <div v-if="configVO.price.join">
                    <el-form-item v-if="scope.$index===0" :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.chargeMachinePirce'>
                      <el-input v-model.trim="scope.row.functionPrice" maxlength="4">
                      </el-input>
                    </el-form-item>
                    <span v-else>{{getRestFunctionPrice(scope.row)}}</span>
                  </div>
                  <el-form-item v-else :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.chargeMachinePirce'>
                    <el-input v-model.trim="scope.row.functionPrice" maxlength="4">
                    </el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.price.available">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.ifOpenStatus">
                  </el-switch>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 正常 -->
          <el-table :data="deviceEditForm.functionList" style="width: 100%" key="functionList" v-if="isBoiledWater(deviceEditForm.support)===false&&deviceEditForm.isQuantifyCharge !== 1">
            <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
            <el-table-column prop="needMinutes" :label="configVO.time.title" v-if="configVO.time.available">
              <template slot-scope="scope">
                <el-form-item :prop="'functionList.' + scope.$index + '.needMinutes'" :rules='deviceEditFormRules.needMinutes'>
                  <el-input v-model.trim="scope.row.needMinutes" maxlength="4">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="functionPrice" :label="configVO.price.title" v-if="configVO.price.available">
              <template slot-scope="scope">
                <el-form-item :prop="'functionList.' + scope.$index + '.functionPrice'" :rules='deviceEditFormRules.functionPrice'>
                  <el-input v-model.trim="scope.row.functionPrice" maxlength="5">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="functionCode" :label="configVO.pulse.title" v-if="configVO.pulse.available">
              <template slot-scope="scope">
                <el-form-item :prop="'functionList.' + scope.$index + '.functionCode'" :rules='deviceEditFormRules.functionCode'>
                  <el-input v-model.trim="scope.row.functionCode" maxlength="2">
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.open.available">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.ifOpenStatus">
                </el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="detergent" v-if="checkBatchFuntion === 2&&deviceEditForm.isDetergent === 1">
          <el-form-item label="洗衣液功能" prop="isOpenDetergent" class="edit-isOpenDetergent">
            <el-switch v-model="deviceEditForm.isOpenDetergentStatus">
            </el-switch>
          </el-form-item>
          <el-table :data="deviceEditForm.detergentFunctionList" key="detergentFunctionList" style="width: 100%">
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
        </div>
        <el-table :data="deviceEditForm.waterLevel" style="width: 100%" key="waterLevel" v-if="checkBatchFuntion === 3&&deviceEditForm.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">
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
      </div>

      <el-form-item class="action">
        <el-button type="primary" @click="onEditDecive('deviceEditForm')">确定</el-button>
        <el-button @click="resetForm('deviceEditForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getFunctionSetListFun, batchEditDetergentListFun, batchEditFun, batchEditDetergentFun } from '@/service/device';
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
    },
    multipleSelectionMachineIds: {
      type: String,
      default: () => {
        return [];
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
        callback(new Error('功率必须为数字值，,无小数'));
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
        callback(new Error('功率必须为数字值，,无小数'));
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
        callback(new Error('功率必须为数字值，,无小数'));
      } else {
        callback();
      }
    };
    var validatorWterMachinePirce = (rule, value, callback) => {
      let reg1 = /^(([0-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[0-9]{0,2}|99|99.0|99.00)$/;
      let reg2 = /^(([0-9]|[1-9][0-8])(\.\d{0,3})?|(([1-8][0-9])(\.\d{0,3})?)|0\.[0-9]{0,3}|99|99.0|99.00|99.000)$/;
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
      waterLevelList: [{ value: '1', name: '极低水位' }, { value: '2', name: '低水位' }, { value: '3', name: '中水位' }, { value: '4', name: '高水位' }],
      checkBatchFuntion: 1,
      deviceEditForm: this.deviceEditdetailForm,
      deviceEditFormRules: {
        machineName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        needMinutes: [{ required: true, message: '请输入耗时', trigger: 'blur' }, { pattern: /^([1-9]\d{0,4})$/, message: '请输入1-9999之间的数字', trigger: 'blur' }],
        functionPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }, { pattern: /^(([0-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0|99.00)$/, message: '请输入0-99之间的数字,最多保留2位小数', trigger: 'blur' }],
        waterMachinePirce: [{ required: true, message: '请输入价格', trigger: 'blur' }, { validator: validatorWterMachinePirce, trigger: 'blur' }],
        waterMachineNeedMinutes: [{ required: true, message: '请输入单脉冲流量', trigger: 'blur' }, { pattern: /^(([1-9]|([1-9][0-9]{1,2}([0-8])?)|([1-9][0-8]{1,2}([0-9])?))(\.\d{0,3})?|0\.\d{0,3}|9999|9999.0|9999.00|9999.000)$/, message: '请输入0.001-9999之间数字，最多保留3位小数', trigger: 'blur' }],
        chargeMachinePirce: [{ required: true, message: '请输入价格', trigger: 'blur' }, { pattern: /^([0-4]{1}([.]{1}[0-9]{1,2})?|5|5.0|5.00)$/, message: '请输入0.01-5之间数字，最多保留2位小数', trigger: 'blur' }],
        functionCode: [{ required: true, message: '请输入脉冲', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentLiquid: [{ required: true, message: '请输入用量', trigger: 'blur' }, { pattern: /^([1-9]\d{0,1})$/, message: '请输入1-99之间的数字', trigger: 'blur' }],
        detergentPrice: [{ required: true, message: '请输入洗衣液价格', trigger: 'blur' }, { pattern: /^(([1-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0|99.00)$/, message: '请输入0.01-99之间的数字,最多保留2位小数', trigger: 'blur' }],
        'extraAttr.power1': [{ required: true, message: '请输入功率', trigger: 'blur' }, { validator: validatorPower1, trigger: 'blur' }],
        'extraAttr.power2': [{ required: true, message: '请输入功率', trigger: 'blur' }, { validator: validatorPower2, trigger: 'blur' }],
        'extraAttr.power3': [{ required: true, message: '请输入功率', trigger: 'blur' }, { validator: validatorPower3, trigger: 'blur' }],
        'extraAttr.ratio2': [{ required: true, message: '请输入系数', trigger: 'blur' }, { pattern: /^((0\.[1-9]{0,1}?)|1|1.0)$/, message: '请输入0.1-1之间的数字，最多保留1位小数', trigger: 'blur' }],
        'extraAttr.ratio3': [{ required: true, message: '请输入系数', trigger: 'blur' }, { pattern: /^((0\.[1-9]{0,1}?)|1|1.0)$/, message: '请输入0.1-1之间的数字，最多保留1位小数', trigger: 'blur' }]
      },
      //充电时间选择
      chargeTimeMax: 0,
      chargeTimeMin: 0,
      chargeTimeStep: 0,
      configVO: {
        extra: {},
        name: {},
        open: {},
        price: {},
        time: {}
      }
    };
  },
  filters: {
    getBeginPower(val) {
      return val ? +val + 1 : val;
    }
  },
  components: {},
  created() {
    this.configVO = this._.get(this.deviceEditForm, 'configVO', {});
    let extraAttr = this._.get(this.deviceEditForm, 'functionList[0].extraAttr', {});
    this.$set(this.deviceEditForm, 'extraAttr', extraAttr);
    this.getFunctionSetList();
    this.getbatchEditDetergentList();
    if (this.deviceEditForm.isQuantifyCharge === 1) {
      let tmpext = Object.assign({}, extraAttr);
      this.chargeTimeMax = tmpext.max || 0;
      this.chargeTimeMin = tmpext.min || 0;
      this.chargeTimeStep = tmpext.step || 0;
    }
  },
  mounted() {},
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getFunctionSetList() {
      //批量编辑获取功能列表
      let payload = Object.assign({}, { subTypeId: this.deviceEditForm.subTypeId, shopId: this.deviceEditForm.shopId });
      let res = await getFunctionSetListFun(payload);
      this.deviceEditForm.functionList = res.list;
      this.deviceEditForm.communicateType = res.communicateType;
      this.deviceEditForm.functionTempletType = res.functionTempletType;
      this.deviceEditForm.functionList.forEach(item => {
        item.ifOpen === 0 ? this.$set(item, 'ifOpenStatus', true) : this.$set(item, 'ifOpenStatus', false);
      });
    },
    async getbatchEditDetergentList() {
      //批量编辑获取洗衣液功能列表
      let payload = Object.assign({}, { subTypeId: this.deviceEditForm.subTypeId, shopId: this.deviceEditForm.shopId });
      let res = await batchEditDetergentListFun(payload);
      this.deviceEditForm.detergentFunctionList = res.list;
      this.deviceEditForm.isOpenDetergent == 1 ? this.$set(this.deviceEditForm, 'isOpenDetergentStatus', true) : this.$set(this.deviceEditForm, 'isOpenDetergentStatus', false);
    },
    getRestNeedMinutes(row) {
      return (row.needMinutes = this._.get(this.deviceEditForm, 'functionList[0].needMinutes', row.needMinutes));
    },
    getRestFunctionPrice(row) {
      return (row.functionPrice = this._.get(this.deviceEditForm, 'functionList[0].functionPrice', row.needMinutes));
    },
    //批量基本功能设置和其他属性
    batchEditBaseFunction() {
      let ifOpenLen = 0;
      this.deviceEditForm.functionList.forEach(item => {
        if (item.ifOpenStatus === false) {
          item.ifOpen = 1;
          ifOpenLen = ifOpenLen + 1;
        } else {
          item.ifOpen = 0;
        }
      });
      if (ifOpenLen === this.deviceEditForm.functionList.length) {
        this.$Message.error('请至少开启一项功能');
        return false;
      }
      let payload = Object.assign(
        {},
        {
          machineIdList: this.multipleSelectionMachineIds,
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId,
          functionTempletType: this.deviceEditForm.functionTempletType,
          functionJson: JSON.stringify(this.deviceEditForm.functionList),
          waterLevel: this.deviceEditForm.waterLevel,
          extraAttr: this.deviceEditForm.extraAttr ? JSON.stringify(this.deviceEditForm.extraAttr) : ''
        }
      );
      batchEditFun(payload).then(() => {
        this.$Message.success('批量编辑成功');
        this.modalClose();
        this.$listeners.getDeviceDataToTable && this.$listeners.getDeviceDataToTable();
      });
    },
    //批量洗衣液
    batchEditDetergent() {
      this.deviceEditForm.isOpenDetergentStatus === true ? (this.deviceEditForm.isOpenDetergent = 1) : (this.deviceEditForm.isOpenDetergent = 0);
      let payload = Object.assign(
        {},
        {
          machineIdList: this.multipleSelectionMachineIds,
          subTypeId: this.deviceEditForm.subTypeId,
          shopId: this.deviceEditForm.shopId,
          isOpenDetergent: this.deviceEditForm.isOpenDetergent,
          detergentJson: JSON.stringify(this.deviceEditForm.detergentFunctionList)
        }
      );
      batchEditDetergentFun(payload).then(() => {
        this.$Message.success('批量编辑成功');
        this.modalClose();
        this.$listeners.getDeviceDataToTable && this.$listeners.getDeviceDataToTable();
      });
    },
    onEditDecive(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.checkBatchFuntion === 1 || this.checkBatchFuntion === 3) {
            this.batchEditBaseFunction();
          }
          if (this.checkBatchFuntion === 2) {
            this.batchEditDetergent();
          }
        } else {
          this.$Message.error('请填写完整信息');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
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
.device-type {
  color: #8c8c8c;
  padding-top: 16px;
  span {
    padding: 0 25px;
  }
}
.waterAndChargeMachinePirce-type {
  padding-top: 24px;
}

.check-batch-funtion {
  margin-top: 18px;
}
.action {
  text-align: right;
  padding: 16px 0 24px 0;
}
.add-discount {
  display: flex;
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
.water-machine-pirce {
  padding-top: 24px;
  padding-bottom: 24px;
}
/deep/ .el-table {
  .el-form-item--small.el-form-item {
    margin-bottom: 25px;
  }
  td,
  th {
    vertical-align: top;
  }
}
</style>

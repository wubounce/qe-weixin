<template>
  <div class=device-page>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="设备名称：" prop="machineName">
        <el-input v-model.trim="searchData.machineName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="IMEI：" prop="imei">
        <el-input v-model.trim="searchData.imei" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态：" prop="machineState">
        <el-select v-model="searchData.machineState" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in deviceSearchStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型：" prop="parentTypeId">
        <el-select v-model="searchData.parentTypeId" @change="getmachineSubType" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备型号：" prop="subTypeId">
        <el-select v-model="searchData.subTypeId" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item, index) in machineSubTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通信类型：" prop="communicateType">
        <el-select v-model="searchData.communicateType" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in communicateType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" @click="handleBatchEdit">
          <svg-icon icon-class="bianji" class="batch-bianji" fill='#fff' /> 批量编辑 </el-button>
        <el-button @click="exportTable()">
          <svg-icon icon-class="daochu" class="daochu" /> 导出</el-button>
      </div>
      <el-table :data="deviceDataToTable" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="machineName" label="设备名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookShopDetail(scope.row);detailDialogVisible = true;">{{scope.row.machineName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="shopName" label="所属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="machineTypeName" label="设备类型"></el-table-column>
        <el-table-column header-align="left" prop="subTypeName" label="设备型号" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="machineState" label="状态">
          <template slot-scope="scope">
            <span class="status-clire" :style="machineStateBgColor(scope.row.machineState)"></span>{{scope.row.machineState | deviceStatus}}
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="imei" label="IMEI" min-width="130"></el-table-column>
        <el-table-column header-align="left" prop="signal" label="信号值">
          <template slot-scope="scope">
            <el-tooltip content="设备离线" placement="top" effect="dark">
              <div v-if="scope.row.machineState===8" style="pos">
                <svg-icon icon-class="erjiguanbi" class="out-line" />
                <span class=" signal signal-one"></span>
                <span class="signal signal-two"></span>
                <span class="signal signal-three"></span>
                <span class="signal signal-four"></span>
                <span class="signal signal-five"></span>
              </div>
            </el-tooltip>
            <div v-if="scope.row.machineState!==8&&scope.row.signal">
              <el-tooltip :content="`设备信号极差：${scope.row.signal}`" placement="top" effect="dark">
                <div v-if=" scope.row.signal<=5">
                  <span class="signal signal-one" style="background:#EF5657"></span>
                  <span class="signal signal-two"></span>
                  <span class="signal signal-three"></span>
                  <span class="signal signal-four"></span>
                  <span class="signal signal-five"></span>
                </div>
              </el-tooltip>
              <el-tooltip :content="`设备信号差：${scope.row.signal}`" placement="top" effect="dark">
                <div v-if="scope.row.signal>=6&&scope.row.signal<=11">
                  <span class="signal signal-one" style="background:#EF5657"></span>
                  <span class="signal signal-two" style="background:#EF5657"></span>
                  <span class="signal signal-three"></span>
                  <span class="signal signal-four"></span>
                  <span class="signal signal-five"></span>
                </div>
              </el-tooltip>
              <el-tooltip :content="`设备信号一般：${scope.row.signal}`" placement="top" effect="dark">
                <div v-if="scope.row.signal>=12&&scope.row.signal<=17">
                  <span class="signal signal-one" style="background:#FBD337"></span>
                  <span class="signal signal-two" style="background:#FBD337"></span>
                  <span class="signal signal-three" style="background:#FBD337"></span>
                  <span class="signal signal-four"></span>
                  <span class="signal signal-five"></span>
                </div>
              </el-tooltip>
              <el-tooltip :content="`设备信号好：${scope.row.signal}`" placement="top" effect="dark">
                <div v-if="scope.row.signal>=18&&scope.row.signal<=23">
                  <span class="signal signal-one" style="background:#4ECB73"></span>
                  <span class="signal signal-two" style="background:#4ECB73"></span>
                  <span class="signal signal-three" style="background:#4ECB73"></span>
                  <span class="signal signal-four" style="background:#4ECB73"></span>
                  <span class="signal signal-five"></span>
                </div>
              </el-tooltip>
              <el-tooltip :content="`设备信号极好：${scope.row.signal}`" placement="top" effect="dark">
                <div v-if="scope.row.machineState!==8&&scope.row.signal>=24">
                  <span class="signal signal-one" style="background:#4ECB73"></span>
                  <span class="signal signal-two" style="background:#4ECB73"></span>
                  <span class="signal signal-three" style="background:#4ECB73"></span>
                  <span class="signal signal-four" style="background:#4ECB73"></span>
                  <span class="signal signal-five" style="background:#4ECB73"></span>
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="profit" label="累计收益(元)" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.profit | tofixd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" width="200px">
          <template slot-scope="scope">
            <el-tooltip content="筒自洁" placement="top" effect="dark" v-show="scope.row.machineState===1||scope.row.machineState ===4">
              <span v-if="scope.row.machineTypeName==='洗鞋机'&&scope.row.subTypeName.includes('脉冲')===false||scope.row.machineTypeName==='洗衣机'&&scope.row.subTypeName.includes('脉冲')===false">
                <svg-icon icon-class="tongzijie" class="icon-tongzijie" @click="handleDeviceTzj(scope.row)" /></span>
            </el-tooltip>
            <el-tooltip content="复位" placement="top" effect="dark" v-show="scope.row.machineState !==8 && scope.row.subTypeName !== '通用脉冲充电桩'&& scope.row.notQuantitative===false">
              <svg-icon icon-class="fuwei" class="icon-fuwei" @click="handleDeviceReset(scope.row)" />
            </el-tooltip>
            <el-tooltip content="启动" placement="top" effect="dark" v-show="scope.row.machineState ===1 && scope.row.subTypeName !== '通用脉冲充电桩'&&scope.row.notQuantitative===false||scope.row.machineState ===4 && scope.row.subTypeName !== '通用脉冲充电桩'&&scope.row.notQuantitative===false">
              <svg-icon icon-class="qidong" class="icon-qidong" @click="handleDeviceStart(scope.row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="handleDeviceEdit(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />

      <!-- 启动设备 -->
      <el-dialog title="启动设备" v-if="detailData" :visible.sync="deviceStartDialogVisible" width="540px" @close="resetQuantifyForm('quantifyStartForm')">
        <div v-show="detailData.isQuantifyCharge === 1" class="start-charge-function">
          <el-form ref="quantifyStartForm" :model="quantifyStartForm" :rules="quantifyStartFormRules" label-width="140px" class="add-shop-from">
            <el-form-item label="选择启动充电口：" prop="functionId">
              <el-radio-group v-model="quantifyStartForm.functionId">
                <el-radio v-for="(item,index) in detailData.functionList" :disabled="item.ifOpen===1" :key="index" :label="item.functionId" @click.native="quantifyStartChargeFunctionName(item.functionName)">{{item.functionName}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择充电时长：" prop="extra">
              <el-select v-model="quantifyStartForm.extra">
                <el-option v-for="item in chargeTimeMax" v-if="(item*chargeTimeStep)>=chargeTimeMin" :key="item" :label="(item*chargeTimeStep)+'小时'" :value="item*chargeTimeStep"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="quantifyStartDeviceFun('quantifyStartForm',detailData.machineId)">启动</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="detailData.isQuantifyCharge !== 1">
          <h5 class="chose-start-fun">选择设备启动的模式</h5>
          <el-table :data="detailData.functionList" style="width: 100%">
            <el-table-column prop="functionName" label="功能"></el-table-column>
            <el-table-column prop="needMinutes" label="耗时/分钟" v-if="detailData.subTypeName !== '通用脉冲充电桩'"></el-table-column>
            <el-table-column prop="functionPrice" label="原价/元"></el-table-column>
            <el-table-column prop="functionCode" label="脉冲数" v-if="detailData.communicateType == 0"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="startDeviceFun(detailData.machineName,detailData.machineId,scope.row)">启动</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 串口充电桩复位  -->
      <el-dialog title="设备复位" v-if="detailData" :visible.sync="quantifyResetDialogVisible" width="540px" @close="resetQuantifyForm('quantifyResetForm')">
        <el-form ref="quantifyResetForm" :model="quantifyResetForm" :rules="quantifyResetFormRules" label-width="140px" class="add-shop-from start-charge-function">
          <el-form-item label="选择复位充电口：" prop="functionId">
            <el-radio-group v-model="quantifyResetForm.functionId">
              <el-radio v-for="(item,index) in detailData.functionList" :disabled="item.ifOpen===1" :key="index" :label="item.functionId">{{item.functionName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="quantifyResetDeviceFun('quantifyResetForm')">复位</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 设备详情 -->
      <device-info v-if="detailDialogVisible&&detailData" :visible.sync="detailDialogVisible" :detailData="detailData"></device-info>
      <!-- 编辑设备  -->
      <edit-device v-if="deviceEditDialogVisible&&deviceEditdetailForm" :visible.sync="deviceEditDialogVisible" :deviceEditdetailForm="deviceEditdetailForm" @getDeviceDataToTable="getDeviceDataToTable"></edit-device>
      <!-- 批量编辑设备  -->
      <batch-edit v-if="batchDEditDeviceDialogVisible" :visible.sync="batchDEditDeviceDialogVisible" :deviceEditdetailForm="deviceEditdetailForm" :multipleSelectionMachineIds="multipleSelectionMachineIds" @getDeviceDataToTable="getDeviceDataToTable"></batch-edit>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { deviceListFun, detailDeviceListFun, getlistParentTypeFun, listSubTypeAllFun, getlistSubTypeFun, tzjDeviceFun, manageResetDeviceFun, machineStartFun, deviceList, quantifyResetFun, quantifyStartFun } from '@/service/device';
import { exportExcel } from '@/service/common';
import { shopListFun } from '@/service/report';
import { deviceStatus, deviceColorStatus, deviceSearchStatus, communicateType } from '@/utils/mapping';
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import ShopFilter from '@/components/Shopfilter';
import editDevice from './editDevice';
import batchEdit from './batchEdit';
import deviceInfo from './deviceInfo';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    ShopFilter,
    editDevice,
    batchEdit,
    deviceInfo
  },
  data() {
    return {
      searchData: {
        machineName: '',
        imei: '',
        shopId: '',
        machineState: '',
        parentTypeId: '',
        subTypeId: '',
        communicateType: ''
      },
      shopList: [],
      deviceDataToTable: [],

      detailDialogVisible: false,
      // detailData: {
      //   functionList: []
      // },
      detailData: null,
      machineParentTypeList: [],
      machineSubTypeList: [],

      deviceStartDialogVisible: false,
      deviceRestDialogVisible: false,
      multipleSelection: [],
      multipleSelectionMachineIds: [],

      //编辑
      deviceEditDialogVisible: false,
      deviceEditdetailForm: null,

      //批量编辑设备
      batchDEditDeviceDialogVisible: false,

      quantifyStartFormRules: {
        functionId: [{ required: true, message: '请选择需要启动的充电口', trigger: 'change' }],
        extra: [{ required: true, message: '请选择充电时长', trigger: 'change' }]
      },
      quantifyStartForm: {
        //充电桩定量启动
        functionId: '',
        extra: '',
        functionName: ''
      },
      quantifyResetDialogVisible: false,
      quantifyResetFormRules: {
        functionId: [{ required: true, message: '请选择需要复位的充电口', trigger: 'change' }]
      },
      quantifyResetForm: {
        //充电桩定量复位
        functionId: ''
      },
      //充电时间选择
      chargeTimeMax: 0,
      chargeTimeMin: 0,
      chargeTimeStep: 0
    };
  },
  filters: {
    deviceStatus: val => {
      return deviceStatus[val];
    },
    tofixd(val) {
      return val >= 0 ? Number(val).toFixed(2) : val;
    }
  },
  computed: {
    deviceSearchStatus() {
      return deviceSearchStatus;
    },
    communicateType() {
      return communicateType;
    },
    machineStateBgColor: function() {
      return function(value) {
        return `background:${deviceColorStatus[value]}`;
      };
    }
  },
  mounted() {},
  created() {
    this.getShopList();
    this.getmachineParentType();
    this.getmachineSubType();
    this.getDeviceDataToTable();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    async getmachineParentType() {
      //获取设备类型
      let res = await getlistParentTypeFun({ onlyMine: true });
      this.machineParentTypeList = res;
    },
    async getmachineSubType(val = '') {
      let res = null;
      this.searchData.subTypeId = '';
      if (val) {
        let payload = { parentTypeId: val, shopId: this.searchData.shopId, onlyMine: true };
        res = await getlistSubTypeFun(payload); //获取某个设备下二级类型
      } else {
        res = await listSubTypeAllFun(); //获取全部设备二级类型
      }
      this.machineSubTypeList = res;
    },
    handlePagination(data) {
      //分页
      this.searchData = Object.assign(this.searchData, data);
      this.getDeviceDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      let payload = Object.assign({}, this.searchData);
      this.getDeviceDataToTable(payload);
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.$refs[formName].clearValidate();
      this.machineSubTypeList = [];
      this.getDeviceDataToTable();
    },
    async getDeviceDataToTable() {
      //列表
      this.deviceDataToTable = [];
      let payload = Object.assign({}, this.searchData);
      let res = await deviceListFun(payload);
      this.deviceDataToTable = res.page.items;
      this.total = res.page.total;
    },
    async lookShopDetail(row) {
      //详情
      let payload = { machineId: row.machineId };
      let res = await detailDeviceListFun(payload);
      this.detailData = Object.assign({}, res);
      let extraAttr = this._.get(res, 'functionList[0].extraAttr', {});
      this.$set(this.detailData, 'extraAttr', extraAttr);
      this.deviceEditdetailForm = Object.assign({}, res);
      if (res.isQuantifyCharge === 1) {
        this.chargeTimeMax = (1 / extraAttr.step) * extraAttr.max || 0;
        this.chargeTimeMin = extraAttr.min || 0;
        this.chargeTimeStep = extraAttr.step || 0;
      }
      return Promise.resolve();
    },
    handleDeviceTzj(row) {
      //筒自洁
      let payload = { machineId: row.machineId };
      this.$confirm(`确定筒自洁${row.machineName}?`, '提示', {
        showClose: false,
        center: true
      }).then(() => {
        tzjDeviceFun(payload).then(() => {
          this.$message.success('筒自洁成功');
          this.getDeviceDataToTable();
        });
      });
    },
    handleDeviceReset(row) {
      if (row.isQuantifyCharge === 1) {
        //充电桩定量复位
        this.lookShopDetail(row);
        this.quantifyResetDialogVisible = true;
      } else {
        //复位
        let payload = { machineId: row.machineId };
        this.$confirm(`确认复位${row.machineName}?`, '提示', {
          showClose: false,
          center: true
        }).then(() => {
          manageResetDeviceFun(payload).then(() => {
            this.$message.success('复位成功');
            this.getDeviceDataToTable();
          });
        });
      }
    },
    quantifyResetDeviceFun(formName) {
      //充电桩定量复位
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = { functionId: this.quantifyResetForm.functionId };
          quantifyResetFun(payload).then(() => {
            this.$message.success('复位成功');
            this.quantifyResetDialogVisible = false;
            this.resetQuantifyForm(formName);
            this.getDeviceDataToTable();
          });
        }
      });
    },
    resetQuantifyForm(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
    },
    handleDeviceStart(row) {
      //启动列表
      if (row.machineState === 1) {
        this.lookShopDetail(row);
        this.deviceStartDialogVisible = true;
      }
      if (row.machineState === 2) {
        this.$confirm(`设备运行中，请先复位`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
      }
      if (row.machineState === 3) {
        this.$confirm(`设备已被预约，请先复位`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
      }
      if (row.machineState === 4) {
        this.$confirm(`设备故障，启动失败`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
      }
      if (row.machineState === 8) {
        this.$confirm(`设备离线，启动失败`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
      }
    },
    startDeviceFun(machineName, machineId, row) {
      //启动
      let payload = { machineId: machineId, functionId: row.functionId };
      this.$confirm(`<p>确定启动${machineName}?</p><p style="font-size: 12px;">启动模式：${row.functionName}</p>`, '提示', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        center: true
      }).then(() => {
        machineStartFun(payload).then(() => {
          this.deviceStartDialogVisible = false;
          this.$message.success('启动成功');
          this.deviceStartDialogVisible = false;
        });
      });
    },
    quantifyStartChargeFunctionName(name) {
      //获取启充电桩功能名称
      this.quantifyStartForm.functionName = name;
    },
    quantifyStartDeviceFun(formName, machineId) {
      //启充电桩定量启动
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({ machineId: machineId }, this.quantifyStartForm);
          this.$confirm(`<p>确定启动${payload.functionName}?</p><p style="font-size: 12px;">充电时长：${payload.extra}小时</p>`, '提示', {
            dangerouslyUseHTMLString: true,
            showClose: false,
            center: true
          }).then(() => {
            quantifyStartFun(payload).then(() => {
              this.$message.success('启动成功');
              this.deviceStartDialogVisible = false;
            });
          });
        }
      });
    },
    handleDeviceEdit(row) {
      //设备单个编辑
      this.lookShopDetail(row).then(data => {
        this.deviceEditDialogVisible = true;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchEdit() {
      //设备批量编辑
      if (this.multipleSelection.length <= 0) {
        this.$alert(`请勾选想要批量编辑的设备`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
        return false;
      }
      let allSame = this.multipleSelection.every((item, index, arr) => {
        return (item.subTypeName === arr[0].subTypeName && item.shopName === arr[0].shopName) || false;
      });
      if (allSame === false) {
        this.$alert(`请勾选同一店铺下相同设备型号进行批量编辑`, '提示', {
          showClose: false,
          confirmButtonText: '确定',
          center: true
        });
        return false;
      }
      this.multipleSelectionMachineIds = this.multipleSelection.map(item => item.machineId);
      this.lookShopDetail(this.multipleSelection[0]).then(data => {
        this.batchDEditDeviceDialogVisible = true;
      });
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.excel = true;
      exportExcel(deviceList, '设备列表.xlsx', payload);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.device-page .el-tooltip {
  display: inline-block;
  position: relative;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.start-charge-function {
  .el-radio + .el-radio {
    margin-left: 0 !important;
    margin-bottom: 24px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.status-clire {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #2fc25b;
  opacity: 0.85;
  border-radius: 20px;
  margin-right: 8px;
}
.signal {
  background: #cccccc;
  display: inline-block;
  margin-right: 2px;
}
.signal-one {
  width: 3px;
  height: 5px;
  border-radius: 1px;
}
.signal-two {
  width: 3px;
  height: 8px;
  border-radius: 1px;
}
.signal-three {
  width: 3px;
  height: 10px;
  border-radius: 1px;
}
.signal-four {
  width: 3px;
  height: 13px;
  border-radius: 1px;
}
.signal-five {
  width: 3px;
  height: 15px;
  border-radius: 1px;
}
.chose-start-fun {
  color: $comment;
  padding: 23px 0 16px 0;
  font-weight: normal;
}

.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
}
.out-line {
  width: 8px;
  position: absolute;
  top: 0px;
}
</style>
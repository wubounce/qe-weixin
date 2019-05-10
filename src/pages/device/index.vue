<template>
  <div>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="设备名称：" prop="machineName">
        <el-input v-model.trim="searchData.machineName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="IMEI：" prop="imei">
        <el-input v-model.trim="searchData.imei" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
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
        <el-table-column header-align="left" prop="subTypeName" label="设备型号" min-width="160"></el-table-column>
        <el-table-column header-align="left" prop="machineState" label="状态">
          <template slot-scope="scope">
            <span class="status-clire" :style="machineStateBgColor(scope.row.machineState)"></span>{{scope.row.machineState | deviceStatus}}
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="imei" label="IMEI"></el-table-column>
        <el-table-column header-align="left" prop="signal" label="信号值">
          <template slot-scope="scope">
            <div v-show="scope.row.signal">
              <div v-show=" scope.row.signal<=5">
                <span class="signal signal-one" style="background:#EF5657"></span>
                <span class="signal signal-two"></span>
                <span class="signal signal-three"></span>
                <span class="signal signal-four"></span>
                <span class="signal signal-five"></span>
              </div>
              <div v-show="scope.row.signal>=6&&scope.row.signal<=11">
                <span class="signal signal-one" style="background:#EF5657"></span>
                <span class="signal signal-two" style="background:#EF5657"></span>
                <span class="signal signal-three"></span>
                <span class="signal signal-four"></span>
                <span class="signal signal-five"></span>
              </div>
              <div v-show="scope.row.signal>=12&&scope.row.signal<=17">
                <span class="signal signal-one" style="background:#FBD337"></span>
                <span class="signal signal-two" style="background:#FBD337"></span>
                <span class="signal signal-three" style="background:#FBD337"></span>
                <span class="signal signal-four"></span>
                <span class="signal signal-five"></span>
              </div>
              <div v-show="scope.row.signal>=18&&scope.row.signal<=23">
                <span class="signal signal-one" style="background:#4ECB73"></span>
                <span class="signal signal-two" style="background:#4ECB73"></span>
                <span class="signal signal-three" style="background:#4ECB73"></span>
                <span class="signal signal-four" style="background:#4ECB73"></span>
                <span class="signal signal-five"></span>
              </div>
              <div v-show="scope.row.signal>=24">
                <span class="signal signal-one" style="background:#4ECB73"></span>
                <span class="signal signal-two" style="background:#4ECB73"></span>
                <span class="signal signal-three" style="background:#4ECB73"></span>
                <span class="signal signal-four" style="background:#4ECB73"></span>
                <span class="signal signal-five" style="background:#4ECB73"></span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="profit" label="累计收益(元)">
          <template slot-scope="scope">
            <span>{{scope.row.profit | numFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" width="300px">
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
            <!-- <el-tooltip content="异常日志" placement="top" effect="dark">
              <svg-icon icon-class="yichangrizhi" class="icon-yichangrizhi" @click="errorLogDialogVisible=true" />
            </el-tooltip> -->
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 设备详情 -->
      <el-dialog title="设备详情" :visible.sync="detailDialogVisible" @close="detailActiveTab='first'" width="540px" top="50px">
        <h3 class="detail-base-title">基本信息</h3>
        <ul class="deatil-list">
          <li><span>设备名称：</span>{{detailData.machineName}}</li>
          <li><span>所属店铺：</span>{{detailData.shopName}}</li>
          <li><span>设备类型：</span>{{detailData.parentTypeName}}</li>
          <li><span>设备型号：</span>{{detailData.subTypeName}}</li>
          <li><span>通信类型：</span>{{detailData.communicateType | communicateType}}</li>
          <li><span>公司：</span>{{detailData.company}}</li>
          <li><span>NQT：</span>{{detailData.nqt}}</li>
          <li><span>IMEI：</span>{{detailData.imei}}</li>
          <li><span>创建人：</span>{{detailData.createUser}}</li>
          <li><span>创建时间：</span>{{detailData.createTime}}</li>
        </ul>
        <h3 class="detail-base-title" style="border:none">功能属性</h3>
        <el-tabs v-model="detailActiveTab">
          <el-tab-pane label="功能设置" name="first">
            <div v-if="detailData.notQuantitative">
              <p style="padding:20px 0;"><span>价格设置：</span>{{detailData.waterMachinePirce}}元/升</p>
              <el-table :data="detailData.functionList" style="width: 100%">
                <el-table-column prop="functionName" label="出水口"></el-table-column>
                <el-table-column prop="ifOpen" label="状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.ifOpen | ifOpenType}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-table :data="detailData.functionList" style="width: 100%" v-if="detailData.notQuantitative===false">
              <el-table-column prop="functionName" label="功能"></el-table-column>
              <el-table-column prop="needMinutes" label="耗时/分钟"></el-table-column>
              <el-table-column prop="functionPrice" label="原价/元"></el-table-column>
              <el-table-column prop="functionCode" label="脉冲数" v-if="detailData.communicateType == 0"></el-table-column>
              <el-table-column prop="ifOpen" label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.ifOpen | ifOpenType}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="洗衣液设置" name="second" v-if="detailData.isDetergent === 1">
            <el-table :data="detailData.detergentFunctionList" style="width: 100%">
              <el-table-column prop="functionName" label="功能"></el-table-column>
              <el-table-column prop="detergentLiquid" label="用量/ml"></el-table-column>
              <el-table-column prop="detergentPrice" label="原价/元"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="其他属性设置" name="third" v-if="detailData.subTypeName === '海尔5/6/7公斤波轮SXB60-51U7/SXB70-51U7'">
            <el-table :data="detailData.waterLevel" style="width: 100%">
              <el-table-column prop="functionName" label="属性名称">
                <template slot-scope="scope">
                  <span>水位设置</span>
                </template>
              </el-table-column>
              <el-table-column prop="waterLevel" label="属性值">
                <template slot-scope="scope">
                  <span>{{scope.row | waterStatus}}</span>
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
      </el-dialog>
      <!-- 设备异常状态日志 -->
      <el-dialog title="异常状态日志" :visible.sync="errorLogDialogVisible" width="1100px">
        <el-table :data="errorLogDeviceList" style="width: 100%" height="670">
          <el-table-column header-align="left" label="序号" width="60" type="index"></el-table-column>
          <el-table-column prop="machineName" label="设备名" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="machineTypeName" label="设备类型" width="180"></el-table-column>
          <el-table-column prop="address" min-width="180" label="设备型号" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 设备异常状态日志 -->
      <el-dialog title="启动设备" :visible.sync="deviceStertDialogVisible" width="540px">
        <h5 class="chose-start-fun">选择设备启动的模式</h5>
        <el-table :data="detailData.functionList" style="width: 100%">
          <el-table-column prop="functionName" label="功能"></el-table-column>
          <el-table-column prop="needMinutes" label="耗时/分钟" v-if="detailData.subTypeName !== '通用脉冲充电桩'"></el-table-column>
          <el-table-column prop="functionPrice" label="原价/元"></el-table-column>
          <el-table-column prop="functionCode" label="脉冲数" v-if="detailData.communicateType == 0"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="startDeviceFun(detailData.machineId,scope.row)">启动</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <!-- 编辑设备  -->
      <el-dialog title="编辑设备" :visible.sync="deviceEditDialogVisible" width="768px">
        <edit-device :deviceEditdetailForm="deviceEditdetailForm" :visible="deviceEditDialogVisible" @closeDeviceEdit="closeDeviceEdit" v-if="deviceEditDialogVisible"></edit-device>
      </el-dialog>
      <!-- 批量编辑设备  -->
      <el-dialog title="批量编辑设备" :visible.sync="batchDEditDeviceDialogVisible" width="768px">
        <batch-edit :deviceEditdetailForm="deviceEditdetailForm" :multipleSelectionMachineIds="multipleSelectionMachineIds" :visible="batchDEditDeviceDialogVisible" @closeBatchDeviceEdit="closeBatchDeviceEdit" v-if="batchDEditDeviceDialogVisible"></batch-edit>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { deviceListFun, detailDeviceListFun, getlistParentTypeFun, listSubTypeAllFun, getlistSubTypeFun, tzjDeviceFun, manageResetDeviceFun, machineStartFun, deviceList } from '@/service/device';
import { exportExcel } from '@/service/common';
import { shopListFun } from '@/service/report';
import { deviceStatus, deviceColorStatus, deviceSearchStatus, communicateType, ifOpenType, waterStatus } from '@/utils/mapping';
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import ShopFilter from '@/components/Shopfilter';
import editDevice from './editDevice';
import batchEdit from './batchEdit';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    ShopFilter,
    editDevice,
    batchEdit
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
      detailData: {},
      detailActiveTab: 'first',
      errorLogDialogVisible: false,
      errorLogDeviceList: [],
      machineParentTypeList: [],
      machineSubTypeList: [],

      deviceStertDialogVisible: false,
      multipleSelection: [],
      multipleSelectionMachineIds: [],

      //编辑
      deviceEditDialogVisible: false,
      deviceEditdetailForm: {},

      //批量编辑设备
      batchDEditDeviceDialogVisible: false
    };
  },
  filters: {
    deviceStatus: val => {
      return deviceStatus[val];
    },
    communicateType(val) {
      return communicateType[val];
    },
    ifOpenType(val) {
      return ifOpenType[val];
    },
    waterStatus(val) {
      return waterStatus[val];
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
      this.$set(this.detailData, 'waterMachinePirce', res.functionList[0].functionPrice || 0);
      this.deviceEditdetailForm = Object.assign({}, res);
      this.deviceEditdetailForm.isOpenDetergent == 1 ? this.$set(this.deviceEditdetailForm, 'isOpenDetergentStatus', true) : this.$set(this.deviceEditdetailForm, 'isOpenDetergentStatus', false);
      this.deviceEditdetailForm.functionList.forEach(item => {
        item.ifOpen === 0 ? this.$set(item, 'ifOpenStatus', true) : this.$set(item, 'ifOpenStatus', false);
      });
      return Promise.resolve();
    },
    handleDeviceTzj(row) {
      //筒自洁
      let payload = { machineId: row.machineId };
      this.$confirm(`确认筒自洁${row.machineName}此设备?`, '提示', {
        showClose: false
      }).then(() => {
        tzjDeviceFun(payload).then(() => {
          this.$message.success('筒自洁成功');
          this.getDeviceDataToTable();
        });
      });
    },
    handleDeviceReset(row) {
      //复位
      let payload = { machineId: row.machineId };
      this.$confirm(`确认复位${row.machineName}此设备?`, '提示', {
        showClose: false
      }).then(() => {
        manageResetDeviceFun(payload).then(() => {
          this.$message.success('复位成功');
          this.getDeviceDataToTable();
        });
      });
    },
    handleDeviceStart(row) {
      //启动列表
      if (row.machineState === 1) {
        this.lookShopDetail(row);
        this.deviceStertDialogVisible = true;
      }
      if (row.machineState === 2) {
        this.$confirm(`设备运行中，请先复位`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
      }
      if (row.machineState === 3) {
        this.$confirm(`设备已被预约，请先复位`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
      }
      if (row.machineState === 4) {
        this.$confirm(`设备故障，启动失败`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
      }
      if (row.machineState === 8) {
        this.$confirm(`设备离线，启动失败`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
      }
    },
    startDeviceFun(machineId, row) {
      //启动
      let payload = { machineId: machineId, functionId: row.functionId };
      machineStartFun(payload).then(() => {
        this.deviceStertDialogVisible = false;
        this.$message.success('启动成功');
      });
    },
    handleDeviceEdit(row) {
      //设备单个编辑
      this.lookShopDetail(row).then(data => {
        this.deviceEditDialogVisible = true;
      });
    },
    closeDeviceEdit(res) {
      this.deviceEditDialogVisible = false;
      this.getDeviceDataToTable();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBatchEdit() {
      //设备批量编辑
      if (this.multipleSelection.length <= 0) {
        this.$alert(`请勾选想要批量编辑的设备`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
        return false;
      }
      let allSame = this.multipleSelection.every((item, index, arr) => {
        return (item.subTypeName === arr[0].subTypeName && item.shopName === arr[0].shopName) || false;
      });
      if (allSame === false) {
        this.$alert(`请勾选同一店铺下相同设备型号进行批量编辑`, '提示', {
          showClose: false,
          confirmButtonText: '确定'
        });
        return false;
      }
      this.multipleSelectionMachineIds = this.multipleSelection.map(item => item.machineId);
      this.lookShopDetail(this.multipleSelection[0]).then(data => {
        this.batchDEditDeviceDialogVisible = true;
      });
    },
    closeBatchDeviceEdit(res) {
      this.batchDEditDeviceDialogVisible = false;
      this.getDeviceDataToTable();
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.excel = true;
      exportExcel(deviceList, '设备列表.xlsx', payload);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.detail-base-title {
  font-size: 16px;
  padding: 10px 0;
  font-weight: normal;
}
.deatil-list {
  padding-bottom: 15px;
  li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $under_line;
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
    }
  }
}
.status-clire {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #2fc25b;
  opacity: 0.85;
  border-radius: 20px;
  margin-right: 8px;
}
[class^='icon-'] {
  width: 20px;
  height: 20px;
  margin-right: 20px;
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
</style>
 
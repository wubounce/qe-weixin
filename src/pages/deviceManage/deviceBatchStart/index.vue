<template>
  <div>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型：" prop="parentTypeId">
        <el-select v-model="searchData.parentTypeId" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" @click="addDeviceBatchStartDialogVisible=true">
          <svg-icon icon-class="qidong" class="batch-bianji" fill='#fff' /> 批量启动 </el-button>
        <el-button @click="exportTable()">
          <svg-icon icon-class="daochu" class="daochu" /> 导出</el-button>
      </div>
      <el-table :data="batchStartDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="所属店铺" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="machineTypeName" label="设备类型"></el-table-column>
        <el-table-column header-align="left" prop="functionName" label="启动模式"></el-table-column>
        <el-table-column header-align="left" prop="beginTime" label="启动时间" min-width="160"></el-table-column>
        <el-table-column header-align="left" prop="createUserName" label="创建人"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" min-width="140px">
          <template slot-scope="scope">
            <el-tooltip content="启动" placement="top" effect="dark">
              <svg-icon icon-class="qidong" class="icon-qidong" @click="handleDeviceStart(scope.row)" />
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="handleDeviceEdit(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-yichangrizhi" @click="handleDeviceDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 编辑设备  -->
      <el-dialog title="编辑批量启动" :visible.sync="deviceBatchStartDialogVisible" width="540px">
        <el-form :model="deviceBatchStartForm" ref="deviceBatchStartForm" :rules="deviceBatchStartFormRules" label-position="left" class="batch-device-edit-wrap">
          <el-form-item label="启动方式：" prop="standardFunctionId">
            <el-radio-group v-model="deviceBatchStartForm.standardFunctionId">
              <el-radio v-for="(item,index) in functionEditList" :key="index" :label="item.functionId">{{item.functionName}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="启动时间：" class="add-batch-time" prop="startTime">
            <el-date-picker v-model="deviceBatchStartForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="batch-device-edit-action">
            <el-button type="primary" @click="onSubmitDeviceEdit('deviceBatchStartForm')">保存</el-button>
            <el-button @click="resetAddDeviceStart('deviceBatchStartForm');deviceBatchStartDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 新增  -->
      <el-dialog title="新增批量启动" :visible.sync="addDeviceBatchStartDialogVisible" width="540px">
        <el-form :model="addDeviceBatchStartForm" ref="addDeviceBatchStartForm" :rules="addDeviceBatchStartFormRules" class="batch-device-edit-wrap" v-if="addDeviceBatchStartDialogVisible" label-position="left">
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
            <el-button @click="resetAddDeviceStart('addDeviceBatchStartForm');addDeviceBatchStartDialogVisible=false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getlistParentTypeFun } from '@/service/device';
import { listBatchStartFun, batchStartNowFun, updateBatchStartFun, getFunctionListFun, delBatchStartFun, addBatchStartFun, listBatchStartApi } from '@/service/todoList';
import { exportExcel } from '@/service/common';
import { shopListFun } from '@/service/report';
import { listShopBatchStartFun } from '@/service/device';
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import ShopFilter from '@/components/Shopfilter';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    ShopFilter
  },
  data() {
    return {
      searchData: {
        shopId: '',
        parentTypeId: ''
      },
      shopList: [],
      batchStartDataToTable: [],
      machineParentTypeList: [],
      deviceStertDialogVisible: false,
      //编辑
      functionEditList: [],
      deviceBatchStartDialogVisible: false,
      deviceBatchStartForm: {
        standardFunctionId: '',
        startTime: ''
      },
      deviceBatchStartFormRules: {
        standardFunctionId: [{ required: true, message: '请选择模式', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },

      //批量添加启动
      shopBatchStartList: [],
      addDeviceBatchStartForm: {
        shopId: '',
        machineParentTypeId: '',
        standardFunctionId: '',
        standardFunctionAction: '',
        startTime: ''
      },
      addDeviceBatchStartDialogVisible: false,
      addBatchStartMachineParentTypeList: [],
      addBatchStartFunctionList: [],
      isNowAndTimingStartAction: false,
      addDeviceBatchStartFormRules: {
        shopId: [{ required: true, message: '请选择店铺', trigger: 'change' }],
        machineParentTypeId: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        standardFunctionId: [{ required: true, message: '请选择启动模式', trigger: 'change' }],
        standardFunctionAction: [{ required: true, message: '请选择启动方式', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
      }
    };
  },
  filters: {},
  computed: {},
  mounted() {},
  created() {
    this.getShopList();
    this.getmachineParentType();
    this.getBatchStartDataToTable();
    this.getshopBatchStartList();
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
    handlePagination(data) {
      //分页
      this.searchData = Object.assign(this.searchData, data);
      this.getBatchStartDataToTable();
    },
    searchForm() {
      //头部搜索
      this.searchData.page = 1;
      this.total = 0;
      this.getBatchStartDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getBatchStartDataToTable();
    },
    async getshopBatchStartList() {
      //获取批量添加店铺列表
      let res = await listShopBatchStartFun();
      this.shopBatchStartList = res;
    },
    async getBatchStartDataToTable() {
      //列表
      let payload = Object.assign({}, this.searchData);
      let res = await listBatchStartFun(payload);
      this.batchStartDataToTable = res.items || [];
      this.batchStartDataToTable.forEach(item => {
        item.createTime = item.createTime ? moment(item.createTime).format('YYYY-MM-DD HH:mm:ss') : '';
      });
      this.total = res.total;
    },
    async changeBatchFuncionList(val) {
      //根据店铺和一级类型获取启动模式
      let payload = { shopId: this.addDeviceBatchStartForm.shopId, machineParentTypeId: val };
      let res = await getFunctionListFun(payload);
      this.addBatchStartFunctionList = res;
    },
    async changeBatchMachineype(val) {
      //根据店铺获取一级类型
      let payload = { shopId: val, batchStart: true };
      let res = await getlistParentTypeFun(payload);
      this.addBatchStartMachineParentTypeList = res;
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
            this.resetAddDeviceStart(formName);
            this.getBatchStartDataToTable();
            this.addDeviceBatchStartDialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    resetAddDeviceStart(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
    },
    async handleDeviceEdit(row) {
      this.deviceBatchStartForm.startTime = moment(row.beginTime).format('YYYY-MM-DD HH:mm:ss');
      this.deviceBatchStartForm.id = row.id;
      this.deviceBatchStartForm.machineParentTypeId = row.machineParentTypeId;
      this.deviceBatchStartForm.shopId = row.shopId;
      this.deviceBatchStartForm.standardFunctionId = row.standardFunctionId;
      let payload = { machineParentTypeId: row.machineParentTypeId, shopId: row.shopId };
      let res = await getFunctionListFun(payload);
      this.functionEditList = res;
      this.deviceBatchStartDialogVisible = true;
    },
    onSubmitDeviceEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.deviceBatchStartForm);
          updateBatchStartFun(payload).then(() => {
            this.$message.success('编辑成功');
            this.getBatchStartDataToTable();
            this.deviceBatchStartDialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    handleDeviceStart(row) {
      let payload = { id: row.id };
      this.$confirm('您确定要立即批量启动设备?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        batchStartNowFun(payload).then(() => {
          this.$message.success('启动成功');
          this.getBatchStartDataToTable();
        });
      });
    },
    // 删除
    handleDeviceDelete(row) {
      let payload = { id: row.id };
      this.$confirm('您确定要取消批量启动设备?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        delBatchStartFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getBatchStartDataToTable();
        });
      });
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.excel = true;
      exportExcel(listBatchStartApi, '设备批量启动列表.xlsx', payload);
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
</style>
 
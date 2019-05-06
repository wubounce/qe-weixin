<template>
  <div class="date-earing">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="日期筛选：" prop="time">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" @change="checkedTime" align="right" :clearable="false" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择" @change="checkedShop">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备：" prop="machineId">
        <el-select v-model="searchData.machineId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in machineList" :key="index" :label="item.machineName" :value="item.machineId"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="来源类型：" prop="origin">
        <el-select v-model="searchData.origin" clearable placeholder="请选择">
          <el-option v-for="(name, id) in sourceType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="收支类型：" prop="type">
        <el-select v-model="searchData.type " clearable placeholder="请选择">
          <el-option v-for="(name, id) in earningType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="report-detail table-content">
      <div class="chart-title">
        <span>详细数据</span>
        <el-button icon="el-icon-download" style="float: right;" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="tableDataList" style="width: 100%">
        <el-table-column header-align="left" prop="time" label="时间"></el-table-column>
        <el-table-column header-align="left" prop="orderNo" label="订单编号"></el-table-column>
        <el-table-column header-align="left" prop="userName" label="用户账号"></el-table-column>
        <el-table-column header-align="left" prop="money" label="金额">
          <template slot-scope="scope">
            <span>{{ scope.row.money | tofixd }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="origin" label="来源类型">
          <template slot-scope="scope">
            <span>{{scope.row.origin | sourceType}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="total-summary" v-if="tableDataList.length > 0">
        <span>合计</span>
        <span class="total">
          <span>收益(元)<span class="num"> {{totalMoney}}</span></span>
          <span>收入金额(元)<span class="num">{{profitMoney}}</span></span>
          <span>退款金额(元)<span class="num">{{refundMoney}}</span></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { balanceLogFlowListFun, balanceLogFlowListApi, shopListFun } from '@/service/report';
import { exportExcel } from '@/service/common';
import { manageSimpleListFun } from '@/service/shop';
import { sourceType, earningType } from '@/utils/mapping';
export default {
  components: {},
  data() {
    return {
      tableDataList: [],
      shopList: [],
      searchData: {
        time: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        shopId: '',
        machineId: '',
        origin: 0,
        type: ''
      },
      machineList: []
    };
  },
  filters: {
    sourceType: val => {
      return sourceType[val];
    },
    earningType(val) {
      return earningType[val];
    }
  },
  computed: {
    sourceType: function() {
      return sourceType;
    },
    earningType: function() {
      return earningType;
    }
  },
  mounted() {},
  created() {
    this.getShopList();
    this.getProfitDate();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    checkedTime(val) {
      let oneTime = new Date().setTime(new Date(val[0]).getTime());
      let twoTime = new Date().setTime(new Date(val[1]).getTime());
      if (oneTime + 3600 * 1000 * 24 * 31 <= twoTime) {
        //判断开始时间+30天是否小于结束时间
        this.$Message.error('最多查询跨度31天');
        return false;
      }
    },
    checkedShop(val) {
      this.searchData.machineId = '';
      this.getmachineParentType(val);
    },
    searchForm() {
      this.searchData.page = 1;
      this.checkedTime(this.searchData.time);
      this.getProfitDate();
    },
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
      this.getProfitDate();
    },
    async getmachineParentType(shopId = '') {
      //获取设备类型
      let res = await manageSimpleListFun({ page: 1, pageSize: 9999, shopId: shopId });
      this.machineList = res.items || [];
    },
    async getProfitDate(shopId = '') {
      //收益数据
      let payload = Object.assign({}, this.searchData);
      payload.startDate = this.searchData.time[0];
      payload.endDate = this.searchData.time[1];
      payload.time = [];
      let res = await balanceLogFlowListFun(payload);
      this.tableDataList = res.items || [];
      this.profitMoney = res.profitMoney;
      this.refundMoney = res.refundMoney;
      this.totalMoney = res.totalMoney;
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startDate = this.searchData.time[0];
      payload.endDate = this.searchData.time[1];
      payload.time = [];
      payload.excel = true;
      exportExcel(balanceLogFlowListApi, '流水明细.xlsx', payload);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/profitreport.scss';
.date-chart {
  background: #fff;
  padding: 16px 32px 32px 32px;
  border-radius: 2px;
  margin: 24px 0;
  border: 0;
}
.header-search,
.report-detail {
  background: #fff;
  padding: 24px 32px 6px 32px;
  border-radius: 2px;
}
.total-summary {
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fafafa;
  font-size: 14px;
  padding-left: 10px;
  padding-right: 10px;
  .total {
    float: right;
    > span {
      margin-left: 70px;
    }
    .num {
      color: $menuText;
    }
  }
}
</style>

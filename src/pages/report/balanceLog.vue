<template>
  <div class="date-earing">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="日期筛选：" prop="time">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店铺筛选：" prop="shopIds">
        <shop-filter v-model="searchData.shopIds" placeholder="请选择"></shop-filter>
      </el-form-item>
      <el-form-item label="设备类型：" prop="machineTypeIds">
        <el-select v-model="searchData.machineTypeIds" multiple clearable placeholder="请选择">
          <el-option v-for="(item,index) in parentTypList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源类型：" prop="source">
        <el-select v-model="searchData.source" clearable placeholder="请选择">
          <el-option v-for="(item,index) in parentTypList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收支类型：" prop="type">
        <el-select v-model="searchData.type " clearable placeholder="请选择">
          <el-option v-for="(item,index) in parentTypList" :key="index" :label="item.name" :value="item.id"></el-option>
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
        <el-button icon="el-icon-download" style="float: right;">导出</el-button>
      </div>
      <el-table :data="tableDataList" show-summary style="width: 100%">
        <el-table-column header-align="left" prop="date" label="时间"></el-table-column>
        <el-table-column header-align="left" prop="count" label="订单数量"></el-table-column>
        <el-table-column header-align="left" prop="refundMoney" label="用户账号"></el-table-column>
        <el-table-column header-align="left" prop="money" label="金额"></el-table-column>
        <el-table-column header-align="left" prop="money" label="来源类型"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { dayReportFun } from '@/service/report';
import { ParentTypeFun } from '@/service/index';
import ShopFilter from '@/components/Shopfilter';
export default {
  components: {
    ShopFilter
  },
  data() {
    return {
      tableDataList: [],
      searchData: {
        time: [
          moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD'),
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
        ],
        shopIds: [],
        machineTypeIds: [],
        source: '',
        type: ''
      },
      parentTypList: []
    };
  },

  mounted() {},
  created() {
    this.getmachineParentType();
    this.getProfitDate();
  },
  methods: {
    searchForm() {
      this.getProfitDate();
    },
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
      this.getProfitDate();
    },
    async getmachineParentType() {
      //获取设备类型
      let res = await ParentTypeFun({ onlyMine: true });
      this.parentTypList = res;
    },
    async getProfitDate(shopId = '') {
      //收益数据
      let payload = Object.assign({}, { startDate: this.searchData.time[0], endDate: this.searchData.time[1], shopIds: this.searchData.shopIds.join(','), machineTypeIds: this.searchData.machineTypeIds.join(','), dateLevel: 4 });
      let res = await dayReportFun(payload);
      this.tableDataList = res.list;
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
</style>

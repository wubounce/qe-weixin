<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="优惠适用店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态：" prop="expired">
        <el-select v-model="searchData.expired" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(name, id) in CouponAcctiveStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启/关闭：" prop="status">
        <el-select v-model="searchData.status" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="openAddBDDialog()">新增优惠</el-button>
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="timeMaketingDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="适用店铺" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="more-shop" v-for="(items,index) in scope.row.shop" :key="index">
              {{items.name}}
              <i v-if="index !== (scope.row.shop.length-1)">,</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="parentTypeName" label="适用类型" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" label="优惠日期" min-width="180">
          <template slot-scope="scope">
            <span>{{scope.row.noDiscountStart}}~{{scope.row.noDiscountEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="week" label="活动日">
          <template slot-scope="scope">
            <span>{{scope.row.noWeek?scope.row.noWeek:'' | week}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="noTime" label="每日活动时段" min-width="140px">
          <template slot-scope="scope">
            <span>{{scope.row.noTime === '00:00-23:59'? '全天':scope.row.noTime}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="discountVO" label="优惠折扣">
          <template slot-scope="scope">
            <span>{{scope.row.discountVO | discountToFIexd}} 折</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="expired" label="活动状态" :formatter="formatterExpired"></el-table-column>
        <el-table-column header-align="left" label="开启/关闭">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.switchStatus" v-if="scope.row.expired!==2" @change="updataeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark" v-if="scope.row.expired!==2">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="openAddBDDialog(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDeleteDiscount(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 新增 -->
    <add-limited-discount :visible.sync="addMaketDialogVisible" v-if="addMaketDialogVisible" :limitedDiscountId="limitedDiscountId" @getTimeMaketingDataToTable="getTimeMaketingDataToTable" />
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { timeMarketListFun, delMarketFun, updataeStatusFun, timeMarketListApi } from '@/service/market';
import { shopListFun } from '@/service/report';
import { exportExcel } from '@/service/common';
import { CouponAcctiveStatusType } from '@/utils/mapping';
import addLimitedDiscount from './addLimitedDiscount';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    addLimitedDiscount
  },
  data() {
    return {
      searchData: {
        shopId: '',
        status: '',
        expired: ''
      },
      shopList: [],
      timeMaketingDataToTable: [],
      addMaketDialogVisible: false,
      limitedDiscountId: ''
    };
  },
  filters: {
    discountToFIexd: val => {
      return Number(val).toFixed(1);
    }
  },
  computed: {
    CouponAcctiveStatusType() {
      return CouponAcctiveStatusType;
    }
  },
  created() {
    this.getShopList();
    this.getTimeMaketingDataToTable();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getTimeMaketingDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getTimeMaketingDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getTimeMaketingDataToTable();
    },
    formatterExpired(row, column) {
      return CouponAcctiveStatusType[row.expired];
    },
    async getTimeMaketingDataToTable() {
      //获取列表
      this.timeMaketingDataToTable = [];
      let payload = Object.assign({}, this.searchData);
      let res = await timeMarketListFun(payload);
      if (res.items) {
        res.items.forEach(item => {
          item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
          item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD') : '';
          if (item.status === 0) {
            item.switchStatus = true;
          } else {
            item.switchStatus = false;
          }
        });
      }
      this.timeMaketingDataToTable = res.items;
      this.total = res.total;
    },
    async openAddBDDialog(row = {}) {
      this.limitedDiscountId = '';
      if (row.id) {
        this.limitedDiscountId = row.id;
      }
      this.addMaketDialogVisible = true;
    },

    handleDeleteDiscount(row) {
      let payload = { timeId: row.id };
      this.$confirm('您确定要删除该优惠?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        delMarketFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getTimeMaketingDataToTable();
        });
      });
    },
    updataeStatus(row) {
      if (row.switchStatus === true) {
        row.status = 0;
      } else {
        row.status = 1;
      }
      let payload = Object.assign({}, { timeId: row.id, status: row.status });
      updataeStatusFun(payload).then(() => {
        this.$message.success('操作成功');
      });
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.excel = true;
      exportExcel(timeMarketListApi, '限时优惠.xlsx', payload);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

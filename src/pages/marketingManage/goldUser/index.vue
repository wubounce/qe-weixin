<template>
  <div class="coupon-active-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="会员账号：" prop="type">
        <el-input v-model="searchData.type"></el-input>
      </el-form-item>
      <el-form-item label="店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="addGoldDialogVisible=true">金币充值</el-button>
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="会员账号"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="金币余额(枚)"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="金币本金余额(枚)"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="赠送金币余额(枚)"></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="回收" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleRecycle(scope.row.shopId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 金币充值 -->
    <recharge v-if="addGoldDialogVisible" :visible.sync="addGoldDialogVisible" :shopList="shopList"></recharge>
    <!-- 金币回收 -->
    <recycle-gold v-if="recycleDialogVisible" :visible.sync="recycleDialogVisible"></recycle-gold>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { voucherListFun } from '@/service/voucher';
import { shopListFun } from '@/service/report';
import { deleteShopFun } from '@/service/shop';
import { exportExcel } from '@/service/common';
import recharge from './recharge';
import recycleGold from './recycleGold';

export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    recharge,
    recycleGold
  },
  data() {
    return {
      searchData: {
        type: '',
        shopId: ''
      },
      shopList: [],
      addGoldDialogVisible: false,
      recycleDialogVisible: false
    };
  },
  filters: {},
  computed: {},
  created() {
    this.getShopList();
    this.getCouponSentDataToTable();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getCouponSentDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.getCouponSentDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.$refs[formName].resetFields();
      this.getCouponSentDataToTable();
    },
    async getCouponSentDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startDate = payload.time ? payload.time[0] : null;
      payload.endDate = payload.time ? payload.time[1] : null;
      payload.time = null;
      let res = await voucherListFun(payload);
      this.couponSentDataToTable = res.page.items;
      this.total = res.page.total;
    },
    addGoldCase(row) {
      this.addGoldDialogVisible = true;
    },
    // 删除店铺
    handleRecycle(row) {
      this.recycleDialogVisible = true;
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.provinceId = payload.areas[0];
      payload.cityId = payload.areas[1];
      payload.districtId = payload.areas[2];
      payload.areas = [];
      payload.excel = true;
      exportExcel(manageListApi, '店铺列表.xlsx', payload);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
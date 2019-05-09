<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="用户账号：" prop="phone">
        <el-input v-model.trim="searchData.phone" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="券状态：" prop="status">
        <el-select v-model="searchData.status" clearable placeholder="请选择">
          <el-option v-for="(name, id) in CouponStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="券类型：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option v-for="(name, id) in CouponType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="适用店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用类型：" prop="parentTypeId">
        <el-select v-model="searchData.parentTypeId" clearable placeholder="请选择">
          <el-option label="通用" value=""></el-option>
          <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="来源类型：" prop="origin">
        <el-select v-model="searchData.origin" clearable placeholder="请选择">
          <el-option v-for="(name, id) in couponSourceType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="创建时间： " prop="time">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="相关活动：" prop="name">
        <el-input v-model.trim="searchData.name" placeholder="请输入活动名称"></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="voucherListDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="面额(元)/折扣" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="" label="条件" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>满{{scope.row.faceValue}}元可用</span>
          </template>
        </el-table-column>
        <!-- <el-table-column header-align="left" prop="merchantType" label="券类型">
          <template slot-scope="scope">
            <span>{{scope.row.merchantType | CouponType}}</span>
          </template>
        </el-table-column> -->
        <el-table-column header-align="left" prop="phone" label="用户账号" width="160"></el-table-column>
        <!-- <el-table-column header-align="left" prop="" label="优惠金额(元)" width="100"></el-table-column> -->
        <el-table-column header-align="left" prop="shopName" label="适用店铺" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="parentType" label="适用类型"></el-table-column>
        <el-table-column header-align="left" prop="" label="有效期" width="160">
          <template slot-scope="scope">
            <span>{{scope.row.startDate}}-{{scope.row.endDate}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="" label="有效时段" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="createTime" label="创建时间 " width="160"></el-table-column>
        <el-table-column header-align="left" prop="status" label="券状态 ">
          <template slot-scope="scope">
            <span>{{scope.row.status | CouponStatusType}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column header-align="left" prop="" label="相关活动 "></el-table-column> -->
        <el-table-column header-align="left" prop="source" label="来源类型 "></el-table-column>
        <el-table-column header-align="left" prop="realName" label="创建人"></el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { voucherListFun, listApi } from '@/service/voucher';
import { shopListFun } from '@/service/report';
import { getlistParentTypeFun } from '@/service/device';
import { exportExcel } from '@/service/common';
import { CouponStatusType, CouponType, couponSourceType } from '@/utils/mapping';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination
  },
  data() {
    return {
      searchData: {
        phone: '',
        status: '',
        shopId: '',
        parentTypeId: '',
        time: []
      },
      shopList: [],
      machineParentTypeList: [],
      voucherListDataToTable: []
    };
  },
  filters: {
    CouponStatusType: val => {
      return CouponStatusType[val];
    },
    CouponType: val => {
      return CouponType[val];
    }
  },
  computed: {
    CouponStatusType: function() {
      return CouponStatusType;
    },
    CouponType: function() {
      return CouponType;
    },
    couponSourceType: function() {
      return couponSourceType;
    }
  },
  created() {
    this.getShopList();
    this.getmachineParentType();
    this.getCouponRecordDataToTable();
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
      this.searchData = Object.assign(this.searchData, data);
      this.getCouponRecordDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getCouponRecordDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getCouponRecordDataToTable();
    },
    async getCouponRecordDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startDate = payload.time ? payload.time[0] : null;
      payload.endDate = payload.time ? payload.time[1] : null;
      payload.time = null;
      let res = await voucherListFun(payload);
      this.voucherListDataToTable = res.page.items;
      this.total = res.page.total;
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startDate = payload.time ? payload.time[0] : null;
      payload.endDate = payload.time ? payload.time[1] : null;
      payload.time = null;
      payload.excel = true;
      exportExcel(listApi, '优惠券记录.xlsx', payload);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

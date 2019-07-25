<template>
  <div class="coupon-active-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="适用店铺：" prop="type">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间： " prop="type">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="addGoldCase">新增方案</el-button>
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="适用店铺" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="detailDialogVisible = true;">{{scope.row.merchantType | CouponType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="折扣比例(%)" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="创建时间 "></el-table-column>
        <el-table-column header-align="left" prop="isLock" label="开启/关闭">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.merchantType"></el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDelete(scope.row.shopId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 新增方案 -->
    <add-gold v-if="addGoldDialogVisible" :visible.sync="addGoldDialogVisible" :shopList="shopList"></add-gold>
    <!-- 金币方案详情 -->
    <gold-infor v-if="detailDialogVisible" :visible.sync="detailDialogVisible" :shopList="shopList"></gold-infor>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { voucherListFun } from '@/service/voucher';
import { shopListFun } from '@/service/report';
import { deleteShopFun } from '@/service/shop';
import { exportExcel } from '@/service/common';

import addGold from './addGold';
import goldInfor from './goldInfor';

export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    addGold,
    goldInfor
  },
  data() {
    return {
      searchData: {
        phone: '',
        time: []
      },
      shopList: [],
      addGoldDialogVisible: false,
      detailDialogVisible: false
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
    handleDelete(shopId) {
      this.$confirm('您确定要删除该店铺?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        deleteShopFun({ shopId: shopId }).then(() => {
          this.$message.success('店铺删除成功');
          this.getShopDataToTable();
        });
      });
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
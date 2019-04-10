<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="适用店铺：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放时间： " prop="type">
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
        <el-button type="primary" icon="el-icon-plus" @click="openAddBDDialog()">发券</el-button>
      </div>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="发放用户数" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="适用店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="merchantType" label="券类型">
          <template slot-scope="scope">
            <span>{{scope.row.merchantType | CouponType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="phone" label="适用类型"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="面额(元)/折扣"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="条件" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="有效期"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="有效时段"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="每用户发放数量"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="发放时间 " width="160"></el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { voucherListFun } from '@/service/voucher';
import { CouponStatusType, CouponType } from '@/utils/mapping';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination
  },
  data() {
    return {
      searchData: {
        phone: '',
        time: []
      },
      couponSentDataToTable: []
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
    }
  },
  created() {
    this.getCouponSentDataToTable();
  },
  methods: {
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

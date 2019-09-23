<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="浴室名称：" prop="bathroomName">
        <el-input v-model="searchData.bathroomName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用性别：" prop="expired">
        <el-select v-model="searchData.expired" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option value="0" label="男"></el-option>
          <el-option value="1" label="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="searchData.status" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option value="0" label="营业中"></el-option>
          <el-option value="1" label="暂停营业"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <el-table :data="timeMaketingDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="浴室名称" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="parentTypeName" label="所属店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="week" label="违约次数"></el-table-column>
        <el-table-column header-align="left" prop="noTime" label="禁止预约(天)" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="noTime" label="浴位数量" min-width="140px">
          <template slot-scope="scope">
            <span class="rowstyle">{{scope.row.parentTypeName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="noTime" label="适用性别" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="noTime" label="预约时长(分钟)" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="noTime" label="营业状态" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="noTime" label="开放时段" min-width="140px"></el-table-column>
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
    <!-- 浴室列表 -->
    <positon-list></positon-list>
    <!-- 编辑浴室 -->
    <edit-bathroom></edit-bathroom>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { timeMarketListFun, delMarketFun } from '@/service/market';
import { shopListFun } from '@/service/report';
import { CouponAcctiveStatusType } from '@/utils/mapping';
import positonList from './positonList';
import editBathroom from './editBathroom';

export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    positonList,
    editBathroom
  },
  data() {
    return {
      searchData: {
        bathroomName: '',
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
      this.$confirm('确认删除该浴室？', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        delMarketFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getTimeMaketingDataToTable();
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

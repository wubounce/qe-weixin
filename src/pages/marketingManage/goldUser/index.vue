<template>
  <div class="coupon-active-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="会员账号：" prop="phone">
        <el-input v-model="searchData.phone"></el-input>
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
      </div>
      <el-table :data="goleUserList" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="phone" label="会员账号">
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookDetail(scope.row)">{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="shopName" label="店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="totalAmount" label="金币余额(枚)"></el-table-column>
        <el-table-column header-align="left" prop="principalAmount" label="金币本金余额(枚)"></el-table-column>
        <el-table-column header-align="left" prop="presentAmount" label="赠送金币余额(枚)"></el-table-column>
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
    <recharge v-if="addGoldDialogVisible" :visible.sync="addGoldDialogVisible" @getGoldUserDataToTable="getGoldUserDataToTable"></recharge>
    <!-- 金币回收 -->
    <recycle-gold v-if="recycleDialogVisible" :visible.sync="recycleDialogVisible"></recycle-gold>
    <!-- 金币充值记录 -->
    <record v-if="recordDialogVisible" :visible.sync="recordDialogVisible"></record>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { tokenCoinListFun, tokenCoinMemberListFun } from '@/service/tokenCoin';
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
        phone: '',
        shopId: ''
      },
      shopList: [],
      goleUserList: [],
      addGoldDialogVisible: false,
      recycleDialogVisible: false,
      recordDialogVisible: false
    };
  },
  filters: {},
  computed: {},
  created() {
    this.getShopList();
  },
  methods: {
    async getShopList() {
      let res = await tokenCoinListFun({ page: 1, pageSize: 999 });
      this.shopList = (res && res.items) || [];
      this.searchData.shopId = this.shopList.length > 0 ? this.shopList[0].shopId : '';
      this.searchData.shopId && this.getGoldUserDataToTable();
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getGoldUserDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.getGoldUserDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.$refs[formName].resetFields();
      this.getGoldUserDataToTable();
    },
    async getGoldUserDataToTable() {
      let payload = Object.assign({}, this.searchData);
      let res = await tokenCoinMemberListFun(payload);
      this.goleUserList = res.items || [];
      this.total = res.total;
    },
    addGoldCase(row) {
      this.addGoldDialogVisible = true;
    },
    //回收
    handleRecycle(row) {
      this.recycleDialogVisible = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
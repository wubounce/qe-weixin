<template>
  <div class="coupon-active-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="适用店铺：" prop="type">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item) in shopList" :key="item.shopId" :label="item.shopName" :value="item.shopId"></el-option>
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
      </div>
      <el-table :data="tokenCoinListDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="适用店铺" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookDetail(scope.row)">{{scope.row.shopName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="discountProportion" label="折扣比例(%)" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="createdAt" label="创建时间 "></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="开通/关闭" placement="top" effect="dark">
              <el-switch v-model="scope.row.switchStatus" @change="updataeStatus(scope.row)"></el-switch>
            </el-tooltip>
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="addGoldCase(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 新增方案 -->
    <add-gold v-if="addGoldDialogVisible" :visible.sync="addGoldDialogVisible" :shopTokenCoinId="shopTokenCoinId" @getTokenCoinList="getTokenCoinList"></add-gold>
    <!-- 金币方案详情 -->
    <gold-infor v-if="detailDialogVisible&&shopTokenCoinId" :visible.sync="detailDialogVisible" :shopTokenCoinId="shopTokenCoinId"></gold-infor>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { tokenCoinListFun, shoplistInTokenCoinFun, tokenCoinDelFun, tokenCoinCloseFun, tokenCoinOpenFun } from '@/service/tokenCoin';
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
        shopId: '',
        time: []
      },
      shopList: [],
      shopTokenCoinId: '',
      tokenCoinListDataToTable: [],
      addGoldDialogVisible: false,
      detailDialogVisible: false
    };
  },
  filters: {},
  computed: {},
  created() {
    this.getShopList();
    this.getTokenCoinList();
  },
  methods: {
    async getShopList() {
      let res = await shoplistInTokenCoinFun({ page: 1, pageSize: 999 });
      let items = (res && res.items) || [];
      this.shopList = items.filter(item => Boolean(item.isSet) === true);
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getTokenCoinList();
    },
    searchForm() {
      this.searchData.page = 1;
      this.getTokenCoinList();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.$refs[formName].resetFields();
      this.getTokenCoinList();
    },
    async getTokenCoinList() {
      let payload = Object.assign({}, this.searchData);
      payload.startDate = payload.time ? payload.time[0] : null;
      payload.endDate = payload.time ? payload.time[1] : null;
      payload.time = null;
      let res = await tokenCoinListFun(payload);
      if (res.items) {
        res.items.forEach(item => {
          if (item.isDelete === 0) {
            item.switchStatus = true;
          } else {
            item.switchStatus = false;
          }
        });
      }
      this.tokenCoinListDataToTable = res.items;
      this.total = res.total;
    },
    addGoldCase(row = {}) {
      this.shopTokenCoinId = '';
      if (row.id) {
        this.shopTokenCoinId = row.id;
      }
      this.addGoldDialogVisible = true;
    },
    async updataeStatus(row) {
      let payload = Object.assign({}, { id: row.id });
      row.switchStatus === true ? await tokenCoinOpenFun(payload) : await tokenCoinCloseFun(payload);
      this.$message.success('操作成功');
      this.getTokenCoinList();
    },
    lookDetail(row) {
      this.shopTokenCoinId = row.id;
      this.detailDialogVisible = true;
    },
    // 删除店铺
    handleDelete(row) {
      this.$confirm('您确定要删除该店铺?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        tokenCoinDelFun({ id: row.id }).then(() => {
          this.$message.success('店铺删除成功');
          this.getTokenCoinList();
        });
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-switch {
  margin-right: 20px;
}
</style>
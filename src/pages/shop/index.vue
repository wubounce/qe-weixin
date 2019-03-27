<template>
  <div>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="店铺名称：">
        <el-input v-model="searchData.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：">
        <el-select v-model="searchData.type" placeholder="请选择">
          <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择区域：">
        <el-select v-model="searchData.direct" placeholder="请选择">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址：">
        <el-input v-model="searchData.address" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus">新增店铺</el-button>
        <el-button icon="el-icon-download">导出</el-button>
      </div>
      <el-table :data="shopDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" class-name="rowstyle" prop="shopName" label="店铺名称" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="count" label="店铺地址" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="shopType" label="店铺类型"></el-table-column>
        <el-table-column header-align="left" prop="machineCount" label="设备数量"></el-table-column>
        <el-table-column header-align="left" prop="profit" label="累计收益(元)"></el-table-column>
        <el-table-column header-align="left" prop="isReserve" label="预约功能">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isReserve">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <i class="el-icon-edit"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <i class="el-icon-delete"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handleSearch" :total="total" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopTypeListFun, manageListFun } from '@/service/shop'
import Pagination from '@/components/Pager'
import PagerMixin from "@/mixins/PagerMixin";

export default {
  mixins: [PagerMixin],
  components: {
    Pagination
  },
  data () {
    return {
      searchData: {
      },
      shopTypeList: [],
      shopDataToTable: []
    }
  },
  created () {
    this.getShopTypeList()
    this.getShopDataToTable()
  },
  methods: {
    async getShopTypeList () {
      this.shopTypeList = await shopTypeListFun();
    },
    handleSearch (data) {
      this.searchData = Object.assign(this.searchData, data)
      this.getShopDataToTable()
    },
    searchForm () {
      let payload = Object.assign({}, this.searchData);
      this.getShopDataToTable(payload)
    },
    async getShopDataToTable () {
      let payload = Object.assign({}, this.searchData);
      let res = await manageListFun(payload);
      this.shopDataToTable = res.items
      this.shopDataToTable.forEach((item) => {
        if (item.isReserve === 0) {
          item.isReserve = true;
        } else {
          item.isReserve = false;
        }
      });
      this.total = res.total
    }
  },
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.rowstyle {
  color: $menuText;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-header-action {
  padding-bottom: 16px;
}
</style>

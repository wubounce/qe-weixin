<template>
  <div>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="店铺名称：" prop="shopName">
        <el-input v-model.trim="searchData.shopName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择区域：" prop="areas">
        <Area v-model="searchData.areas" size="small" default-option="不限" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model.trim="searchData.address" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="分账配置：" prop="type">
        <el-select v-model="searchData.isRevenueSharing " clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(name, id) in subAccountType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddOrEditShop">新增店铺</el-button>
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="shopDataToTable" ref="shopDataToTable" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-class-name="celClass">
        <el-table-column type="selection" width="55" :selectable="checkboxInit"></el-table-column>
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="店铺名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookShopDetail(scope.row);detailDialogVisible = true;">{{scope.row.shopName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="shopAddress" label="店铺地址" min-width="180" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="shopType" label="店铺类型"></el-table-column>
        <el-table-column header-align="left" prop="machineCount" label="设备数量">
          <template slot-scope="scope">
            <span class="rowstyle" @click="getDeciveFromShop(scope.row)">{{scope.row.machineCount}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="profit" label="累计收益(元)" min-width="100">
          <template slot-scope="scope">
            <span>{{scope.row.profit | tofixd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="isReserve" label="预约功能">
          <template slot-scope="scope">
            <span>{{scope.row.isReserve === 0 ? '已开启':'已关闭'}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="isRevenueSharing" label="分账配置">
          <template slot-scope="scope">
            {{scope.row.isRevenueSharing | subAccountType}}
          </template>
        </el-table-column>
        <el-table-column header-align="left" fixed="right" label="操作" min-width="160">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="handleAddOrEditShop(scope.row)" />
            </el-tooltip>
            <el-tooltip content="分账配置" placement="top" effect="dark" v-if="scope.row.attribute === 1">
              <svg-icon icon-class="zhangmu" class="icon-zhangmu" @click="subAccountSet(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDelete(scope.row.shopId)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <div style="float:left;padding-left:14px;">
          <el-checkbox v-model="isAllChecked" @change="handleCheckAllChange">全选</el-checkbox>
          <el-button type="primary" :disabled="multipleSelection.length<=0" @click="subAccountSet">
            <svg-icon icon-class="rmb" style="margin-right: 5px;" />分账配置</el-button>
        </div>
        <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      </div>
      <!-- 店铺详情 -->
      <el-dialog title="店铺详情" :visible.sync="detailDialogVisible" width="768px">
        <h3 class="detail-base-title">基本信息</h3>
        <ul class="deatil-list">
          <li>
            <div><span>店铺名称：</span>{{detailData.shopName}}</div>
            <div><span>店铺类型：</span>{{detailData.shopTypeName}}</div>
          </li>
          <li>
            <div><span>店铺地址：</span><i>{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.organization}}{{detailData.address}}</i></div>
            <div><span>已有设备：</span>{{detailData.machineTypeNames?detailData.machineTypeNames:'暂无设备'}}</div>
          </li>
          <li>
            <div><span>预约功能：</span>{{detailData.isReserve | isReserveType}}</div>
            <div><span>预约时间：</span>{{detailData.orderLimitMinutes?detailData.orderLimitMinutes+'分钟':''}}</div>
          </li>
          <li>
            <div><span>营业时间：</span>{{detailData.workTime}}</div>
            <div> <span>限时优惠：</span>{{detailData.isDiscount | isDiscountType}}</div>
          </li>
          <li>
            <div><span>VIP卡：</span>{{detailData.hasVip | isHasVipType}}</div>
            <div><span>VIP数量：</span>{{detailData.vipCount}}个</div>
          </li>
          <li>
            <div><span>客服电话：</span>{{detailData.serviceTelephone}}</div>
            <div><span>创建人：</span>{{detailData.createUser}}</div>
          </li>
          <li>
            <div><span>创建时间：</span>{{detailData.createTime}}</div>
          </li>
        </ul>
        <div v-if="revenueSharingDetail">
          <h3 class="detail-base-title" style="border:none">分账信息</h3>
          <div class="revent-share"><span>创建时间：</span>{{revenueSharingDetail.createdAt}}</div>
          <el-table :data="revenueSharingDetail.detail" style="width: 100%" max-height="300">
            <el-table-column prop="shareOperaterId" label="分账账户">
              <template slot-scope="scope">
                <span>{{scope.row.shareOperaterMobile}}({{scope.row.shareOperaterName}})</span>
              </template>
            </el-table-column>
            <el-table-column prop="proportion" label="分账比例">
              <template slot-scope="scope">
                <span>{{scope.row.proportion}}%</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 店铺设备数量 -->
      <machines-in-shop :title="deviceDialogTitle" v-if="deviceDialogVisible" :visible.sync="deviceDialogVisible" :shopId="shopIds"></machines-in-shop>
      <!-- 分账设置 -->
      <sub-account-set :title="subAccountSetTitle" v-if="subAccountSetDialogVisible" :visible.sync="subAccountSetDialogVisible" :isAllChecked.sync="isAllChecked" :shopIds="shopIds" @getShopDataToTable="getShopDataToTable"></sub-account-set>
      <!-- </el-dialog> -->
      <!-- 新增编辑店铺 -->
      <add-or-edit-shop :visible.sync="addShopDialogVisible" v-if="addShopDialogVisible" :shopId="shopIds" @getShopDataToTable="getShopDataToTable" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopTypeListFun, manageListFun, shopDetailFun, deleteShopFun, manageListApi, getrevenueSharingFun } from '@/service/shop';
import { exportExcel } from '@/service/common';
import { isReserveType, isHasVipType, isDiscountType, subAccountType } from '@/utils/mapping';
import Pagination from '@/components/Pager';
import machinesInShop from './machinesInShop';
import subAccountSet from './subAccountSet';
import addOrEditShop from './addOrEditShop';
import PagerMixin from '@/mixins/PagerMixin';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    machinesInShop,
    subAccountSet,
    addOrEditShop
  },
  data() {
    return {
      searchData: {
        shopName: '',
        type: '',
        areas: [],
        address: ''
      },
      addShopDialogVisible: false,
      shopDataToTable: [],
      detailDialogVisible: false,
      detailData: {},
      revenueSharingDetail: null, //分账详情
      deviceDialogVisible: false,
      shopIds: '', //店铺id
      deviceDialogTitle: '',
      multipleSelection: [],
      subAccountSetDialogVisible: false,
      subAccountSetTitle: '分账批量配置',
      isAllChecked: false
    };
  },
  computed: {
    subAccountType() {
      return subAccountType;
    }
  },
  filters: {
    isReserveType: val => {
      return isReserveType[val];
    },
    isHasVipType: val => {
      return isHasVipType[val];
    },
    isDiscountType: val => {
      return isDiscountType[val];
    },
    subAccountType: val => {
      return subAccountType[val];
    },
    tofixd(val) {
      return val >= 0 ? Number(val).toFixed(2) : val;
    }
  },
  watch: {},
  mounted() {},
  created() {
    this.getShopTypeList();
    this.getShopDataToTable();
  },
  methods: {
    async getShopTypeList() {
      this.shopTypeList = await shopTypeListFun();
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getShopDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getShopDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getShopDataToTable();
    },
    celClass(row) {
      if (row.columnIndex === 0) {
        return 'disable-selection';
      }
    },
    checkboxInit(row, index) {
      return row.attribute === 1;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let arr = this.shopDataToTable.filter(row => row.attribute == 1);
      this.multipleSelection.length === arr.length ? (this.isAllChecked = true) : (this.isAllChecked = false);
    },
    // 全选和取消全选
    handleCheckAllChange(val) {
      if (val) {
        this.multipleSelection = this.shopDataToTable.filter(row => {
          if (row.attribute == 1) {
            this.$refs.shopDataToTable.toggleRowSelection(row, true);
            return row;
          }
        });
      } else {
        this.$refs.shopDataToTable.clearSelection();
        this.multipleSelection = [];
      }
    },
    subAccountSet(row = {}) {
      if (row.shopId) {
        this.shopIds = row.shopId;
        this.subAccountSetTitle = '分账配置';
      } else {
        //批量分账
        if (this.multipleSelection.length <= 0) {
          this.$alert(`请勾选想要分账的店铺`, '提示', {
            showClose: false,
            confirmButtonText: '确定',
            center: true
          });
          return false;
        } else {
          this.shopIds = this.multipleSelection.map(item => item.shopId);
          this.subAccountSetTitle = '分账批量配置';
        }
      }
      this.subAccountSetDialogVisible = true;
    },
    async getShopDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.provinceId = payload.areas[0];
      payload.cityId = payload.areas[1];
      payload.districtId = payload.areas[2];
      payload.areas = [];
      let res = await manageListFun(payload);
      this.shopDataToTable = res.items || [];
      this.total = res.total;
    },
    async lookShopDetail(row) {
      let payload = { shopId: row.shopId };
      let res = await shopDetailFun(payload);
      let resSharingDetail = await getrevenueSharingFun(payload);
      this.detailData = res || {};
      this.revenueSharingDetail = resSharingDetail || null;
    },
    async getDeciveFromShop(row) {
      if (row.machineCount === 0) {
        return false;
      }
      this.deviceDialogTitle = row.shopName;
      this.shopIds = row.shopId;
      this.deviceDialogVisible = true;
    },
    async handleAddOrEditShop(row = {}) {
      this.shopIds = '';
      if (row.shopId) {
        this.shopIds = row.shopId;
      }
      this.addShopDialogVisible = true;
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
@import '~@/styles/variables.scss';
.detail-base-title {
  font-size: 16px;
  padding: 10px 0;
  font-weight: normal;
}
.deatil-list {
  padding-bottom: 15px;
  :last-child {
    border: none;
  }
  li {
    padding: 11px 0;
    border-bottom: 1px solid $under_line;
    display: flex;
    > div {
      width: 50%;
    }
    span {
      float: left;
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
      height: 100%;
    }
    i {
      font-style: normal;
    }
  }
}
.revent-share {
  margin: 15px 0;
  span {
    color: rgba(23, 26, 46, 0.45);
    width: 70px;
  }
}

.pagination-right {
  width: auto;
}
.el-table /deep/ .disable-selection .cell .el-checkbox__inner {
  display: none;
  position: relative;
}
.el-table /deep/ .disable-selection .cell::before {
  content: '选择';
  position: absolute;
}
</style>
 
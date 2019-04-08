<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="优惠适用店铺：">
        <el-input v-model="searchData.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动状态：">
        <el-select v-model="searchData.type" placeholder="请选择">
          <el-option label="开启"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启/关闭：">
        <el-select v-model="searchData.type" placeholder="请选择">
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="openAddBDDialog()">新增优惠</el-button>
        <el-button icon="el-icon-download">导出</el-button>
      </div>
      <el-table :data="timeMaketingDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="适用店铺" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="more-shop" v-for="(items,index) in scope.row.shop" :key="index">{{items.name}}<i v-if="index !== (scope.row.shop.length-1)">,</i></span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="parentTypeName" label="适用类型" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" label="优惠日期">
          <template slot-scope="scope">
            <span>{{scope.row.noDiscountStart}}~{{scope.row.noDiscountEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="week" label="活动日"></el-table-column>
        <el-table-column header-align="left" prop="time" label="每日活动时段"></el-table-column>
        <el-table-column header-align="left" prop="discount" label="优惠折扣">
          <template slot-scope="scope">
            <span>{{scope.row.discount | tofixd}} 折</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="expired" label="活动状态">
          <template slot-scope="scope">
            <span>{{scope.row.expired===2 ? '过期':''}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="开启/关闭">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.switchStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <i class="el-icon-edit" @click="openAddBDDialog(scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <i class="el-icon-delete" @click="handleDelete(scope.row.shopId)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handleSearch" :total="total" />
    </div>
    <!-- 新增 -->
    <el-dialog :title="addOrEditMaketTitle" :visible.sync="addMaketDialogVisible" @close="addMaketDialogVisible = false" width="620px" height="768px">
      <el-form ref="addMaketFrom" :model="addMaketFrom" :rules="addMaketFromRules" class="add-shop-from" label-width="120px" v-if="addMaketDialogVisible">
        <el-form-item label="适用店铺：" prop="shopIds">
          <span :class="['filter-shop',{'filter-shop-selected':shopFilterName}]" @click="getFilterShop">{{shopFilterName?shopFilterName:'请选择店铺'}}</span>
          <multiple-shop v-model="addMaketFrom.shopIds" @getShopFilterName="getShopFilterName(arguments)" :visible="filterShopVisible"></multiple-shop>
        </el-form-item>
        <el-form-item label="适用类型：" class="shop-name" prop="parentTypeIds">
          <el-select v-model="addMaketFrom.parentTypeIds" placeholder="请先选择店铺" :disabled="hasShop">
            <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
            <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠日期：" class="shop-name" prop="date">
          <el-date-picker size="small" v-model="addMaketFrom.date" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动日：" class="shop-name active-date" prop="week">
          <el-radio-group v-model="addMaketFrom.week" @change="changeActiveDate">
            <el-radio label="9">每天</el-radio>
            <el-radio label="8">周一～周五</el-radio>
            <el-radio label="10">自定义</el-radio>
          </el-radio-group>
          <active-week v-model="addMaketFrom.weekCheckList" @getShopFilterName="getWeekFilterName(arguments)" :visible="weekFilterVisible" />
        </el-form-item>
        <el-form-item label="每日活动时段：" class="perm-tree" prop="time">
          <el-time-picker is-range v-model="addMaketFrom.time" placeholder="请选择" value-format="HH:mm"> </el-time-picker>
        </el-form-item>
        <el-form-item label="优惠折扣：" class="shop-name" prop="discount">
          <div class="add-discount">
            <div>
              <el-input v-model="addMaketFrom.discount" placeholder="例：8.5"></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">折</span>
            </div>
            <div style="color:#bfbfbf;margin-left: 30px;">优惠折扣为用户支付时所享受的折扣</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitMemberFrom('addMaketFrom')">保存</el-button>
          <el-button @click="addMaketDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager'
import PagerMixin from "@/mixins/PagerMixin";
import multipleShop from '@/components/multipleShop'
import activeWeek from './activeWeek'
import { timeMarketListFun, updataeStatusFun, addOruPdateFun, marketlistParentTypeIdFun } from '@/service/market';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    multipleShop,
    activeWeek,
  },
  data () {
    return {
      searchData: {},
      timeMaketingDataToTable: [],
      addOrEditMaketTitle: '新增优惠',
      addMaketDialogVisible: false,
      shopFilterName: null,
      filterShopVisible: false,
      weekFilterName: null,
      weekFilterVisible: false,
      addMaketFrom: {
        id: '',
        week: '',
        time: ['00:00', '23:59'],
        date: [],
        parentTypeIds: '',
        shopIds: [],
        discount: ''
      },
      addMaketFromRules: {
        shopIds: [
          { required: true, type: 'array', trigger: 'change', message: '请选择适用店铺' }
        ],
        parentTypeIds: [
          { required: true, trigger: "change", message: '请填写适用类型' },
        ],
        date: [
          { required: true, type: 'array', trigger: 'change', message: '请选择优惠日期' },
        ],
        week: [
          { required: true, trigger: 'blur', message: '请选择活动日' }
        ],
        time: [
          { required: true, type: 'array', trigger: 'change', message: '请选择每日活动时间段' }
        ],
        discount: [
          { required: true, message: '请输入折扣', trigger: 'blur' },
        ],
      },
      machineParentType: [],
      hasShop: true,
    }
  },
  created () {
    this.getTimeMaketingDataToTable();
  },
  methods: {
    handleSearch (data) {
      this.searchData = Object.assign(this.searchData, data)
      this.getTimeMaketingDataToTable()
    },
    searchForm () {
      this.searchData.page = 1;
      let payload = Object.assign({}, this.searchData);
      this.getTimeMaketingDataToTable(payload)
    },
    getFilterShop () {
      this.filterShopVisible = true
    },
    getShopFilterName (data) {
      this.shopFilterName = data[0].join(',')
      this.filterShopVisible = data[1]
    },
    getWeekFilterName (data) {
      this.weekFilterName = data[0].join(',')
      this.weekFilterVisible = data[1]
    },
    changeActiveDate (val) {
      val == 10 ? this.weekFilterVisible = true : this.weekFilterVisible = false;
    },
    changeParentType () {
      console.log(8787987)
      if (this.addMaketFrom.shopIds.length <= 0) {
        this.$Message.error('先选择店铺');
        return false;
      } else {
        this.getMarketlistParentType();
      }
    },
    async getMarketlistParentType () {
      let payload = { shopIds: this.addMaketFrom.shopIds.join(',') };
      let res = await marketlistParentTypeIdFun(payload);
      this.machineParentType = res.length > 0 ? [{ parentTypeId: '', parentTypeName: '全部' }, ...res] : [];
    },
    async getTimeMaketingDataToTable () {
      let payload = Object.assign({}, this.searchData);
      let res = await timeMarketListFun(payload);
      res.items.forEach((item) => {
        item.noDiscountStart = item.noDiscountStart ? moment(item.noDiscountStart).format('YYYY-MM-DD') : '';
        item.noDiscountEnd = item.noDiscountEnd ? moment(item.noDiscountEnd).format('YYYY-MM-DD') : '';
        if (item.status === 0) {
          item.switchStatus = true;
        } else {
          item.switchStatus = false;
        }
      });
      this.timeMaketingDataToTable = res.items;
      this.total = res.total;
    },
    async openAddBDDialog (row = {}) {
      this.addOrEditMaketTitle = '新增优惠'
      if (row.id) {
        this.addOrEditMaketTitle = '编辑优惠';
      }
      this.addMaketDialogVisible = true;
    },
  },
  watch: {
    'addMaketFrom.shopIds': {
      deep: true,
      handler: function (val) {
        val.length > 0 ? this.hasShop = false : this.hasShop = true;
      }
    }
  },
}
</script>
<style lang="scss">
.active-date .el-radio {
  margin-right: 0;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/variables.scss";
.filter-shop {
  display: inline-block;
  width: 220px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  line-height: 32px;
  padding: 0 3px;
  color: #c0c4cc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.filter-shop-selected {
  color: #606266;
}
.add-shop-from {
  border-top: 1px solid $under_line;
  padding-top: 24px;
  padding-bottom: 24px;
}
.add-discount {
  display: flex;
  > div {
  }
}
</style>

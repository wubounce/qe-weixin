<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="优惠适用店铺：" prop="name">
        <el-input v-model="searchData.name" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="活动状态：" prop="status">
        <el-select v-model="searchData.status" clearable placeholder="请选择">
          <el-option label="开启"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启/关闭：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
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
            <span class="more-shop" v-for="(items,index) in scope.row.shop" :key="index">
              {{items.name}}
              <i v-if="index !== (scope.row.shop.length-1)">,</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="parentTypeName" label="适用类型" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" label="优惠日期">
          <template slot-scope="scope">
            <span>{{scope.row.noDiscountStart}}~{{scope.row.noDiscountEnd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="week" label="活动日">
          <template slot-scope="scope">
            <span>{{scope.row.week?scope.row.week:'1,2,3' | week}}</span>
          </template>
        </el-table-column>
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
            <el-switch v-model="scope.row.switchStatus"></el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <i class="el-icon-edit" @click="openAddBDDialog(scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <i class="el-icon-delete" @click="handleDeleteDiscount(scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 新增 -->
    <el-dialog :title="addOrEditMaketTitle" :visible.sync="addMaketDialogVisible" @close="resetAddOrEditMaketFrom('addMaketFrom')" width="620px" height="768px">
      <el-form ref="addMaketFrom" :model="addMaketFrom" :rules="addMaketFromRules" class="add-shop-from" label-width="120px" v-if="addMaketDialogVisible">
        <el-form-item label="适用店铺：" prop="shopIds">
          <multiple-shop v-model="addMaketFrom.shopIds" @change="getShopFilter" placeholder="请选择店铺"></multiple-shop>
        </el-form-item>
        <el-form-item label="适用类型：" prop="parentTypeIds">
          <el-select v-model="addMaketFrom.parentTypeIds" placeholder="请先选择店铺" :disabled="hasShop">
            <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
            <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠日期：" prop="date">
          <el-date-picker size="small" v-model="addMaketFrom.date" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动日：" class="shop-name active-date" prop="week">
          <el-radio-group v-model="addMaketFrom.week" @change="changeActiveDate">
            <el-radio :label="9">每天</el-radio>
            <el-radio :label="8">周一～周五</el-radio>
            <el-radio :label="10">自定义</el-radio>
          </el-radio-group>
          <active-week v-model="addMaketFrom.weekCheckList" @getcustomWeekCheckList="getcustomWeekCheckList(arguments)" :visible="weekFilterVisible" />
        </el-form-item>
        <el-form-item label="每日活动时段：" prop="time">
          <el-time-picker is-range v-model="addMaketFrom.time" placeholder="请选择" value-format="HH:mm"></el-time-picker>
        </el-form-item>
        <el-form-item label="优惠折扣：" prop="discount">
          <div class="add-discount">
            <div>
              <el-input v-model="addMaketFrom.discount" placeholder="例：8.5"></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">折</span>
            </div>
            <div style="color:#bfbfbf;margin-left: 30px;">优惠折扣为用户支付时所享受的折扣</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitAddOrEditMaketFrom('addMaketFrom')">保存</el-button>
          <el-button @click="resetAddOrEditMaketFrom('addMaketFrom')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import multipleShop from '@/components/multipleShop';
import activeWeek from './activeWeek';
import { timeMarketListFun, addOruPdateFun, marketlistParentTypeIdFun, delMarketFun, detailMarketFun } from '@/service/market';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    multipleShop,
    activeWeek
  },
  data() {
    return {
      searchData: {
        name: '',
        status: '',
        type: ''
      },
      timeMaketingDataToTable: [],
      addOrEditMaketTitle: '新增优惠',
      addMaketDialogVisible: false,
      weekFilterVisible: false,
      addMaketFrom: {
        timeId: '',
        week: '',
        time: ['00:00', '23:59'],
        date: [],
        parentTypeIds: '',
        shopIds: [],
        discount: '',
        weekCheckList: []
      },
      addMaketFromRules: {
        shopIds: [
          {
            required: true,
            type: 'array',
            trigger: 'change',
            message: '请选择适用店铺'
          }
        ],
        parentTypeIds: [{ required: true, trigger: 'change', message: '请填写适用类型' }],
        date: [
          {
            required: true,
            type: 'array',
            trigger: 'change',
            message: '请选择优惠日期'
          }
        ],
        week: [{ required: true, trigger: 'blur', message: '请选择活动日' }],
        time: [
          {
            required: true,
            type: 'array',
            trigger: 'change',
            message: '请选择每日活动时间段'
          }
        ],
        discount: [{ required: true, message: '请输入折扣', trigger: 'blur' }]
      },
      machineParentType: [],
      hasShop: true
    };
  },
  created() {
    this.getTimeMaketingDataToTable();
  },
  methods: {
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getTimeMaketingDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.getTimeMaketingDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.$refs[formName].resetFields();
      this.getTimeMaketingDataToTable();
    },
    getShopFilter(val) {
      if (val.length >= 1) {
        this.getMarketlistParentType();
      }
    },
    getcustomWeekCheckList(data) {
      this.addMaketFrom.weekCheckList = data[0];
      this.weekFilterVisible = data[1];
    },
    changeActiveDate(val) {
      if (val === 10) {
        this.weekFilterVisible = true;
      } else {
        this.weekFilterVisible = false;
        this.addMaketFrom.weekCheckList = [];
      }
    },
    changeParentType() {
      if (this.addMaketFrom.shopIds.length <= 0) {
        this.$Message.error('先选择店铺');
        return false;
      } else {
        this.getMarketlistParentType();
      }
    },
    async getMarketlistParentType() {
      //获取二级类型
      let payload = { shopIds: this.addMaketFrom.shopIds.join(',') };
      let res = await marketlistParentTypeIdFun(payload);
      this.machineParentType = res.length > 0 ? [{ parentTypeId: '全部', parentTypeName: '全部' }, ...res] : [];
    },
    async getTimeMaketingDataToTable() {
      //获取列表
      let payload = Object.assign({}, this.searchData);
      console.log(payload);
      let res = await timeMarketListFun(payload);
      res.items.forEach(item => {
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
    async openAddBDDialog(row = {}) {
      this.addOrEditMaketTitle = '新增优惠';
      this.addMaketDialogVisible = true;
      if (row.id) {
        this.addOrEditMaketTitle = '编辑优惠';
        this.getMaketDetail(row).then(() => {
          this.addMaketDialogVisible = true;
        });
      }
    },
    async getMaketDetail(row) {
      let payload = { timeId: row.id };
      let res = await detailMarketFun(payload);
      let time = res.noTime.split('-');
      let weeklist = res.noWeek ? res.noWeek.split(',') : [];
      let startTime = res.noDiscountStart ? moment(res.noDiscountStart).format('YYYY-MM-DD') : '';
      let endTime = res.noDiscountEnd ? moment(res.noDiscountEnd).format('YYYY-MM-DD') : '';
      let beshop = [];
      let beshopIds = [];
      res.shop.forEach(item => {
        beshop.push(item.name);
        beshopIds.push(item.id);
      });
      this.addMaketFrom = {
        timeId: res.id,
        week: res.noWeek,
        time: [time[0], time[1]],
        date: [startTime, endTime],
        parentTypeIds: res.parentTypeMap && res.parentTypeIds ? res.parentTypeMap[0].parentTypeId : '全部',
        shopIds: beshopIds,
        discount: res.discount,
        weekCheckList: weeklist
      };
      if (weeklist.length > 1) {
        this.addMaketFrom.week = 10;
      }
      this.getMarketlistParentType();
      return Promise.resolve();
    },
    onSubmitAddOrEditMaketFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.addMaketFrom);
          payload.time = payload.time.join('-');
          payload.shopIds = payload.shopIds.join(',');
          payload.startTime = payload.date ? payload.date[0] : null;
          payload.endTime = payload.date ? payload.date[1] : null;
          payload.date = null;
          if (payload.week === 10) payload.week = payload.weekCheckList.join(',');
          payload.parentTypeIds = payload.parentTypeIds == '全部' ? '' : `'${payload.parentTypeIds}'`;
          addOruPdateFun(payload).then(() => {
            this.$Message.success('操作成功');
            this.getTimeMaketingDataToTable();
            this.resetAddOrEditMaketFrom(formName);
          });
        } else {
          return false;
        }
      });
    },
    resetAddOrEditMaketFrom(formName) {
      this.addMaketFrom.weekCheckList = [];
      this.$refs[formName].resetFields();
      this.addMaketDialogVisible = false;
    },
    handleDeleteDiscount(row) {
      let payload = { timeId: row.id };
      this.$confirm('您确定要删除该优惠?', '提示', {
        showClose: false
      }).then(() => {
        delMarketFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getTimeMaketingDataToTable();
        });
      });
    }
  },
  watch: {
    'addMaketFrom.shopIds': {
      deep: true,
      handler: function(val) {
        val.length > 0 ? (this.hasShop = false) : (this.hasShop = true);
      }
    }
  }
};
</script>
<style lang="scss">
.active-date .el-radio {
  margin-right: 0;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
}
.add-discount {
  display: flex;
}
</style>

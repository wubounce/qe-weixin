<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="优惠适用店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动状态：" prop="expired">
        <el-select v-model="searchData.expired" clearable placeholder="请选择">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(name, id) in CouponAcctiveStatusType" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开启/关闭：" prop="status">
        <el-select v-model="searchData.status" clearable placeholder="请选择">
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
        <el-button icon="el-icon-download" @click="exportTable()">导出</el-button>
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
            <span>{{scope.row.noWeek?scope.row.noWeek:'' | week}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="noTime" label="每日活动时段">
          <template slot-scope="scope">
            <span>{{scope.row.noTime === '00:00-23:59'? '全天':scope.row.noTime}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="discountVO" label="优惠折扣">
          <template slot-scope="scope">
            <span>{{scope.row.discountVO | discountToFIexd}} 折</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="expired" label="活动状态" :formatter="formatterExpired"></el-table-column>
        <el-table-column header-align="left" label="开启/关闭">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.switchStatus" v-if="scope.row.expired!==2" @change="updataeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark" v-if="scope.row.expired!==2">
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
          <multiple-shop v-model="addMaketFrom.shopIds" @change="getShopFilter" :isTimeMaket="isTimeMaket" placeholder="请选择店铺"></multiple-shop>
        </el-form-item>
        <el-form-item label="适用类型：" prop="parentTypeIds">
          <el-select v-model="addMaketFrom.parentTypeIds" placeholder="请先选择店铺" :disabled="hasShop" v-if="machineParentType.length>0">
            <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
            <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
          </el-select>
          <el-select placeholder="请先选择店铺" :disabled="hasShop" v-else>
            <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠日期：" prop="date">
          <el-date-picker size="small" v-model="addMaketFrom.date" :picker-options="pickerOptions" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
        </el-form-item>
        <el-form-item label="活动日：" class="shop-name active-date" prop="week">
          <el-radio-group v-model="addMaketFrom.week">
            <el-radio :label="9" @click.native="changeCustomWeekVisible(9)">每天</el-radio>
            <el-radio :label="8" @click.native="changeCustomWeekVisible(8)">周一～周五</el-radio>
            <el-radio :label="10" @click.native="changeCustomWeekVisible(10)">自定义</el-radio>
          </el-radio-group>
          <active-week v-model="addMaketFrom.weekCheckList" @getcustomWeekCheckList="getcustomWeekCheckList(arguments)" :visible="weekFilterVisible" />
        </el-form-item>
        <el-form-item label="每日活动时段：" prop="time">
          <el-time-picker is-range v-model="addMaketFrom.time" placeholder="请选择" format="HH:mm" value-format="HH:mm"></el-time-picker>
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
import { timeMarketListFun, addOruPdateFun, marketlistParentTypeIdFun, delMarketFun, detailMarketFun, updataeStatusFun, timeMarketListApi } from '@/service/market';
import { shopListFun } from '@/service/report';
import { exportExcel } from '@/service/common';
import { CouponAcctiveStatusType } from '@/utils/mapping';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    multipleShop,
    activeWeek
  },
  data() {
    const validateDiscount = (rule, value, callback) => {
      let reg = /^[0-9]{1}(\.[0-9])?$/;
      if (!value) {
        return callback(new Error('折扣不能为空'));
      } else if (!reg.test(value)) {
        callback(new Error('折扣请填写1到9的数字,可保留一位小数'));
      } else if (Number(value) === 0) {
        callback(new Error('折扣请填写1到9的数字,可保留一位小数'));
      } else {
        callback();
      }
    };
    return {
      searchData: {
        shopId: '',
        status: '',
        expired: ''
      },
      shopList: [],
      timeMaketingDataToTable: [],
      addOrEditMaketTitle: '新增优惠',
      isTimeMaket: '123',
      addMaketDialogVisible: false,
      weekFilterVisible: false,
      pickerOptions: {
        disabledDate(time) {
          let now = new Date();
          let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
          return time.getTime() < yesterday;
        }
      },
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
        shopIds: [{ required: true, type: 'array', trigger: 'blur', message: '请选择适用店铺' }],
        parentTypeIds: [{ required: true, trigger: 'change', message: '请填写适用类型' }],
        date: [{ required: true, type: 'array', trigger: 'change', message: '请选择优惠日期' }],
        week: [{ required: true, trigger: 'change', message: '请选择活动日' }],
        time: [{ required: true, type: 'array', trigger: 'change', message: '请选择每日活动时间段' }],
        discount: [{ required: true, trigger: 'blur', validator: validateDiscount }]
      },
      machineParentType: [],
      hasShop: true
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
    getShopFilter(val) {
      this.addMaketFrom.parentTypeIds = '';
      if (val.length >= 1) {
        this.getMarketlistParentType();
      }
    },
    formatterExpired(row, column) {
      return CouponAcctiveStatusType[row.expired];
    },
    getcustomWeekCheckList(data) {
      this.addMaketFrom.weekCheckList = data[0];
      this.weekFilterVisible = data[1];
    },
    changeCustomWeekVisible(val) {
      if (val === 10) {
        this.weekFilterVisible = true;
      } else {
        this.weekFilterVisible = false;
        this.addMaketFrom.weekCheckList = [];
      }
      console.log(this.addMaketFrom);
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
      if (row.id) {
        this.addOrEditMaketTitle = '编辑优惠';
        this.isTimeMaket = '';
        this.getMaketDetail(row);
      } else {
        this.addOrEditMaketTitle = '新增优惠';
        this.addMaketFrom = {
          timeId: '',
          week: '',
          time: ['00:00', '23:59'],
          date: [],
          parentTypeIds: '',
          shopIds: [],
          discount: '',
          weekCheckList: []
        };
        this.isTimeMaket = '123';
        this.addMaketDialogVisible = true;
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
        week: Number(res.noWeek),
        time: [time[0], time[1]],
        date: [startTime, endTime],
        parentTypeIds: res.parentTypeMap && res.parentTypeIds ? res.parentTypeMap[0].parentTypeId : '全部',
        shopIds: beshopIds,
        discount: (res.discountVO / 10).toFixed(1),
        weekCheckList: weeklist
      };
      if (Number(this.addMaketFrom.week) !== 8 && Number(this.addMaketFrom.week) !== 9 && weeklist.length >= 1) {
        this.addMaketFrom.week = 10;
      }
      this.getMarketlistParentType();
      this.addMaketDialogVisible = true;
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
          if (payload.week === 10) {
            if (payload.weekCheckList.length > 0) {
              payload.week = payload.weekCheckList.join(',');
            } else {
              this.$Message.error('请选择自定义活动日');
              return false;
            }
          }
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
      this.$refs[formName].clearValidate();
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
    },
    updataeStatus(row) {
      if (row.switchStatus === true) {
        row.status = 0;
      } else {
        row.status = 1;
      }
      let payload = Object.assign({}, { timeId: row.id, status: row.status });
      updataeStatusFun(payload).then(() => {
        this.$message.success('操作成功');
      });
    },
    exportTable() {
      let payload = Object.assign({}, this.searchData);
      payload.excel = true;
      exportExcel(timeMarketListApi, '限时优惠.xlsx', payload);
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

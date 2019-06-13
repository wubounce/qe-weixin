<template>
  <div class="coupon-active-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="发放时间： " prop="type">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="适用店铺：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option value="0" label="开启"></el-option>
          <el-option value="1" label="关闭"></el-option>
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
        <el-button type="primary" icon="el-icon-plus" @click="addActiveDialogVisible=true">新增活动</el-button>
      </div>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="活动名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="getActiveDetail(scope.row)">{{scope.row.merchantType | CouponType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="活动类型" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="有效期"></el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="参与用户数">
          <template slot-scope="scope">
            <span class="rowstyle" @click="getparticipateUser(scope.row)">{{scope.row.faceValue}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="createTime" label="创建时间 " width="160"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="活动状态 " width="160"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="开启/关闭 " width="160"></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right">
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
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 活动详情 -->
    <el-dialog title="活动详情" :visible.sync="detailDialogVisible" @close="detailDialogVisible=false" width="768px" top="50px">
      <h3 class="detail-base-title">活动信息</h3>
      <ul class="deatil-list">
        <li><span>活动名称：</span>开业大吉</li>
        <li><span>活动时间：</span>2018-03-6～2018-03-08</li>
        <li><span>活动类型：</span>扫码领券</li>
      </ul>
      <h3 class="detail-base-title" style="border:none">优惠券信息</h3>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column prop="faceValue" label="券类型"></el-table-column>
        <el-table-column prop="faceValue" label="适用类型"></el-table-column>
        <el-table-column prop="faceValue" label="适用店铺"></el-table-column>
        <el-table-column prop="faceValue" label="面额(元)/折扣" width="100px"></el-table-column>
        <el-table-column prop="faceValue" label="条件"></el-table-column>
        <el-table-column prop="createTime" label="有效期" width="140px"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 参与用户 -->
    <el-dialog title="发放用户" :visible.sync="participateUserDialogVisible" width="540px">
      <div class="table-header-action" style="padding-bottom: 16px;padding-top: 16px;text-align:right;">
        <el-button icon="el-icon-download">导 出</el-button>
      </div>
      <el-table :data="couponSentDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="用户账号 "></el-table-column>
        <el-table-column header-align="left" prop="createTime" label="参与时间 "></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 新增活动 -->
    <el-dialog title="新增活动" :visible.sync="addActiveDialogVisible" width="768px" top="5vh">
      <h3 class="detail-base-title">活动信息</h3>
      <el-form ref="sentCouponFrom" :model="sentCouponFrom" label-width="85px" label-position="left" class="sent-coupon-from">
        <el-form-item label="活动名称：" prop="name">
          <el-input v-model="sentCouponFrom.discount" clearable placeholder="优惠折扣"></el-input>
        </el-form-item>
        <el-form-item label="活动时间：" prop="name">
          <el-date-picker size="small" v-model="searchData.name" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>.
        <el-form-item label="活动类型：" prop="name">
          <el-radio-group v-model="sentCouponFrom.resource">
            <el-radio :label="0">满减券</el-radio>
            <el-radio :label="1">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用店铺：" prop="name" class="apply-shop">
          <el-radio-group v-model="sentCouponFrom.resource">
            <el-radio :label="0">全部店铺</el-radio>
            <el-radio :label="1">指定店铺</el-radio>
          </el-radio-group>
          <multiple-shop class="appoint" v-model="sentCouponFrom.shopIds" @change="getShopFilter" placeholder="选择店铺"></multiple-shop>
        </el-form-item>
        <el-form-item label="发券条件：" class="condition-type">
          <el-radio-group v-model="sentCouponFrom.type">
            <el-radio :label="0" name="type">活动期间内首次在店铺消费</el-radio>
            <el-radio :label="1" name="type">活动期间内累计消费<el-input v-model="sentCouponFrom.discount" clearable></el-input> 次</el-radio>
            <el-radio :label="2" name="type">活动期间消费后≥<el-input v-model="sentCouponFrom.discount" clearable></el-input> 天未消费</el-radio>
          </el-radio-group>
        </el-form-item>
        <h3 class="detail-base-title" style="border:none">优惠券信息</h3>
        <div class="table-header-action" style="padding-bottom: 15px;">
          <el-button type="primary" icon="el-icon-plus" @click="couponActiveDialogVisible=true">添加优惠券</el-button>
        </div>
        <el-table :data="couponSentDataToTable" style="width: 100%">
          <el-table-column prop="faceValue" label="券类型"></el-table-column>
          <el-table-column prop="faceValue" label="适用类型"></el-table-column>
          <el-table-column prop="faceValue" label="适用店铺"></el-table-column>
          <el-table-column prop="faceValue" label="面额(元)/折扣" width="100px"></el-table-column>
          <el-table-column prop="faceValue" label="条件"></el-table-column>
          <el-table-column prop="createTime" label="有效期" width="140px"></el-table-column>
          <el-table-column header-align="left" label="操作" fixed="right" width="100px">
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
        <el-form-item class="sent-coupon-from-action">
          <el-button type="primary" @click="resetSearchForm('searchForm')">确 定</el-button>
          <el-button @click="resetSearchForm('searchForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增活动 -->
    <el-dialog :visible.sync="couponActiveDialogVisible" width="540px">
      <div slot="title" class="dialog-footer btn-footer">
        <p>新增活动优惠券</p>
        <p class="add-coupon-tip">说明：自动发放的优惠券只能在发券店铺这一个店铺内使用</p>
      </div>
      <el-form ref="sentCouponFrom" :model="sentCouponFrom" label-width="85px" label-position="left" class="sent-coupon-from">
        <el-form-item label="券类型：" prop="name">
          <el-radio-group v-model="sentCouponFrom.resource">
            <el-radio :label="0">满减券</el-radio>
            <el-radio :label="1">折扣券</el-radio>
            <el-radio :label="2">免费券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用类型：">
          <el-checkbox-group v-model="sentCouponFrom.type">
            <el-checkbox :label="0" name="type">通用</el-checkbox>
            <el-checkbox :label="1" name="type">洗衣机</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="面额：">
          <div class="add-discount">
            <div>
              <el-input v-model="sentCouponFrom.discount" clearable></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">元</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="折扣 ：">
          <div class="add-discount">
            <div>
              <el-input v-model="sentCouponFrom.discount" clearable placeholder="优惠折扣"></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">元</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="条件：">
          <div class="add-discount">
            <div>
              <el-input v-model="sentCouponFrom.discount" clearable placeholder="优惠券金额"></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">元</span>
            </div>
            <div style="color:#bfbfbf;margin-left: 30px;">例:满 1 元可用</div>
          </div>
        </el-form-item>
        <el-form-item label="有效期：">
          <div class="add-discount">
            <div>
              <el-input v-model="sentCouponFrom.discount" clearable placeholder=""></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">天</span>
            </div>
            <div style="color:#bfbfbf;margin-left: 30px;">有效期至2019-03-15</div>
          </div>
        </el-form-item>
        <el-form-item label="有效时段：" prop="type">
          <el-date-picker size="small" v-model="searchData.name" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放数量：" prop="type">
          <div class="add-discount">
            <div>
              <el-input v-model="sentCouponFrom.discount" clearable placeholder=""></el-input>
              <span style="position: absolute;left: 125px;color:#bfbfbf;">张</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="sent-coupon-from-action">
          <el-button type="primary" @click="resetSearchForm('searchForm')">确 定</el-button>
          <el-button @click="resetSearchForm('searchForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import multipleShop from '@/components/multipleShop';
import { voucherListFun } from '@/service/voucher';
import { CouponStatusType, CouponType } from '@/utils/mapping';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    multipleShop
  },
  data() {
    return {
      searchData: {
        phone: '',
        time: []
      },
      couponSentDataToTable: [],
      participateUserDialogVisible: false,
      sentUserDetailData: {},
      searchSentUserFrom: {},

      addActiveDialogVisible: false,
      sentCouponFrom: {},
      detailDialogVisible: false,
      couponActiveDialogVisible: false
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
    },
    getparticipateUser(row) {
      this.participateUserDialogVisible = true;
    },
    getActiveDetail(row) {
      this.detailDialogVisible = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import '~@/styles/variables.scss';
.coupon-active-page {
  .apply-shop .el-form-item__content {
    position: absolute;
  }
  .condition-type {
    .el-radio,
    .el-radio + .el-radio {
      margin-left: 0px !important;
      margin-bottom: 12px !important;
    }
    .el-input {
      width: 120px !important;
    }
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.detail-base-title {
  font-size: 16px;
  padding: 10px 0;
  font-weight: normal;
}
.deatil-list {
  padding-bottom: 15px;
  li {
    height: 40px;
    line-height: 40px;
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
    }
  }
}
.sent-coupon-from {
  padding-top: 24px;
  overflow: hidden;
}
.sent-coupon-from-action {
  padding-top: 16px;
  border-top: 1px solid $under_line;
  text-align: right;
}
.add-discount {
  display: flex;
}
.appoint {
  position: absolute;
  left: 229px;
  top: 0;
}
.add-coupon-tip {
  font-size: 12px;
  font-weight: 400;
  color: $menuText;
  line-height: 20px;
}
</style>
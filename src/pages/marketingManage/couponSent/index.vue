<template>
  <div class="sent-coupon-page">
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
        <el-table-column header-align="left" prop="faceValue" label="发放用户数" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="getSentUser(scope.row)">{{scope.row.merchantType | CouponType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="faceValue" label="适用店铺" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="merchantType" label="券类型"></el-table-column>
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
    <!-- 发放用户 -->
    <el-dialog title="发放用户" :visible.sync="sentUserDialogVisible" width="540px">
      <div>
        <el-form :inline="true" ref="searchSentUserFrom" :model="searchSentUserFrom" class="header-search sent-user-deatil-search">
          <el-form-item prop="name">
            <el-input v-model="searchSentUserFrom.name" placeholder="请输入用户账号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSentUserFrom">查 询</el-button>
          </el-form-item>
        </el-form>
        <ul class="sent-user-deatil-list">
          <li>18311214521</li>
          <li>18311214521</li>
          <li>18311214521</li>
          <li>18311214521</li>
          <li>18311214521</li>
          <li>18311214521</li>
        </ul>
      </div>
    </el-dialog>
    <!-- 发券 -->
    <el-dialog title="发券" :visible.sync="sentCouponDialogVisible" width="600px">
      <div class="step">
        <div class="active"><span class="step-num">1</span> 第一步
          <svg-icon icon-class="yingxiaoxiangyoujiantou" class="yingxiaoxiangyoujiantou" />
        </div>
        <div><span class="step-num">2</span> 第二步</div>
      </div>
      <el-form ref="sentCouponFrom" :model="sentCouponFrom" label-width="85px" label-position="left" class="sent-coupon-from">
        <div class="step-one">
          <el-form-item label="适用类型：" prop="name">
            <el-radio-group v-model="sentCouponFrom.resource">
              <el-radio :label="0">单个发放</el-radio>
              <el-radio :label="1">批量发放</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="">
            <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="false">
              <span class="check-file">选择文件</span>
              <span style="margin-left: 10px;">未选择文件</span>
            </el-upload>
            <el-button style="margin-left: 40px;" size="small" type="primary" @click="submitUpload">下载模板</el-button>
          </el-form-item>
          <el-form-item label="券类型：" prop="name">
            <el-radio-group v-model="sentCouponFrom.resource">
              <el-radio :label="0">满减券</el-radio>
              <el-radio :label="1">折扣券</el-radio>
              <el-radio :label="2">免费券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="适用店铺：" prop="name" class="apply-shop">
            <el-radio-group v-model="sentCouponFrom.resource">
              <el-radio :label="0">全部店铺</el-radio>
              <el-radio :label="1">指定店铺</el-radio>
            </el-radio-group>
            <multiple-shop class="appoint" v-model="sentCouponFrom.shopIds" @change="getShopFilter" placeholder="选择店铺"></multiple-shop>
          </el-form-item>
          <el-form-item label="适用类型：">
            <el-checkbox-group v-model="sentCouponFrom.type">
              <el-checkbox :label="0" name="type">通用</el-checkbox>
              <el-checkbox :label="1" name="type">洗衣机</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div class="step-two">
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
        </div>
        <el-form-item class="sent-coupon-from-action">
          <el-button @click="resetSearchForm('searchForm')">下 一 步</el-button>
          <el-button @click="resetSearchForm('searchForm')">上 一 步</el-button>
          <el-button type="primary" @click="resetSearchForm('searchForm')">确 定</el-button>
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
      sentUserDialogVisible: false,
      sentUserDetailData: {},
      searchSentUserFrom: {},

      sentCouponDialogVisible: true,
      sentCouponFrom: {}
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
    getSentUser(row) {
      this.sentUserDialogVisible = true;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
@import '~@/styles/variables.scss';
.sent-coupon-page {
  .sent-user-deatil-search .el-input__inner {
    width: 290px !important;
  }
  .upload-demo {
    float: left;
  }
  .el-upload:focus {
    border-color: $under_line;
    color: #595959;
  }
  .apply-shop .el-form-item__content {
    position: absolute;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.sent-user-deatil-list {
  width: 100%;
  overflow: hidden;
  padding-bottom: 60px;
  li {
    width: 33%;
    float: left;
    height: 43px;
    line-height: 43px;
    border-bottom: 1px solid $under_line;
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
.check-file {
  display: inline-block;
  width: 90px;
  height: 25px;
  line-height: 25px;
  background: linear-gradient(360deg, rgba(230, 230, 230, 1) 0%, rgba(255, 255, 255, 1) 100%);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
.step {
  width: 100%;
  height: 54px;
  text-align: center;
  line-height: 54px;
  background: #f7f7f7;
  display: flex;
  color: #bfbfbf;
  > div {
    flex: 1;
  }
  .step-num {
    display: inline-block;
    width: 24px;
    height: 24px;
    text-align: center;
    line-height: 20px;
    border: 2px solid #bfbfbf;
    border-radius: 50px;
    margin-right: 15px;
  }
  .active {
    color: $menuText;
    .step-num {
      border: 2px solid $menuText;
    }
  }
  .yingxiaoxiangyoujiantou {
    width: 10px;
    height: 14px;
    float: right;
    margin-top: 20px;
  }
}
.add-discount {
  display: flex;
}
.appoint {
  position: absolute;
  left: 229px;
  top: 0;
}
</style>
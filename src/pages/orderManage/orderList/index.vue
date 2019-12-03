<template>
  <div class="order-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="所属店铺：">
        <el-select v-model="searchData.shopId" filterable placeholder="请选择">
          <el-option
            v-for="(item) in shopList"
            :key="item.shopId"
            :label="item.shopName"
            :value="item.shopId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号：" clearable prop="orderNo">
        <el-input v-model.trim="searchData.orderNo" clearable placeholder="请输入" class="order-no"></el-input>
      </el-form-item>
      <el-form-item label="用户账号：" prop="phone">
        <el-input v-model.trim="searchData.phone" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="设备名称：" prop="machineName">
        <el-input v-model.trim="searchData.machineName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="订单状态：" prop="orderStatus">
        <el-select v-model="searchData.orderStatus" clearable placeholder="请选择">
          <el-option label="不限" value></el-option>
          <el-option v-for="(name, id) in orderStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期筛选：">
        <el-date-picker
          size="small"
          v-model="searchData.time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <el-table :data="orederDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="orderNo" label="订单编号" width="180">
          <template slot-scope="scope">
            <span
              class="rowstyle"
              @click="lookShopDetail(scope.row);detailDialogVisible = true;"
            >{{scope.row.orderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="orderStatus" label="订单状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.orderStatus | orderStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="phone" label="用户账号" width="120"></el-table-column>
        <el-table-column
          header-align="left"
          prop="shopName"
          label="店铺"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          header-align="left"
          prop="machineName"
          label="设备"
          width="160"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          header-align="left"
          prop="machineFunctionName"
          label="功能模式"
          min-width="240"
        >
          <template slot-scope="scope">
            <span>{{scope.row.machineFunctionName}}/{{scope.row.markMinutes}}分钟</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="markPrice" label="原价(元)"></el-table-column>
        <el-table-column header-align="left" prop="detergentPrice" label="洗衣液价格(元)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.detergentPrice||'-' }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="disinfectantPayPrice" label="除菌液(元)" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.disinfectantPayPrice||'-' }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop label="优惠金额(元)" width="120">
          <template slot-scope="scope">
            <el-popover
              ref="popover"
              trigger="hover"
              placement="bottom"
              v-if="scope.row.discountTotalPirce&&scope.row.discountTotalPirce>0"
            >
              <p
                v-if="scope.row.discountType==1 && scope.row.discountPrice>0"
              >VIP会员卡：{{ scope.row.discountPrice }}</p>
              <p
                v-if="scope.row.discountType==2 && scope.row.discountPrice>0 || scope.row.discountType===null&&scope.row.discountPrice>0"
              >限时优惠：{{ scope.row.discountPrice }}</p>
              <div v-if="scope.row.source!=3&&scope.row.voucherPrice>0">
                <span>平台优惠券：{{ scope.row.voucherPrice }}</span>
                <p
                  class="rowstyle"
                  style="font-size:10px;"
                  v-if="scope.row.platformPayPrice>0"
                >(优惠券平台承担{{scope.row.platformPayPrice}})</p>
              </div>
              <p
                v-if="scope.row.source==3&&scope.row.voucherPrice>0"
              >商家优惠券：{{scope.row.voucherPrice}}</p>
              <p v-if="scope.row.tokenCoinDiscount>0">金币抵扣：{{scope.row.tokenCoinDiscount}}</p>
              <div slot="reference" class="name-wrapper">
                <span size="medium">
                  <span>{{ scope.row.discountTotalPirce | tofixd}}</span>
                  <svg-icon
                    icon-class="xialajiantouxia"
                    class="arrow"
                    v-if="scope.row.discountTotalPirce>0"
                  />
                </span>
              </div>
            </el-popover>
            <span v-else>{{ scope.row.discountTotalPirce | tofixd}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="payPrice" label="实付金额(元)" width="120"></el-table-column>
        <el-table-column header-align="left" prop="profitPrice" label="收益金额(元) " width="120"></el-table-column>
        <el-table-column header-align="left" prop="payType" label="支付方式">
          <template slot-scope="scope">
            <span>{{scope.row.orderStatus ===1||scope.row.orderStatus ===0 ? '-' : scope.row.payType | PayType }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column header-align="left" prop="payTime" label="支付时间" width="180"></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" min-width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus === 0&&scope.row.orderType === 3">
              <el-tooltip content="取消订单" placement=" top" effect="dark">
                <svg-icon
                  icon-class="cancelOrder"
                  class="icon-fuwei"
                  @click="handleDelete(scope.row)"
                />
              </el-tooltip>
            </div>
            <div v-if="scope.row.orderStatus === 5">
              <span
                class="rowstyle"
                @click="lookShopDetail(scope.row);refundDialogVisible=true"
              >退款详情</span>
            </div>
            <div v-if="scope.row.orderStatus === 2">
              <el-tooltip
                content="复位"
                placement="top"
                effect="dark"
                v-show="scope.row.subType !== '通用脉冲充电桩'&&scope.row.notQuantitative===false"
              >
                <svg-icon
                  icon-class="fuwei"
                  class="icon-fuwei"
                  @click="handleDeviceReset(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                content="启动"
                placement="top"
                effect="dark"
                v-show="scope.row.subType !== '通用脉冲充电桩'&&scope.row.notQuantitative===false&&notAllowToStart(scope.row.support)"
              >
                <svg-icon
                  icon-class="qidong"
                  class="icon-qidong"
                  @click="handleDeviceStart(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                content="退款"
                placement="top"
                effect="dark"
                v-if="scope.row.payType !== 4 && scope.row.isRefund===1"
              >
                <svg-icon
                  icon-class="tuikuan"
                  class="icon-qidong"
                  @click="handleOrderRefund(scope.row)"
                />
              </el-tooltip>
              <el-tooltip
                content="补偿券"
                placement="top"
                effect="dark"
                v-if="scope.row.shopState === 2"
              >
                <svg-icon
                  icon-class="youhuiquan"
                  class="icon-qidong"
                  @click="handleCompensate(scope.row)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 订单详情 -->
      <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="768px">
        <h3 class="detail-base-title">基本信息</h3>
        <ul class="deatil-list new-detail-list">
          <li>
            <div>
              <span>订单编号：</span>
              {{detailData.orderNo}}
            </div>
            <div>
              <span>订单状态：</span>
              {{detailData.orderStatus | orderStatus}}
            </div>
          </li>
          <li>
            <div>
              <span>用户账号：</span>
              {{detailData.phone}}
            </div>
            <div>
              <span>店铺：</span>
              {{detailData.shopName}}
            </div>
          </li>
          <li>
            <div>
              <span>设备：</span>
              {{detailData.machineName }}
            </div>
            <div>
              <span>功能模式：</span>
              {{detailData.machineFunctionName}}/{{detailData.markMinutes}}分钟
            </div>
          </li>
          <li>
            <div>
              <span>原价(元)：</span>
              {{detailData.markPrice||'-'}}
            </div>
            <div>
              <span>洗衣液价格(元)：</span>
              {{detailData.detergentPayPrice||'-'}}
            </div>
          </li>
          <li>
            <div>
              <span>除菌液(元)：</span>
              {{detailData.disinfectantPayPrice||'-'}}
            </div>
            <div>
              <span>优惠金额(元)：</span>
              <el-popover
                ref="popover"
                trigger="hover"
                placement="bottom"
                v-if="detailData.discountTotalPirce&&detailData.discountTotalPirce>0"
              >
                <p
                  v-if="detailData.discountType==1 && detailData.discountPrice>0"
                >VIP会员卡：{{ detailData.discountPrice }}</p>
                <p
                  v-if="detailData.discountType==2 && detailData.discountPrice>0 || detailData.discountType===null&&detailData.discountPrice>0"
                >限时优惠：{{ detailData.discountPrice }}</p>
                <div v-if="detailData.source!=3&&detailData.voucherPrice>0">
                  <span>平台优惠券：{{ detailData.voucherPrice }}</span>
                  <p
                    class="rowstyle"
                    style="font-size:10px;"
                    v-if="detailData.platformPayPrice>0"
                  >(优惠券平台承担{{detailData.platformPayPrice}})</p>
                </div>
                <p
                  v-if="detailData.source==3&&detailData.voucherPrice>0"
                >商家优惠券：{{detailData.voucherPrice}}</p>
                <p v-if="detailData.tokenCoinDiscount>0">金币抵扣：{{detailData.tokenCoinDiscount}}</p>
                <div slot="reference" class="name-wrapper" style="   color: #595959;">
                  {{ detailData.discountTotalPirce | tofixd}}
                  <svg-icon
                    icon-class="xialajiantouxia"
                    class="arrow"
                    v-if="detailData.discountTotalPirce>0"
                  />
                </div>
              </el-popover>
              <span v-else>{{ detailData.discountTotalPirce | tofixd}}</span>
            </div>
          </li>
          <li>
            <div>
              <span>实付金额(元)：</span>
              {{detailData.profitPrice}}
            </div>
            <div>
              <span>收益金额(元)：</span>
              {{detailData.payPrice}}
            </div>
          </li>
          <li>
            <div>
              <span>支付方式 ：</span>
              {{detailData.payType | PayType}}
            </div>
            <div>
              <span>下单时间：</span>
              {{detailData.createTime}}
            </div>
          </li>
          <li>
            <div>
              <span>支付时间：</span>
              {{detailData.payTime}}
            </div>
          </li>
        </ul>
        <div v-if="detailData.orderRevenueSharingLogList">
          <h3 class="detail-base-title" style="border:none">分账信息</h3>
          <el-table
            :data="detailData.orderRevenueSharingLogList"
            style="width: 100%"
            max-height="300"
          >
            <el-table-column prop="shareOperatorUsername" label="分账账户"></el-table-column>
            <el-table-column prop="shareOperatorRealName" label="运营商姓名"></el-table-column>
            <el-table-column prop="ifOpen" label="分账比例">
              <template slot-scope="scope">
                <span>{{scope.row.proportion}}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="分账金额(元)"></el-table-column>
          </el-table>
        </div>
      </el-dialog>
      <!-- 退款详情 -->
      <el-dialog title="退款详情" :visible.sync="refundDialogVisible" width="540px">
        <ul class="deatil-list">
          <li>
            <span>用户账号：</span>
            {{detailData.phone}}
          </li>
          <li>
            <span>退款金额：</span>
            {{detailData.payPrice}}元
          </li>
          <li>
            <span>订单编号：</span>
            {{detailData.orderNo}}
          </li>
          <li>
            <span>支付方式：</span>
            {{detailData.payType | PayType}}
          </li>
          <li>
            <span>下单时间：</span>
            {{detailData.createTime}}
          </li>
          <li>
            <span>支付时间：</span>
            {{detailData.payTime}}
          </li>
          <li>
            <span>退款原因：</span>
            {{detailData.refundRemark}}
          </li>
          <li>
            <span>退款人：</span>
            {{detailData.refundName}}
          </li>
          <li>
            <span>退款时间：</span>
            {{detailData.refundTime}}
          </li>
        </ul>
      </el-dialog>
      <!-- 订单补偿 -->
      <orderCompensate
        :visible.sync="compensateDialogVisible"
        v-if="compensateDialogVisible"
        :initCompensateForm="compensateFrom"
        @getOrderDataToTable="getOrderDataToTable"
      />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {
  orderListFun,
  orderDetailFun,
  machineResetFun,
  machineBootFun,
  ordeRrefundFun,
  isReleaseCompensateFun,
  delAfterOrderFun
} from "@/service/order";
import { shopListFun } from "@/service/report";
import { orderStatus, PayType } from "@/utils/mapping";
import Pagination from "@/components/Pager";
import PagerMixin from "@/mixins/PagerMixin";
import orderCompensate from "./orderCompensate";
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    orderCompensate
  },
  data() {
    return {
      searchData: {
        shopId: "",
        orderNo: "",
        phone: "",
        machineName: "",
        orderStatus: "",
        time: [
          moment()
            .subtract(6, "days")
            .format("YYYY-MM-DD"),
          moment().format("YYYY-MM-DD")
        ]
      },
      orederDataToTable: [],
      refundDialogVisible: false,
      detailDialogVisible: false,
      detailData: {},
      compensateFrom: {},
      compensateDialogVisible: false,
      shopList: []
    };
  },
  filters: {
    orderStatus: val => {
      return orderStatus[val];
    },
    PayType: val => {
      return PayType(val);
    }
  },
  computed: {
    orderStatus: function() {
      return orderStatus;
    },
    validDaysEnd: function() {
      return moment()
        .add(this.compensateFrom.validDays, "days")
        .format("YYYY-MM-DD");
    },
    notAllowToStart: function() {
      //不允许启动
      return function(value) {
        if ((value & 16) == 16) {
          return false;
        } else {
          return true;
        }
      };
    }
  },
  mounted() {},
  created() {
    this.getShopList();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
      this.searchData.shopId = res.length > 0 ? res[0].shopId : "";
      this.searchData.shopId && this.getOrderDataToTable();
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getOrderDataToTable();
    },
    searchForm() {
      if (!this.searchData.shopId) {
        this.$Message.error("请选择店铺");
        return false;
      }
      this.searchData.page = 1;
      this.total = 0;
      this.getOrderDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.searchData.shopId =
        this.shopList.length > 0 ? this.shopList[0].shopId : "";
      this.searchData.shopId && this.getOrderDataToTable();
    },
    async getOrderDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startTime = payload.time ? payload.time[0] + " 00:00:00" : null;
      payload.endTime = payload.time ? payload.time[1] + " 23:59:59" : null;
      payload.time = null;
      let res = await orderListFun(payload);
      this.orederDataToTable = res.items || [];
      this.orederDataToTable.forEach(item => {
        item.discountPrice = item.discountPrice || 0;
        item.voucherPrice = item.voucherPrice || 0;
        item.tokenCoinDiscount = item.tokenCoinDiscount || 0;
        let tmp =
          Number(item.discountPrice) +
          Number(item.voucherPrice) +
          Number(item.tokenCoinDiscount);
        this.$set(item, "discountTotalPirce", tmp.toFixed(2));
      });
      this.total = res.total;
    },
    async lookShopDetail(row) {
      let payload = {
        orderNo: row.orderNo,
        memberId: row.userId,
        shopId: row.shopId
      };
      let res = await orderDetailFun(payload);
      this.detailData = res;
      this.detailData.discountPrice = this.detailData.discountPrice || 0;
      this.detailData.voucherPrice = this.detailData.voucherPrice || 0;
      this.detailData.tokenCoinDiscount =
        this.detailData.tokenCoinDiscount || 0;
      let tmp =
        Number(this.detailData.discountPrice) +
        Number(this.detailData.voucherPrice) +
        Number(this.detailData.tokenCoinDiscount);
      this.$set(this.detailData, "discountTotalPirce", tmp.toFixed(2));
    },
    handleDeviceReset(row) {
      let payload = { orderNo: row.orderNo, machineId: row.machineId };
      this.$confirm(`确认复位${row.machineName}此设备?`, "提示", {
        showClose: false,
        center: true
      }).then(() => {
        machineResetFun(payload).then(() => {
          this.$Message.success("设备复位成功");
          this.getOrderDataToTable();
        });
      });
    },
    handleDeviceStart(row) {
      let payload = {
        orderId: row.id,
        memberId: row.userId,
        shopId: row.shopId
      };
      this.$confirm(`确认启动${row.machineName}此设备?`, "提示", {
        showClose: false,
        center: true
      }).then(() => {
        machineBootFun(payload).then(() => {
          this.$Message.success("设备启动成功");
          this.getOrderDataToTable();
        });
      });
    },
    handleOrderRefund(row) {
      let payload = {
        orderNo: row.orderNo,
        refundMoney: row.payPrice,
        memberId: row.userId
      };
      this.$confirm(`确定发起退款？`, "提示", {
        showClose: false,
        center: true
      }).then(() => {
        ordeRrefundFun(payload).then(() => {
          this.$Message.success("退款成功");
          this.getOrderDataToTable();
        });
      });
    },
    async handleCompensate(row) {
      let payload = {
        orderNo: row.orderNo,
        memberId: row.userId,
        shopId: row.shopId
      };
      let res = await isReleaseCompensateFun(payload);
      if (Number(res.available) === 0) {
        this.$Message.error("一个订单只能补偿一次");
      } else {
        this.compensateFrom = row;
        this.compensateDialogVisible = true;
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm("取消订单将使订单失效，确定吗？", "提示", {
        showClose: false,
        center: true
      }).then(() => {
        delAfterOrderFun({ orderId: row.id }).then(() => {
          this.$message.success("取消成功");
          this.getOrderDataToTable();
        });
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.order-no {
  .el-input__inner {
    width: 190px !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/variables.scss";
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
    padding: 12px 0;
    border-bottom: 1px solid $under_line;
    display: flex;
    > div {
      width: 50%;
    }
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
    }
  }
}
.new-detail-list {
  li span {
    width: 120px;
  }
}
.arrow {
  width: 9px;
  margin-left: 5px;
  margin-top: 8px;
}
</style>

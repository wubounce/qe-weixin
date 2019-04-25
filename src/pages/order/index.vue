<template>
  <div class="order-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="订单编号：" prop="orderNo">
        <el-input v-model="searchData.orderNo" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="用户账号：" prop="phone">
        <el-input v-model="searchData.phone" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="设备名称：" prop="machineName">
        <el-input v-model="searchData.machineName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="订单状态：" prop="orderStatus">
        <el-select v-model="searchData.orderStatus" clearable placeholder="请选择">
          <el-option v-for="(name, id) in orderStatus" :key="id" :label="name" :value="id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期筛选：" prop="time">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:ss:mm" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <el-table :data="orederDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="orderNo" label="订单编号" width="180"></el-table-column>
        <el-table-column header-align="left" prop="orderStatus" label="订单状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.orderStatus | orderStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="phone" label="用户账号" width="120"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="店铺" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="machineName" label="设备" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="machineFunctionName" label="功能模式"></el-table-column>
        <el-table-column header-align="left" prop="markPrice" label="原价(元)"></el-table-column>
        <el-table-column header-align="left" prop="detergentPrice" label="洗衣液价格(元)" width="120"></el-table-column>
        <el-table-column header-align="left" prop="" label="优惠金额(元)" width="120">
          <template slot-scope="scope">
            <el-popover ref="popover" trigger="hover" placement="bottom">
              <p v-if="scope.row.discountType==1 && scope.row.discountPrice>0">VIP会员卡{{ scope.row.discountPrice }}</p>
              <p v-if="scope.row.discountType==2 && scope.row.discountPrice>0 || scope.row.discountType===null&&scope.row.discountPrice>0">限时优惠{{ scope.row.discountPrice }}</p>
              <div v-if="scope.row.source!=3&&scope.row.voucherPrice>0">
                <span>平台优惠券{{ scope.row.voucherPrice }}</span>
                <p class="rowstyle" style="font-size:10px;" v-if="scope.row.platformPayPrice>0">(优惠券平台承担{{scope.row.platformPayPrice}})</p>
              </div>
              <p v-if="scope.row.source==3&&scope.row.voucherPrice>0">商家优惠券{{scope.row.voucherPrice}}</p>
            </el-popover>
            <div v-popover:popover class="name-wrapper">
              <span size="medium">
                <span>{{ scope.row.discountTotalPirce}}</span>
                <svg-icon icon-class="xialajiantoushang" class="arrow" v-if="scope.row.discountTotalPirce>0" />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="payPrice" label="实付金额(元)" width="120"></el-table-column>
        <el-table-column header-align="left" prop="profitPrice" label="收益金额(元) " width="120"></el-table-column>
        <el-table-column header-align="left" prop="payType" label="支付方式">
          <template slot-scope="scope">
            <span>{{scope.row.payType | PayType }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="createTime" label="下单时间" width="180"></el-table-column>
        <el-table-column header-align="left" prop="payTime" label="支付时间" width="180"></el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus === 5">
              <span class="rowstyle" @click="lookShopDetail(scope.row);detailDialogVisible=true">退款详情</span>
            </div>
            <div v-if="scope.row.orderStatus === 2">
              <el-tooltip content="复位" placement="top" effect="dark" v-show="(scope.row.notQuantitative===false && scope.row.isESource === 0) || (scope.row.notQuantitative===false&&scope.row.isESource === null)">
                <svg-icon icon-class="fuwei" class="icon-fuwei" @click="handleDeviceReset(scope.row)" />
              </el-tooltip>
              <el-tooltip content="启动" placement="top" effect="dark" v-show="(scope.row.notQuantitative===false && scope.row.isESource === 0) || (scope.row.notQuantitative===false&&scope.row.isESource === null)">
                <svg-icon icon-class="qidong" class="icon-qidong" @click="handleDeviceStart(scope.row)" />
              </el-tooltip>
              <el-tooltip content="退款" placement="top" effect="dark">
                <svg-icon icon-class="tuikuan" class="icon-qidong" @click="handleOrderRefund(scope.row)" />
              </el-tooltip>
              <el-tooltip content="补偿券" placement="top" effect="dark" v-if="scope.row.shopState === 2">
                <svg-icon icon-class="youhuiquan" class="icon-qidong" @click="handleCompensate(scope.row)" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 退款详情 -->
      <el-dialog title="退款详情" :visible.sync="detailDialogVisible" width="540px">
        <ul class="deatil-list">
          <li><span>用户账号：</span>{{detailData.phone}}</li>
          <li><span>退款金额：</span>{{detailData.payPrice}}元</li>
          <li><span>订单编号：</span>{{detailData.orderNo}}</li>
          <li><span>支付方式：</span>{{detailData.payType | PayType}}</li>
          <li><span>下单时间：</span>{{detailData.createTime}}</li>
          <li><span>支付时间：</span>{{detailData.payTime}}</li>
          <li><span>退款原因：</span>{{detailData.refundRemark}}</li>
          <li><span>退款人：</span>{{detailData.refundName}}</li>
          <li><span>退款时间：</span>{{detailData.refundTime}}</li>
        </ul>
      </el-dialog>
      <!-- 订单补偿 -->
      <el-dialog title="补偿券发放" :visible.sync="compensateDialogVisible" @close="resetCompensateForm('compensateFrom')" width="540px" top="20px">
        <el-form ref="compensateFrom" :model="compensateFrom" :rules="compensateFormRules" class="add-shop-from" label-width="120px">
          <el-form-item label="发放用户：" class="shop-name">
            <span>{{compensateFrom.phone}}</span>
          </el-form-item>
          <el-form-item label="适用店铺：">
            <span>{{compensateFrom.shopName}}</span>
          </el-form-item>
          <el-form-item label="适用类型：" prop="parentTypeId">
            <el-select v-model="compensateFrom.parentTypeId" placeholder="请选择">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="补偿金额(天)：" prop="compensateMoney">
            <el-input v-model="compensateFrom.compensateMoney" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item label="满减金额(天)：" prop="conditionMoney">
            <el-col :span="9">
              <el-input v-model="compensateFrom.conditionMoney" placeholder="请填写"></el-input>
            </el-col>
            <el-col :span="15" style=" color: rgba(23, 26, 46, 0.45);">满{{compensateFrom.conditionMoney}}可用 </el-col>
          </el-form-item>
          <el-form-item label="有效期(天)：" prop="validDays">
            <el-col :span="9">
              <el-input v-model.number="compensateFrom.validDays" placeholder="请填写"></el-input>
            </el-col>
            <el-col :span="15" style=" color: rgba(23, 26, 46, 0.45);">有效期至{{validDaysEnd}}</el-col>
          </el-form-item>
          <el-form-item label="发放数量(张)：" prop="compensateNumber">
            <el-input v-model.number="compensateFrom.compensateNumber" placeholder="请填写"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitCompensateFrom('compensateFrom')">保存</el-button>
            <el-button @click="resetCompensateForm('compensateFrom')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { orderListFun, orderDetailFun, compensateFun, machineResetFun, machineBootFun, ordeRrefundFun } from '@/service/order';
import { getlistParentTypeFun } from '@/service/device';
import { orderStatus, PayType } from '@/utils/mapping';
import { validatPrice, validatNum } from '@/utils/validate';
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination
  },
  data() {
    const validateCompensateMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('补偿面额不能为空'));
      } else if (!validatPrice(value) || Number(value) === 0) {
        callback(new Error('补偿面额必须大于0，支持两位小数'));
      } else if (Number(value) > 99) {
        callback(new Error('补偿面额输入不能超过99'));
      } else {
        callback();
      }
    };
    const validateConditionMoney = (rule, value, callback) => {
      if (!value) {
        callback(new Error('满减金额不能为空'));
      } else if (!validatPrice(value) || Number(value) === 0) {
        callback(new Error('满减金额必须大于0，支持两位小数'));
      } else if (Number(value) > 99) {
        callback(new Error('满减金额输入不能超过99'));
      } else if (Number(value) !== 0 && Number(value) < Number(this.compensateFrom.compensateMoney)) {
        callback(new Error('满减金额不能小于补偿面额'));
      } else {
        callback();
      }
    };
    const validateValidDays = (rule, value, callback) => {
      if (!value) {
        callback(new Error('有效期不能为空'));
      } else if (!validatNum(value)) {
        callback(new Error('有效期必须为数字值'));
      } else if (Number(value) > 999) {
        callback(new Error('有效期不能超过999'));
      } else {
        callback();
      }
    };
    const validateCompensateNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('发放数量不能为空'));
      } else if (!validatNum(value)) {
        callback(new Error('发放数量必须为数字值'));
      } else if (Number(value) > 999) {
        callback(new Error('发放数量不能超过999'));
      } else {
        callback();
      }
    };
    return {
      searchData: {
        orderNo: '',
        phone: '',
        machineName: '',
        orderStatus: '',
        time: []
      },
      orederDataToTable: [],
      detailDialogVisible: false,
      detailData: {},
      compensateFrom: {
        parentTypeId: '',
        compensateMoney: '',
        conditionMoney: '',
        validDays: '',
        compensateNumber: ''
      },
      compensateDialogVisible: false,
      compensateFormRules: {
        parentTypeId: [{ required: true, trigger: 'change', message: '请选择适用类型' }],
        compensateMoney: [{ required: true, trigger: 'blur', message: '请填写补偿面额', validator: validateCompensateMoney }],
        conditionMoney: [{ required: true, trigger: 'blur', message: '请选择满减金额', validator: validateConditionMoney }],
        validDays: [{ required: true, trigger: 'blur', message: '请填写有效期', validator: validateValidDays }],
        compensateNumber: [{ required: true, trigger: 'blur', message: '请填写发放数量', validator: validateCompensateNumber }]
      },
      machineParentTypeList: [],
      hh: false
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
        .add(this.compensateFrom.validDays, 'days')
        .format('YYYY-MM-DD');
    }
  },
  mounted() {},
  created() {
    this.getOrderDataToTable();
  },
  methods: {
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getOrderDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getOrderDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getOrderDataToTable();
    },
    async getmachineParentType(shopId = '') {
      //获取设备类型
      let res = await getlistParentTypeFun({ shopId: shopId });
      this.machineParentTypeList = res;
    },
    async getOrderDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.startTime = payload.time ? payload.time[0] : null;
      payload.endTime = payload.time ? payload.time[1] : null;
      payload.time = null;
      let res = await orderListFun(payload);
      this.orederDataToTable = res.items || [];
      this.orederDataToTable.forEach(item => {
        let tmp = null;
        if (item.discountPrice && item.voucherPrice) {
          tmp = Number(item.discountPrice) + Number(item.voucherPrice);
        }
        if (item.discountPrice && item.discountPrice > 0 && (!item.voucherPrice || item.voucherPrice < 0)) {
          tmp = Number(item.discountPrice);
        }
        if ((!item.discountPrice || item.discountPrice < 0) && (item.voucherPrice && item.voucherPrice > 0)) {
          tmp = Number(item.voucherPrice);
        }
        tmp = Number(tmp).toFixed(2);
        this.$set(item, 'discountTotalPirce', tmp);
      });
      this.total = res.total;
    },
    async lookShopDetail(row) {
      let payload = { orderNo: row.orderNo, memberId: row.userId };
      let res = await orderDetailFun(payload);
      this.detailData = res;
    },
    onSubmitCompensateFrom(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let payload = Object.assign({}, this.compensateFrom);
          await compensateFun(payload);
          this.$Message.success('恭喜你，操作成功！');
          this.$refs[formName].resetFields();
          this.compensateDialogVisible = false;
          this.getOrderDataToTable();
        } else {
          return false;
        }
      });
    },
    resetCompensateForm(formName) {
      this.$refs[formName].resetFields();
      this.compensateDialogVisible = false;
    },
    handleDeviceReset(row) {
      let payload = { orderNo: row.orderNo, machineId: row.machineId };
      this.$confirm(`确认复位${row.machineName}此设备?`, '提示', {
        showClose: false
      }).then(() => {
        machineResetFun(payload).then(() => {
          this.$Message.success('设备复位成功');
          this.getOrderDataToTable();
        });
      });
    },
    handleDeviceStart(row) {
      let payload = { orderId: row.id, memberId: row.userId };
      this.$confirm(`确认启动${row.machineName}此设备?`, '提示', {
        showClose: false
      }).then(() => {
        machineBootFun(payload).then(() => {
          this.$Message.success('设备启动成功');
          this.getOrderDataToTable();
        });
      });
    },
    handleOrderRefund(row) {
      let payload = { orderNo: row.orderNo, refundMoney: row.payPrice, memberId: row.userId };
      this.$confirm(`确定发起退款？`, '提示', {
        showClose: false
      }).then(() => {
        ordeRrefundFun(payload).then(() => {
          this.$Message.success('退款成功');
          this.getOrderDataToTable();
        });
      });
    },
    handleCompensate(row) {
      this.compensateDialogVisible = true;
      this.$set(this.compensateFrom, 'shopName', row.shopName);
      this.$set(this.compensateFrom, 'orderNo', row.orderNo);
      this.$set(this.compensateFrom, 'phone', row.phone);
      this.compensateFrom.parentTypeId = row.parentTypeId;
      this.compensateFrom.compensateMoney = row.markPrice;
      this.compensateFrom.conditionMoney = row.markPrice;
      this.compensateFrom.validDays = 5;
      this.compensateFrom.compensateNumber = 1;
      this.getmachineParentType(row.shopId);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
}
.deatil-list {
  padding-bottom: 15px;
  :last-child {
    border: none;
  }
  li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $under_line;
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
    }
  }
}
[class^='icon-'] {
  width: 20px;
  height: 20px;
  margin-right: 20px;
}
.arrow {
  width: 9px;
  margin-left: 5px;
  margin-top: 8px;
}
</style>
 
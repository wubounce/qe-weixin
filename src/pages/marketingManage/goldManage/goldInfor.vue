<template>
  <el-dialog title="金币方案详情" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <ul class="deatil-list">
      <li>
        <div><span>适用店铺：</span>{{shopTokenCoinSet.shopName}}</div>
        <div><span>强制金币消费：</span>{{shopTokenCoinSet.isForceUse | isForceUsType}}</div>
      </li>
      <li>
        <div><span>折扣比例(%)：</span>{{shopTokenCoinSet.discountProportion}}</div>
        <div><span>创建人：</span>{{managerOperatorName}}</div>
      </li>
      <li>
        <div><span>创建时间：</span>{{shopTokenCoinSet.createdAt}}</div>
      </li>
    </ul>
    <h2 class="add_gold_dynamic_form">
      <span class="gold_case">金币方案</span>
      <el-tooltip placement="bottom-start" class="gold-tip">
        <div slot="content" class="gold_tooltip">
          <p class="title">方案规则：</p>
          <p>1.店铺可支持1~8个方案； </p>
          <p>2.运营商添加了方案，且状态处于开启状态，用户均可购买店铺金币。 </p>
          <p class="title">金币含义：</p>
          <p>1.金币分为金币本金和额外赠送金币；</p>
          <p>2.1金币可抵扣0.01元，以此类推；</p>
          <p>3.用户使用金币时，金币本金将被优先使用，金币本金为0后再消耗赠送金币额度。</p>
          <p class="title">折扣说明：</p>
          <p>1.每笔消费金币可抵扣部分费用，具体抵扣比例由运营商配置。若抵扣比例为99%，即表示总金额为1元的订单，99金币可抵扣0.99元，须再支付0.01元（如按比例计算不足0.01元按0.01元计算）。</p>
          <p class="title">退还金币：</p>
          <p>1.若用户向运营商申请退还金币，则退还金额仅以金币本金部分计算，运营商可在营销管理--金币会员页面将用户对应的金币做回收处理。</p>
          <p class="title">强制金币消费：</p>
          <p>1.若开启此功能，则用户金币余额为0时无法使用店铺中的设备，即用户必须购买店铺金币方案。</p>
        </div>
        <svg-icon icon-class="zhibiaoshuoming" />
      </el-tooltip>
    </h2>
    <el-table :data="rewardSets" class="gold_table">
      <el-table-column prop="cashValue" label="充值金额（元）"></el-table-column>
      <el-table-column prop="reach" label="金币本金（枚）"></el-table-column>
      <el-table-column prop="reward" label="赠送金币（枚）"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { isForceUsType } from '@/utils/mapping';
import { getTokenCoinFun } from '@/service/tokenCoin';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopTokenCoinId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shopTokenCoinSet: {},
      rewardSets: [],
      managerOperatorName: ''
    };
  },
  components: {},
  filters: {
    isForceUsType(val) {
      return isForceUsType[val];
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getDetail() {
      let payload = { id: this.shopTokenCoinId };
      let res = await getTokenCoinFun(payload);
      let { shopTokenCoinSet, rewardSets, managerOperatorName } = res || {};
      this.shopTokenCoinSet = shopTokenCoinSet || {};
      this.rewardSets = rewardSets || [];
      this.managerOperatorName = managerOperatorName || '';
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.deatil-list {
  padding-bottom: 15px;
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
      width: 100px;
      height: 100%;
    }
    i {
      font-style: normal;
    }
  }
}
.add_gold_dynamic_form {
  padding: 18px 0;
}
.gold_case {
  font-size: 16px;
  margin-right: 8px;
}
.gold_tooltip {
  max-width: 550px;
  p {
    line-height: 22px;
  }
  .title {
    color: #f00;
  }
}
.gold-tip {
  width: 16px;
  height: 16px;
}
</style>

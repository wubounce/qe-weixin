<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <el-form label-position="left" label-width="120px" ref="addGoldDynamicForm" :model="addGoldDynamicForm" :rules="addGoldDynamicFormRules" class="add_gold_dynamic_form">
      <el-form-item label="适用店铺：" prop="shopId">
        <span v-if="shopTokenCoinId">{{shopTokenCoinSet.shopName}}</span>
        <el-select v-if="!shopTokenCoinId" v-model="addGoldDynamicForm.shopId" filterable clearable placeholder="请选择店铺">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="折扣比例(%)：" prop="discountProportion">
        <el-input v-model.trim="addGoldDynamicForm.discountProportion" placeholder="请填写1-99的数字" :maxlength='4'></el-input>
      </el-form-item>
      <h2>
        <span class="gold_case">金币方案</span>
        <el-tooltip placement="bottom-start" class="gold-tip">
          <div slot="content" class="gold_tooltip">
            <p class="title">方案规则：</p>
            <p>1.店铺可支持0~8个方案； </p>
            <p>2.运营商添加的方案，用户均可购买；</p>
            <p class="title">金币含义：</p>
            <p>1.金币分为金币本金和额外赠送金币；</p>
            <p>2.1金币可抵扣0.01元，以此类推；</p>
            <p>3.用户使用金币时，金币本金将被优先使用，金币本金为0后再消耗赠送金币额度。</p>
            <p class="title">折扣说明：</p>
            <p>1.每笔消费金币可抵扣部分费用，具体抵扣比例由运营商配置。若抵扣比例为99%，即表示总金额为1元的订单，99金币可抵扣0.99元，须再支付0.01元（如按比例计算不足0.01元按0.01元计算）。</p>
            <p class="title">退还金币：</p>
            <p>1.若用户向运营商申请退还金币，则退还金额仅以金币本金部分计算，运营商可在营销管理--金币会员页面将用户对应的金币做回收处理。</p>
          </div>
          <svg-icon icon-class="zhibiaoshuoming" />
        </el-tooltip>
      </h2>
      <el-table :data="addGoldDynamicForm.rewardsJson" class="gold_table" max-height="325" style="min-height:220px">
        <el-table-column prop="cashValue" label="充值金额（元）">
          <template slot-scope="scope">
            <el-form-item :prop="'rewardsJson.' + scope.$index + '.cashValue'" :rules='addGoldDynamicFormRules.cashValue'>
              <el-input v-model.trim="scope.row.cashValue" :maxlength='7'></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="金币本金（枚）">
          <template slot-scope="scope">
            <span>{{formatReach(scope) | numFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reward" label="赠送金币（枚）">
          <template slot-scope="scope">
            <el-form-item :prop="'rewardsJson.' + scope.$index + '.reward'" :rules='addGoldDynamicFormRules.reward'>
              <el-input v-model.trim="scope.row.reward" :maxlength='6'></el-input>
            </el-form-item>
            <svg-icon icon-class="accountdel" class="accountdel" v-if="addGoldDynamicForm.rewardsJson.length>1" @click.prevent="removeDomain(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="begin-add-accout" v-if="addGoldDynamicForm.rewardsJson.length<maxRewardNum" @click="addDomain">
        <div class="add-accout">
          <i class="el-icon-plus"></i><span>添加账号{{addGoldDynamicForm.rewardsJson.length}}</span>
        </div>
      </div>
      <el-form-item class="action">
        <el-button type="primary" @click="onHandleAddAcount('addGoldDynamicForm')">确定</el-button>
        <el-button @click="resetForm('addGoldDynamicForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { tokenCoinAddFun, configTokenCoinFun, shoplistInTokenCoinFun, getTokenCoinFun, tokenCoinUpdateFun } from '@/service/tokenCoin';
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
      title: '新增方案',
      shopList: [],
      maxRewardNum: 8,
      exchangeRate: 100,
      shopTokenCoinSet: {},
      addGoldDynamicForm: {
        shopId: '',
        discountProportion: '',
        rewardsJson: []
      },
      addGoldDynamicFormRules: {
        shopId: [{ required: true, message: '请选择适用店铺', trigger: 'change' }],
        discountProportion: [{ required: true, message: '请填写抵扣比例', trigger: 'blur' }, { pattern: /^(([1-9]|[1-9][0-8])(\.\d{0,1})?|(([1-8][0-9])(\.\d{0,1})?)|0\.[1-9]{1}|99|99.0)$/, message: '抵扣比例请输入1-99之间的数字,最多一位小数', trigger: 'blur' }],
        cashValue: [{ required: true, message: '请填写充值金额', trigger: 'blur' }, { pattern: /^(([1-9]|([1-9][0-9]{1,2}([0-8])?)|([1-9][0-8]{1,2}([0-9])?))(\.\d{0,2})?|0\.\d{0,2}|9999|9999.0|9999.00)$/, message: '请输入0~9999之间数字', trigger: 'blur' }],
        reward: [{ required: true, message: '请填写赠送金币', trigger: 'blur' }, { pattern: /^(([0-9])|[1-9]([0-9]{1,3})?[0]{0,2})$/, message: '请填写0~999,900之间整数', trigger: 'blur' }, { pattern: /^[0-9]*$/, message: '请填写0~999,900之间整数', trigger: 'blur' }]
      }
    };
  },
  components: {},
  created() {
    this.shoplistInTokenCoin();
    this.getTokenCoinConfig();
    if (this.shopTokenCoinId) {
      this.getDetail();
      this.title = '编辑金币';
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getDetail() {
      let payload = { id: this.shopTokenCoinId };
      let res = await getTokenCoinFun(payload);
      this.addGoldDynamicForm.rewardsJson = res.rewardSets || [];
      let { shopId, discountProportion } = res.shopTokenCoinSet || {};
      this.addGoldDynamicForm.shopId = shopId;
      this.addGoldDynamicForm.discountProportion = discountProportion;
      this.shopTokenCoinSet = res.shopTokenCoinSet || {};
    },
    async shoplistInTokenCoin() {
      let res = await shoplistInTokenCoinFun({ page: 1, pageSize: 999 });
      let items = (res && res.items) || [];
      if (this.shopTokenCoinId) {
        this.shopList = items;
      } else {
        this.shopList = items.filter(item => Boolean(item.isSet) === false);
      }
    },
    async getTokenCoinConfig() {
      let res = await configTokenCoinFun();
      if (!this.shopTokenCoinId) {
        this.addGoldDynamicForm.rewardsJson = res.rewardsConfig || [];
      }
      this.exchangeRate = res.exchangeRate || 100;
      this.maxRewardNum = res.maxRewardNum || 8;
    },
    formatReach(scope) {
      let reach = scope.row.cashValue ? scope.row.cashValue * this.exchangeRate : '';
      scope.row.reach = reach;
      return reach;
    },
    resetForm(formName) {
      this.modalClose();
    },
    removeDomain(item) {
      let index = this.addGoldDynamicForm.rewardsJson.indexOf(item);
      if (index !== -1) {
        this.addGoldDynamicForm.rewardsJson.splice(index, 1);
      }
    },
    addDomain() {
      this.addGoldDynamicForm.rewardsJson.push({
        date: '',
        name: '',
        address: ''
      });
    },
    checkRepeat() {
      let isRepeat = false;
      let cashValueArr = this.addGoldDynamicForm.rewardsJson.map(item => Number(item.cashValue));
      let setCashValueArr = new Set(cashValueArr); //去重复
      if (setCashValueArr.size !== this.addGoldDynamicForm.rewardsJson.length) {
        isRepeat = true;
      }
      return isRepeat;
    },
    onHandleAddAcount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.checkRepeat()) {
            this.$Message.error('充值金额重复，请重新输入');
            return false;
          }
          let payload = Object.assign({}, this.addGoldDynamicForm);
          if (this.shopTokenCoinId) {
            payload.updateRewardsJson = JSON.stringify(payload.rewardsJson);
            payload.id = this.shopTokenCoinId;
            payload.rewardsJson = [];
            tokenCoinUpdateFun(payload).then(() => {
              this.successFlow();
            });
          } else {
            payload.rewardsJson = JSON.stringify(payload.rewardsJson);
            tokenCoinAddFun(payload).then(() => {
              this.successFlow();
            });
          }
        }
      });
    },
    successFlow() {
      this.$Message.success('操作成功');
      this.$listeners.getTokenCoinList && this.$listeners.getTokenCoinList(); //若组件传递事件confirm则执行
      this.modalClose();
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.add_gold_dynamic_form {
  padding: 18px 0;
  h2 {
    margin: 15px 0;
  }

  .begin-add-accout {
    .add-accout {
      padding: 24px 0;
      border: 1px dashed #dfdfdf;
      margin: 24px;
      text-align: center;
      cursor: pointer;
      font-size: 20px;
      color: $menuText;
      span {
        margin-left: 17px;
      }
    }
  }
  .gold_table {
    /deep/ .el-form-item__content {
      margin-left: 0px !important;
    }
    /deep/ .el-form-item {
      float: left;
      margin-right: 15px;
    }
    .accountdel {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    /deep/ .el-form-item__error {
      width: 150%;
    }
  }

  .action {
    text-align: right;
  }
}
.gold-tip {
  width: 16px;
  height: 16px;
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
</style>

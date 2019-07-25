<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <el-form label-position="left" label-width="120px" :model="addGoldDynamicForm" :rules="addGoldDynamicFormRules" class="add_gold_dynamic_form">
      <el-form-item label="适用店铺：" prop="shopId">
        <el-select v-model="addGoldDynamicForm.shopId" filterable clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="折扣比例(%)：" prop="region">
        <el-input v-model="addGoldDynamicForm.region" placeholder="请填写1-99的数字" :maxlength='4'></el-input>
      </el-form-item>
      <h2>
        <span class="gold_case">金币方案</span>
        <el-tooltip placement="bottom-start" class="gold-tip">
          <div slot="content" class="gold_tooltip">
            <p class="title">方案规则：</p>
            <p>1.店铺可支持0~9个方案； </p>
            <p>2.运营商添加的方案，用户均可购买；</p>
            <p>3.若未添加任何金币方案，则用户可自定义金额购买金币本金，但无赠送金币。</p>
            <p class="title">金币含义：</p>
            <p>1.金币分为金币本金和额外赠送金币；</p>
            <p>2.1金币可抵扣0.01元，以此类推；</p>
            <p>3.用户使用金币时，金币本金将被优先使用，金币本金为0后再消耗赠送金币额度。</p>
            <p class="title">折扣说明：</p>
            <p>1.每笔消费金币可抵扣部分费用，具体抵扣比例由运营商配置。若抵扣比例为99%，即表示总金额为1元的订单，99金币可抵扣0.99元，须再支付0.01元（如按比例计算不足0.01元按0.01元计算）。</p>
            <p class="title">退还金币：</p>
            <p>1.若用户向运营商申请退还金币，则退还金额仅以金币本金部分计算，运营商可在金币管理--金币会员管理处将用户对应的金币做回收处理。</p>
          </div>
          <svg-icon icon-class="zhibiaoshuoming" />
        </el-tooltip>
      </h2>
      <el-table :data="addGoldDynamicForm.tableData" class="gold_table" max-height="325" style="min-height:220px">
        <el-table-column prop="date" label="充值金额（元）">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.date'" :rules='addGoldDynamicFormRules.date'>
              <el-input v-model.trim="scope.row.date" :maxlength='7'></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="金币本金（枚）">
          <template slot-scope="scope">
            <span>{{scope.row.date*100 | numFormat}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="赠送金币（枚）">
          <template slot-scope="scope">
            <el-form-item :prop="'tableData.' + scope.$index + '.address'" :rules='addGoldDynamicFormRules.address'>
              <el-input v-model.trim="scope.row.address" :maxlength='6'></el-input>
            </el-form-item>
            <svg-icon icon-class="accountdel" class="accountdel" @click.prevent="removeDomain(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <div class="begin-add-accout" v-if="addGoldDynamicForm.tableData.length<=9" @click="addDomain">
        <div class="add-accout">
          <i class="el-icon-plus"></i><span>添加账号</span>
        </div>
      </div>
      <el-form-item class="action">
        <el-button type="primary" @click="onHandleAddAcount('dynamicValidateForm')">确定</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopIds: {
      type: String,
      default: ''
    },
    shopList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      title: '新增方案',
      addGoldDynamicForm: {
        name: '',
        region: '',
        type: '',
        tableData: [
          {
            date: '200',
            name: '2000',
            address: '800'
          }
        ]
      },
      addGoldDynamicFormRules: {
        date: [{ required: true, message: '请填写充值金额', trigger: 'blur' }, { pattern: /^(([1-9][0-9]{1,2}|[1-9])(\.\d{1,2})?|0\.[1-9]{1,2}|1000|1000.0|1000.00)$/, message: '请填写1~1000之间数字', trigger: 'blur' }],
        address: [{ required: true, message: '请填写赠送金币', trigger: 'blur' }, { pattern: /^(([0-9]{1,5})|100000)$/, message: '请填写0~100000之间数字', trigger: 'blur' }],
        shopId: [{ required: true, message: '请选择适用店铺', trigger: 'change' }],
        region: [{ required: true, message: '请填折扣比例', trigger: 'blur' }, { pattern: /^([0-9]|[1-9]{1,2})(\.\d{0,1})?$/, message: '请填写1-99之间的数字,可保留一位小数', trigger: 'blur' }]
      }
    };
  },
  components: {},
  created() {},
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },

    handleParent() {
      this.$Message.success('成功');
      this.modalClose();
      this.$listeners.getShopDataToTable && this.$listeners.getShopDataToTable(); //若组件传递事件confirm则执行
      this.$emit('update:isAllChecked', false); // 直接修改父组件的属性
    },
    resetForm(formName) {
      this.modalClose();
    },
    removeDomain(item) {
      let index = this.addGoldDynamicForm.tableData.indexOf(item);
      if (index !== -1) {
        this.addGoldDynamicForm.tableData.splice(index, 1);
      }
    },
    addDomain() {
      this.addGoldDynamicForm.tableData.push({
        date: '',
        name: '',
        address: ''
      });
    },
    checkRepeat(list) {
      let isRepeat = false;
      let newlist = list.sort();
      for (var i = 0; i < newlist.length; i++) {
        if (newlist[i] && newlist[i] === newlist[i + 1]) {
          isRepeat = true;
        }
      }
      return isRepeat;
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
  .gold-tip {
    width: 16px;
    height: 16px;
  }
  .action {
    text-align: right;
  }
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

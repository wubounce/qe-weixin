<template>
  <el-dialog title="金币充值记录" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="768px">
    <ul class="deatil-list">
      <li>
        <span>会员账号：</span>{{defaultInfo.phone}}
      </li>
      <li>
        <span>充值店铺：</span>{{defaultInfo.shopName}}
      </li>
    </ul>
    <el-table :data="list" class="gold_table" max-height="325" style="min-height:220px">
      <el-table-column prop="principalAmount" label="充值金额"></el-table-column>
      <el-table-column prop="amount" label="充值金币"></el-table-column>
      <el-table-column prop="afterAmount" label="金币本金"></el-table-column>
      <el-table-column prop="presentAmount" label="赠送金币"></el-table-column>
      <el-table-column prop="remark" label="充值方式"></el-table-column>
      <el-table-column prop="createdAt" label="充值时间"></el-table-column>
    </el-table>
    <div class="pagination-right">
      <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modlePageMixin from '@/mixins/modlePageMixin';
import { tokenCoinMemberRecordFun } from '@/service/tokenCoin';
export default {
  mixins: [modlePageMixin],
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
      defaultInfo: {}
    };
  },
  components: {},
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async _getList() {
      let payload = Object.assign({ shopId: this.shopId, phone: this.phone }, this.searchData);
      let res = await tokenCoinMemberRecordFun(payload);
      this.list = res.items || [];
      this.defaultInfo = res && res.items.length > 0 ? res.items[0] : {};
      this.total = res.total;
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
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 100px;
      height: 100%;
    }
  }
}
</style>

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
    <el-table :data="list" class="gold_table" max-height="600">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="principalAmount" label="充值金额">
        <template slot-scope="scope">{{formatAmount(scope.row.principalAmount,scope.row.subType,1)}}</template>
      </el-table-column>
      <el-table-column prop="amount" label="充值金币">
        <template slot-scope="scope">{{formatAmount(scope.row.principalAmount,scope.row.subType)}}</template>
      </el-table-column>
      <el-table-column prop="presentAmount" label="赠送金币">
        <template slot-scope="scope">{{formatAmount(scope.row.presentAmount,scope.row.subType)}}</template>
      </el-table-column>
      <el-table-column prop="afterAmount" label="金币本金">
        <template slot-scope="scope">{{formatAmount(scope.row.amount,scope.row.subType)}}</template>
      </el-table-column>
      <el-table-column prop="remark" label="充值方式">
        <template slot-scope="scope">{{scope.row.subType|rechargeWay}}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="充值时间" width="140"></el-table-column>
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
    userInfo: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      defaultInfo: {}
    };
  },
  components: {},
  filters: {
    rechargeWay: function(value) {
      let map = {
        101: `用户直充`,
        102: `商户代充`,
        202: `金币回收`
      };
      return map[value];
    }
  },
  computed: {
    formatAmount() {
      return function(value, subType, flag = 0) {
        value = flag === 1 ? (Number(value) / 100).toFixed(0) : value;
        let map = {
          101: `+${value}`,
          102: `+${value}`,
          202: `-${value}`
        };
        return map[subType] || value;
      };
    }
  },
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async _getList() {
      let payload = Object.assign({ shopId: this.userInfo.shopId, phone: this.userInfo.phone }, this.searchData);
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
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 100px;
      height: 100%;
    }
  }
}
.pagination-right {
  padding: 24px 0;
}
</style>

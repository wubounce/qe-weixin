<template>
  <el-dialog title="" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :before-close="modalClose" top="5vh" :close="modalClose" width="915">
    <center class="print-content" align="center" ref="print">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th :colspan="columns.length" class="table-title">{{tableTitle}}</th>
          </tr>
          <tr>
            <th v-for="(col, index) in columns" :key="index">{{col.label}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td v-for="(col, index) in columns" :key="index" :width="col.width">{{ item[col.prop] }}</td>
          </tr>
          <tr>
            <td v-for="(item, index) in summary" :key="index">{{item}}</td>
          </tr>
          <tr>
            <td :colspan="columns.length">数据打印时间:{{pritnDate}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数据打印操作人：{{userInfoIn.realName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 数据生成秘钥：Qekj{{key}} </td>
          </tr>
          <tr>
            <td :colspan="columns.length">数据统计店铺:{{shopNames.join(',')}}</td>
          </tr>
        </tbody>
      </table>
    </center>
    <div class="print-action">
      <el-button type="primary" class="no-print" @click="doPrint">打印</el-button>
      <el-button class="no-print" @click="modalClose" style="width:95px">取消</el-button>
    </div>
  </el-dialog>
</template>

  <script>
import moment from 'moment';
import { shopListFun } from '@/service/report';
import { getUserInfoInLocalstorage } from '@/utils/auth';
export default {
  name: 'printTable',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    summary: {
      type: Array,
      default: () => {
        return [];
      }
    },
    searchData: {
      type: Object,
      default: () => {
        return {
          shopIds: []
        };
      }
    }
  },
  data() {
    return {
      pritnDate: moment().format('YYYY-MM-DD HH:mm:ss'),
      userInfoIn: getUserInfoInLocalstorage() ? getUserInfoInLocalstorage() : {},
      tableTitle: '',
      shopNames: []
    };
  },
  created() {
    this.getShopList();
  },
  computed: {
    key() {
      return ((Math.random() * Date.now()) / 1000000).toFixed(0);
    }
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      let shopNmaes;
      if (this.searchData.shopIds.length > 0) {
        shopNmaes = res.filter(v => this.searchData.shopIds.some(k => k == v.shopId)).map(item => item.shopName);
      } else {
        shopNmaes = res.map(i => i.shopName);
      }
      this.tableTitle = shopNmaes.length > 0 ? `${shopNmaes[0]}等${shopNmaes.length}家店铺${this.searchData.time[0]}~${this.searchData.time[1]}营收报表` : `${this.searchData.time[0]}~${this.searchData.time[1]}营收报表`;
      this.shopNames = shopNmaes;
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    doPrint() {
      this.$print(this.$refs.print);
    }
  },
  watch: {
    'searchData.shopIds': function(newVal) {
      this.getShopList();
    }
  }
};
</script>
<style lang="scss" scoped>
.print-content {
  background: #d8d8d8;
  padding: 5px;
  /deep/ .el-table .cell {
    line-height: 20px !important;
  }
  table {
    border: 1px solid #999;
    border-collapse: collapse;
    background: #fff;
  }
  table td,
  table th {
    font-size: 10pt;
    border: 1px solid #999;
    line-height: 28px;
    font-weight: 500;
  }
  table td {
    text-align: left;
  }
  .table-title {
    font-weight: 700;
    line-height: 42px;
  }
}
.print-action {
  padding-top: 27px;
  padding-bottom: 30px;
  text-align: center;
  /deep/ .el-button--primary,
  /deep/ .el-button--primary:active {
    background: #1873e8;
    border-color: #1873e8;
    width: 95px;
  }
}

@media print {
  @page {
    margin: 1cm;
  }
  body {
    padding: 0;
    margin: 2cm;
    font-family: 'Microsoft Yahei', 'Times New Roman', serif;
    font-size: 10pt;
  }
  .no-print {
    display: none;
  }
}
</style>
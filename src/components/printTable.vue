<template>
  <el-dialog title="" :visible.sync="visible" :show-close="false" :close-on-click-modal="false" :before-close="modalClose" top="5vh" :close="modalClose" width="915">
    <!--startprint-->
    <center class="print-content" align="center" ref="print" id="print">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th :colspan="columnsData.length" class="table-title" style="border-bottom: none; font-size:20px;">营收报表</th>
          </tr>
          <tr>
            <th :colspan="columnsData.length" style="text-align:right;border-top: none;padding-right:5px; line-height: 22px; font-weight:normal" class="table-title">{{printTime}}</th>
          </tr>
          <tr>
            <th v-for="(col, index) in columnsData" :width="col.width" :key="index">{{col.label}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableData" :key="index">
            <td v-for="(col, index) in columnsData" :key="index" :style="col.style">{{ item[col.prop] }}</td>
          </tr>
          <tr>
            <td v-for="(item, index) in summary" :key="index" :style="item.style">{{item.total}}</td>
          </tr>
          <tr>
            <td :colspan="columnsData.length" style="text-align:left; padding-left:5px">报表数据包含店铺：{{shopNames.join(',')}}</td>
          </tr>
          <tr>
            <td :colspan="columnsData.length" style="text-align:left; padding-left:5px">打印时间：{{pritnDate}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印人：{{userInfoIn.realName}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 报表生成秘钥：Qekj{{key}} </td>
          </tr>
        </tbody>
      </table>
    </center>
    <!--endprint-->
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
import { checkPerms } from '@/utils/tools';
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
      shopNames: [],
      printTime: `${this.searchData.time[0]}  至  ${this.searchData.time[1]}`,
      columnsData: []
    };
  },
  mounted() {
    if (!checkPerms('mer:tokencoin:vip')) {
      this.columnsData = this.columns.filter(i => {
        return i.prop !== 'coinCount' && i.prop !== 'coinMoney';
      });
    } else {
      this.columnsData = this.columns;
    }
  },
  created() {
    this.getShopList();
  },
  computed: {
    key() {
      let num = '';
      for (var i = 0; i < 6; i++) {
        num += Math.floor(Math.random() * 10);
      }
      return num;
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
      this.shopNames = shopNmaes;
    },
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    doPrint() {
      let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串//判断是否IE浏览器
      if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') < 1) {
        let html = document.getElementById('print').innerHTML;
        let oPop = window.open('', 'oPop');
        oPop.document.write(html);
        oPop.print();
        oPop.close();
      } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1) {
        this.iePreview();
      } else {
        this.$print(this.$refs.print);
      }
    },
    iePreview() {
      let bdhtml = window.document.body.innerHTML;
      let sprnstr = '<!--startprint-->';
      let eprnstr = '<!--endprint-->';
      let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17);
      prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr));
      window.document.body.innerHTML = prnhtml;
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        //是否ie
        this.remove_ie_header_and_footer();
      }
      window.print();
      window.document.body.innerHTML = bdhtml;
    },
    /**
     * 移除页眉页脚
     * */
    remove_ie_header_and_footer() {
      var hkey_path;
      hkey_path = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\';
      try {
        var RegWsh = new ActiveXObject('WScript.Shell');
        RegWsh.RegWrite(hkey_path + 'header', '');
        RegWsh.RegWrite(hkey_path + 'footer', '');
      } catch (e) {}
    }
  },
  watch: {
    'searchData.shopIds': function(newVal) {
      this.getShopList();
    },
    'searchData.time': function(newVal) {
      this.printTime = `${this.searchData.time[0]}  至  ${this.searchData.time[1]}`;
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
    border: 1px solid #333;
    border-collapse: collapse;
    background: #fff;
  }

  table td,
  table th {
    font-size: 10pt;
    border: 1px solid #333;
    padding-top: 5px;
    padding-bottom: 5px;
    font-weight: 500;
  }

  table td {
    padding-right: 5px;
  }
  .table-title {
    font-weight: 700;
    line-height: 22px;
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
    margin-top: 15mm;
    margin-left: 10mm;
    margin-right: 10mm;
  }
  body {
    padding: 0;
    margin-top: 10mm;
    margin-left: 6mm;
    margin-right: 6mm;
    font-family: 'Microsoft Yahei', 'Times New Roman', serif;
    font-size: 8pt;
  }
  .no-print {
    display: none;
  }
}
</style>
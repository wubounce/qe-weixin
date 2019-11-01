<template>
  <div class="date-earing year-earing">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="earing-search">
      <el-form-item label="时间筛选：" prop="time">
        <el-date-picker v-model="searchData.time" type="year" placeholder="选择年" :picker-options="pickerOptions" :clearable="false" value-format="yyyy"></el-date-picker>
      </el-form-item>
      <el-form-item label="店铺筛选：" prop="shopIds">
        <shop-filter v-model="searchData.shopIds" placeholder="请选择"></shop-filter>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="date-chart">
      <div class="chart-title">
        <span>趋势图</span>
      </div>
      <div class="line" id="datelinechart" style="height:220px;width:100%"></div>
      <p class="legend">
        <span class="legend-earing"></span><span style="margin-right: 20px;">营收</span>
        <span class="legend-earing legend-order"></span><span style="color: #1890ff;">订单数</span>
      </p>
    </div>
    <div>
      <div class="chart-title detail-table">
        <span>详细数据</span>
        <el-button style="float: right;" @click="exportTable()">
          <svg-icon icon-class="daochu" class="daochu" />导出</el-button>
      </div>
      <el-table :data="tableDataList" show-summary :summary-method="getSummaries" style="width: 100%">
        <el-table-column header-align="left" prop="date" label="时间"></el-table-column>
        <el-table-column header-align="left" prop="machineCount" label="设备订单数"></el-table-column>
        <el-table-column header-align="left" prop="machineMoney" label="设备订单支付金额(元)"></el-table-column>
        <el-table-column header-align="left" prop="machineRefundMoney" label="设备订单退款金额(元)"></el-table-column>
        <el-table-column header-align="left" prop="money" label="设备订单营收(元)">
          <template slot-scope="scope">
            {{(scope.row.machineMoney-scope.row.machineRefundMoney) | toFixed}}
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="vipCount" label="VIP结算数"></el-table-column>
        <el-table-column header-align="left" prop="vipMoney" label="VIP结算营收(元)"></el-table-column>
        <el-table-column header-align="left" prop="coinCount" label="金币订单数" v-if="checkPerms('mer:tokencoin:vip')"></el-table-column>
        <el-table-column header-align="left" prop="coinMoney" label="金币营收(元)" v-if="checkPerms('mer:tokencoin:vip')"></el-table-column>
        <el-table-column header-align="left" prop="money" label="营收(元)"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { dayReportFun, dayReportApi } from '@/service/report';
import { exportExcel } from '@/service/common';
import { calMax, calMin, checkPerms } from '@/utils/tools';
import ShopFilter from '@/components/Shopfilter';
import PagerMixin from '@/mixins/PagerMixin';

export default {
  name: 'date-earing',
  mixins: [PagerMixin],
  data() {
    return {
      linechart: null,
      orderMax: null,
      moneyMax: null,
      orderMin: null,
      moneyMin: null,
      tableDataList: [],
      oderDataList: [],
      moneyDataList: [],
      reportDate: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchData: {
        time: moment().format('YYYY'),
        shopIds: []
      }
    };
  },
  components: {
    ShopFilter
  },
  filters: {
    toFixed(val) {
      return Number(val).toFixed(2);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  created() {
    this.getProfitDate();
  },
  methods: {
    checkPerms,
    initChart() {
      this.linechart = echarts.init(document.getElementById('datelinechart'));
    },
    searchForm() {
      this.getProfitDate();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.getProfitDate();
    },
    async getProfitDate(shopId = '') {
      //收益数据
      let payload = Object.assign({}, { startDate: this.searchData.time, endDate: this.searchData.time, shopIds: this.searchData.shopIds.join(','), dateLevel: 3 });
      let res = await dayReportFun(payload);
      this.oderDataList = [];
      this.moneyDataList = [];
      this.reportDate = [];
      res.list.forEach(item => {
        this.oderDataList.push(item.count);
        this.moneyDataList.push(item.money);
        this.reportDate.push(item.date);
      });
      this.orderMax = calMax(this.oderDataList) > 0 ? calMax(this.oderDataList) : 1; //订单Y轴最大值
      this.moneyMax = calMax(this.moneyDataList) > 0 ? calMax(this.moneyDataList) : 1; //金额Y轴最大值
      this.orderMin = calMin(this.oderDataList); //订单Y轴最小值
      this.moneyMin = calMin(this.moneyDataList); //金额Y轴最小值
      this.tableDataList = res.list;
      this.tableDataList.sort(this.ortId); //表格时间倒序
      this.linechart.setOption(this.lineChartOption);
    },
    ortId(a, b) {
      //数据排序
      let k = a.date.replace(/\-/g, '');
      let h = b.date.replace(/\-/g, '');
      return h - k;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] = index === 1 || index === 5 || index === 7 ? sums[index].toFixed(0) : sums[index].toFixed(2);
        } else {
          sums[index] = 'N/A';
        }
      });
      return sums;
    },
    exportTable() {
      let payload = Object.assign({}, { startDate: this.searchData.time, endDate: this.searchData.time, shopIds: this.searchData.shopIds.join(','), dateLevel: 3, excel: true });
      exportExcel(dayReportApi, '年报表.xlsx', payload);
    }
  },
  computed: {
    lineChartOption() {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: false,
            label: {
              backgroundColor: '#505765'
            }
          },
          backgroundColor: '#FFFFFF',
          textStyle: { color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 },
          extraCssText: 'box-shadow:0px 5px 38px 0px rgba(0,0,0,0.1);',
          formatter: function(data) {
            return `&nbsp;&nbsp;&nbsp;&nbsp;${data[0].name}<br/>${data[0].marker}${data[0].seriesName}：${data[0].value}元<br/>${data[1].marker}${data[1].seriesName}：${data[1].value}`;
          }
        },
        grid: {
          y: 10,
          x: 0,
          x2: 0,
          y2: 10, //网格下方距离
          containLabel: true
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        xAxis: [
          {
            type: 'category',
            offset: 8,
            boundaryGap: false,
            data: this.reportDate,
            axisLabel: {
              textStyle: { color: '#999' }
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6',
                type: 'solid'
              }
            },
            axisTick: { length: 5 }
          }
        ],
        yAxis: [
          {
            name: '营收',
            type: 'value',
            min: this.moneyMin,
            max: this.moneyMax,
            splitNumber: 4,
            interval: (this.moneyMax - this.moneyMin) / 4,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: { color: '#999' },
              formatter: function(value) {
                return value.toFixed(2);
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
                type: 'soild'
              }
            }
          },
          {
            name: '订单数量',
            type: 'value',
            min: this.orderMin,
            max: this.orderMax,
            splitNumber: 4,
            interval: (this.orderMax - this.orderMin) / 4,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#e6e6e6'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: { color: '#999' }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#e6e6e6',
                type: 'soild'
              }
            }
          }
        ],
        series: [
          {
            name: '营收',
            type: 'line',
            yAxisIndex: 0,
            symbol: 'circle',
            smooth: true,
            data: this.moneyDataList,
            itemStyle: {
              normal: {
                color: '#FFB300',
                lineStyle: {
                  color: '#FFB300'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FFB300' }, { offset: 1, color: '#FDFDFD' }])
              }
            }
          },
          {
            name: '订单数量',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
            smooth: true,
            data: this.oderDataList,
            itemStyle: {
              normal: {
                color: '#188EFC',
                lineStyle: {
                  color: '#188EFC'
                }
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#188EFC' }, { offset: 1, color: '#FDFDFD' }])
              }
            }
          }
        ]
      };
      return option;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss">
.year-earing .el-date-editor {
  width: 120px !important;
  .el-input__inner {
    padding-left: 30px !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/profitreport.scss';
</style>

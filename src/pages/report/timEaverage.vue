<template>
  <div class="date-earing">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="日期筛选：" prop="time">
        <el-date-picker size="small" v-model="searchData.time" type="daterange" :picker-options="pickerOptions" align="right" :clearable="false" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店铺：" prop="shopIds">
        <el-select v-model="searchData.shopIds" clearable placeholder="请选择" @change="checkedShop">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型：" prop="machineTypeIds">
        <el-select v-model="searchData.machineTypeIds" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in parentTypList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="date-chart">
      <div class="chart-title">
        <span>趋势图</span>
      </div>
      <div class="line" id="datelinechart" style="height:220px;width:100%"></div>
      <p class="legend">
        <span class="legend-earing"></span><span style="margin-right: 20px;">订单收益</span>
        <span class="legend-earing legend-order"></span><span style="color: #1890ff;">订单数</span>
      </p>
    </div>
    <div class="report-detail">
      <div class="chart-title">
        <span>详细数据</span>
        <el-button icon="el-icon-download" style="float: right;" @click="exportTable()">导出</el-button>
      </div>
      <el-table :data="tableDataList" show-summary style="width: 100%">
        <el-table-column header-align="left" prop="date" label="时间"></el-table-column>
        <el-table-column header-align="left" prop="count" label="订单数量"></el-table-column>
        <el-table-column header-align="left" prop="refundMoney" label="退款金额(元)"></el-table-column>
        <el-table-column header-align="left" prop="money" label="订单收益(含洗衣液)(元)"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { dayReportFun, dayReportApi, shopListFun } from '@/service/report';
import { exportExcel } from '@/service/common';
import { ParentTypeFun } from '@/service/index';
import { calMax, calMin } from '@/utils/tools';
import ShopFilter from '@/components/Shopfilter';

export default {
  name: 'date-earing',

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
      shopList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      searchData: {
        time: [
          moment()
            .subtract(7, 'days')
            .format('YYYY-MM-DD'),
          moment()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
        ],
        shopIds: '',
        machineTypeIds: ''
      },
      parentTypList: []
    };
  },
  components: {
    ShopFilter
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  created() {
    this.getShopList();
    this.getmachineParentType();
    this.getProfitDate();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    initChart() {
      this.linechart = echarts.init(document.getElementById('datelinechart'));
    },
    searchForm() {
      this.getProfitDate();
    },
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
      this.getProfitDate();
    },
    async getmachineParentType() {
      //获取设备类型
      let res = await ParentTypeFun({ onlyMine: true });
      this.parentTypList = res;
    },
    async getProfitDate(shopId = '') {
      //收益数据
      let payload = Object.assign({}, { startDate: this.searchData.time[0], endDate: this.searchData.time[1], shopIds: this.searchData.shopIds, machineTypeIds: this.searchData.machineTypeIds, dateLevel: 4 });
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
      this.orderMin = calMin(this.oderDataList); //订单Y轴最大值
      this.moneyMin = calMin(this.moneyDataList); //金额Y轴最大值
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
    exportTable() {
      let payload = Object.assign({}, { startDate: this.searchData.time[0], endDate: this.searchData.time[1], shopIds: this.searchData.shopIds, machineTypeIds: this.searchData.machineTypeIds, dateLevel: 4, excel: true });
      exportExcel(dayReportApi, '时段平均报表.xlsx', payload);
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
            name: '收益金额',
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
            name: '收益金额',
            type: 'line',
            yAxisIndex: 0,
            symbol: 'circle',
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FFECC9' }, { offset: 1, color: '#FDFDFD' }])
              }
            }
          },
          {
            name: '订单数量',
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
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

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/profitreport.scss';
.date-chart {
  background: #fff;
  padding: 16px 32px 32px 32px;
  border-radius: 2px;
  margin: 24px 0;
  border: 0;
}
.header-search,
.report-detail {
  background: #fff;
  padding: 24px 32px 6px 32px;
  border-radius: 2px;
}
</style>

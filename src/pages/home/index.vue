<template>
  <div class="dashboard-container">
    <el-row :gutter="25">
      <el-col :span="12">
        <div class="card-data">
          <h2>收益数据 </h2>
          <ul class="profit-sub">
            <li>
              <p class="title">今日收益 (元)</p>
              <p class="num">￥{{frofitCount.todayMoney}}</p>
              <p :class="['pio',{'up-arrows':String(frofitCount.yoy).includes('+'),'down-arrows':String(frofitCount.yoy).includes('-')}]">
                {{frofitCount.yoy}}
                <svg-icon :icon-class="String(frofitCount.yoy).includes('+')? 'shangzhang':'xiajiang'" />
              </p>
            </li>
            <li>
              <p class="title">当月收益 (元)</p>
              <p class="num">￥{{frofitCount.monthMoney}}</p>
            </li>
            <li>
              <p class="title">总收益 (元)</p>
              <p class="num">￥{{frofitCount.allMoney}}</p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="card-data">
          <h2>订单数据<el-tooltip content="订单数为除未支付和支付超时的订单，即有效订单数" placement="top">
              <svg-icon icon-class="zhibiaoshuoming" />
            </el-tooltip>
          </h2>
          <ul class="profit-sub">
            <li>
              <p class="title">今日订单数</p>
              <p class="num">{{orderCount.todayCount}}</p>
              <p :class="['pio',{'up-arrows':String(orderCount.yoy).includes('+'),'down-arrows':String(orderCount.yoy).includes('-')}]">
                {{orderCount.yoy}}
                <svg-icon :icon-class="String(orderCount.yoy).includes('+')? 'shangzhang':'xiajiang'" />
              </p>
            </li>
            <li>
              <p class="title">当月订单数</p>
              <p class="num">{{orderCount.monthCount}}</p>
            </li>
            <li>
              <p class="title">总订单数</p>
              <p class="num">{{orderCount.totalCount}}</p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="25">
      <el-col :span="16">
        <div class="card-data">
          <h2>用户数据<el-tooltip placement="top">
              <div slot="content">今日下单用户数：今日实际下单支付的用户数量<br />今日新增用户数：今日首次在店铺下单支付的用户数量</div>
              <svg-icon icon-class="zhibiaoshuoming" />
            </el-tooltip>
          </h2>
          <ul class="profit-sub">
            <li>
              <p class="title">今日下单用户数</p>
              <p class="num">{{userCount.todayUserCount}}</p>
              <p :class="['pio',{'up-arrows':String(userCount.yoyUser).includes('+'),'down-arrows':String(userCount.yoyUser).includes('-')}]">
                {{userCount.yoyUser}}
                <svg-icon :icon-class="String(userCount.yoyUser).includes('+')? 'shangzhang':'xiajiang'" />
              </p>
            </li>
            <li>
              <p class="title">今日新增用户数</p>
              <p class="num">{{userCount.todayAddUserCount}}</p>
              <p :class="['pio',{'up-arrows':String(userCount.yoyAddUser).includes('+'),'down-arrows':String(userCount.yoyAddUser).includes('-')}]">
                {{userCount.yoyAddUser}}
                <svg-icon :icon-class="String(userCount.yoyAddUser).includes('+')? 'shangzhang':'xiajiang'" />
              </p>
            </li>
            <li>
              <p class="title">今日新增VIP</p>
              <p class="num">{{userCount.countAddVip}}</p>
            </li>
            <li>
              <p class="title">VIP总数</p>
              <p class="num">{{userCount.countVip}}</p>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card-data">
          <h2>设备数据<el-tooltip content="今日设备活跃率：今日产生有效订单设备数/总设备数" placement="top">
              <svg-icon icon-class="zhibiaoshuoming" />
            </el-tooltip>
          </h2>
          <ul class="profit-sub">
            <li>
              <p class="title">今日设备活跃率 </p>
              <p class="num">{{deviceCount.deviceActiveRatio}}%</p>
              <p :class="['pio',{'up-arrows':String(deviceCount.yoy).includes('+'),'down-arrows':String(deviceCount.yoy).includes('-')}]">
                {{deviceCount.yoy}}
                <svg-icon :icon-class="String(deviceCount.yoy).includes('+')? 'shangzhang':'xiajiang'" />
              </p>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="25">
      <el-col :span="12">
        <div class="line-chart">
          <div class="chart-title">
            <span>收益趋势</span>
            <div class="change-type">
              <el-radio-group v-model="changeType" @change="profitTimeSearch">
                <el-radio-button v-for="(item,index) in lineSearchTime" :key="index" :label="item.value">{{item.lable}}</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="line" id="linechart" style="height:200px;width:100%"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="pie-chart">
          <div class="chart-title">
            <span>设备监控</span>
            <div class="change-type">
              <el-select v-model="parentTypeId" @change="machineTypeSearch">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item,index) in parentTypList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
          <div class="line" id="piechart" style="height:200px;width:100%"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ParentTypeFun, countMachineFun, timeProfitFun, totalProfitFun, orderCountFun, userCountFun, deviceActiveRatiotFun } from '@/service/index';
import { calMax, calMin } from '@/utils/tools';
import { MachineStatus } from '@/utils/mapping';
export default {
  name: 'home',
  data() {
    return {
      frofitCount: {},
      orderCount: {},
      userCount: {},
      deviceCount: {},
      linechart: null,
      piechart: null,
      lineMax: null,
      lineMin: null,
      linexAxisData: [],
      lineseriesData: [],
      pietypeData: [],
      allmMachine: 0,
      changeType: 0,
      parentTypeId: '',
      lineSearchTime: [{ value: 0, lable: '今天' }, { value: 1, lable: '7天' }, { value: 2, lable: '30天' }],
      parentTypList: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  created() {
    this.getTotalProfit();
    this.getOrderCount();
    this.getUserCount();
    this.getdeviceActiveRatiot();
    this.getmachineParentType();
    this.getProfitDate();
    this.getMachineCount();
  },
  methods: {
    initChart() {
      this.linechart = echarts.init(document.getElementById('linechart'));
      this.piechart = echarts.init(document.getElementById('piechart'));
      const that = this;
      window.addEventListener('resize', function() {
        that.linechart.resize();
        that.piechart.resize();
      });
    },
    async getTotalProfit() {
      //总收益
      let res = await totalProfitFun();
      this.frofitCount = res;
    },
    async getOrderCount() {
      //订单
      let res = await orderCountFun();
      this.orderCount = res;
    },
    async getdeviceActiveRatiot() {
      //设备
      let res = await deviceActiveRatiotFun();
      this.deviceCount = res;
    },
    async getUserCount() {
      //用户
      let res = await userCountFun();
      this.userCount = res;
    },
    async getmachineParentType() {
      //获取设备类型
      let res = await ParentTypeFun({ onlyMine: true });
      this.parentTypList = res.length > 0 ? res : [];
    },
    async getProfitDate(type = 0) {
      //收益数据
      let res = await timeProfitFun({ type: type });
      this.lineseriesData = [];
      this.linexAxisData = [];
      res.forEach(item => {
        this.lineseriesData.push(item.sum);
        if (String(item.time).length <= 2) {
          this.linexAxisData.push(`${item.time}:00`);
        } else {
          this.linexAxisData.push(item.time);
        }
      });
      this.lineMax = calMax(this.lineseriesData) > 0 ? calMax(this.lineseriesData) : 1; //Y轴最大值
      this.lineMin = calMin(this.lineseriesData);
      // 把配置和数据放这里
      this.linechart.setOption(this.lineChartOption);
    },
    async getMachineCount(parentTypeId = '') {
      //设备监控
      let res = await countMachineFun({ parentTypeId: parentTypeId });
      this.allmMachine = res.all; //设备总数
      delete res.all; //图表删除总数
      delete res.timeout; //图表删除总数
      for (var i in res) {
        this.pietypeData.push({
          value: res[i],
          name: MachineStatus[i]
        });
      }
      this.piechart.setOption(this.pietypeChartOPtion);
    },
    profitTimeSearch: function() {
      //收益收据选择时间搜索
      this.linexAxisData = [];
      this.lineseriesData = [];
      this.getProfitDate(this.changeType);
    },
    machineTypeSearch() {
      //收益收据选择设备类型搜索
      this.pietypeData = [];
      this.getMachineCount(this.parentTypeId);
    }
  },
  destroyed() {
    const that = this;
    window.removeEventListener('resize', function() {
      that.linechart.resize();
      that.piechart.resize();
    });
  },
  computed: {
    lineChartOption() {
      let opt = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          backgroundColor: '#FFFFFF',
          textStyle: { color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 },
          extraCssText: 'box-shadow:0px 5px 38px 0px rgba(0,0,0,0.1);',
          formatter: function(data) {
            let reg = /^(\d{1,2})(:)?(\d{1,2})$/;
            if (reg.test(data[0].name)) {
              let time = data[0].name.replace(':00', ':59');
              data[0].name = `${data[0].name}-${time}`;
            }
            return `&nbsp;&nbsp;&nbsp;&nbsp;${data[0].name}<br/>${data[0].marker}${data[0].seriesName}：${data[0].value.toFixed(2)}元`;
          }
        },
        grid: {
          top: 10,
          right: 15,
          bottom: 20,
          left: 20,
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
            boundaryGap: false,
            offset: 8,
            data: this.linexAxisData,
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
            type: 'value',
            offset: 10,
            min: this.lineMin,
            max: this.lineMax,
            splitNumber: 4,
            interval: (this.lineMax - this.lineMin) / 4,
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
          }
        ],
        series: [
          {
            symbol: 'circle',
            data: this.lineseriesData,
            name: '收益',
            type: 'line',
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
                /* eslint-disable */
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#FFB300' }, { offset: 1, color: '#FDFDFD' }])
              }
            }
          }
        ]
      };
      return opt;
    },
    pietypeChartOPtion() {
      let opt = {
        tooltip: {
          trigger: 'item',
          backgroundColor: '#FFFFFF',
          textStyle: { color: 'rgba(0, 0, 0, 0.65)' },
          extraCssText: 'box-shadow:0px 5px 38px 0px rgba(0,0,0,0.1);',
          // formatter: "{a} <br/>{b}: {c} ({d}%)"//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
          formatter: function(data) {
            return `${data.marker}${data.name}<span style="display: inline-block;width:2px;height:12px;background: #D9D9D9;margin:0 8px;"></span>${data.value}`;
          }
        },
        title: {
          text: '总设备数',
          subtext: `${this.allmMachine}`,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
            fontSize: 14,
            align: 'center'
          },
          subtextStyle: {
            fontSize: 24,
            color: ['#171A2E']
          },
          x: 'center',
          y: '35%'
        },
        legend: {
          //图例样式
          y: 'center',
          itemWidth: 8,
          itemHeight: 8,
          orient: 'vertical',
          right: '12%',
          itemGap: 16,
          formatter: name => {
            var target;
            for (var i = 0, l = this.pietypeData.length; i < l; i++) {
              if (this.pietypeData[i].name == name) {
                target = this.pietypeData[i].value;
              }
            }
            var arr = ['{a|' + name + '}', '{b|' + '|' + '}', '{c|' + target + '}'];
            return arr.join('');
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 14
              },
              b: {
                fontSize: 14,
                padding: [0, 10],
                color: '#D9D9D9'
              },
              c: {
                fontSize: 14
              }
            }
          },
          pageButtonGap: 20,
          data: [
            {
              name: '空闲设备',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 }
            },
            {
              name: '工作设备',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 }
            },
            {
              name: '故障设备',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 }
            },
            {
              name: '离线设备',
              icon: 'circle',
              textStyle: { fontWeight: 'normal', color: 'rgba(0, 0, 0, 0.65)', fontSize: 12 }
            }
          ]
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '90%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: function(data) {
                  return '';
                },
                color: '#333'
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 10,
                length2: 0
              }
            },
            data: this.pietypeData,
            itemStyle: {
              normal: {
                color: function(data) {
                  switch (data.name) {
                    case '空闲设备':
                      return '#1890FF';
                    case '工作设备':
                      return '#2FC25B';
                    case '故障设备':
                      return '#F04864';
                    case '离线设备':
                      return '#FACC14';
                    default:
                      return '#EF5657';
                  }
                }
              }
            }
          }
        ]
      };
      return opt;
    }
  }
};
</script>
<style lang="scss">
.dashboard-container .el-row {
  margin-bottom: 20px;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.dashboard-container {
  .card-data {
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 16px 24px;
    h2 {
      font-size: 16px;
      font-weight: normal;
      padding-bottom: 17px;
      border-bottom: 1px solid $under_line;
      .svg-icon {
        margin-left: 8px;
      }
    }
    .profit-sub {
      display: flex;
      li {
        flex: 1;
        text-align: center;
      }
      .title {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 20px;
        margin-top: 16px;
      }
      .num {
        height: 33px;
        font-size: 24px;
        font-family: HelveticaNeue;
        color: $menuText;
        line-height: 33px;
        margin-top: 4px;
        margin-bottom: 8px;
      }
      .pio {
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: $menuText;
        line-height: 20px;
      }
      .up-arrows {
        color: $menuText;
      }
      .down-arrows {
        color: #2fc25b;
      }
    }
  }
  .line-chart,
  .pie-chart {
    background: #fff;
    padding: 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .chart-title {
    width: 100%;
    overflow: hidden;
  }
  .change-type {
    float: right;
    margin-bottom: 24px;
  }
}
</style>

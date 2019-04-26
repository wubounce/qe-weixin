<template>
  <div class="earing-page">
    <div class="report-tab">
      <span v-for="(item,index) in tabTitle" :key="index" @click="tabChange(item.component,index)" :class="{active:index==num}">{{item.title}}</span>
    </div>
    <div :is="currentView"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import dateReport from '@/pages/report/dateReport';
import monthReport from '@/pages/report/monthReport';
import yearReport from '@/pages/report/yearReport';
export default {
  data() {
    return {
      currentView: 'dateReport', // 默认选中第一项
      num: 0,
      tabTitle: [{ component: 'dateReport', title: '日报表' }, { component: 'monthReport', title: '月报表' }, { component: 'yearReport', title: '年报表' }]
    };
  },
  components: {
    dateReport,
    monthReport,
    yearReport
  },
  methods: {
    tabChange(tabItem, index) {
      this.currentView = tabItem;
      this.num = index;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.earing-page {
  background: #fff;
  padding: 16px 32px 32px 32px;
  .report-tab {
    padding-bottom: 11px;
    border-bottom: 1px solid $under_line;
    span {
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      line-height: 22px;
      margin-right: 44px;
      padding-bottom: 11px;
      cursor: pointer;
    }
    .active {
      color: $menuText;
      border-bottom: 2px solid $menuText;
    }
  }
}
</style>

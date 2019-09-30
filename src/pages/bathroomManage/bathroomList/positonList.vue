<template>
  <el-dialog title="浴位列表" :visible="visible" :before-close="modalClose" :close="modalClose" width="1100px">
    <el-table :data="list" style="width: 100%" max-height="540">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="deviceName" label="浴位编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sn" label="终端设备号"></el-table-column>
      <el-table-column prop="gatewayType" label="网关类型" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="gatewayName" label="网关名称"></el-table-column>
      <el-table-column prop="createTime" label="浴室名称"></el-table-column>
      <el-table-column prop="liquidPerPulse" label="单脉冲流量(ml)"></el-table-column>
      <el-table-column prop="price" label="单价(元/L)"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getShowerListFun } from '@/service/shower';
export default {
  props: {
    orgId: {
      type: String,
      default: '1'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getShowerList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getShowerList(row) {
      let payload = { orgId: this.orgId };
      let res = await getShowerListFun(payload);
      this.list = res || [];
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 27px !important;
}
</style>


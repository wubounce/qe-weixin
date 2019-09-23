<template>
  <el-dialog title="浴室列表" :visible="visible" :before-close="modalClose" :close="modalClose" width="1100px">
    <el-table :data="list" style="width: 100%" max-height="540">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="machineName" label="浴位编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="machineTypeName" label="终端设备号"></el-table-column>
      <el-table-column prop="subTypeName" label="网关类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="machineState" label="网关名称"></el-table-column>
      <el-table-column prop="createTime" label="浴室名称"></el-table-column>
      <el-table-column prop="createTime" label="单脉冲流量(ml)"></el-table-column>
      <el-table-column prop="createTime" label="单脉冲流量(ml)"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modlePageMixin from '@/mixins/modlePageMixin';
import { manageSimpleListFun } from '@/service/shop';
export default {
  mixins: [modlePageMixin],
  props: {
    shopId: {
      type: String,
      default: '201812221917180000060615'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async _getList(row) {
      let payload = Object.assign({ shopId: this.shopId }, this.searchData);
      let res = await manageSimpleListFun(payload);
      this.list = res.items || [];
      this.total = res.total;
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog__body {
  padding-bottom: 27px !important;
}
</style>


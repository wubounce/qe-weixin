<template>
  <el-dialog title="预约模块" :visible="visible" :before-close="modalClose" :close="modalClose" width="1100px">
    <el-table :data="list" style="width: 100%" max-height="600">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="parentTypeName" label="设备类型"></el-table-column>
      <el-table-column prop="subTypeName" label="设备型号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ifOpen" label="模板状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ifOpen===0?'关闭':'开启'}}
        </template>
      </el-table-column>
      <el-table-column prop="version" label="可预约设备数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑预约模板" placement="top" effect="dark">
            <svg-icon icon-class="bianji" class="icon-bianji" />
          </el-tooltip>
          <el-tooltip content="开启/关闭" placement="top" effect="dark">
            <el-switch v-model="scope.row.ifOpen" class="change-reserve-status"></el-switch>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <svg-icon icon-class="shanchu" class="icon-shanchu" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getReserveModuleListFun } from '@/service/shop';
export default {
  props: {
    shopId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    };
  },
  components: {},
  created() {
    this.getReserveModuleList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getReserveModuleList(row) {
      let payload = Object.assign({ shopId: '201909031529240000019364311016' }, this.searchData);
      let res = await getReserveModuleListFun(payload);
      console.log(res);
      this.list = res.items || [];
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pagination-right {
  padding: 24px 0;
}
.change-reserve-status {
  margin-right: 10px;
  vertical-align: top;
}
</style>


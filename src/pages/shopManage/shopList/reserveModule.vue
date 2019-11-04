<template>
  <el-dialog title="预约模块" :visible="visible" :before-close="modalClose" :close="modalClose" width="1100px">
    <el-table :data="list" style="width: 100%" max-height="600">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="machineTypeName" label="设备类型"></el-table-column>
      <el-table-column prop="subTypeName" label="设备型号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subTypeName" label="模板状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subTypeName" label="可预约设备数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑预约模板" placement="top" effect="dark">
            <svg-icon icon-class="bianji" class="icon-bianji" />
          </el-tooltip>
          <el-tooltip content="开启/关闭" placement="top" effect="dark">
            <el-switch v-model="scope.row.switchStatus" class="change-reserve-status"></el-switch>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <svg-icon icon-class="shanchu" class="icon-shanchu" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-right">
      <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modlePageMixin from '@/mixins/modlePageMixin';
import { deviceColorStatus, deviceStatus } from '@/utils/mapping';
import { manageSimpleListFun } from '@/service/shop';
export default {
  mixins: [modlePageMixin],
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
    return {};
  },
  components: {},
  filters: {
    deviceStatus: val => {
      return deviceStatus[val];
    }
  },
  computed: {
    classObject: function() {
      return function(value) {
        return `background:${deviceColorStatus[value]}`;
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
.pagination-right {
  padding: 24px 0;
}
.change-reserve-status {
  margin-right: 10px;
  vertical-align: top;
}
</style>


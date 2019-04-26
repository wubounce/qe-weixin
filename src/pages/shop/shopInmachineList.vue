<template>
  <div class="shop-in-machine-list">
    <el-table :data="list" style="width: 100%">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="machineName" label="设备名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="machineTypeName" label="设备类型"></el-table-column>
      <el-table-column prop="subTypeName" label="设备型号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="machineState" label="设备状态">
        <template slot-scope="scope">
          <div>
            <span class="status-clire" :style="classObject(scope.row.machineState)"></span>{{scope.row.machineState | deviceStatus}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
    </el-table>
    <div class="pagination-right">
      <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
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
    async _getList(row) {
      let payload = Object.assign({ shopId: this.shopId }, this.searchData);
      let res = await manageSimpleListFun(payload);
      this.list = res.items || [];
      this.total = res.total;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.shop-in-machine-list {
  .pagination-right {
    padding: 24px 0;
  }
}
</style>

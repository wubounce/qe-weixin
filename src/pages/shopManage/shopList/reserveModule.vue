<template>
  <el-dialog title="预约模块" :visible="visible" :before-close="modalClose" :close="modalClose" width="1100px">
    <el-table :data="list" max-height="600" style="width: 100%;padding-bottom: 30px;">
      <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
      <el-table-column prop="parentTypeName" label="设备类型"></el-table-column>
      <el-table-column prop="subTypeName" label="设备型号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ifOpen" label="模板状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ifOpen | ifOpenType}}
        </template>
      </el-table-column>
      <el-table-column prop="canAppointMachineCount" label="可预约设备数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑预约模板" placement="top" effect="dark">
            <svg-icon icon-class="bianji" class="icon-bianji" @click="editReserveTemplate(scope.row)" />
          </el-tooltip>
          <el-tooltip content="开启/关闭" placement="top" effect="dark">
            <el-switch v-model="scope.row.ifOpenStatus" class="change-reserve-status" @change="setModuleIsOpen(scope.row)"></el-switch>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="dark">
            <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDeleteModule(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getReserveModuleListFun, setModuleIsOpenFun, delModuleFun } from '@/service/shop';
import { ifOpenType } from '@/utils/mapping';
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
  filters: {
    ifOpenType(val) {
      return ifOpenType[val];
    }
  },
  created() {
    this.getReserveModuleList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false);
    },
    async getReserveModuleList(row) {
      let payload = Object.assign({ shopId: this.shopId }, this.searchData);
      let res = await getReserveModuleListFun(payload);
      this.list = res.items || [];
      this.list.forEach(item => {
        item.ifOpen === 0 ? this.$set(item, 'ifOpenStatus', true) : this.$set(item, 'ifOpenStatus', false);
      });
    },
    editReserveTemplate(row) {
      this.modalClose();
      this.$emit('doEditReserveTemplate', row);
    },
    async setModuleIsOpen(row) {
      if (row.ifOpenStatus === true) {
        row.ifOpen = 0;
      } else {
        row.ifOpen = 1;
      }
      let payload = Object.assign({}, { id: row.id, ifOpen: row.ifOpen });
      await setModuleIsOpenFun(payload);
      this.$Message.success('操作成功');
    },
    handleDeleteModule(row) {
      this.$confirm('您确定要删除该预约模板?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        delModuleFun({ id: row.id }).then(() => {
          this.$message.success('删除成功');
          this.getReserveModuleList();
          this.$listeners.getShopDataToTable && this.$listeners.getShopDataToTable();
        });
      });
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


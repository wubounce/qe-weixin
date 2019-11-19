<template>
  <el-dialog title="打印" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="794">
    <div class="print-content" align="center" ref="print">
      <el-table :data="tableData" border style="width: 100%">
        <template v-for="(col, index) in columns">

          <slot v-if="col.slot" :name="col.slot"></slot>

          <el-table-column v-else :key="index" :prop="col.prop" :label="col.label" :width="col.width" :formatter="col.formatter" align="center">
          </el-table-column>
        </template>
      </el-table>
    </div>
    <el-button type="primary" class="no-print" @click="doPrint">打印</el-button>
    <el-button class="no-print" @click="modalClose">取消</el-button>
  </el-dialog>
</template>

  <script>
export default {
  name: 'printTable',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    doPrint() {
      this.$print(this.$refs.print);
    }
  }
};
</script>
<style lang="scss" scoped>
.print-content {
  text-align: center;
  text-align: center;
  margin: 0 auto;
  /deep/ .el-table .cell {
    line-height: 20px !important;
  }
}
@media print {
  @page {
    margin: 1cm;
  }
  body {
    padding: 0;
    margin: 0;
    font-family: 'Microsoft Yahei', 'Times New Roman', serif;
    font-size: 12pt;
    text-align: center;
  }
  .no-print {
    display: none;
  }
}
</style>
<template>
  <div class="pagination-right">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pagesize" :layout="layout" :total="total">
    </el-pagination>
  </div>
</template>
<script>
import PagerMixin from "@/mixins/PagerMixin";
export default {
  mixins: [PagerMixin],
  props: ['total'],
  data () {
    return {
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.searchData.page = val;
      this.$emit('pagination', this.searchData);
    },
    handleSizeChange (pageSize) {
      this.searchData.pageSize = pageSize;
      this.$emit('pagination', this.searchData);
    }
  },
};
</script>
<style lang="scss">
.pagination-right {
  margin-top: 16px !important;
  width: 100%;
  overflow: hidden;
  .el-pagination {
    float: right;
  }
}
</style>


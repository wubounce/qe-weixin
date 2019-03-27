<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size === 'medium'" command="medium">
        Medium
      </el-dropdown-item>
      <el-dropdown-item :disabled="size === 'small'" command="small">
        Small
      </el-dropdown-item>
      <el-dropdown-item :disabled="size === 'mini'" command="mini">
        Mini
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    size () {
      return this.$store.getters.size;
    }
  },
  methods: {
    handleSetSize (size) {
      this.$ELEMENT.size = size;
      this.$store.dispatch("setSize", size);
      this.refreshView();
      this.$message.success("切换成功");
    },
    refreshView () {
      // In order to make the cached page re-rendered
      this.$store.dispatch("delAllCachedViews", this.$route);
      // 由于已经加载过设置 需要刷新此页面
      this.$router.go(0);
    }
  }
};
</script>

<style scoped>
.size-icon {
  font-size: 25px;
  cursor: pointer;
  vertical-align: -5px !important;
}
</style>

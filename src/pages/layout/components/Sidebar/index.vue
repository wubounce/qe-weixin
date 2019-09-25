<template>
  <div>
    <div class="el-logo">
      <svg-icon icon-class="logo" /><span class="erp-title">企鹅商家管理平台</span>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :show-timeout="200" :default-active="onRoutes" :collapse="isCollapse" mode="vertical" :unique-opened="true" :active-text-color="variables.$menuText">
        <sidebar-item v-for="route in permission_routes" :key="route.menuId" :item="route" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem';
import variables from '@/styles/variables.scss';
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar', 'permission_routes']),
    onRoutes() {
      return this.$route.path === '/index' ? '/' : this.$route.path;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style lang="scss" scoped>
@import '~@//styles/variables.scss';
.el-logo {
  height: 54px;
  background: $menuText;
  margin-bottom: 16px;
  .svg-icon {
    display: block;
    width: 70px;
    height: 40px;
    padding-top: 11px;
    float: left;
  }
  .erp-title {
    font-size: 18px;
    color: #fff;
    line-height: 54px;
  }
}
</style>

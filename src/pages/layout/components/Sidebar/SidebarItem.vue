<template>
  <div class="menu-wrapper">
    <el-submenu v-if="item.children && item.children.length > 0" :index="item.name">
      <template slot="title">
        <svg-icon :icon-class="item.icon" />
        <span slot="title">{{ item.name }}</span>
      </template>
      <template v-for="child in item.children">
        <router-link :to="resolvePath(item.url,child.url)" :key="child.name">
          <el-menu-item :index="resolvePath(item.url,child.url)">
            <span slot="title">{{ child.name }}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>
    <template v-else>
      <router-link :to="resolvePath('',item.url)" :key="item.name">
        <el-menu-item :index="resolvePath('',item.url)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <svg-icon :icon-class="item.icon" />
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
import path from 'path';
import { isExternal } from '@/utils/validate';
export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      onlyOneChild: null
    };
  },
  methods: {
    resolvePath(basePath, routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return path.resolve(basePath, routePath);
    }
    // hasOneShowingChild(children, parent) {
    //   const showingChildren = children.filter(item => {
    //     if (item.hidden) {
    //       return false;
    //     } else {
    //       // Temp set(will be used if only has one showing child)
    //       this.onlyOneChild = item;
    //       return true;
    //     }
    //   });
    //   // When there is only one child router, the child router is displayed by default
    //   if (showingChildren.length === 1) {
    //     return true;
    //   }
    //   // Show parent if there are no child router to display
    //   if (showingChildren.length === 0) {
    //     this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
    //     return true;
    //   }
    //   return false;
    // },
    // resolvePath(routePath) {
    //   if (this.isExternalLink(routePath)) {
    //     return routePath;
    //   }
    //   return path.resolve(this.basePath, routePath);
    // },
    // isExternalLink(routePath) {
    //   return isExternal(routePath);
    // }
  }
};
</script>
<style lang="scss" scoped>
.menu-wrapper {
  .svg-icon {
    margin-right: 11px;
  }
}
</style>


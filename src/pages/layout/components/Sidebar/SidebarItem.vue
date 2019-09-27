<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)">
      <router-link :to="resolvePath('',item.path)" :key="item.name" @click.native="flushCom('',item.path)">
        <el-menu-item :index="resolvePath('',item.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <svg-icon :icon-class="item.meta.icon" />
          <span slot="title">{{ item.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
    <el-submenu v-else :index="item.name">
      <template slot="title">
        <svg-icon :icon-class="item.meta.icon" />
        <span slot="title">{{ item.meta.title }}</span>
      </template>
      <template v-for="child in item.children">
        <router-link :to="resolvePath(item.path,child.path)" @click.native="flushCom(item.path,child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(item.path,child.path)">
            <span slot="title">{{ child.meta.title }}</span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>

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
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.meta.title === '首页') {
          this.onlyOneChild = item;
          return true;
        } else {
          // Temp set(will be used if only has one showing child)
          return false;
        }
      });
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(basePath, routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return path.resolve(basePath, routePath);
    },
    flushCom: function(basePath, routePath) {
      this.$router.push({
        path: path.resolve(basePath, routePath),
        query: {
          t: +new Date()
        }
      });
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


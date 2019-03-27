<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link v-for="tag in visitedViews" ref="tag" :class="isActive(tag) ? 'active' : ''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" :key="tag.path" tag="span" class="tags-view-item" @click.middle.native="closeSelectedTag(tag)">
        {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </scroll-pane>
    <div class="close-con close-btn">
      <span class="el-icon-circle-close-outline" @click="visible = true"></span>
    </div>
    <ul v-show="visible" class="contextmenu">
      <!-- <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li @click="closeSelectedTag(selectedTag)">关闭</li> -->
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "@/components/ScrollPane";
export default {
  components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route () {
      this.addViewTags();
    },
    visible (value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted () {
    this.addViewTags();
  },
  methods: {
    isActive (route) {
      return route.path === this.$route.path;
    },
    addViewTags () {
      const { name, path, query, params, meta, fullPath } = this.$route;
      this.$store.dispatch("addView", {
        name,
        path,
        query,
        params,
        meta,
        fullPath
      });
      // return false;
    },
    refreshSelectedTag (view) {
      this.$store.dispatch("delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag (view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    closeOthersTags () {
      let pic = this.visitedViews.find(item => {
        return item.path === this.$route.path;
      });
      this.$router.push(pic);
      this.$store.dispatch("delOthersViews", pic).then(() => { });
    },
    closeAllTags () {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    openMenu (tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right
      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu () {
      this.visible = false;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@//styles/variables.scss";
.tags-view-container {
  height: 40px;
  width: 100%;
  border-bottom: 1px solid #d8dce5;
  background: #f0f0f0;
  -webkit-box-shadow: 0 0 3px 2px hsla(0, 0%, 39.2%, 0.1) inset;
  box-shadow: inset 0 0 3px 2px hsla(0, 0%, 39.2%, 0.1);
  position: relative;
  .close-con {
    position: absolute;
    top: 0;
    height: 100%;
    background: #fff;
    z-index: 10;
    width: 32px;
    text-align: center;
    span {
      display: inline-block;
      margin-top: 11px;
      color: #515a6e;
    }
  }
  .close-btn {
    right: 0;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 32px;
  }
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 6px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: $menuText;
        color: #fff;
        border-color: $menuText;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 9999;
    position: absolute;
    right: 0px;
    top: 34px;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      font-size: 12px;
      margin-left: 10px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        display: inline-block;
      }
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>

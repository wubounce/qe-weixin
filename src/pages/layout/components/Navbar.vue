<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-tooltip :content="'全屏'" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>
        <el-tooltip :content="'布局大小'" effect="dark" placement="bottom">
          <size-select class="international right-menu-item" />
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="static/image/logo.svg" class="user-avatar" /><span style="display: inline-block;line-height:54px;">{{userInfoIn.realName}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>消息中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import { getUserInfoInLocalstorage } from '@/utils/auth';
export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,

  },
  computed: {
    ...mapGetters(["sidebar", "name", "avatar", "device"])
  },
  data () {
    return {
      userInfoIn: getUserInfoInLocalstorage() ? getUserInfoInLocalstorage() : {}
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch("ToggleSideBar");
    },
    logout () {
      this.$store.dispatch("FedLogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 54px;
  line-height: 54px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 54px;
    height: 54px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 23px;
          background: #ef5657;
          float: left;
          margin-top: 14px;
          margin-right: 5px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

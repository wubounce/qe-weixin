<template>
  <div class="shop-filter" v-show="visibleModel">
    <div class=" el-select-dropdown el-popper" x-placement="bottom-start">
      <div class="el-scrollbar">
        <div style="margin-right: -17px;">
          <div class="shop-search-text" style="">
            <el-input v-model="state" suffix-icon="el-icon-search" placeholder="请输入店铺关键字搜索" @input="getSearchShop"></el-input>
          </div>
          <ul class="el-scrollbar__view">
            <el-checkbox-group v-model="checkedList">
              <li v-for="(item,index) in shopList" :key="index" :class="['shop-list',{'checked-active':item.active}]">
                <el-checkbox :label="item.shopId" @change="handleCheakedBg(item,index)">{{item.shopName}}</el-checkbox><span></span>
              </li>
            </el-checkbox-group>
          </ul>
          <div class="action">
            <p>
              <span style="margin-right:24px;color:rgba(0,0,0,0.65);" @click="resetCheckedShop">重置</span>
              <span @click="getCheckedShop">确定</span>
            </p>
          </div>
        </div>
      </div>
      <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopListFun } from '@/service/report';
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      state: '',
      checkedList: this.value,
      checkedListName: [],
      shopList: [],
      shopListBak: [],
      visibleModel: this.visible
    }
  },
  created () {
    this.getShopList()
  },
  methods: {
    async getShopList (shopName = '') {
      let payload = { shopName: shopName }
      let res = await shopListFun(payload);
      this.shopList = res;
      this.shopListBak = res;
    },
    handleCheakedBg (item, val) {
      if (item.active) {
        this.$set(item, 'active', false);//为item添加不存在的属性，需要使用vue提供的Vue.set( object, key, value )方法。 
      } else {
        this.$set(item, 'active', true);
      }
    },
    getSearchShop (val) {
      console.log(val)
      this.getShopList(val)
    },
    resetCheckedShop () {
      this.checkedList = []
      this.checkedListName = []
      this.shopList = this.shopList.map(item => {
        return { shopId: item.shopId, shopName: item.shopName, active: false }
      });
      this.$emit('input', this.checkedList);
      this.$emit("getShopFilterName", this.checkedListName);
    },
    getCheckedShop () {
      this.visibleModel = false;
      this.checkedListName = this.shopList.filter(v => this.checkedList.some(k => k == v.shopId)).map(item => item.shopName);
      this.$emit('input', this.checkedList);
      this.$emit('getShopFilterName', this.checkedListName, this.visibleModel);
    }
  },
  watch: {
    visible: function (val) {
      this.visibleModel = val;
    },
    value: function (val) {
      this.checkedList = val;
      this.shopList = this.shopList.map(item => {
        return { shopId: item.shopId, shopName: item.shopName, active: false }
      });
    },
  },
}
</script>
<style lang="scss">
.shop-search-text {
  width: 233px;
  padding: 16px 41px 16px 24px;
  .el-input {
    width: 233px;
  }
  .el-input__inner {
    width: 230px !important;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/variables.scss";
.shop-filter {
  min-width: 280px;
  transform-origin: center top;
  z-index: 2009;
  position: absolute;
  left: 0px;
  top: 30px;
}
.el-select-dropdown__item {
  padding: 0 24px;
  height: 34px;
}
.el-scrollbar__wrap {
  overflow: hidden;
}
.el-scrollbar__view {
  height: 280px;
  overflow-y: scroll;
}

.shop-list {
  width: 281px;
  height: 34px;
  line-height: 34px;
  padding: 0 24px;
}
.action {
  padding: 16px 41px 16px 24px;
  font-size: 14px;
  color: $menuText;
  cursor: pointer;
  p {
    padding-top: 16px;
    border-top: 1px solid $under_line;
    text-align: right;
  }
}
.checked-active {
  background: $activeBg;
}
</style>

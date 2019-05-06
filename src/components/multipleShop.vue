<template>
  <div class="multiple-shop-page">
    <span :class="['filter-shop',{'filter-shop-selected':shopFilterName}]" @click="getFilterShop">{{shopFilterName?shopFilterName:placeholder}}
      <svg-icon icon-class="xialajiantouxia" class="filter-shop-arrow" /></span>
    <transition name="el-zoom-in-top">
      <div class="el-select-dropdown el-popper" v-show="visibleModel" x-placement="bottom-start" style="width:565px;">
        <div class="el-scrollbar">
          <div>
            <div class="all-content">
              <div class="all-content-left">
                <div class="shop-search-text">
                  <el-input v-model="state" suffix-icon="el-icon-search" placeholder="请输入店铺关键字搜索" @input="getSearchShop"></el-input>
                </div>
                <ul class="el-scrollbar__view">
                  <el-checkbox-group v-model="checkedList">
                    <li v-for="(item,index) in shopList" :key="index" :class="['shop-list',{'checked-active':item.active}]">
                      <el-checkbox :label="item.shopId" @change="handleCheakedBg(item,index)">{{item.shopName}}</el-checkbox><span></span>
                    </li>
                  </el-checkbox-group>
                </ul>
              </div>
              <div class="checked-shop-list">
                <h3>已选店铺 ({{checkedList.length}})</h3>
                <ul class="el-scrollbar__view" style="margin-right: -17px;">
                  <li v-for="(item,index) in checkedListName" :key="index" :class="['shop-list',{'checked-active':item.active}]">{{item}}
                    <svg-icon icon-class="erjiguanbi" class="close-icon" @click="deleteCheckedSHop(item,index)" />
                  </li>
                </ul>
              </div>
            </div>
            <div class="action">
              <p>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" style="float:left">全选</el-checkbox>
                <span style="margin-right:24px;color:rgba(0,0,0,0.65);" @click="resetCheckedShop">重置</span>
                <span @click="getCheckedShop">确定</span>
              </p>
            </div>
          </div>
        </div>
        <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopListFun } from '@/service/member';
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isTimeMaket: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shopFilterName: '',
      state: '',
      checkedList: this.value,
      checkedListName: [],
      isEditTime: this.isTimeMaket,
      shopList: [],
      allShopList: [],
      visibleModel: this.visible,
      checkAll: false,
      isIndeterminate: true,
      shopTypeIds: []
    };
  },
  created() {
    this.getShopList();
  },
  methods: {
    getFilterShop() {
      this.visibleModel = true;
    },
    async getShopList(shopName = this.state, isTimeMaket = this.isEditTime) {
      let payload = { shopName: shopName, timeId: isTimeMaket };
      let res = await shopListFun(payload);
      if (!shopName) this.allShopList = res;
      this.shopTypeIds = res.map(item => item.shopId);
      this.shopList = res;
      this.checkedListName = this.getCheckedListName();
      this.allShopList.forEach(v => this.checkedList.some(k => (k == v.shopId ? this.$set(v, 'active', true) : this.$set(v, 'active', false))));
      this.shopFilterName = this.checkedListName.join(',');
      this.indeterminateStatus();
    },
    indeterminateStatus() {
      //全选反选状态
      let checkedCount = this.checkedList.length;
      this.checkAll = checkedCount === this.shopTypeIds.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.shopTypeIds.length;
    },
    getCheckedListName() {
      return this.allShopList.filter(v => this.checkedList.some(k => k == v.shopId)).map(item => item.shopName);
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? [...this.checkedList, ...this.shopTypeIds] : [...this.checkedList];
      this.isIndeterminate = false;
      this.shopList.forEach(item => {
        val ? this.$set(item, 'active', true) : this.$set(item, 'active', false);
      });
      this.checkedListName = this.getCheckedListName();
    },
    handleCheakedBg(item, val) {
      item.active ? this.$set(item, 'active', false) : this.$set(item, 'active', true);
      this.indeterminateStatus(val);
      this.checkedListName = this.getCheckedListName();
    },
    deleteCheckedSHop(shopname, index) {
      this.checkedListName.splice(index, 1);
      this.checkedList = this.allShopList.filter(v => this.checkedListName.some(k => k == v.shopName)).map(item => item.shopId);
      this.shopList.forEach(item => {
        if (item.shopName === shopname) this.$set(item, 'active', false);
      });
      this.indeterminateStatus();
    },
    getSearchShop(val) {
      this.getShopList();
    },
    resetCheckedShop() {
      this.checkedList = [];
      this.checkedListName = [];
      this.shopFilterName = '';
      this.state = '';
      this.shopList = this.allShopList.map(item => {
        return { shopId: item.shopId, shopName: item.shopName, active: false };
      });
      this.$emit('input', this.checkedList);
      this.$emit('change', this.checkedList);
      this.visibleModel = false;
    },
    getCheckedShop() {
      this.checkedListName = this.getCheckedListName();
      this.shopFilterName = this.checkedListName.join(',');
      this.$emit('input', this.checkedList);
      this.$emit('change', this.checkedList);
      this.visibleModel = false;
    }
  },
  watch: {
    value: function(val) {
      this.checkedList = val;
      // this.getShopList();
    },
    isTimeMaket: function(val) {
      this.isEditTime = val;
      this.getShopList();
    }
  }
};
</script>
<style lang="scss">
.shop-search-text {
  width: 233px;
  padding: 16px 24px;
  .el-input {
    width: 233px !important;
  }
  .el-input__inner {
    width: 230px !important;
  }
}
.multiple-shop-page .shop-list .el-checkbox__label {
  font-size: 12px !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.filter-shop {
  display: inline-block;
  width: 220px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  line-height: 32px;
  padding: 0 3px;
  color: #c0c4cc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.filter-shop-selected {
  color: #606266;
}
.filter-shop-arrow {
  width: 10px;
  float: right;
  margin-right: 12px;
  margin-top: 8px;
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
.all-content {
  width: 100%;
  overflow: hidden;
  display: flex;
  > div {
    flex: 1;
  }
}
.shop-list {
  width: 281px;
  height: 34px;
  line-height: 34px;
  padding: 0 24px;
  font-size: 12px;
}
.action {
  padding: 16px 24px;
  font-size: 12px;
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
.checked-shop-list {
  h3 {
    height: 32xp;
    line-height: 32px;
    padding: 16px 24px;
    font-weight: normal;
    font-size: 14px;
  }
}
.close-icon {
  float: right;
  font-size: 10px;
  margin-top: 12px;
  margin-right: 17px;
  cursor: pointer;
}
</style>

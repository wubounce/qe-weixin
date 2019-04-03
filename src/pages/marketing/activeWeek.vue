<template>
  <div class="shop-filter" v-show="visibleModel">
    <div class=" el-select-dropdown el-popper" x-placement="bottom-start">
      <div class="week">
        <el-checkbox-group v-model="weekCheckList">
          <el-checkbox v-for="(item,index) in  weekTitle" :key="index" :value="item.value" :label="item.label"></el-checkbox>
        </el-checkbox-group>
        <div class="action">
          <span @click="getCheckedShop">确定</span>
        </div>
      </div>
      <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
      visibleModel: this.visible,
      weekCheckList: [],
      weekTitle: [
        { value: '1', label: '周一' },
        { value: '2', label: '周二' },
        { value: '3', label: '周三' },
        { value: '4', label: '周四' },
        { value: '5', label: '周五' },
        { value: '6', label: '周六' },
        { value: '0', label: '周日' }
      ],
    }
  },
  created () {
  },
  methods: {
    changeWeek () {
      this.showWeekModel = true;
    }
  },
  watch: {
    visible: function (val) {
      this.visibleModel = val;
    },
  }

}
</script>
<style lang="scss">
.week .el-checkbox {
  margin: 0 20px !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "~@/styles/variables.scss";
.shop-filter {
  margin-left: 190px;
}
.week {
  width: 150px;
}
.action {
  border-top: 1px solid #e8e8e8;
  text-align: right;
  margin: 0 20px;
  color: $menuText;
  cursor: pointer;
}
</style>

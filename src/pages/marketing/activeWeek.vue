<template>
  <transition name="el-zoom-in-top">
    <div class="shop-filter" v-show="visibleModel">
      <div class=" el-select-dropdown el-popper" x-placement="bottom-start">
        <div class="week">
          <el-checkbox-group v-model="customWeekCheckList">
            <el-checkbox name="customWeekCheckList" v-for="(item,index) in  weekTitle" :key="index" :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
          <div class="action">
            <span @click="getCustomCheckedWeek" style="margin-right:24px;">确定</span>
            <span style="color:rgba(0,0,0,0.65);" @click="resetCheckedWeek">取消</span>
          </div>
        </div>
        <div x-arrow="" class="popper__arrow" style="left: 35px;"></div>
      </div>
    </div>
  </transition>
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
  data() {
    return {
      visibleModel: this.visible,
      customWeekCheckList: [],
      weekTitle: [{ value: '1', label: '周一' }, { value: '2', label: '周二' }, { value: '3', label: '周三' }, { value: '4', label: '周四' }, { value: '5', label: '周五' }, { value: '6', label: '周六' }, { value: '0', label: '周日' }]
    };
  },
  created() {},
  methods: {
    getCustomCheckedWeek() {
      this.visibleModel = false;
      this.$emit('getcustomWeekCheckList', this.customWeekCheckList, this.visibleModel);
    },
    resetCheckedWeek() {
      this.customWeekCheckList = [];
      this.visibleModel = false;
      this.$emit('getcustomWeekCheckList', this.customWeekCheckList, this.visibleModel);
    }
  },
  watch: {
    visible: function(val) {
      this.visibleModel = val;
    }
  }
};
</script>
<style lang="scss">
.week .el-checkbox {
  margin: 0 20px !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
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

<template>
  <div class="active-week-page" v-clickoutside="handleClose">
    <el-radio v-model="activeWeek" :label="9" @click.native="changeCustomWeekVisible(9)">每天</el-radio>
    <el-radio v-model="activeWeek" :label="8" @click.native="changeCustomWeekVisible(8)">周一～周五</el-radio>
    <el-radio v-model="activeWeek" :label="10" @click.native="changeCustomWeekVisible(10)">自定义</el-radio>
    <transition name="el-zoom-in-top" v-if="visibleModel">
      <div class="shop-filter">
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
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeWeek: this.value,
      visibleModel: false,
      customWeekCheckList: [],
      weekTitle: [{ value: '1', label: '周一' }, { value: '2', label: '周二' }, { value: '3', label: '周三' }, { value: '4', label: '周四' }, { value: '5', label: '周五' }, { value: '6', label: '周六' }, { value: '0', label: '周日' }]
    };
  },
  created() {
    let tmpWeekList = this.activeWeek ? this.activeWeek.split(',') : [];
    if (Number(this.activeWeek) !== 8 && Number(this.activeWeek) !== 9 && tmpWeekList.length > 1) {
      this.customWeekCheckList = this.activeWeek ? this.activeWeek.split(',') : [];
      this.activeWeek = 10;
    } else {
      this.activeWeek = Number(this.value);
    }
  },
  methods: {
    handleClose(e) {
      this.customWeekCheckList = [];
      this.visibleModel = false;
    },
    changeCustomWeekVisible(val) {
      this.activeWeek = val;
      if (val === 10) {
        this.visibleModel = true;
      } else {
        this.customWeekCheckList = [];
        this.$emit('input', this.activeWeek);
        this.visibleModel = false;
      }
    },
    getCustomCheckedWeek() {
      if (this.activeWeek === 10) {
        let comWeeek = this.customWeekCheckList.join(',');
        this.$emit('input', comWeeek);
      } else {
        this.$emit('input', this.activeWeek);
      }
      this.visibleModel = false;
    },
    resetCheckedWeek() {
      this.customWeekCheckList = [];
      this.visibleModel = false;
      this.$emit('input', '');
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
  position: relative;
  z-index: 99999;
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

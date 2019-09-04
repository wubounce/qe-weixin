<template>
  <el-dialog :title="addOrEditMaketTitle" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="620px" height="768px">
    <el-form ref="addMaketFrom" :model="addMaketFrom" :rules="addMaketFromRules" class="add-shop-from" label-width="125px">
      <el-form-item label="适用店铺：" prop="shopIds">
        <multiple-shop v-model="addMaketFrom.shopIds" @change="getShopFilter" :isTimeMaket="isTimeMaket" placeholder="请选择店铺"></multiple-shop>
      </el-form-item>
      <el-form-item label="适用类型：" prop="parentTypeIds">
        <el-select v-model="addMaketFrom.parentTypeIds" placeholder="请先选择店铺" :disabled="hasShop" v-if="machineParentType.length>0">
          <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
          <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
        </el-select>
        <el-select placeholder="请先选择店铺" :disabled="hasShop" v-else>
          <span slot="empty" style="font-size: 12px;height: 80px;display: block;line-height: 80px;text-align: center;color: rgba(0,0,0,0.65);">此店铺下暂无设备</span>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠日期：" prop="date">
        <el-date-picker size="small" v-model="addMaketFrom.date" :picker-options="pickerOptions" type="daterange" align="right" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :default-time="['00:00:00', '23:59:59']"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动日：" class="shop-name active-date" prop="week">
        <active-week v-model="addMaketFrom.week"></active-week>
      </el-form-item>
      <el-form-item label="每日活动时段：" prop="time">
        <el-time-picker is-range v-model="addMaketFrom.time" placeholder="请选择" format="HH:mm" value-format="HH:mm"></el-time-picker>
      </el-form-item>
      <el-form-item label="优惠折扣：" prop="discount">
        <div class="add-discount">
          <div>
            <el-input v-model.trim="addMaketFrom.discount" placeholder="例：8.5" maxlength="3"></el-input>
            <span style="position: absolute;left: 125px;color:#bfbfbf;">折</span>
          </div>
          <div style="color:#bfbfbf;margin-left: 30px;">优惠折扣为用户支付时所享受的折扣</div>
        </div>
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onSubmitAddOrEditMaketFrom('addMaketFrom')">确定</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { addOruPdateFun, marketlistParentTypeIdFun, detailMarketFun } from '@/service/market';
import activeWeek from './activeWeek';
import multipleShop from '@/components/multipleShop';

export default {
  components: {
    activeWeek,
    multipleShop
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    limitedDiscountId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchData: {
        shopId: '',
        status: '',
        expired: ''
      },
      shopList: [],
      timeMaketingDataToTable: [],
      addOrEditMaketTitle: '新增优惠',
      isTimeMaket: '123',
      addMaketDialogVisible: false,
      pickerOptions: {
        disabledDate(time) {
          let now = new Date();
          let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();
          return time.getTime() < yesterday;
        }
      },
      addMaketFrom: {
        timeId: '',
        week: '',
        time: ['00:00', '23:59'],
        date: [],
        parentTypeIds: '',
        shopIds: [],
        discount: ''
      },
      addMaketFromRules: {
        shopIds: [{ required: true, type: 'array', trigger: 'blur', message: '请选择适用店铺' }],
        parentTypeIds: [{ required: true, trigger: 'change', message: '请填写适用类型' }],
        date: [{ required: true, type: 'array', trigger: 'change', message: '请选择优惠日期' }],
        week: [{ required: true, trigger: 'blur', message: '请选择活动日' }],
        time: [{ required: true, type: 'array', trigger: 'change', message: '请选择每日活动时间段' }],
        discount: [{ required: true, message: '折扣不能为空', trigger: 'blur' }, { pattern: /^([1-9]|[1-9](\.\d{0,1})|0\.[1-9])?$/, message: '折扣请填写1到9的数字,可保留一位小数', trigger: 'blur' }]
      },
      machineParentType: [],
      hasShop: true
    };
  },
  mounted() {
    if (this.limitedDiscountId) {
      this.isTimeMaket = '';
      this.getMaketDetail();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getMarketlistParentType() {
      //获取二级类型
      let payload = { shopIds: this.addMaketFrom.shopIds.join(',') };
      let res = await marketlistParentTypeIdFun(payload);
      this.machineParentType = res.length > 0 ? [{ parentTypeId: '全部', parentTypeName: '全部' }, ...res] : [];
    },
    getShopFilter(val) {
      this.addMaketFrom.parentTypeIds = '';
      if (val.length >= 1) {
        this.getMarketlistParentType();
      }
    },
    async getMaketDetail() {
      let payload = { timeId: this.limitedDiscountId };
      let res = await detailMarketFun(payload);
      let time = res.noTime.split('-');
      let startTime = res.noDiscountStart ? moment(res.noDiscountStart).format('YYYY-MM-DD') : '';
      let endTime = res.noDiscountEnd ? moment(res.noDiscountEnd).format('YYYY-MM-DD') : '';
      let beshop = [];
      let beshopIds = [];
      res.shop.forEach(item => {
        beshop.push(item.name);
        beshopIds.push(item.id);
      });
      this.addMaketFrom = {
        timeId: res.id,
        week: res.noWeek,
        time: [time[0], time[1]],
        date: [startTime, endTime],
        parentTypeIds: res.parentTypeMap && res.parentTypeIds ? res.parentTypeMap[0].parentTypeId : '全部',
        shopIds: beshopIds,
        discount: (res.discountVO / 10).toFixed(1)
      };
      this.getMarketlistParentType();
    },
    onSubmitAddOrEditMaketFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.addMaketFrom);
          payload.time = payload.time.join('-');
          payload.shopIds = payload.shopIds.join(',');
          payload.startTime = payload.date ? payload.date[0] : null;
          payload.endTime = payload.date ? payload.date[1] : null;
          payload.date = null;
          if (!payload.week) {
            this.$Message.error('请选择自定义活动日');
            return false;
          }
          payload.parentTypeIds = payload.parentTypeIds == '全部' ? '' : `'${payload.parentTypeIds}'`;
          addOruPdateFun(payload).then(() => {
            this.$Message.success('操作成功');
            this.modalClose();
            this.$listeners.getTimeMaketingDataToTable && this.$listeners.getTimeMaketingDataToTable();
          });
        }
      });
    }
  },
  watch: {
    'addMaketFrom.shopIds': {
      deep: true,
      handler: function(val) {
        val.length > 0 ? (this.hasShop = false) : (this.hasShop = true);
      }
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
  .action {
    padding-top: 16px;
    border-top: 1px solid $under_line;
    text-align: right;
  }
}
.add-discount {
  display: flex;
}
.active-date /deep/ .el-radio {
  margin-right: 0;
}
/deep/ .el-date-editor--daterange .el-icon-date:after {
  position: absolute;
  width: 160px !important;
  cursor: pointer;
}
</style>

<template>
  <el-dialog :title="addOrEditShopTitle" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="1100px" top="20px">
    <el-form ref="addShopFrom" :model="addShopFrom" :rules="addShopRules" class="add-shop-from" label-width="160px">
      <el-form-item label="店铺名称：" class="shop-name" prop="shopName">
        <el-input v-model.trim="addShopFrom.shopName" placeholder="店铺名称需为2-16个字，只支持中英文、_和-"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="shopType">
        <el-select v-model="addShopFrom.shopType" placeholder="请选择">
          <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择区域：" prop="areas" style="width:520px;">
        <Area v-model="addShopFrom.areas" @getAreaName="getAreaName" size="small" />
      </el-form-item>
      <el-form-item label="所在小区/大厦/学校：" class="map-search">
        <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <div class="el-form-item__error" v-show="!isposition">请填写所在小区/大厦/学校</div>
      </el-form-item>
      <el-form-item>
        <el-amap vid="amapDemo" :center="center" :zoom="zoom" :plugin="plugin" style="height: 320px;">
          <el-amap-marker :position="marker.position"></el-amap-marker>
        </el-amap>
      </el-form-item>
      <el-form-item label="详细地址：" class="shop-name" prop="address">
        <el-input v-model.trim="addShopFrom.address" placeholder="例：A座1005室"></el-input>
      </el-form-item>
      <el-form-item label="预约功能：" prop="isReserve">
        <el-col :span="4">
          <el-radio-group v-model="addShopFrom.isReserve" @change="offAndOnReserve">
            <el-radio name="type" label="0">开启</el-radio>
            <el-radio name="type" label="1">关闭</el-radio>
          </el-radio-group>
        </el-col>
        <el-col class="line" :span="1">|</el-col>
        <el-col :span="19">
          <el-form-item label="预约时长（分钟）：" prop="orderLimitMinutes">
            <el-input v-model.trim="addShopFrom.orderLimitMinutes" :placeholder="isOffAndOnReservePlaceholder" :disabled="isOffAndOnReserve"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="营业时间：" prop="workTime">
        <el-time-picker is-range v-model="addShopFrom.workTime" placeholder="请选择" format="HH:mm" value-format="HH:mm" :clearable="false"> </el-time-picker>
      </el-form-item>
      <el-form-item label="客服电话：" class="shop-name" prop="serviceTelephone">
        <el-input v-model.trim="addShopFrom.serviceTelephone" placeholder="请填写店铺客服电话"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitShopFrom('addShopFrom')">保存</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { shopTypeListFun, shopDetailFun, addOrEditShopFun } from '@/service/shop';
import Area from '@/components/Area';
export default {
  components: {
    Area
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    shopId: {
      type: String,
      default: ''
    }
  },
  data() {
    let self = this;
    const validateAres = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('请选择省市区'));
      } else {
        callback();
      }
    };
    return {
      shopTypeList: [],
      addShopDialogVisible: false,
      addOrEditShopTitle: '新增店铺',
      addShopFrom: {
        shopId: '',
        areas: [],
        isReserve: '0',
        workTime: ['00:00', '23:59'],
        shopName: '',
        shopType: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        address: '',
        lat: '',
        lng: '',
        orderLimitMinutes: '',
        organization: '',
        serviceTelephone: ''
      },
      isOffAndOnReserve: false,
      isOffAndOnReservePlaceholder: '请填写1-9数字',
      //地图 城市搜索
      searchName: '', // 搜索城市
      searchOption: {
        city: '',
        citylimit: true
      },
      center: [121.59996, 31.197646],
      lng: 0,
      lat: 0,
      zoom: 14,
      marker: {
        position: [121.5273285, 31.21515044]
        //icon: '../img/currentLocationCenter.png'
      },
      isposition: true,
      plugin: [
        {
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.marker.position = [self.lng, self.lat];
                  self.center = [self.lng, self.lat];
                  self.$nextTick();
                }
              });
            }
          }
        }
      ],
      addShopRules: {
        shopName: [{ required: true, trigger: 'blur', message: '请输入店铺名称' }, { pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_-]{2,16}$/, message: '店铺名称需为2-16个字，只支持中英文、_和-', trigger: 'blur' }],
        shopType: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
        areas: [{ type: 'array', required: true, message: '请选择省市区', trigger: 'change', validator: validateAres }],
        address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        orderLimitMinutes: [{ required: true, message: '请填写预约时长（分钟）', trigger: 'blur' }, { pattern: /^[1-9]+\d*$/, message: '预约时长请填写1到9的数字', trigger: 'blur' }],
        workTime: [{ required: true, message: '请选择营业时间', trigger: 'change' }],
        serviceTelephone: [{ pattern: /^[0-9]*$/, message: '客服电话需为纯数字', trigger: 'blur' }]
      }
    };
  },
  mounted() {
    if (this.shopId) {
      this.addOrEditShopTitle = '编辑店铺';
      this.getShopDetail();
    }
  },
  created() {
    this.getShopTypeList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getShopDetail() {
      let payload = { shopId: this.shopId };
      let res = await shopDetailFun(payload);
      this.addShopFrom.shopId = res.shopId;
      this.addShopFrom.isReserve = String(res.isReserve);
      this.addShopFrom.workTime = res.workTime.split('-');
      this.addShopFrom.shopName = res.shopName;
      this.addShopFrom.shopType = Number(res.shopTypeId);
      this.addShopFrom.provinceId = res.provinceId;
      this.addShopFrom.cityId = res.cityId;
      this.addShopFrom.districtId = res.districtId;
      this.addShopFrom.address = res.address;
      this.addShopFrom.lat = res.lat;
      this.addShopFrom.lng = res.lng;
      this.addShopFrom.orderLimitMinutes = res.orderLimitMinutes;
      this.addShopFrom.organization = res.organization;
      this.addShopFrom.serviceTelephone = res.serviceTelephone;
      // 地区组件
      this.addShopFrom.areas = [res.provinceId, res.cityId, res.districtId];
      // 地图相关
      this.center = [res.lng, res.lat];
      this.marker.position = [res.lng, res.lat];
      this.searchOption.city = res.cityName;
      this.offAndOnReserve(this.addShopFrom.isReserve);
    },
    async getShopTypeList() {
      this.shopTypeList = await shopTypeListFun();
    },
    //搜索城市获取经纬度
    onSearchResult(pois) {
      this.center = [pois[0].lng, pois[0].lat];
      this.marker.position = [pois[0].lng, pois[0].lat];
      this.addShopFrom.lng = pois[0].lng;
      this.addShopFrom.lat = pois[0].lat;
      this.addShopFrom.organization = pois[0].name;
      this.addShopFrom.lng && this.addShopFrom.lat ? (this.isposition = true) : (this.isposition = false);
    },
    offAndOnReserve(val) {
      if (val == 1) {
        this.isOffAndOnReserve = true;
        this.addShopRules.orderLimitMinutes[0].required = false;
        this.isOffAndOnReservePlaceholder = '开启预约功能可填';
        this.addShopFrom.orderLimitMinutes = '';
      } else {
        this.isOffAndOnReserve = false;
        this.addShopRules.orderLimitMinutes[0].required = true;
        this.isOffAndOnReservePlaceholder = '请填写1到9的数字';
      }
    },
    getAreaName(data) {
      if (data.length >= 2) {
        this.searchOption.city = data[1];
      }
    },
    onSubmitShopFrom(formName) {
      this.$refs[formName].validate(async valid => {
        this.addShopFrom.lng && this.addShopFrom.lat ? (this.isposition = true) : (this.isposition = false);
        if (valid && this.isposition) {
          let payload = Object.assign({}, this.addShopFrom);
          payload.workTime = payload.workTime.join('-');
          payload.provinceId = payload.areas[0];
          payload.cityId = payload.areas[1];
          payload.districtId = payload.areas[2];
          payload.areas = [];
          await addOrEditShopFun(payload);
          this.$Message.success('操作成功！');
          this.modalClose();
          this.$listeners.getShopDataToTable && this.$listeners.getShopDataToTable();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-vue-search-box-container {
  border-radius: 4px !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  width: 468px !important;
  height: 32px !important;
  line-height: 32px !important;
  z-index: 10000 !important;
}
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
}
.add-shop-from {
  .shop-name /deep/ .el-input__inner {
    width: 468px !important;
  }
  /deep/ .el-radio {
    margin-right: 15px;
  }
  /deep/ .el-radio + .el-radio {
    margin-left: 0px;
  }
}
/deep/.el-vue-search-box-container .search-box-wrapper .search-btn {
  display: none !important;
}
.map-search /deep/ .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>

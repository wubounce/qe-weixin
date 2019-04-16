<template>
  <div>
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="店铺名称：" prop="name">
        <el-input v-model="searchData.name" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="店铺类型：" prop="type">
        <el-select v-model="searchData.type" clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择区域：" prop="areas">
        <Area v-model="searchData.areas" size="small" default-option="不限" />
      </el-form-item>
      <el-form-item label="地址：" prop="address">
        <el-input v-model="searchData.address" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="addShopDialogVisible=true;">新增店铺</el-button>
        <el-button icon="el-icon-download">导出</el-button>
      </div>
      <el-table :data="shopDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="shopName" label="店铺名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookShopDetail(scope.row);detailDialogVisible = true;">{{scope.row.shopName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="count" label="店铺地址" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="shopType" label="店铺类型"></el-table-column>
        <el-table-column header-align="left" prop="machineCount" label="设备数量">
          <template slot-scope="scope">
            <span class="rowstyle" @click="getDeciveFromShop(scope.row)">{{scope.row.machineCount}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="profit" label="累计收益(元)"></el-table-column>
        <el-table-column header-align="left" prop="isReserve" label="预约功能">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isReserve">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <i class="el-icon-edit" @click="oneditShop(scope.row)"></i>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <i class="el-icon-delete" @click="handleDelete(scope.row.shopId)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 店铺详情 -->
      <el-dialog title="店铺详情" :visible.sync="detailDialogVisible" width="540px">
        <ul class="deatil-list">
          <li><span>店铺名称：</span>{{detailData.shopName}}</li>
          <li><span>店铺类型：</span>{{detailData.shopTypeName}}</li>
          <li><span>店铺地址：</span>{{detailData.provinceName}}{{detailData.cityName}}{{detailData.districtName}}{{detailData.address}}</li>
          <li><span>已有设备：</span>{{detailData.machineTypeNames?detailData.machineTypeNames:'暂无设备'}}</li>
          <li><span>预约功能：</span>{{detailData.isReserve | isReserveType}}</li>
          <li><span>预约时间：</span>{{detailData.orderLimitMinutes?detailData.orderLimitMinutes+'分钟':''}}</li>
          <li><span>营业时间：</span>{{detailData.workTime}}</li>
          <li><span>限时优惠：</span>{{detailData.isDiscount | isDiscountType}}</li>
          <li><span>VIP卡：</span>{{detailData.hasVip | isHasVipType}}</li>
          <li><span>VIP数量：</span>{{detailData.vipCount}}个</li>
          <li><span>客服电话：</span>{{detailData.serviceTelephone}}</li>
          <li><span>创建人：</span>{{detailData.createUser}}</li>
          <li><span>创建时间：</span>{{detailData.createTime}}</li>
        </ul>
      </el-dialog>
      <!-- 店铺设备数量 -->
      <el-dialog :title="deviceDialogTitle" :visible.sync="deviceDialogVisible" width="1100px">
        <el-table :data="deviceList" style="width: 100%" height="670">
          <el-table-column header-align="left" label="序号" width="60" type="index"></el-table-column>
          <el-table-column prop="machineName" label="设备名" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="machineTypeName" label="设备类型" width="180"></el-table-column>
          <el-table-column prop="address" min-width="180" label="设备型号" show-overflow-tooltip></el-table-column>
          <el-table-column prop="machineState" label="设备状态">
            <template slot-scope="scope">
              <div>
                <span class="status-clire" :style="classObject(scope.row.machineState)"></span>{{scope.row.machineState | deviceStatus}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="添加时间"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 新增编辑店铺 -->
      <el-dialog :title="addOrEditShopTitle" :visible.sync="addShopDialogVisible" @close="resetaddOrEditShopForm('addShopFrom')" width="1100px" top="20px">
        <el-form ref="addShopFrom" :model="addShopFrom" :rules="addShopRules" class="add-shop-from" label-width="150px" v-if="addShopDialogVisible">
          <el-form-item label="店铺名称：" class="shop-name" prop="shopName">
            <el-input v-model="addShopFrom.shopName" placeholder="店铺名称需为2-16个字，只支持中英文、_和-"></el-input>
          </el-form-item>
          <el-form-item label="店铺类型：" prop="shopType">
            <el-select v-model="addShopFrom.shopType" placeholder="请选择">
              <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择区域：" prop="areas" style="width:520px;">
            <Area v-model="addShopFrom.areas" size="small" default-option="不限" />
          </el-form-item>
          <el-form-item label="所在小区/大厦/学校：">
            <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
            <div class="el-form-item__error" v-show="!isposition">所在小区/大厦/学校</div>
          </el-form-item>
          <el-form-item>
            <el-amap vid="amapDemo" :center="center" :zoom="zoom" :plugin="plugin" style="height: 320px;">
              <el-amap-marker :position="marker.position"></el-amap-marker>
            </el-amap>
          </el-form-item>
          <el-form-item label="详细地址：" class="shop-name" prop="address">
            <el-input v-model="addShopFrom.address" placeholder="例：A座1005室"></el-input>
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
                <el-input v-model="addShopFrom.orderLimitMinutes" :placeholder="isOffAndOnReservePlaceholder" :disabled="isOffAndOnReserve"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="营业时间：" prop="workTime">
            <el-time-picker is-range v-model="addShopFrom.workTime" placeholder="请选择" value-format="HH:mm"> </el-time-picker>
          </el-form-item>
          <el-form-item label="客服电话：" class="shop-name" prop="serviceTelephone">
            <el-input v-model="addShopFrom.serviceTelephone" placeholder="请填写店铺客服电话"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitShopFrom('addShopFrom')">保存</el-button>
            <el-button @click="resetaddOrEditShopForm('addShopFrom')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopTypeListFun, manageListFun, shopDetailFun, addOrEditShopFun, deleteShopFun } from '@/service/shop';
import { deviceListFun } from '@/service/device';
import { isReserveType, isHasVipType, isDiscountType, deviceStatus, deviceColorStatus } from '@/utils/mapping';
import Pagination from '@/components/Pager';
import Area from '@/components/Area';
import PagerMixin from '@/mixins/PagerMixin';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    Area
  },
  data() {
    let self = this;
    return {
      searchData: {
        name: '',
        type: '',
        areas: [],
        address: ''
      },
      shopTypeList: [],
      shopDataToTable: [],
      detailDialogVisible: false,
      detailData: {},
      deviceDialogVisible: false,
      deviceList: [],
      deviceDialogTitle: '',
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
        areas: [{ type: 'array', required: true, message: '请选择区域', trigger: 'change' }],
        address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
        orderLimitMinutes: [{ required: true, message: '请填写预约时长（分钟）', trigger: 'blur' }, { pattern: /^[1-9]+\d*$/, message: '预约时长请填写1到9的数字', trigger: 'blur' }],
        workTime: [{ required: true, message: '请选择营业时间', trigger: 'change' }],
        serviceTelephone: [{ pattern: /^[0-9]*$/, message: '客服电话需为纯数字', trigger: 'blur' }]
      }
    };
  },
  filters: {
    isReserveType: val => {
      return isReserveType[val];
    },
    isHasVipType: val => {
      return isHasVipType[val];
    },
    isDiscountType: val => {
      return isDiscountType[val];
    },
    deviceStatus: val => {
      return deviceStatus[val];
    }
  },
  computed: {
    classObject: function() {
      return function(value) {
        return `background:${deviceColorStatus[value]}`;
      };
    }
  },
  mounted() {},
  created() {
    this.getShopTypeList();
    this.getShopDataToTable();
  },
  methods: {
    async getShopTypeList() {
      this.shopTypeList = await shopTypeListFun();
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getShopDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.getShopDataToTable();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.$refs[formName].resetFields();
      this.getShopDataToTable();
    },
    async getShopDataToTable() {
      let payload = Object.assign({}, this.searchData);
      payload.provinceId = payload.areas[0];
      payload.cityId = payload.areas[1];
      payload.districtId = payload.areas[2];
      payload.areas = [];
      let res = await manageListFun(payload);
      this.shopDataToTable = res.items;
      this.shopDataToTable.forEach(item => {
        if (item.isReserve === 0) {
          item.isReserve = true;
        } else {
          item.isReserve = false;
        }
      });
      this.total = res.total;
    },
    async lookShopDetail(row) {
      let payload = { shopId: row.shopId };
      let res = await shopDetailFun(payload);
      this.detailData = res;
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
      return Promise.resolve();
    },
    async getDeciveFromShop(row) {
      if (row.machineCount === 0) {
        return false;
      }
      this.deviceDialogTitle = row.shopName;
      let payload = { page: 1, pageSize: 9999, shopId: row.shopId };
      let res = await deviceListFun(payload);
      this.deviceDialogVisible = true;
      this.deviceList = res.page.items;
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
      } else {
        this.isOffAndOnReserve = false;
        this.addShopRules.orderLimitMinutes[0].required = true;
        this.isOffAndOnReservePlaceholder = '请填写1到9的数字';
      }
    },
    oneditShop(row) {
      this.lookShopDetail(row).then(() => {
        this.offAndOnReserve(this.addShopFrom.isReserve);
        this.addShopDialogVisible = true;
      });
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
          this.resetaddOrEditShopForm(formName);
          this.$Message.success('操作成功！');
          this.getShopDataToTable();
        } else {
          return false;
        }
      });
    },
    resetaddOrEditShopForm(formName) {
      this.$refs[formName].resetFields();
      this.isposition = true;
      this.addShopFrom.areas = [];
      this.addShopDialogVisible = false;
    },
    addOrEditShopfrom(formName) {
      this.resetaddOrEditShopForm(formName);
    },
    // 删除店铺
    handleDelete(shopId) {
      this.$confirm('您确定要删除该店铺?', '提示', {
        showClose: false
      }).then(() => {
        deleteShopFun({ shopId: shopId }).then(() => {
          this.$message.success('店铺删除成功');
          this.getShopDataToTable();
        });
      });
    }
  }
};
</script>
<style lang="scss">
.el-vue-search-box-container {
  border-radius: 4px !important;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.15) !important;
  width: 468px !important;
  height: 32px !important;
  line-height: 32px !important;
}
.add-shop-from {
  .shop-name .el-input__inner {
    width: 468px !important;
  }
  .el-radio {
    margin-right: 15px;
  }
  .el-radio + .el-radio {
    margin-left: 0px;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.deatil-list {
  padding-bottom: 15px;
  :last-child {
    border: none;
  }
  li {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid $under_line;
    span {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
    }
  }
}
.status-clire {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #2fc25b;
  opacity: 0.85;
  border-radius: 20px;
  margin-right: 8px;
}
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
 
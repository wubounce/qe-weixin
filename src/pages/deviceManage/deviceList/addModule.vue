<template>
  <el-dialog title="新增点位模型" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="540px" height="768px">
    <div class="pre-form" v-show="basicVisible">
      <el-form ref="addModuleFrom" :model="addModuleFrom" :rules="addModuleFormRules" class="add-shop-from" label-width="100px">
        <el-form-item label="所属店铺：" prop="orgId">
          <span>{{batchPoint.shopName}}</span>
        </el-form-item>
        <el-form-item label="区域：" prop="region">
          <el-select v-model="addModuleFrom.region" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'region','building', [ 'building','unit','floor','room'])})">
            <el-option v-for="(item,index) in childrenList.regionList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼号：" prop="building">
          <el-select v-model="addModuleFrom.building" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val,  'building','unit',[ 'unit','floor','room'])})">
            <el-option v-for="(item,index) in childrenList.buildingList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元：" prop="unit">
          <el-select v-model="addModuleFrom.unit" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'unit', 'floor', [ 'floor','room'])})">
            <el-option v-for="(item,index) in childrenList.unitList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="楼层：" prop="floor">
          <el-select v-model="addModuleFrom.floor" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val,  'floor','room',[ 'room'])})">
            <el-option v-for="(item,index) in childrenList.floorList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号：" prop="room">
          <el-select v-model="addModuleFrom.room" value-key="id" placeholder="请选择">
            <el-option v-for="(item,index) in childrenList.roomList" :key="index" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="action">
          <el-button type="primary" @click="goNext('addModuleFrom')">保存</el-button>
          <el-button @click="modalClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { batchEditTagFun, poitionListChildrenFun } from '@/service/point';
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    batchPoint: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      shopList: [],
      basicVisible: true,
      generateVisible: false,
      positionModelName: '',
      addModuleFrom: {
        region: {},
        building: {},
        unit: {},
        floor: {},
        room: {}
      },
      addModuleFormRules: {
        // region: [{ required: true, trigger: 'change', message: '请选择区域' }],
        // building: [{ required: true, trigger: 'change', message: '请选择楼号' }],
        // unit: [{ required: true, trigger: 'change', message: '请选择单元' }],
        // floor: [{ required: true, trigger: 'change', message: '请选择楼层' }],
        // room: [{ required: true, trigger: 'change', message: '房间号' }]
      },
      childrenList: {
        regionList: [],
        buildingList: [],
        unitList: [],
        floorList: [],
        roomList: []
      }
    };
  },
  mounted() {
    this.getRegion();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getRegion() {
      let payload = { orgId: this.batchPoint.shopId, parentId: 0 };
      let res = await poitionListChildrenFun(payload);
      this.childrenList.regionList = res || [];
    },
    async getChildren(item, optionName, childName, option) {
      let payload = { orgId: item.orgId, parentId: item.id };
      let res = await poitionListChildrenFun(payload);
      this.childrenList[childName + 'List'] = res || [];
      this.positionModelName = optionName;
      option.forEach(i => {
        this.addModuleFrom[i] = '';
      });
    },
    onSubmitPointForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.validateNames()) {
          let payload = Object.assign({}, this.batchPoint);
          payload.positionModelId = this.this.addModuleFrom[this.positionModelName].id || '';
          console.log(payload);
          batchEditTagFun(payload).then(() => {
            this.$Message.success('修改成功');
            this.modalClose();
            this.$listeners.getDeviceDataToTable && this.$listeners.getDeviceDataToTable();
          });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.pre-form {
  padding-top: 24px;
  padding-bottom: 24px;
  /deep/ .el-radio {
    margin-left: 0 !important;
    margin-right: 10px !important;
  }
  /deep/ .el-select,
  .el-input {
    width: 85% !important;
  }
  /deep/ .el-input__inner {
    width: 100% !important;
  }
}
.action {
  padding-top: 16px;
  padding-bottom: 27px;
  border-top: 1px solid $under_line;
  text-align: right;
}
.generate-area {
  .area-info {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    padding-top: 19px;
    padding-bottom: 16px;
    font-size: 14px;
    li {
      width: 50%;
      line-height: 32px;
      &:nth-child(2n + 2) {
        text-align: right;
      }
    }
  }
  .generate-num {
    background: #fcfcfc;
    padding: 15px 27px;
    margin-bottom: 25px;
    max-height: 361px;
    overflow: auto;
    h2 {
      text-align: center;
      font-weight: normal;
      color: #d8d8d8;
      padding-bottom: 30px;
      font-size: 16px;
    }
    .room-num {
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap;
      /deep/ .el-form-item {
        width: 60px !important;
        margin-left: 0 !important;
        margin-right: 50px;
        &:nth-child(4n + 4) {
          margin-right: 0px !important;
        }
        .el-form-item__content {
          margin: 0 !important;
        }
      }
      /deep/ .el-input__inner {
        width: 100% !important;
        border-top: none;
        border-left: none;
        border-right: none;
        border-radius: 0 !important;
        text-align: center;
        background: #fcfcfc;
      }
    }
  }
}
</style>

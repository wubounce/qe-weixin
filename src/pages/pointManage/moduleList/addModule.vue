<template>
  <el-dialog title="新增点位模型" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="540px" height="768px">
    <div class="pre-form" v-show="basicVisible">
      <el-form ref="addModuleFrom" :model="addModuleFrom" :rules="addModuleFormRules" class="add-shop-from" label-width="100px">
        <el-form-item label="所属店铺：" prop="orgId">
          <el-select v-model="addModuleFrom.orgId" filterable value-key="shopId" placeholder="请选择" @change="getRegion">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别：" prop="type">
          <el-radio-group v-model="addModuleFrom.type">
            <el-radio v-for="(name,id) in pointType" :label="(+id)" :key="id">{{name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="addModuleFrom.type===2">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'building')})">
              <el-option v-for="(item,index) in childrenList.regionList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===3">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'building')})">
              <el-option v-for="(item,index) in childrenList.regionList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'unit')})">
              <el-option v-for="(item,index) in childrenList.buildingList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===4">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'building')})">
              <el-option v-for="(item,index) in childrenList.regionList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'unit')})">
              <el-option v-for="(item,index) in childrenList.buildingList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元：" prop="unit">
            <el-select v-model="addModuleFrom.unit" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'floor')})">
              <el-option v-for="(item,index) in childrenList.unitList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===5">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'building')})">
              <el-option v-for="(item,index) in childrenList.regionList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'unit')})">
              <el-option v-for="(item,index) in childrenList.buildingList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元：" prop="unit">
            <el-select v-model="addModuleFrom.unit" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'floor')})">
              <el-option v-for="(item,index) in childrenList.unitList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼层：" prop="floor">
            <el-select v-model="addModuleFrom.floor" value-key="id" placeholder="请选择" @change="((val)=>{getChildren(val, 'room')})">
              <el-option v-for="(item,index) in childrenList.floorList" :key="index" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="数量：" prop="roomNum">
          <el-input v-model.trim.number="addModuleFrom.roomNum" placeholder="请输入数量" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item class="action">
          <el-button type="primary" @click="goNext('addModuleFrom')">保存</el-button>
          <el-button @click="modalClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="generate-area" v-show="generateVisible">
      <ul class="area-info">
        <li>{{addModuleFrom.orgId.shopName?'所属店铺：'+addModuleFrom.orgId.shopName:''}}</li>
        <li>{{addModuleFrom.region.name?'区域：'+addModuleFrom.region.name:''}}</li>
        <li>{{addModuleFrom.building.name?'楼号：'+addModuleFrom.building.name:''}}</li>
        <li>{{addModuleFrom.unit.name?'单元：'+addModuleFrom.unit.name:''}}</li>
        <li>{{addModuleFrom.floor.name?'楼层：'+addModuleFrom.floor.name:''}}</li>
      </ul>
      <el-form ref="addGenerateFrom" :model="addGenerateFrom" :rules="addGenerateFromRules" class="add-shop-from" label-width="100px">
        <div class="generate-num">
          <h2>生成的{{addModuleFrom.type | pointType}}</h2>
          <div class="room-num">
            <el-form-item v-for="(item,index) in addGenerateFrom.names" :key="index" :prop="'names.'+ index" :rules='addGenerateFromRules.name'>
              <el-input v-model.trim="addGenerateFrom.names[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item class="action">
          <el-button @click="goPrevious">上一步</el-button>
          <el-button type="primary" @click="onSubmitPointForm('addGenerateFrom')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { poitionAddFun, poitionListChildrenFun } from '@/service/point';
import { shopListFun } from '@/service/report';
import { pointType } from '@/utils/mapping';
export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      shopList: [],
      basicVisible: true,
      generateVisible: false,
      addModuleFrom: {
        orgId: {},
        parentId: 0,
        type: 1,
        region: {},
        building: {},
        unit: {},
        floor: {},
        roomNum: null
      },
      addModuleFormRules: {
        orgId: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value.id) {
                callback(new Error('请选择所属店铺'));
              } else {
                callback();
              }
            }
          }
        ],
        type: [{ required: true, trigger: 'change', message: '请选择类别' }],
        region: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value.id) {
                callback(new Error('请选择区域'));
              } else {
                callback();
              }
            }
          }
        ],
        building: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value.id) {
                callback(new Error('请选择楼号'));
              } else {
                callback();
              }
            }
          }
        ],
        unit: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value.id) {
                callback(new Error('请选择单元'));
              } else {
                callback();
              }
            }
          }
        ],
        floor: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (!value.id) {
                callback(new Error('请选择楼层'));
              } else {
                callback();
              }
            }
          }
        ],
        roomNum: [{ required: true, message: '数量不能为空', trigger: 'blur' }, { type: 'number', message: '数量必须为数字值', trigger: 'blur' }]
      },
      addGenerateFrom: {
        names: []
      },
      addGenerateFromRules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
  computed: {
    pointType() {
      return pointType;
    }
  },
  filters: {
    pointType(val) {
      return pointType[val];
    }
  },
  mounted() {
    this.getShopList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    async getRegion(item) {
      let payload = { orgId: item.id, parentId: 0 };
      let res = await poitionListChildrenFun(payload);
      this.childrenList.regionList = res || [];
    },
    async getChildren(item, name) {
      let payload = { orgId: item.orgId, parentId: item.id };
      let res = await poitionListChildrenFun(payload);
      this.childrenList[name + 'List'] = res || [];
    },
    goNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.basicVisible = false;
          this.generateVisible = true;
          this.generateNames();
        }
      });
    },
    generateNames() {
      // 生成区域,不允许重复
      let map = {
        1: '区域',
        2: '号楼',
        3: '单元',
        4: '楼',
        5: ''
      };
      let floor = 0;
      if (this.addModuleFrom.type === 5) {
        //生成房间数
        let floorName = this.addModuleFrom.floor.name || '';
        floor = floorName.replace(/[^0-9]/gi, '');
      }
      let start = this.getRepeatList(this.addModuleFrom.type).length || 0;
      let names = [];
      let len = start + this.addModuleFrom.roomNum;
      for (let i = start + 1; i <= len; i++) {
        let pad = i < 10 ? '0' : '';
        this.addModuleFrom.type === 5 ? names.push(floor + pad + (i + map[this.addModuleFrom.type])) : names.push(i + map[this.addModuleFrom.type]);
      }
      this.addGenerateFrom.names = names;
    },
    getRepeatList(val) {
      let map = {
        1: this.childrenList.regionList,
        2: this.childrenList.buildingList,
        3: this.childrenList.unitList,
        4: this.childrenList.floorList,
        5: this.childrenList.roomList
      };
      return map[val] || [];
    },
    goPrevious() {
      this.generateVisible = false;
      this.basicVisible = true;
    },
    validateNames() {
      let originalNmaes = this.getRepeatList(this.addModuleFrom.type).map(i => i.name);
      let allNames = [...originalNmaes, ...this.addGenerateFrom.names];
      let isRepeat = false;
      let repeatName = '';
      var newlist = allNames.sort();
      for (var i = 0; i < newlist.length; i++) {
        if (newlist[i] && newlist[i] === newlist[i + 1]) {
          isRepeat = true;
          repeatName = newlist[i];
          break;
        }
      }
      if (isRepeat) {
        this.$Message.error(`${repeatName}存在重复，请重新输入`);
        return false;
      } else {
        return true;
      }
    },
    onSubmitPointForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.validateNames()) {
          let map = {
            1: 0,
            2: this.addModuleFrom.region.id,
            3: this.addModuleFrom.building.id,
            4: this.addModuleFrom.unit.id,
            5: this.addModuleFrom.floor.id
          };
          let payload = {
            orgId: this.addModuleFrom.orgId.id || '',
            parentId: map[this.addModuleFrom.type],
            type: this.addModuleFrom.type,
            region: this.addModuleFrom.region.id || '',
            building: this.addModuleFrom.building.id || '',
            unit: this.addModuleFrom.unit.id || '',
            floor: this.addModuleFrom.floor.id || '',
            names: this.addGenerateFrom.names
          };
          console.log(payload);
          poitionAddFun(payload).then(() => {
            this.$Message.success('新增成功');
            this.modalClose();
            this.$listeners.getpointList && this.$listeners.getpointList();
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

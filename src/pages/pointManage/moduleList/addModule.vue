<template>
  <el-dialog title="新增点位模型" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="540px" height="768px">
    <div class="pre-form" v-show="basicVisible">
      <el-form ref="addModuleFrom" :model="addModuleFrom" :rules="addModuleFormRules" class="add-shop-from" label-width="100px">
        <el-form-item label="所属店铺：" prop="orgId">
          <el-select v-model="addModuleFrom.orgId" filterable clearable placeholder="请选择" @change="changeShop($event,id)">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类别：" prop="type">
          <el-radio-group v-model="addModuleFrom.type">
            <el-radio v-for="(name,id) in pointType" :label="(+id)" :key="id">{{name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="addModuleFrom.type===2">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===3">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===4">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元：" prop="unit">
            <el-select v-model="addModuleFrom.unit" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="addModuleFrom.type===5">
          <el-form-item label="区域：" prop="region">
            <el-select v-model="addModuleFrom.region" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼号：" prop="building">
            <el-select v-model="addModuleFrom.building" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元：" prop="unit">
            <el-select v-model="addModuleFrom.unit" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="楼层：" prop="floor">
            <el-select v-model="addModuleFrom.floor" placeholder="请选择">
              <el-option v-for="(item,index) in machineParentType" :key="index" :label="item.parentTypeName" :value="item.parentTypeId"></el-option>
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
        <li>所属店铺：企鹅1号店</li>
        <li v-if="addModuleFrom.type===2">区域：生活区</li>
        <li v-if="addModuleFrom.type===3">楼号：男生寝室1号楼</li>
        <li v-if="addModuleFrom.type===4">单元：三单元</li>
        <li v-if="addModuleFrom.type===5">楼层：5楼</li>
      </ul>
      <el-form ref="addGenerateFrom" :model="addGenerateFrom" :rules="addGenerateFromRules" class="add-shop-from" label-width="100px">
        <div class="generate-num">
          <h2>生成的{{addModuleFrom.type | pointType}}</h2>
          <div class="room-num">
            <el-form-item v-for="(item,index) in addGenerateFrom.names" :key="index">
              <el-input v-model.trim="addGenerateFrom.names[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item class="action">
          <el-button type="primary" @click="goPrevious">上一步</el-button>
          <el-button @click="onSubmitPointForm('addGenerateFrom')">提交</el-button>
        </el-form-item>
      </el-form>
    </div>

  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { poitionAddFun } from '@/service/point';
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
        orgId: null,
        parentId: 0,
        type: 1,
        region: null,
        building: null,
        unit: null,
        floor: null,
        roomNum: null
      },
      addModuleFormRules: {
        orgId: [{ required: true, trigger: 'change', message: '请选择所属店铺' }],
        type: [{ required: true, trigger: 'change', message: '请选择类别' }],
        region: [{ required: true, trigger: 'change', message: '请选择区域' }],
        building: [{ required: true, trigger: 'change', message: '请选择楼号' }],
        unit: [{ required: true, trigger: 'change', message: '请选择单元' }],
        floor: [{ required: true, trigger: 'change', message: '请选择楼层' }],
        roomNum: [{ required: true, message: '数量不能为空', trigger: 'blur' }, { type: 'number', message: '数量必须为数字值', trigger: 'blur' }]
      },
      addGenerateFrom: {
        names: []
      },
      addGenerateFromRules: {
        roomNum: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
      },
      machineParentType: []
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
    // async getMarketlistParentType() {
    //   //获取二级类型
    //   let payload = { shopIds: this.addModuleFrom.shopIds.join(',') };
    //   let res = await marketlistParentTypeIdFun(payload);
    //   this.machineParentType = res.length > 0 ? [{ parentTypeId: '全部', parentTypeName: '全部' }, ...res] : [];
    // },
    changeShop(e) {
      console.log(event.target.innerText);
    },
    goNext(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid);

        if (valid) {
          console.log(123123123);
          this.basicVisible = false;
          this.generateVisible = true;
          this.generateNames();
        }
      });
    },
    generateNames() {
      let map = {
        1: '区域',
        2: '号楼',
        3: '单元',
        4: '楼',
        5: ''
      };
      let names = [];
      for (let i = 1; i <= this.addModuleFrom.roomNum; i++) {
        names.push(i + map[this.addModuleFrom.type]);
      }
      this.addGenerateFrom.names = names;
    },
    goPrevious() {
      this.generateVisible = false;
      this.basicVisible = true;
    },
    onSubmitPointForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.addModuleFrom, this.addGenerateFrom);
          console.log(payload);
          poitionAddFun(payload).then(() => {
            this.$Message.success('操作成功');
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

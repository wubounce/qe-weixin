<template>
  <el-dialog :title="reserveTemplateId?'编辑预约模板':'新增预约模板'" :visible="visible" :before-close="modalClose" :close="modalClose" width="610px">
    <el-form :model="templateForm" :rules="templateFormRules" ref="templateForm" label-position="right" label-width="100px">
      <div class="reserve-template-wrap">
        <el-form-item label="所属店铺：" prop="shopIds">
          {{shopName}}
        </el-form-item>
        <el-form-item label="设备类型：" prop="parentTypeId">
          <el-select v-model="templateForm.parentTypeId" placeholder="请选择设备类型" @change="getmachineSubType">
            <el-option v-for="(item,index) in machineParentTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号：" prop="subTypeId">
          <el-select v-model="templateForm.subTypeId" placeholder="请选择设备型号" @change="getFunctionSetList">
            <el-option v-for="(item, index) in machineSubTypeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="ifOpen">
          <el-select v-model="templateForm.ifOpen" placeholder="请选择状态">
            <el-option v-for="(name, id) in ifOpenType" :key="id" :label="name" :value="(+id)"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-table v-if="configVO" :data="templateForm.functionJson" style="width: 100%" key="functionJson" class="reserve-table">
        <el-table-column prop="functionName" :label="configVO.name.title" v-if="configVO.name.available"></el-table-column>
        <el-table-column prop="needMinutes" :label="configVO.time.title" v-if="configVO.time.available">
          <template slot-scope="scope">
            <el-form-item :prop="'functionJson.' + scope.$index + '.needMinutes'" :rules='templateFormRules.needMinutes'>
              <el-input v-model.trim="scope.row.needMinutes" maxlength="4">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="functionPrice" :label="configVO.price.title" v-if="configVO.price.available">
          <template slot-scope="scope">
            <el-form-item :prop="'functionJson.' + scope.$index + '.functionPrice'" :rules='templateFormRules.functionPrice'>
              <el-input v-model.trim="scope.row.functionPrice" maxlength="5">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="ifOpenStatus" header-align="right" align="right" :label="configVO.open.title" v-if="configVO.open.available">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ifOpenStatus">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <el-form-item class="action">
        <el-button type="primary" @click="handleReserveTemplate('templateForm')">确定</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { ifOpenType } from '@/utils/mapping';
import { doReserveTemplateFun, getReserveDetailFun, getListSubTypeFun } from '@/service/shop';
import { getlistParentTypeFun, getFunctionSetListFun } from '@/service/device';
export default {
  props: {
    shopId: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    shopName: {
      type: String,
      default: ''
    },
    reserveTemplateId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateForm: {
        parentTypeId: '',
        subTypeId: '',
        ifOpen: 0,
        functionTempletType: 2,
        functionJson: []
      },
      templateFormRules: {
        parentTypeId: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        subTypeId: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        ifOpen: [{ required: true, message: '请选择状态', trigger: 'change' }],
        needMinutes: [{ required: true, message: '请输入耗时', trigger: 'blur' }, { pattern: /^([1-9]\d{0,4})$/, message: '请输入1-9999之间的数字', trigger: 'blur' }],
        functionPrice: [{ required: true, message: '请输入原价', trigger: 'blur' }, { pattern: /^(([0-9]|[1-9][0-8])(\.\d{0,2})?|(([1-8][0-9])(\.\d{0,2})?)|0\.[1-9]{0,2}|99|99.0|99.00)$/, message: '请输入0-99之间的数字,最多保留2位小数', trigger: 'blur' }]
      },
      configVO: null,
      machineParentTypeList: [],
      machineSubTypeList: []
    };
  },
  computed: {
    ifOpenType() {
      return ifOpenType;
    }
  },
  created() {
    this.getmachineParentType();
    if (this.reserveTemplateId) {
      this.getReserveDetail();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getReserveDetail() {
      let res = await getReserveDetailFun({ id: this.reserveTemplateId });
      this.templateForm.subTypeId = res.subTypeId;
      this.templateForm.parentTypeId = res.parentTypeId;
      this.templateForm.ifOpen = res.ifOpen;
      this.getmachineSubType(res.parentTypeId, false);
      this.getFunctionSetList();
    },
    async getmachineParentType() {
      //获取设备类型
      let res = await getlistParentTypeFun({ reserve: 0 });
      this.machineParentTypeList = res;
    },
    async getmachineSubType(val = '', isChangeId = true) {
      if (isChangeId) this.templateForm.subTypeId = '';
      let payload = { parentTypeId: val, shopId: this.shopId, onlyMine: true };
      let res = await getListSubTypeFun(payload); //获取某个设备下二级类型
      this.machineSubTypeList = res;
    },
    async getFunctionSetList() {
      let payload = Object.assign({}, { shopId: this.shopId, subTypeId: this.templateForm.subTypeId });
      let res = await getFunctionSetListFun(payload);
      this.templateForm.functionJson = res.list || [];
      this.templateForm.functionTempletType = res.functionTempletType;
      this.templateForm.functionJson.forEach(item => {
        item.ifOpen === 0 ? this.$set(item, 'ifOpenStatus', true) : this.$set(item, 'ifOpenStatus', false);
      });
      this.configVO = this._.get(res, 'configVO', {});
    },
    async handleReserveTemplate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let ifOpenLen = 0;
          this.templateForm.functionJson = this.templateForm.functionJson.map(item => {
            if (item.ifOpenStatus) {
              item.ifOpen = 0;
            } else {
              item.ifOpen = 1;
              ifOpenLen = ifOpenLen + 1;
            }
            return item;
          });
          if (ifOpenLen === this.templateForm.functionJson.length) {
            this.$Message.error('请至少开启一项功能');
            return false;
          }
          let payload = Object.assign({ shopId: this.shopId }, this.templateForm);
          payload.functionJson = this.templateForm.functionJson ? JSON.stringify(this.templateForm.functionJson) : null;
          doReserveTemplateFun(payload).then(() => {
            this.$Message.success('操作成功');
            this.modalClose();
            this.$listeners.getShopDataToTable && this.$listeners.getShopDataToTable();
          });
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.pagination-right {
  padding: 24px 0;
}
.reserve-template-wrap {
  /deep/ .el-input__inner {
    width: 380px !important;
  }
}
.reserve-table /deep/ .el-form-item__content {
  margin-left: 0 !important;
}
.action {
  text-align: right;
  padding: 30px 0;
}
</style>


<template>
  <el-dialog title="新增预约模板" :visible="visible" :before-close="modalClose" :close="modalClose" width="610px">
    <el-form :model="templateForm" :rules="templateFormRules" ref="templateForm" label-position="right" label-width="100px">
      <div class="reserve-template-wrap">
        <el-form-item label="所属店铺：" prop="shopIds">
          企鹅1号店
        </el-form-item>
        <el-form-item label="设备类型：">
          <el-select v-model="templateForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号：">
          <el-select v-model="templateForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="templateForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-table :data="templateForm.functionList" style="width: 100%" max-height="500" class="reserve-table">
        <el-table-column prop="machineTypeName" label="设备类型"></el-table-column>
        <el-table-column prop="subTypeName" label="设备型号">
          <template slot-scope="scope">
            <el-form-item :prop="'functionList.' + scope.$index + '.subTypeName'">
              <el-input v-model.trim="scope.row.subTypeName" maxlength="4">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="subTypeName" label="模板状态">
          <template slot-scope="scope">
            <el-form-item :prop="'functionList.' + scope.$index + '.subTypeName'">
              <el-input v-model.trim="scope.row.subTypeName" maxlength="4">
              </el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="状态" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.switchStatus"></el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div class="pagination-right">
      <el-pagination v-show="pageShow" @size-change="pageSizeChange" @current-change="currentChange" :current-page="searchData.page" :page-sizes="pageSizeOpts" :page-size="searchData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import modlePageMixin from '@/mixins/modlePageMixin';
import { deviceColorStatus, deviceStatus } from '@/utils/mapping';
import { manageSimpleListFun } from '@/service/shop';
export default {
  mixins: [modlePageMixin],
  props: {
    shopId: {
      type: String,
      default: '201812221917180000060615'
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      templateForm: { checkBatchFuntion: 0 },
      templateFormRules: {}
    };
  },
  components: {},
  filters: {
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
  created() {
    this._getList();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async _getList(row) {
      let payload = Object.assign({ shopId: this.shopId }, this.searchData);
      let res = await manageSimpleListFun(payload);
      this.templateForm.functionList = res.items || [];
      this.total = res.total;
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
</style>


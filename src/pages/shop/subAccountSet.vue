<template>
  <el-dialog :title="title" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="600px">
    <el-form :model="dynamicValidateForm" :rules="dynamicValidateFormRules" ref="dynamicValidateForm" label-position="left" class="sub-account-form">
      <h2>
        <span>分账账户</span>
        <span style="padding-left: 125px;">分账比例</span>
      </h2>
      <div class="begin-add-accout" v-if="dynamicValidateForm.detail.length<=0" @click="addDomain">
        <i class="el-icon-plus"></i><span>添加账号</span>
      </div>
      <div v-else class="added-accout">
        <ul>
          <li v-for="(item,index) in dynamicValidateForm.detail" :key="index">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item :prop="'detail.' + index + '.shareOperaterId'" :rules='dynamicValidateFormRules.shareOperaterId'>
                  <el-select v-model="item.shareOperaterId" filterable clearable remote reserve-keyword placeholder="请输入账号" :remote-method="remoteMethod" :loading="loading">
                    <el-option v-for="(item,index) in options" :key="index" :label="item.userName" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item :prop="'detail.' + index + '.proportion'" :rules='dynamicValidateFormRules.proportion' class="proportion-input">
                  <el-input v-model.trim="item.proportion" maxlength="5" placeholder="请输入"></el-input><span>%</span>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <svg-icon icon-class="accountadd" v-if="index===(dynamicValidateForm.detail.length-1)" @click="addDomain" />
                <svg-icon icon-class="accountdel" @click.prevent="removeDomain(item)" />
              </el-col>
            </el-row>
          </li>
        </ul>
      </div>
      <el-form-item class="action">
        <el-button type="primary" @click="onHandleAddAcount('dynamicValidateForm')">确定</el-button>
        <el-button @click="resetForm('dynamicValidateForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import qs from 'qs';
import { delay } from '@/utils/tools';
import { getUserInfoInLocalstorage } from '@/utils/auth';
import { revenueSharingAddFun, revenueSharingBatchAddFun, getByUserOperatornameFun } from '@/service/shop';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    shopIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'],
      options: [],
      loading: false,
      dynamicValidateForm: {
        detail: []
      },
      dynamicValidateFormRules: {
        shareOperaterId: [{ required: true, message: '请填写分账账户', trigger: 'change' }],
        proportion: [{ required: true, message: '请填写分账比例', trigger: 'blur' }, { pattern: /^(([1-9][0-9]|[1-9])(\.\d{1,2})?|0\.\d{1,2}|100)$/, message: '分账比例请输入1-100之间的数字，最多保留2位小数', trigger: 'blur' }]
      }
    };
  },
  components: {},
  created() {},
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        let payload = { username: query };
        delay(async () => {
          let res = await getByUserOperatornameFun(qs.stringify(payload));
          this.options = res ? [{ id: res.id, userName: res.userName }] : [];
          this.loading = false;
        }, 200);
      } else {
        this.options = [];
      }
    },
    onHandleAddAcount(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dynamicValidateForm.detail.length > 0) {
            let proportionTotal = 0;
            let isShareOperaterIdSame = false;
            let user = getUserInfoInLocalstorage() ? getUserInfoInLocalstorage().phone : '';
            this.dynamicValidateForm.detail.forEach((item, index, arr) => {
              proportionTotal += Number(item.proportion);
              isShareOperaterIdSame = item.shareOperaterId === user;
            });
            var repeatOperatorArr = this.dynamicValidateForm.detail.map(item => item.shareOperaterId);
            var setrepeatOperatorArr = new Set(repeatOperatorArr); //去重复
            if (setrepeatOperatorArr.size !== this.dynamicValidateForm.detail.length) {
              this.$Message.error('当前添加的账户不允许重复');
              return;
            }
            if (isShareOperaterIdSame) {
              this.$Message.error('不允许添加操作者账号');
              return;
            }
            if (proportionTotal <= 0 || proportionTotal > 100) {
              this.$Message.error('总比例大于100%，请重新输入');
              return;
            }
            this.submitreveneSharing();
          } else {
            this.submitreveneSharing();
          }
        }
      });
    },
    type(obj) {
      return Object.prototype.toString
        .call(obj)
        .slice(8, -1)
        .toLowerCase();
    },
    submitreveneSharing() {
      if (this.type(this.shopIds) === 'array' && this.shopIds.length > 0) {
        this.$confirm('此次配置将覆盖之前的配置记录。', '提示', {
          showClose: false,
          center: true
        }).then(() => {
          let payload = Object.assign({}, this.dynamicValidateForm, { shopIds: this.shopIds });
          payload.detail = JSON.stringify(payload.detail);
          payload.shopIds = JSON.stringify(payload.shopIds);
          revenueSharingBatchAddFun(payload).then(() => this.handleParent());
        });
      } else {
        let payload = Object.assign({}, this.dynamicValidateForm, { shopId: this.shopIds });
        payload.detail = JSON.stringify(payload.detail);
        payload.shopId = JSON.stringify(payload.shopId);
        revenueSharingAddFun(payload).then(() => this.handleParent());
      }
    },
    handleParent() {
      this.$Message.success('成功');
      this.modalClose();
      this.$listeners.getShopDataToTable && this.$listeners.getShopDataToTable(); //若组件传递事件confirm则执行
      this.$emit('update:isAllChecked', false); // 直接修改父组件的属性
    },
    resetForm(formName) {
      if (this.dynamicValidateForm.detail.length > 0) {
        this.$refs[formName].resetFields();
        this.$refs[formName].clearValidate();
      }
      this.modalClose();
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.detail.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.detail.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.detail.push({
        shareOperaterId: '',
        proportion: ''
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.sub-account-form {
  padding-top: 24px;
  padding-bottom: 24px;
  h2 {
    font-size: 14px;
    font-weight: 600;
    height: 54px;
    line-height: 54px;
    background: #fafafa;
    border-radius: 4px 4px 0px 0px;
    padding: 0 10px;
    color: #262626;
  }
  li {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    border-bottom: 1px solid $under_line;
  }
  .svg-icon {
    width: 18px;
    height: 18px;
    margin: 0 10px;
    cursor: pointer;
  }
  .begin-add-accout {
    padding: 24px 0;
    border: 1px dashed #dfdfdf;
    margin: 24px;
    text-align: center;
    cursor: pointer;
    font-size: 20px;
    color: $menuText;
    span {
      margin-left: 17px;
    }
  }
}
.sub-account-form /deep/ .el-form-item {
  padding-top: 10px;
  margin: 0;
}
.proportion-input /deep/ .el-input {
  width: 70%;
}
.action {
  text-align: right;
}
</style>

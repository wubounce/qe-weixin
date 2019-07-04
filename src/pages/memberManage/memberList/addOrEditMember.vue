<template>
  <el-dialog :title="addOrEditMemberTitle" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="760px" height="768px" top="20px">
    <el-form ref="addMemberFrom" :model="addMemberFrom" :rules="addMemberFormRules" class="add-shop-from" label-width="100px">
      <el-form-item label="手机号码：" class="shop-name" prop="phone" v-show="disabledEdit">
        <el-input v-model.trim="addMemberFrom.phone" placeholder="手机号为登录人员账号，密码将自动短信发送"></el-input>
      </el-form-item>
      <el-form-item label="人员姓名：" class="shop-name" prop="username">
        <el-input v-model.trim="addMemberFrom.username" placeholder="请输入人员姓名" :disabled="!disabledEdit"></el-input>
      </el-form-item>
      <el-form-item label="负责店铺：" prop="operateShopIds">
        <multiple-shop v-model="addMemberFrom.operateShopIds" placeholder="请选择店铺"></multiple-shop>
      </el-form-item>
      <el-form-item label="权限选择：" class="perm-tree">
        <el-tree ref="tree" :data="permissionsData" show-checkbox node-key="menuId" :props="defaultProps" @check="handleCheck" :default-checked-keys="checkpermissionslist" :default-expanded-keys="checkpermissionslist">
        </el-tree>
      </el-form-item>
      <el-form-item class="action">
        <el-button type="primary" @click="onSubmitMemberFrom('addMemberFrom')">保存</el-button>
        <el-button @click="modalClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getOperatorInfoFun, updateOperatorInfoFun, permsMenuFun, addOperatorFun } from '@/service/member';
import multipleShop from '@/components/multipleShop';
import { getTrees } from '@/utils/tools';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    memberId: {
      type: String,
      default: ''
    },
    shopList: {
      type: Object,
      default: () => {
        return [];
      }
    }
  },
  components: {
    multipleShop
  },
  data() {
    return {
      detailPermissionsData: [],
      addOrEditMemberTitle: '新增人员',
      addMemberFrom: {
        id: '',
        phone: '',
        username: '',
        operateShopIds: []
      },
      addMemberFormRules: {
        phone: [{ required: true, trigger: 'blur', message: '请填写手机号' }, { pattern: /^(1)\d{10}$/, message: '请填写正确的手机号', trigger: 'blur' }],
        username: [{ required: true, trigger: 'blur', message: '请填写人员姓名' }, { pattern: /^[\u4e00-\u9fa5_a-zA-Z]{2,16}$/, message: '人员姓名需为2-16个字，只支持中英文', trigger: 'blur' }],
        operateShopIds: [{ required: true, type: 'array', trigger: 'blur', message: '请选择负责店铺' }]
      },
      allMenu: [],
      permissionsData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      parentIds: [],
      checkpermissionslist: [],
      disabledEdit: true
    };
  },
  created() {
    this.menuSelect();
    if (this.memberId) {
      this.initMember();
    }
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async initMember() {
      this.addOrEditMemberTitle = '编辑人员';
      this.disabledEdit = false;
      let payload = { id: this.memberId };
      let res = await getOperatorInfoFun(payload);
      this.addMemberFrom.id = res.id;
      this.addMemberFrom.phone = res.phone;
      this.addMemberFrom.username = res.realName;
      let updateOperateShopIds = res.operateShopNames ? res.operateShopNames.split(',') : [];
      this.addMemberFrom.operateShopIds = this.shopList.filter(v => updateOperateShopIds.some(k => k == v.shopName)).map(item => item.shopId);
      this.checkpermissionslist = res.list.map(item => item.menuId);
      this.parentIds = res.list.filter(item => item.menuId <= 9).map(item => item.menuId); //在父级id中去掉首页和报表
      this.checkpermissionslist = this.checkpermissionslist.filter(v => this.parentIds.indexOf(v) == -1); //取差集
    },
    async menuSelect() {
      let res = await permsMenuFun(); //拼接权限菜单
      this.allMenu = res;
      this.permissionsData = getTrees(res, 0).filter(item => item.name !== '营销管理'); //兼容app
    },
    handleCheck() {
      this.checkpermissionslist = this.$refs.tree.getCheckedKeys(true);
      let checklist = this.allMenu.filter(v => this.checkpermissionslist.some(k => k == v.menuId));
      this.parentIds = checklist.map(item => item.parentId); //获取父级id
      this.checkpermissionslist = Array.from(new Set([...this.checkpermissionslist]));
    },
    onSubmitMemberFrom(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.checkpermissionslist.length <= 0) {
            this.$Message.error('请选择权限');
            return false;
          }
          let payload = Object.assign({}, this.addMemberFrom);
          let menshopids = [];
          payload.operateShopIds.forEach(item => menshopids.push(`'${item}'`));
          payload.operateShopIds = menshopids.join(',');
          let mIds = [...this.checkpermissionslist, ...this.parentIds]; //权限父级id
          mIds = Array.from(new Set([...mIds])); //去重
          payload.mIds = mIds.join(',');
          payload.id ? await updateOperatorInfoFun(payload) : await addOperatorFun(payload);
          this.$Message.success('操作成功！');
          this.modalClose();
          this.$listeners.getMemberDataToTable && this.$listeners.getMemberDataToTable();
        } else {
          return false;
        }
      });
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
    text-align: right;
  }
  .shop-name /deep/ .el-input__inner {
    width: 400px !important;
  }
}
.perm-tree {
  border-bottom: 1px solid $under_line;
  /deep/ .el-form-item__content {
    height: 510px;
    overflow-y: scroll;
  }
}
</style>

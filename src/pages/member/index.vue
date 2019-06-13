<template>
  <div>
    <el-form :inline="true" ref="searchData" :model="searchData" class="header-search">
      <el-form-item label="人员姓名/账号 ：" prop="search">
        <el-input v-model.trim="searchData.search" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="负责店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchData')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="openAddBDDialog()">新增人员</el-button>
      </div>
      <el-table :data="memberDataToTable" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="userName" label="姓名" width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookShopDetail(scope.row);detailDialogVisible=true">{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="phone" label="手机号" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="shopNames" label="负责店铺" width="240" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="list" label="权限" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.list" :key="index">{{item.name}}<i v-if="index !== (scope.row.list.length-1)">,</i></span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="isLock" label="启用/禁用" width="100px">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isLock" @change="lockOperator(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column header-align="left" label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="openAddBDDialog(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
      <!-- 详情 -->
      <el-dialog title="人员详情" :visible.sync="detailDialogVisible" width="540px">
        <ul class="deatil-list">
          <li><span class="lable">人员姓名：</span><span class="content">{{detailData.realName}}</span></li>
          <li><span class="lable">负责店铺：</span><span class="content">{{detailData.operateShopNames}}</span></li>
          <li style="border:none;">
            <span class="lable">权限选择：</span><span class="content">
              <div class="pid-list" v-for="(item,index) in detailPermissionsData" :key="index">
                <span v-if="item.name==='首页'||item.name==='报表'">{{item.name}}</span>
                <p class="pid-title" v-else>{{item.name}}</p>
                <span v-for="(sitem,index) in item.children" :key="index">{{sitem.name}}</span>
              </div>
            </span>
          </li>
        </ul>
      </el-dialog>
      <!-- 新增编辑店铺 -->
      <el-dialog :title="addOrEditMemberTitle" :visible.sync="addMemberDialogVisible" @close="addMemberDialogVisible = false" width="760px" height="768px" top="20px">
        <el-form ref="addMemberFrom" :model="addMemberFrom" :rules="addMemberFormRules" class="add-shop-from" label-width="100px" v-if="addMemberDialogVisible">
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
            <el-button @click="resetAddMemberFrom('addMemberFrom');addMemberDialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopListFun, operatorListFun, lockOperatorrFun, getOperatorInfoFun, updateOperatorInfoFun, delOperatorFun, permsMenuFun, addOperatorFun } from '@/service/member';
import { getTrees } from '@/utils/tools';
import Pagination from '@/components/Pager';
import multipleShop from '@/components/multipleShop';
import PagerMixin from '@/mixins/PagerMixin';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    multipleShop
  },
  data() {
    return {
      searchData: {
        search: '',
        shopId: '',
        like: true
      },
      shopList: [],
      detailDialogVisible: false,
      detailData: {},
      memberDataToTable: [],
      addMemberDialogVisible: false,
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
  filters: {},
  computed: {},
  mounted() {},
  created() {
    this.getShopList();
    this.getMemberDataToTable();
    this.menuSelect();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getMemberDataToTable();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      let payload = Object.assign({}, this.searchData);
      this.getMemberDataToTable(payload);
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getMemberDataToTable();
    },
    async getMemberDataToTable() {
      let payload = Object.assign({}, this.searchData);
      let res = await operatorListFun(payload);
      this.memberDataToTable = res.items || [];
      this.memberDataToTable.forEach(item => {
        if (item.isLock === 0) {
          item.isLock = true;
        } else {
          item.isLock = false;
        }
      });
      this.total = res.total;
    },
    async lockOperator(row) {
      let isLock = null;
      if (row.isLock === true) {
        isLock = 0;
      } else {
        isLock = 1;
      }
      let payload = Object.assign({}, { id: row.id, isLock: isLock });
      await lockOperatorrFun(payload);
      this.$Message.success('操作成功');
    },
    async openAddBDDialog(row = {}) {
      this.addOrEditMemberTitle = '新增人员';
      this.disabledEdit = true;
      this.checkpermissionslist = [];
      this.parentIds = [];
      this.addMemberFrom = {
        id: '',
        phone: '',
        username: '',
        operateShopIds: []
      };
      if (row.id) {
        this.addOrEditMemberTitle = '编辑人员';
        this.disabledEdit = false;
        let payload = { id: row.id };
        let res = await getOperatorInfoFun(payload);
        this.addMemberFrom.id = res.id;
        this.addMemberFrom.phone = res.phone;
        this.addMemberFrom.username = res.realName;
        let updateOperateShopIds = res.operateShopNames ? res.operateShopNames.split(',') : [];
        this.addMemberFrom.operateShopIds = this.shopList.filter(v => updateOperateShopIds.some(k => k == v.shopName)).map(item => item.shopId);
        this.checkpermissionslist = res.list.map(item => item.menuId);
        this.parentIds = res.list.filter(item => item.menuId <= 9).map(item => item.menuId); //在父级id中去掉首页和报表
        this.checkpermissionslist = this.checkpermissionslist.filter(v => this.parentIds.indexOf(v) == -1); //取差集
      }
      this.addMemberDialogVisible = true;
    },
    async lookShopDetail(row) {
      let payload = { id: row.id };
      let res = await getOperatorInfoFun(payload);
      this.detailData = res;
      this.detailPermissionsData = getTrees(res.list, 0);
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
          this.resetAddMemberFrom(formName);
          this.addMemberDialogVisible = false;
          this.getMemberDataToTable();
        } else {
          return false;
        }
      });
    },
    resetAddMemberFrom(formName) {
      this.$refs[formName].clearValidate();
      this.$refs[formName].resetFields();
      this.checkpermissionslist = [];
    },
    // 删除人员
    handleDelete(row) {
      let payload = { id: row.id };
      this.$confirm('您确定要删除该账号?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        delOperatorFun(payload).then(() => {
          this.$message.success('账号删除成功');
          this.getMemberDataToTable();
        });
      });
    }
  }
};
</script>
<style lang="scss">
@import '~@/styles/variables.scss';
.add-shop-from {
  .shop-name .el-input__inner {
    width: 400px !important;
  }
}
.perm-tree {
  border-bottom: 1px solid $under_line;
  .el-form-item__content {
    height: 510px;
    overflow-y: scroll;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.deatil-list {
  padding-bottom: 15px;
  li {
    padding: 12px;
    border-bottom: 1px solid $under_line;
    .lable {
      color: rgba(23, 26, 46, 0.45);
      display: inline-block;
      width: 70px;
      vertical-align: top;
    }
    .content {
      width: 380px;
      display: inline-block;
    }
  }
}
.add-shop-from {
  padding-top: 24px;
  padding-bottom: 24px;
  .action {
    text-align: right;
  }
}
.pid-list {
  .pid-title {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(23, 26, 46, 0.45);
    line-height: 17px;
    margin-bottom: 8px;
  }
  span {
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
    font-size: 14px;
    display: inline-block;
    line-height: 0.53rem;
    padding: 8px 16px;
    margin-right: 8px;
    margin-bottom: 12px;
  }
}
</style>
 
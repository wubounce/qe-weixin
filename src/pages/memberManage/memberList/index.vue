<template>
  <div>
    <el-form :inline="true" ref="searchData" :model="searchData" class="header-search">
      <el-form-item label="人员姓名/账号 ：" prop="search">
        <el-input v-model.trim="searchData.search" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="负责店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
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
      <add-or-edit-member :visible.sync="addMemberDialogVisible" v-if="addMemberDialogVisible" :memberId="memberId" :shopList="shopList" @getMemberDataToTable="getMemberDataToTable" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { shopListFun, operatorListFun, lockOperatorrFun, getOperatorInfoFun, delOperatorFun } from '@/service/member';
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import addOrEditMember from './addOrEditMember';
import { getTrees } from '@/utils/tools';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    addOrEditMember
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
      memberId: ''
    };
  },
  filters: {},
  computed: {},
  mounted() {},
  created() {
    this.getShopList();
    this.getMemberDataToTable();
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
      this.memberId = '';
      if (row.id) {
        this.memberId = row.id;
      }
      this.addMemberDialogVisible = true;
    },
    async lookShopDetail(row) {
      let payload = { id: row.id };
      let res = await getOperatorInfoFun(payload);
      this.detailData = res;
      this.detailPermissionsData = getTrees(res.list, 0);
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
 
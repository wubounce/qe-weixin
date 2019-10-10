<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="浴室名称：" prop="positionName">
        <el-input v-model.trim="searchData.positionName" clearable placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="orgId">
        <el-select v-model="searchData.orgId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用性别：" prop="sexAllow">
        <el-select v-model="searchData.sexAllow" clearable placeholder="请选择">
          <el-option v-for="(name, id) in genderType" :key="id" :label="name" :value="(+id)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：" prop="shopState">
        <el-select v-model="searchData.shopState" clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option :value="2" label="营业中"></el-option>
          <el-option :value="3" label="暂停营业"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <el-table :data="bathroomList" style="width: 100%">
        <el-table-column header-align="left" label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
        <el-table-column header-align="left" prop="positionName" label="浴室名称" min-width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="orgName" label="所属店铺" min-width="160px" show-overflow-tooltip></el-table-column>
        <el-table-column header-align="left" prop="reserveAllowCount" label="违约次数"></el-table-column>
        <el-table-column header-align="left" prop="reserveBanDays" label="禁止预约(天)" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="bathCount" label="浴位数量" min-width="140px">
          <template slot-scope="scope">
            <span class="rowstyle" @click="lookPositionlist(scope.row)">{{scope.row.bathCount}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="sexAllow" label="适用性别" min-width="140px">
          <template slot-scope="scope">
            <span>{{scope.row.sexAllow | genderType}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="reserveMinutes" label="预约时长(分钟)" min-width="140px"></el-table-column>
        <el-table-column header-align="left" prop="shopState" label="营业状态" min-width="140px">
          <template slot-scope="scope">
            <span>{{scope.row.shopState===2?'营业中':'暂停营业'}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="left" prop="workTime" label="开放时段" min-width="140px"></el-table-column>
        <el-table-column header-align="left" label="操作" min-width="100px">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" effect="dark">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="openEditShowerDialog(scope.row)" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top" effect="dark">
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="handleDelete(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 浴室列表 -->
    <positon-list v-if="positionVisible" :visible.sync="positionVisible" :positionRow="positionRow"></positon-list>
    <!-- 编辑浴室 -->
    <edit-bathroom v-if="editShowerVisible" :visible.sync="editShowerVisible" :positionRow="positionRow" @getbathroomList="getbathroomList"></edit-bathroom>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { getBathroomListFun, editBathroomFun } from '@/service/shower';
import { shopListFun } from '@/service/report';
import { genderType } from '@/utils/mapping';
import positonList from './positonList';
import editBathroom from './editBathroom';

export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    positonList,
    editBathroom
  },
  data() {
    return {
      searchData: {
        positionName: '',
        orgId: '',
        shopState: '',
        sexAllow: 0
      },
      shopList: [],
      bathroomList: [],
      positionVisible: false,
      editShowerVisible: false,
      positionRow: {}
    };
  },
  filters: {
    genderType(val) {
      return genderType[val];
    }
  },
  computed: {
    genderType() {
      return genderType;
    }
  },
  created() {
    this.getShopList();
    this.getbathroomList();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getbathroomList();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getbathroomList();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getbathroomList();
    },
    async getbathroomList() {
      //获取列表
      this.bathroomList = [];
      let payload = Object.assign({}, this.searchData);
      let res = await getBathroomListFun(payload);
      this.bathroomList = res.items || [];
      this.total = res.total || 0;
    },
    async openEditShowerDialog(row = {}) {
      if (row.positionId) {
        this.positionRow = row;
        this.editShowerVisible = true;
      }
    },
    lookPositionlist(row = {}) {
      if (row.bathCount > 0) {
        this.positionRow = row;
        this.positionVisible = true;
      }
    },
    handleDelete(row) {
      let payload = { id: row.positionId, shopState: 4 };
      this.$confirm('确认删除该浴室？', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        editBathroomFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getbathroomList();
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

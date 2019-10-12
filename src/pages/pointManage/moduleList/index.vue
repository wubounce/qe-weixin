<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable clearable placeholder="请选择">
          <el-option label="不限" value=""></el-option>
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchForm">查 询</el-button>
        <el-button @click="resetSearchForm('searchForm')">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-content">
      <div class="table-header-action">
        <el-button type="primary" icon="el-icon-plus" @click="addModuleVisible = true">新增点位模型</el-button>
      </div>
      <div class="point-tree-content">
        <el-tree :load="getpointList" :props="pzProps" lazy ref="tree" show-checkbox node-key="id" :key="treeKey" element-loading-text="加载中..." :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-show="node.level>1">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="() => append(data)" />
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="() => handleDeletePoint(node, data)" />
            </span>
          </span>
        </el-tree>
      </div>
      <Pagination @pagination="handlePagination" :currentPage="searchData.page" :total="total" />
    </div>
    <!-- 新增 -->
    <add-module :visible.sync="addModuleVisible" v-if="addModuleVisible" @getpointList="getpointList" />
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editModuleVisible" width="540px">
      <el-form ref="editModuleForm" :model="editModuleForm" :rules="editModuleFormRules" class="edit-point-name-from" label-width="100px">
        <el-form-item prop="name">
          <el-input v-model.trim="editModuleForm.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="action" style="text-align:right">
          <el-button type="primary" @click="goNext()">保存</el-button>
          <el-button @click="modalClose()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/Pager';
import PagerMixin from '@/mixins/PagerMixin';
import { poitionListFun, poitionDeleteFun } from '@/service/point';
import { shopListFun } from '@/service/report';
import { manageListFun } from '@/service/shop';
import addModule from './addModule';
export default {
  mixins: [PagerMixin],
  components: {
    Pagination,
    addModule
  },
  data() {
    return {
      searchData: {
        shopId: '',
        status: '',
        expired: ''
      },
      pzProps: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      shopList: [],
      treeKey: '', // 控制tree渲染的key
      addModuleVisible: false,
      editModuleVisible: false,
      editModuleForm: {
        id: 0,
        name: '',
        orgId: ''
      }
    };
  },
  created() {
    this.getShopList();
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    handlePagination(data) {
      this.searchData = Object.assign(this.searchData, data);
      this.getpointList();
    },
    searchForm() {
      this.searchData.page = 1;
      this.total = 0;
      this.getpointList();
    },
    resetSearchForm(formName) {
      this.searchData.page = 1;
      this.total = 0;
      this.$refs[formName].resetFields();
      this.getpointList();
    },
    async getpointList(node, resolve) {
      console.log(node);

      if (node.level === 0) {
        this.getTopShopList(resolve);
      } else {
        this.getTreeChild(node, node.data, resolve);
      }
    },
    async getTopShopList(resolve) {
      //获取列表
      this.pointLitDataToTable = [];
      let payload = Object.assign({}, this.searchData);
      let res = await manageListFun(payload);
      this.pointLitDataToTable = res.items || [];
      this.pointLitDataToTable.forEach(i => {
        i.name = i.shopName;
      });
      this.total = res.total;
      resolve(res.items);
    },
    async getTreeChild(node, data, resolve) {
      let payload = node.level === 1 ? { orgId: data.id, parentId: 0 } : { orgId: data.orgId, parentId: data.id };
      let res = await poitionListFun(payload);
      res.forEach(i => {
        if (!i.children) {
          this.$set(i, 'leaf', true);
        }
      });
      resolve(res);
    },
    append(data) {
      console.log(data);
      // const newChild = { id: id++, label: 'testtest', children: [] };
      // if (!data.children) {
      //   this.$set(data, 'children', []);
      // }
      // data.children.push(newChild);
    },
    handleDeletePoint(node, data) {
      let payload = { id: data.id, orgId: data.orgId };
      this.$confirm('您确定要删除点位?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        poitionDeleteFun(payload).then(() => {
          this.$message.success('删除成功');
          this.renderTree();
        });
      });
    },
    // 刷新key值，重新渲染tree
    renderTree() {
      this.treeKey = +new Date();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.point-tree-content {
  width: 20%;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  /deep/ .el-tree-node__content {
    height: 32px;
  }
}
.edit-point-name-from {
  padding: 27px;
}
</style>

<template>
  <div class="time-discount-page">
    <el-form :inline="true" ref="searchForm" :model="searchData" class="header-search">
      <el-form-item label="所属店铺：" prop="shopId">
        <el-select v-model="searchData.shopId" filterable placeholder="请选择">
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
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree :data="treeData" :props="pzProps" ref="tree" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-show="node.level>1">
              <svg-icon icon-class="bianji" class="icon-bianji" @click="() => editPoint(data)" />
              <svg-icon icon-class="shanchu" class="icon-shanchu" @click="() => handleDeletePoint(node, data)" />
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <!-- 新增 -->
    <add-module :visible.sync="addModuleVisible" v-if="addModuleVisible" @getpointList="getpointList" />
    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="editModuleVisible" width="540px">
      <el-form ref="editModuleForm" :model="editModuleForm" :rules="editModuleFormRules" class="edit-point-name-from" label-width="100px">
        <el-form-item prop="name">
          <el-input v-model.trim="editModuleForm.name" placeholder="请输入" :maxlength='16'></el-input>
        </el-form-item>
        <el-form-item class="action" style="text-align:right">
          <el-button type="primary" @click="onSubmitEdit('editModuleForm')">保存</el-button>
          <el-button @click="resetEdit('editModuleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { poitionListFun, poitionDeleteFun, poitionEditFun } from '@/service/point';
import { shopListFun } from '@/service/report';
import addModule from './addModule';
export default {
  components: {
    addModule
  },
  data() {
    return {
      searchData: {
        shopId: ''
      },
      pzProps: {
        label: 'name',
        children: 'children'
      },
      shopList: [],
      treeData: [],
      filterText: '',
      addModuleVisible: false,
      editModuleVisible: false,
      editModuleForm: {
        id: 0,
        name: '',
        orgId: ''
      },
      editModuleFormRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getShopList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async getShopList() {
      let res = await shopListFun();
      this.searchData.shopId = res.length > 0 ? res[0].shopId : '';
      this.shopList = res;
      this.searchData.shopId && this.getpointList();
    },
    searchForm() {
      this.getpointList();
    },
    resetSearchForm(formName) {
      this.$refs[formName].resetFields();
      this.searchData.shopId = this.shopList.length > 0 ? this.shopList[0].shopId : '';
      this.searchData.shopId && this.getpointList();
    },
    async getpointList(node, resolve) {
      //获取列表
      let pic = this.shopList.find(i => i.shopId == this.searchData.shopId);
      let payload = { orgId: pic ? pic.id : '', parentId: 0 };
      let res = await poitionListFun(payload);
      pic.name = pic.shopName;
      pic.children = res;
      this.treeData = [pic];
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    editPoint(data) {
      this.editModuleVisible = true;
      this.editModuleForm = Object.assign({}, data);
    },
    onSubmitEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.editModuleForm);
          poitionEditFun(payload).then(() => {
            this.$message.success('编辑成功');
            this.resetEdit(formName);
            this.getpointList();
          });
        }
      });
    },
    resetEdit(formName) {
      this.$refs[formName].resetFields();
      this.editModuleVisible = false;
      this.editModuleForm = {};
    },
    handleDeletePoint(node, data) {
      let payload = { id: data.id, orgId: data.orgId };
      this.$confirm('您确定要删除点位?', '提示', {
        showClose: false,
        center: true
      }).then(() => {
        poitionDeleteFun(payload).then(() => {
          this.$message.success('删除成功');
          this.getpointList();
        });
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.point-tree-content {
  max-width: 360px;
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

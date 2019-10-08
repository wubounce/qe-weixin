<template>
  <el-dialog title="编辑浴室" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="520px">
    <el-form ref="bathroomFrom" :model="bathroomFrom" :rules="bathroomFromRules" class="edit-bathroom-from" label-width="120px">
      <el-form-item label="浴室名称：" prop="orgName">
        <el-input v-model="bathroomFrom.orgName" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="parentOrgId">
        <el-select v-model="bathroomFrom.parentOrgId" filterable clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.shopId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约功能：" prop="reserveEnabled">
        <el-radio-group v-model="bathroomFrom.reserveEnabled" disabled>
          <el-radio name="type" v-for="(name, id) in ifOpenType" :key="id" :label="(+id)">{{name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预约时长(分钟)：">
        <span>{{'bathroomFrom.reserveMinutes'}}</span>
      </el-form-item>
      <el-form-item label="适用性别：" prop="sexAllow">
        <el-radio-group v-model="bathroomFrom.sexAllow">
          <el-radio v-for="(name, id) in genderType" :key="id" :label="(+id)">{{name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="违约惩罚：" prop="reservePunishEnabled">
        <el-radio-group v-model="bathroomFrom.reservePunishEnabled">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="pay-tip" v-show="bathroomFrom.reservePunishEnabled === 1">
        <el-tooltip placement="bottom-start" class="gold-tip" content="持续放水最长时间">
          <svg-icon icon-class="zhibiaoshuoming" class="zhibiaoshuoming" />
        </el-tooltip>
        <el-form-item label="违约次数：" prop="reserveAllowCount">
          <el-input v-model.number="bathroomFrom.reserveAllowCount" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <div class="pay-tip" v-show="bathroomFrom.reservePunishEnabled === 1">
        <el-tooltip placement="bottom-start" class="gold-tip" content="0代表永久禁止预约">
          <svg-icon icon-class="zhibiaoshuoming" class="zhibiaoshuoming reserve" />
        </el-tooltip>
        <el-form-item label="禁止预约(天)：" prop="reserveBanDays">
          <el-input v-model.number="bathroomFrom.reserveBanDays" placeholder="请输入"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="状态：" prop="shopState">
        <el-radio-group v-model="bathroomFrom.shopState">
          <el-radio :label="2">营业中</el-radio>
          <el-radio :label="3">暂停营业</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="浴室数量：">
        <span>{{'bathroomFrom.bathCount'}}</span>
      </el-form-item>

      <el-form-item class="action">
        <el-button type="primary" @click="handleBathroom('bathroomFrom')">确定</el-button>
        <el-button @click="modalClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { shopListFun } from '@/service/report';
import { editBathroomFun } from '@/service/shower';
import { genderType, ifOpenType } from '@/utils/mapping';

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    limitedDiscountId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      shopList: [],
      bathroomFrom: {
        orgName: '',
        parentOrgId: '',
        reserveEnabled: '',
        sexAllow: 0,
        reservePunishEnabled: 0,
        reserveAllowCount: '',
        reserveBanDays: '',
        shopState: 0
      },
      bathroomFromRules: {
        orgName: [{ required: true, message: '请输入', trigger: 'blur' }],
        parentOrgId: [{ required: true, trigger: 'change', message: '请选择适用店铺' }],
        reserveEnabled: [{ required: true, trigger: 'change', message: '请选择预约功能' }],
        sexAllow: [{ required: true, trigger: 'change', message: '请选择适用性别' }],
        reservePunishEnabled: [{ required: true, trigger: 'change', message: '请选择违约惩罚' }],
        shopState: [{ required: true, trigger: 'change', message: '请选择状态' }],
        reserveAllowCount: [{ required: true, message: '请输入违约次数', trigger: 'blur' }, { type: 'number', max: 9999, message: '请输入大于等于0的整数', trigger: 'blur' }],
        reserveBanDays: [{ required: true, message: '请输入禁止预约天数', trigger: 'blur' }, { type: 'number', max: 9999, message: '请输入大于等于0的整数', trigger: 'blur' }]
      },
      machineParentType: [],
      hasShop: true
    };
  },
  computed: {
    ifOpenType() {
      return ifOpenType;
    },
    genderType() {
      return genderType;
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
    handleBathroom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({}, this.bathroomFrom);
          if (payload === 0) {
            payload.reserveAllowCount = 0;
            payload.reserveBanDays = 0;
          }
          editBathroomFun(payload);
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/variables.scss';
.edit-bathroom-from {
  padding-top: 24px;
  padding-bottom: 24px;
  .action {
    padding-top: 16px;
    border-top: 1px solid $under_line;
    text-align: right;
  }
  /deep/ .el-input__inner {
    width: 300px !important;
  }
}
.pay-tip {
  position: relative;
  .zhibiaoshuoming {
    position: absolute;
    left: 7px;
    top: 9px;
    color: $menuText;
  }
  .reserve {
    left: -15px;
  }
}
</style>

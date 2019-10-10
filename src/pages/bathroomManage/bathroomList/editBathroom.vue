<template>
  <el-dialog title="编辑浴室" :visible.sync="visible" :before-close="modalClose" :close="modalClose" width="520px">
    <el-form ref="bathroomFrom" :model="bathroomFrom" :rules="bathroomFromRules" class="edit-bathroom-from" label-width="120px">
      <el-form-item label="浴室名称：" prop="positionName">
        <el-input v-model.trim="bathroomFrom.positionName" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="所属店铺：" prop="orgId">
        <el-select v-model="bathroomFrom.orgId" filterable clearable placeholder="请选择">
          <el-option v-for="(item,index) in shopList" :key="index" :label="item.shopName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约功能：" prop="reserveEnabled">
        <el-radio-group v-model="bathroomFrom.reserveEnabled" disabled>
          <el-radio name="type" v-for="(name, id) in ifOpenType" :key="id" :label="(+id)">{{name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预约时长(分钟)：">
        <span>{{bathroomFrom.reserveMinutes}}</span>
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
        <span>{{bathroomFrom.bathCount}}</span>
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
import { getBathroomDetailFun, editBathroomFun } from '@/service/shower';
import { genderType, ifOpenType } from '@/utils/mapping';

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    positionRow: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      shopList: [],
      bathroomFrom: {
        positionName: '',
        orgId: '',
        reserveEnabled: '',
        sexAllow: 0,
        reservePunishEnabled: 0,
        reserveAllowCount: '',
        reserveBanDays: '',
        shopState: 0,
        bathCount: 0,
        reserveMinutes: 0
      },
      bathroomFromRules: {
        positionName: [{ required: true, message: '请输入', trigger: 'blur' }],
        orgId: [{ required: true, trigger: 'change', message: '请选择适用店铺' }],
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
    this.getBathroomDetail();
  },
  methods: {
    modalClose() {
      this.$emit('update:visible', false); // 直接修改父组件的属性
    },
    async getShopList() {
      let res = await shopListFun();
      this.shopList = res;
    },
    async getBathroomDetail() {
      let payload = { positionId: this.positionRow.positionId };
      let res = await getBathroomDetailFun(payload);
      Object.keys(this.bathroomFrom).forEach(key => {
        this.bathroomFrom[key] = res[key];
      });
    },
    handleBathroom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let payload = Object.assign({ id: this.positionRow.positionId }, this.bathroomFrom);
          editBathroomFun(payload).then(() => {
            this.$Message.success('操作成功');
            this.$listeners.getbathroomList && this.$listeners.getbathroomList(); //若组件传递事件confirm则执行
            this.modalClose();
          });
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

<template>
  <el-table border :data="tableData" ref="list" style="width: 100%" :fit="true" @selection-change="selsChange" class="my-table">
    <el-table-column v-if="isbtnVisible" type="selection"></el-table-column>
    <el-table-column fixed label="序号" width="60" type="index" :index="pagerIndex"></el-table-column>
    <el-table-column prop="name" label="设备名称"></el-table-column>
    <el-table-column prop="parentTypeName" label="一级类型"></el-table-column>
    <el-table-column prop="subTypeName" label="二级类型"></el-table-column>
    <el-table-column prop="shopName" label="所属店铺"></el-table-column>
    <el-table-column prop="operatorName" label="运营商"></el-table-column>
    <el-table-column prop="status" label="设备状态"></el-table-column>
    <el-table-column prop="firmware" label="imei版本号"></el-table-column>
    <el-table-column prop="signal" label="信号值">
      <template slot-scope="scope">
        <span :class="{ signalred: scope.row.signal < 18 }">
          {{ scope.row.signal }}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="通信类型">
      <template slot-scope="scope">
        <el-tag size="medium">
          {{ scope.row.type == 0 ? "脉冲" : "串口" }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="company" :formatter="formatterCompany" label="公司"></el-table-column>
    <el-table-column prop="allowPayType" :formatter="formatterType" label="支付方式"></el-table-column>
    <el-table-column label="订单数">
      <template slot-scope="scope">
        <div>{{ scope.row.orderCount ? scope.row.orderCount : 0 }}</div>
      </template>
    </el-table-column>
    <el-table-column prop="nqt" label="NQT"></el-table-column>
    <el-table-column prop="imei" label="IMEI"></el-table-column>
    <el-table-column prop="version" label="VER"></el-table-column>
    <el-table-column prop="aliDeviceStatus" label="阿里状态"></el-table-column>
    <el-table-column prop="createTime" label="添加时间"></el-table-column>
    <el-table-column prop="bdName" label="BD"></el-table-column>
    <el-table-column prop="province" label="省"></el-table-column>
    <el-table-column prop="city" label="市"></el-table-column>
    <el-table-column prop="district" label="区"></el-table-column>
    <el-table-column label="操作" width="150">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
          编辑
        </el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      tableData: [
        {
          name: "饮水机2",
          parentTypeName: "饮水机",
          subTypeName: "杰富睿饮水机",
          shopName: "贝小晴的洗衣铺",
          operatorName: "17095739458",
          status: 9,
          firmware: "QEKJ-0006-FIBOCOM-4G_V1.0.0",
          signal: 26,
          type: 1,
          company: "qiekj",
          allowPayType: "支付宝,余额,微信",
          orderCount: 16,
          orderMoney: 0,
          imei: "867106031567347",
          version: "4",
          aliDeviceStatus: "1",
          createTime: "2018-12-26 12:02:40",
          bdName: null,
          province: "浙江省",
          city: "杭州市",
          district: "西湖区",
          operatorId: "347213021652713618",
          subTypeId: "395176711076970707",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "347214168807441399",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 1,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "682ab0ae-c197-4f46-8243-e51cf7d3ad7d",
          id: "201812261202396940000071541",
          NQT: "682ab0ae-c197-4f46-8243-e51cf7d3ad7d"
        },
        {
          name: "123",
          parentTypeName: "饮水机",
          subTypeName: "沁园QS_ZRW_L15",
          shopName: "测试888",
          operatorName: "17761868956",
          status: 9,
          firmware: "",
          signal: 0,
          type: 1,
          company: "youfang",
          allowPayType: "支付宝,余额",
          orderCount: 4,
          orderMoney: 0,
          imei: "865933034088696",
          version: "3",
          aliDeviceStatus: "2",
          createTime: "2018-12-06 10:22:16",
          bdName: null,
          province: "江苏省",
          city: "苏州市",
          district: "吴江区",
          operatorId: "84aa3441-b2d2-4118-a0b8-bd9f6b8f86ce",
          subTypeId: "363364141383024643",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "201812061018430000051095",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 0,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "898fa263c3c74a7289f1a15e222e5db0",
          id: "201812061022160000042901",
          NQT: "898fa263c3c74a7289f1a15e222e5db0"
        },
        {
          name: "1饮水机",
          parentTypeName: "饮水机",
          subTypeName: "沁园QS_ZRW_L15",
          shopName: "慧仔店铺5",
          operatorName: "15158133937",
          status: 9,
          firmware: "QEKJ-0008-LUAT-2G_V1.0.5",
          signal: 31,
          type: 1,
          company: "qiekj",
          allowPayType: "支付宝,余额,微信",
          orderCount: 305,
          orderMoney: 0,
          imei: "869300033308671",
          version: "3",
          aliDeviceStatus: "1",
          createTime: "2018-11-07 13:43:49",
          bdName: null,
          province: "北京",
          city: "北京市",
          district: "东城区",
          operatorId: "347213492308148880",
          subTypeId: "363364141383024643",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "201812021933470000012540",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 1,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "10644de1-0562-4a11-bb3f-fc356b7560c6",
          id: "201811071343490000018556",
          NQT: "10644de1-0562-4a11-bb3f-fc356b7560c6"
        },
        {
          name: "饮水机",
          parentTypeName: "饮水机",
          subTypeName: "沁园QS_ZRW_L15",
          shopName: "慧仔店铺3",
          operatorName: "15158133937",
          status: 9,
          firmware: "QEKJ-0008-LUAT-2G_V1.0.5",
          signal: 13,
          type: 1,
          company: "qiekj",
          allowPayType: "支付宝,余额,微信",
          orderCount: 151,
          orderMoney: 0,
          imei: "869300033309778",
          version: "3",
          aliDeviceStatus: "1",
          createTime: "2018-10-15 09:40:10",
          bdName: null,
          province: "浙江省",
          city: "杭州市",
          district: "玄武区",
          operatorId: "347213492308148880",
          subTypeId: "363364141383024643",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "S201810171022540000045549",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 1,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "c5707e0dd7884577bbbd5555a18cfce5",
          id: "201810150940100000001858",
          NQT: "c5707e0dd7884577bbbd5555a18cfce5"
        },
        {
          name: "饮水机",
          parentTypeName: "饮水机",
          subTypeName: "沁园QS_ZRW_L15",
          shopName: "慧仔店铺",
          operatorName: "15158133937",
          status: 9,
          firmware: "QEKJ-0008-LUAT-2G_V1.0.5",
          signal: 13,
          type: 1,
          company: "qiekj",
          allowPayType: "支付宝,余额,微信",
          orderCount: 0,
          orderMoney: 0,
          imei: "869300033309778",
          version: "3",
          aliDeviceStatus: "1",
          createTime: "2018-10-11 14:36:30",
          bdName: "慧仔",
          province: "浙江省",
          city: "杭州市",
          district: "西湖区",
          operatorId: "347213492308148880",
          subTypeId: "363364141383024643",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "347217048553652566",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 1,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "c5707e0dd7884577bbbd5555a18cfce5",
          id: "201810111436300000046209",
          NQT: "c5707e0dd7884577bbbd5555a18cfce5"
        },
        {
          name: "饮水机",
          parentTypeName: "饮水机",
          subTypeName: "沁园QS_ZRW_L15",
          shopName: "慧仔店铺",
          operatorName: "15158133937",
          status: 9,
          firmware: "QEKJ-0008-LUAT-2G_V1.0.5",
          signal: 13,
          type: 1,
          company: "qiekj",
          allowPayType: "支付宝,余额,微信",
          orderCount: 2,
          orderMoney: 0,
          imei: "869300033309778",
          version: "3",
          aliDeviceStatus: "1",
          createTime: "2018-10-09 14:28:56",
          bdName: "慧仔",
          province: "浙江省",
          city: "杭州市",
          district: "西湖区",
          operatorId: "347213492308148880",
          subTypeId: "363364141383024643",
          parentTypeId: "4eeb1b0a-d006-49cc-bf17-73c20599057e",
          shopId: "347217048553652566",
          shopImage: null,
          updateTime: null,
          updateUserId: null,
          wechatPayStauts: 1,
          setFunctionList: null,
          isReserve: null,
          remainTime: null,
          machineName: null,
          machineState: null,
          alarmCode: null,
          alarmMean: null,
          waterLevel: null,
          nqt: "c5707e0dd7884577bbbd5555a18cfce5",
          id: "201810091428560000097902",
          NQT: "c5707e0dd7884577bbbd5555a18cfce5"
        }
      ]
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleEdit (index, row) {
      console.log(index, row);
    },
    handleDelete (index, row) {
      console.log(index, row);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss"></style>

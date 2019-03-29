<template>
  <div class="page">
    <el-cascader ref="cascader" :props="objectprops" :change-on-select="true" @change="handleItemChange" v-model="areaIds" :options="options"></el-cascader>
  </div>
</template>

<script type="text/ecmascript-6">
import { areaListFun } from "@/service/shop";
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data () {
    return {
      objectprops: { label: 'areaName', value: 'areaId', children: 'children' },
      options: [],
      areaIds: this.value
    }
  },
  components: {

  },
  created () {
    console.log(this.value)
    this.getAreaList()
  },
  methods: {
    async getAreaList (pid = 0) {
      let res = await areaListFun({ parentId: pid });
      if (this.areaIds.length <= 0) { //初始化加载   查询省份数据
        this.options = res.map((item) => {
          return { areaId: item.areaId, areaName: item.areaName, children: [] }
        });
      }
      if (this.areaIds.length === 1) { //加载二级    查询该省下市级数据
        this.options.map((item) => {
          if (item.areaId === this.areaIds[0]) {
            item.children = res.map((v) => {
              return { areaId: v.areaId, areaName: v.areaName, children: [] }
            })
          }
        })
      }
      if (this.areaIds.length === 2) {  //加载3级   查询该省市下县级数据
        this.options.map((item) => {
          if (item.areaId === this.areaIds[0]) {
            item.children.map((v) => {
              if (v.areaId === this.areaIds[1]) {
                v.children = res.map((k) => {
                  return { areaId: k.areaId, areaName: k.areaName }
                })
              }
            })
          }
        })
      }
    },
    handleItemChange (val) {
      // this.$refs.cascader.currentLabels
      if (this.areaIds.length <= 0) {
        this.getAreaList()

      }
      if (this.areaIds.length === 1) {
        this.getAreaList(val[0])

      }
      if (this.areaIds.length === 2) {
        this.getAreaList(val[1])

      }

    }
  },
  watch: {
    // 监听数据变化，触发数据更新
    areaIds (v) {
      this.$emit("input", v);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

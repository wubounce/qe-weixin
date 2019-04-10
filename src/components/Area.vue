<template>
  <div class="area-com">
    <el-select v-model="data[0]" :size="size" @change="handleChange($event, 0)" clearable placeholder="选择所在省">
      <!-- <el-option v-if="defaultOption" :label="defaultOption" :value="null" /> -->
      <el-option v-for="item in list[0]" :key="item.areaId" :label="item.areaName" :value="item.areaId">
      </el-option>
    </el-select>
    <el-select v-model="data[1]" :size="size" @change="handleChange($event, 1)" clearable placeholder="选择所在市">
      <!-- <el-option v-if="defaultOption" :label="defaultOption" :value="null" /> -->
      <el-option v-for="item in list[1]" :key="item.areaId" :label="item.areaName" :value="item.areaId">
      </el-option>
    </el-select>
    <el-select v-model="data[2]" :size="size" @change="handleChange($event, 2)" clearable placeholder="选择所在区" style="margin:0;">
      <!-- <el-option v-if="defaultOption" :label="defaultOption" :value="null" /> -->
      <el-option v-for="item in list[2]" :key="item.areaId" :label="item.areaName" :value="item.areaId">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import axios from 'axios';
import { areaListFun } from '@/service/shop';

export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return [null, null, null];
      }
    },
    size: {
      type: String,
      default: null
    },
    defaultOption: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [
        [], // 省 level = 0
        [], // 市 level = 1
        [] // 区 level = 2
      ],
      data: [
        null, // 选中的省id
        null, // 选中的市id
        null // 选中的区id
      ],
      dataName: [
        null, // 选中的省
        null, // 选中的市
        null // 选中的区
      ]
    };
  },
  created() {
    // 初始化数据
    let arr = [];
    arr.push(this.getAreaList(0, 0));
    for (let i = 0; i < 2; i++) {
      if (this.value[i] > 0) {
        arr.push(this.getAreaList(this.value[i], i + 1));
      }
    }
    axios.all(arr).then(
      axios.spread((...resp) => {
        this.data = this.value;
      })
    );
  },
  methods: {
    getAreaList(pid = 0, level = 0) {
      return areaListFun({ parentId: pid }).then(resp => {
        // 三级类型，如果不存在，就用二级类型
        if (level === 2 && resp.length === 0) {
          resp = [this.list[1].find(item => item.id * 1 === pid * 1)];
        }
        // 更新数组需要使用$set
        this.$set(this.list, level, resp);
      });
    },
    handleChange(pid, level = 0) {
      this.$set(this.dataName, level, event.target.innerText);
      if (pid > 0) {
        // 选中了数据
        // 重置后面的数据为null
        for (let i = level + 1; i <= 2; i++) {
          this.$set(this.data, i, null);
        }
        // 获取下一级的数据
        this.getAreaList(pid, level + 1);
      } else {
        // 选中了不限
        // 重置后面的数据列表为空array,重置后面的数据为null
        for (let i = level + 1; i <= 2; i++) {
          this.$set(this.list, i, []);
          this.$set(this.data, i, null);
          this.$set(this.dataName, i, null);
        }
      }
    }
  },
  watch: {
    value(val) {
      this.data = val;
    },
    // 监听数据变化，触发数据更新
    data(v) {
      this.$emit('input', v);
    },
    dataName(v) {
      this.$emit('getAreaName', v);
    }
  }
};
</script>>
<style lang="scss" scoped>
.area-com {
  display: flex;
}
</style>
<style lang="scss">
.area-com {
  .el-select {
    width: 33%;
    margin-right: 8px;
  }
}
</style>
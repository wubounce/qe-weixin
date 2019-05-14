<template>
  <div class="map-container" id="container">
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'Map',
  props: {
    options: Object,
    default: () => {
      return {
        resizeEnable: true,
        zoom: 13, //地图显示的缩放级别
        keyboardEnable: false
      };
    }
  },
  data() {
    return {
      $map: null
    };
  },
  mounted() {
    // $el是当前组件根元素，可以直接用来初始化高德地图实例
    this.$map = new AMap.MAP(this.$el, {
      resizeEnable: true,
      zoom: 13, //地图显示的缩放级别
      keyboardEnable: false
    });
  },
  methods: {},
  beforeDestroy() {
    // 组件销毁前可销毁地图实例
    this.$map && this.$map.destroy();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>

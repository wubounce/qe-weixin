<template>
  <div>
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'screenfull'" @click="click" class="screenfull-svg" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'Screenfull',
  data () {
    return {
      isFullscreen: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    click () {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    init () {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  cursor: pointer;
  fill: #606266;
}
</style>
<template>
  <el-upload action="" list-type="picture-card" :multiple="limit > 1" :show-file-list="limit > 1" :limit="limit" :on-exceed="handleExceed" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="handleBeforeUpload" :http-request="handleUpload" :file-list="fileList">
    <img v-if="limit === 1 && value && value.length > 0" :src="value" width="146" height="146">
    <span v-else>
      <i class="el-icon-plus"></i>
      <span class="click-upload">点击上传</span>
    </span>
  </el-upload>
</template>

<script>
/**
 * 通用upload组件，支持单个和批量上传
 *
 *
 */
import fetch from '@/service/http';
export default {
  name: "upload",
  props: {
    // 文件列表
    value: [Array, String],
    // 最多上传个数，默认一个
    limit: {
      type: Number,
      default: 1
    },
    // image 表示图片，file 表示文件
    accept: {
      type: String,
      default: "image"
    },
    // 允许上传文件的大小限制，单位kb
    size: {
      type: Number,
      default: 2048
    }
  },
  methods: {
    handleBeforeUpload (file) {
      if (this.accept === "image" && !file.type.match(/image.*/)) {
        // 图片格式认证
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return false;
      } else if (this.accept === "file") {
        // 文件格式认证
        this.$message.error("上传图片只能是文件!");
        return false;
      }

      // 图片大小认证
      if (this.size > 0 && file.size / 1024 > this.size) {
        this.$message.error("上传图片大小不能超过 " + this.size + "K!");
        return false;
      }

      return true;
    },
    // 自定义上传
    handleUpload ({ file }) {
      // 上传文件
      let formData = new FormData();
      formData.append("files[]", file);
      fetch.post('https://imsapi.qiekj.com/common/uploadFile', formData).then(resp => {
        if (resp.length > 0) {
          const file = resp[0].url;
          if (this.limit === 1) {
            this.$emit("input", file);
          } else {
            let files = this.value || [];
            files.push(file);
            this.$emit("input", files);
          }
        }
      });
    },

    // 附件超限
    handleExceed (files, fileList) {
      this.$message.warning(
        `亲，您上传的文件超限了，当前限制${
        this.limit
        }，如需提升请和管理员联系～`
      );
    },

    // 移除附件
    handleRemove (file, fileList) {
      let files = fileList.map(item => item.url);
      this.$emit("input", files);
    },

    handlePreview (file) {
      this.$msgbox({
        title: "图片预览",
        message: this.$createElement("img", {
          attrs: { src: file.url, width: 390 }
        })
      });
    }
  },
  computed: {
    fileList () {
      if (this.value instanceof Array && this.value.length > 0) {
        return this.value.map((url, index) => {
          return { name: index, url: url };
        });
      }
      return [];
    }
  }
};
</script>

<style lang="less">
.el-upload {
  position: relative;
}
.click-upload{
      position: absolute;
    top: 17px;
    left: 50%;
    color: rgb(140, 147, 157);
    transform: translateX(-50%);
}
</style>

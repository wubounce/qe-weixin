/**
 *  描述：混合类
 */
export default {
  data() {
    return {
      list: [], // 列表展示
      searchData: {
        // 搜索条件
        page: 1,
        pageSize: 10 // 分页大小
      },
      pageSizeOpts: [10, 30, 50],
      total: 0 // 总数量
    };
  },
  computed: {
    // 分页是否展示
    pageShow() {
      return !!this.list.length;
    }
  },
  created() {},
  mounted() {},
  methods: {
    currentChange(val) {
      this.searchData.page = val;
      this._getList();
    },
    pageSizeChange(pageSize) {
      this.searchData.pageSize = pageSize;
      this._getList();
    },
    search() {
      this.isSearchClick = true;
      this.searchData.page = 1;
      this._getList();
    },
    pagerIndex(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    }
  },
  watch: {}
};

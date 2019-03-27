export default {
  data() {
    return {
      searchData: {
        // 搜索条件
        page: 1,
        pageSize: 10 // 分页大小
      },
      // 总条数
      total: 0,
      pageSizeOpts: [10, 30, 50],
      layout: 'total, sizes, prev, pager, next, jumper'
    };
  },
  methods: {
    pagerIndex(index) {
      return index + (this.searchData.page - 1) * this.searchData.pageSize + 1;
    }
  }
};

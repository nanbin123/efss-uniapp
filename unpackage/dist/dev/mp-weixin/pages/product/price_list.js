"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productList: [],
      pageNum: 1,
      // 当前页
      pageSize: 10,
      // 每页条数				
      searchVal: "",
      searchProduct: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { moreSearchStore };
  },
  methods: {
    getProductList() {
      let product = this.moreSearchStore.moreSearch;
      this.searchProduct = product;
      this.$refs.paging.reload();
    },
    refreshProductList() {
      components_utils_request.post("product/selectListProduct", this.searchProduct).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchProduct.pageNum = pageNo;
      this.refreshProductList();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/product/price_query"
      });
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      this.searchProduct.productNameOrType = newVal;
      this.$refs.paging.reload();
    }
  },
  onLoad() {
    this.moreSearchStore.clearMoreSearchStore();
  }
};
if (!Array) {
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  _easycom_z_paging2();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  _easycom_z_paging();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.s("backgroundImage:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    b: $data.searchVal,
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.o(($event) => $options.moreSearch()),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.texture),
        g: common_vendor.t(item.retailPrice),
        h: "/pages/product/price_detail?id=" + item.id
      };
    }),
    f: $options.getImgUrl("static/image/茶几.png"),
    g: common_vendor.sr("paging", "1c84ae56-0"),
    h: common_vendor.o($options.queryList),
    i: common_vendor.o(($event) => $data.productList = $event),
    j: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1c84ae56"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      productList: [],
      searchProduct: {},
      searchVal: ""
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { moreSearchStore };
  },
  methods: {
    getProductList() {
      let customer = this.moreSearchStore.moreSearch;
      this.searchProduct = customer;
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
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/product/product_query"
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
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
    a: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    b: $data.searchVal,
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.o(($event) => $options.moreSearch()),
    e: common_vendor.f($data.productList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.size),
        d: common_vendor.t(item.production),
        e: common_vendor.t(item.productCategoryName),
        f: common_vendor.t(item.color),
        g: common_vendor.t(item.texture),
        h: common_vendor.t(item.stock),
        i: common_vendor.t(item.retailPrice),
        j: common_vendor.t(item.purchasePrice),
        k: "/pages/product/product_detail?id=" + item.id
      };
    }),
    f: common_vendor.sr("paging", "75a4ac1f-0"),
    g: common_vendor.o($options.queryList),
    h: common_vendor.o(($event) => $data.productList = $event),
    i: common_vendor.p({
      modelValue: $data.productList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-75a4ac1f"]]);
wx.createPage(MiniProgramPage);

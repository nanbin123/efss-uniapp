"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      customerList: [],
      fullStarUrl: "static/image/cusomer/star.png",
      nullStarUrl: "static/image/cusomer/empty.png",
      searchCustomer: {},
      searchVal: ""
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { moreSearchStore };
  },
  methods: {
    refreshCustomerList() {
      components_utils_request.post("customer/selectIntendedCustomers", this.searchCustomer).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchCustomer.pageNum = pageNo;
      this.searchCustomer.customerNameOrPhone = this.searchVal;
      this.refreshCustomerList(this.searchCustomer);
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/customer/customer_query"
      });
    },
    getCustomerList() {
      let customer = this.moreSearchStore.moreSearch;
      this.searchCustomer = customer;
      this.$refs.paging.reload();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
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
    e: common_vendor.f($data.customerList, (item, index, i0) => {
      return common_vendor.e({
        a: item.isOrder == "ordered"
      }, item.isOrder == "ordered" ? {
        b: common_vendor.t(item.orderNumber),
        c: common_vendor.t(item.orderTime)
      } : {}, {
        d: common_vendor.t(item.customerName),
        e: common_vendor.t(item.phone),
        f: common_vendor.t(item.sex),
        g: common_vendor.t(item.address),
        h: common_vendor.t(item.quotation),
        i: item.grade > 0 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
        j: item.grade > 1 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
        k: item.grade > 2 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
        l: common_vendor.t(item.createTime),
        m: common_vendor.t(item.operator),
        n: item.isOrder == "no_order"
      }, item.isOrder == "no_order" ? {} : {}, {
        o: item.isOrder == "ordered"
      }, item.isOrder == "ordered" ? {} : {}, {
        p: "/pages/customer/customer_detail?id=" + item.id,
        q: item.id
      });
    }),
    f: common_vendor.sr("paging", "75176b2f-0"),
    g: common_vendor.o($options.queryList),
    h: common_vendor.o(($event) => $data.customerList = $event),
    i: common_vendor.p({
      modelValue: $data.customerList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-75176b2f"]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      orderList: [],
      pageNum: 1,
      searchVal: "",
      searchOrder: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return { moreSearchStore };
  },
  methods: {
    refreshOrderList() {
      components_utils_request.post("order/selectOrder", this.searchOrder).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchOrder.pageNum = pageNo;
      this.searchOrder.customerNameOrPhone = this.searchVal;
      this.refreshOrderList(this.searchOrder);
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/order/order_query"
      });
    },
    getOrderList() {
      let order = this.moreSearchStore.moreSearch;
      this.searchOrder = order;
      this.$refs.paging.reload();
    },
    sexConvert(sex) {
      if ("1" == sex) {
        return "男";
      } else {
        return "女";
      }
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(val) {
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
    e: common_vendor.f($data.orderList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.orderNumber),
        b: common_vendor.t(item.customerName),
        c: common_vendor.t(item.customerPhone),
        d: common_vendor.t(item.customerAddress),
        e: common_vendor.t($options.sexConvert(item.sex)),
        f: common_vendor.t(item.deliveryTime),
        g: common_vendor.t(item.productNames),
        h: common_vendor.t(item.actualmoney),
        i: common_vendor.t(item.createTime),
        j: common_vendor.t(item.operator),
        k: "/pages/order/order_deatil?id=" + item.id,
        l: item.id
      };
    }),
    f: common_vendor.sr("paging", "1ff580a7-0"),
    g: common_vendor.o($options.queryList),
    h: common_vendor.o(($event) => $data.orderList = $event),
    i: common_vendor.p({
      modelValue: $data.orderList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1ff580a7"]]);
wx.createPage(MiniProgramPage);

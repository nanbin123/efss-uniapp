"use strict";
const common_vendor = require("../../common/vendor.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  data() {
    return {
      fullStarUrl: "static/image/cusomer/star.png",
      nullStarUrl: "static/image/cusomer/empty.png",
      start_date: "",
      orderForm: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return {
      moreSearchStore
    };
  },
  methods: {
    toggle(val) {
      this.$refs[val].show();
    },
    startHand(value) {
      this.orderForm.startTime = value.result;
    },
    endHand(value) {
      this.orderForm.endTime = value.result;
    },
    search() {
      let order = this.orderForm;
      this.moreSearchStore.addMoreSearch(order);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getOrderList();
          }
        });
      }
    },
    clearFilters() {
      let that = this;
      Object.keys(this.orderForm).forEach(function(key) {
        that.orderForm[key] = "";
      });
      this.moreSearchStore.addMoreSearchOrder(this.orderForm);
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  onShow() {
    this.orderForm = this.moreSearchStore.moreSearch;
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  _component_cPicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/order/cusomer_name_add.png"),
    b: $data.orderForm.customerName,
    c: common_vendor.o(($event) => $data.orderForm.customerName = $event.detail.value),
    d: $options.getImgUrl("static/image/order/cusomer_phone.png"),
    e: $data.orderForm.phone,
    f: common_vendor.o(($event) => $data.orderForm.phone = $event.detail.value),
    g: $options.getImgUrl("static/image/order/cusomer_address.png"),
    h: $data.orderForm.address,
    i: common_vendor.o(($event) => $data.orderForm.address = $event.detail.value),
    j: $options.getImgUrl("static/image/order/order_number.png"),
    k: $data.orderForm.orderNumber,
    l: common_vendor.o(($event) => $data.orderForm.orderNumber = $event.detail.value),
    m: $options.getImgUrl("static/image/order/start_time.png"),
    n: common_vendor.t($options.isEmpty($data.orderForm.startTime) ? "请选择" : $data.orderForm.startTime),
    o: common_vendor.o(($event) => $options.toggle("start_date")),
    p: $options.isEmpty($data.orderForm.startTime) ? "#a0a0a0" : "#333",
    q: common_vendor.sr("start_date", "10e54755-0"),
    r: common_vendor.o($options.startHand),
    s: common_vendor.p({
      mode: "date"
    }),
    t: $options.getImgUrl("static/image/order/end_time.png"),
    v: common_vendor.t($options.isEmpty($data.orderForm.endTime) ? "请选择" : $data.orderForm.endTime),
    w: common_vendor.o(($event) => $options.toggle("end_date")),
    x: $options.isEmpty($data.orderForm.endTime) ? "#a0a0a0" : "#333",
    y: common_vendor.sr("end_date", "10e54755-1"),
    z: common_vendor.o($options.endHand),
    A: common_vendor.p({
      mode: "date"
    }),
    B: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    C: common_vendor.o((...args) => $options.search && $options.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-10e54755"]]);
wx.createPage(MiniProgramPage);

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
      customer: {}
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
      this.customer.startTime = value.result;
    },
    endHand(value) {
      this.customer.endTime = value.result;
    },
    changeStar(val) {
      this.customer.grade = val;
    },
    search() {
      let customer = this.customer;
      this.moreSearchStore.addMoreSearch(customer);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getCustomerList();
          }
        });
      }
    },
    clearFilters() {
      let _this = this;
      Object.keys(this.customer).forEach(function(key) {
        _this.customer[key] = "";
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  onShow() {
    this.customer = this.moreSearchStore.moreSearch;
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  _component_cPicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/cusomer/cusomer_name.png"),
    b: $data.customer.customerName,
    c: common_vendor.o(($event) => $data.customer.customerName = $event.detail.value),
    d: $options.getImgUrl("static/image/cusomer/customer_phone.png"),
    e: $data.customer.phone,
    f: common_vendor.o(($event) => $data.customer.phone = $event.detail.value),
    g: $options.getImgUrl("static/image/cusomer/cusomer_address.png"),
    h: $data.customer.address,
    i: common_vendor.o(($event) => $data.customer.address = $event.detail.value),
    j: $options.getImgUrl("static/image/cusomer/order_number.png"),
    k: $data.customer.orderNumber,
    l: common_vendor.o(($event) => $data.customer.orderNumber = $event.detail.value),
    m: $options.getImgUrl("static/image/cusomer/start_time.png"),
    n: common_vendor.t($options.isEmpty($data.customer.startTime) ? "请选择" : $data.customer.startTime),
    o: common_vendor.o(($event) => $options.toggle("start_date")),
    p: $options.isEmpty($data.customer.startTime) ? "#a0a0a0" : "#333",
    q: common_vendor.sr("start_date", "91ec2f61-0"),
    r: common_vendor.o($options.startHand),
    s: common_vendor.p({
      mode: "date"
    }),
    t: $options.getImgUrl("static/image/cusomer/end_time.png"),
    v: common_vendor.t($options.isEmpty($data.customer.endTime) ? "请选择" : $data.customer.endTime),
    w: common_vendor.o(($event) => $options.toggle("end_date")),
    x: $options.isEmpty($data.customer.endTime) ? "#a0a0a0" : "#333",
    y: common_vendor.sr("end_date", "91ec2f61-1"),
    z: common_vendor.o($options.endHand),
    A: common_vendor.p({
      mode: "date"
    }),
    B: $options.getImgUrl("static/image/cusomer/degree.png"),
    C: common_vendor.o(($event) => $options.changeStar(1)),
    D: $data.customer.grade > 0 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    E: common_vendor.o(($event) => $options.changeStar(2)),
    F: $data.customer.grade > 1 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    G: common_vendor.o(($event) => $options.changeStar(3)),
    H: $data.customer.grade > 2 ? _ctx.BASEURL + $data.fullStarUrl : _ctx.BASEURL + $data.nullStarUrl,
    I: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    J: common_vendor.o((...args) => $options.search && $options.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-91ec2f61"]]);
wx.createPage(MiniProgramPage);

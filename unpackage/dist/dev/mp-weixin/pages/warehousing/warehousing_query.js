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
      warehousingEntry: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return {
      moreSearchStore
    };
  },
  methods: {
    search() {
      let warehousingEntry = this.warehousingEntry;
      this.moreSearchStore.addMoreSearch(warehousingEntry);
      let pages = getCurrentPages();
      if (pages.length > 1) {
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getWarehousingEntryList();
          }
        });
      }
    },
    clearFilters() {
      let _this = this;
      Object.keys(this.warehousingEntry).forEach(function(key) {
        _this.warehousingEntry[key] = "";
      });
      this.moreSearchStore.clearMoreSearchStore();
    },
    toggle(val) {
      this.$refs[val].show();
    },
    recordHand(value) {
      this.warehousingEntry.recordDate = value.result;
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    },
    isEmpty(str) {
      return typeof str === "undefined" || "" === str;
    }
  },
  onShow() {
    this.warehousingEntry = this.moreSearchStore.moreSearch;
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  _component_cPicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/warehousing/warehousing-number.png"),
    b: $data.warehousingEntry.warehousingNumber,
    c: common_vendor.o(($event) => $data.warehousingEntry.warehousingNumber = $event.detail.value),
    d: $options.getImgUrl("static/image/warehousing/record_date.png"),
    e: common_vendor.t($options.isEmpty($data.warehousingEntry.recordDate) ? "请选择" : $data.warehousingEntry.recordDate),
    f: common_vendor.o(($event) => $options.toggle("record_date")),
    g: $options.isEmpty($data.warehousingEntry.recordDate) ? "#a0a0a0" : "#333",
    h: common_vendor.sr("record_date", "e0f813da-0"),
    i: common_vendor.o($options.recordHand),
    j: common_vendor.p({
      mode: "date"
    }),
    k: $options.getImgUrl("static/image/warehousing/supplier.png"),
    l: $data.warehousingEntry.supplier,
    m: common_vendor.o(($event) => $data.warehousingEntry.supplier = $event.detail.value),
    n: common_vendor.o((...args) => $options.clearFilters && $options.clearFilters(...args)),
    o: common_vendor.o((...args) => $options.search && $options.search(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e0f813da"]]);
wx.createPage(MiniProgramPage);

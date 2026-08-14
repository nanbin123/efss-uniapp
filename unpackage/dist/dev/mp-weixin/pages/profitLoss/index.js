"use strict";
const common_vendor = require("../../common/vendor.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  data() {
    return {
      dateQuery: "选择时间"
    };
  },
  methods: {
    toggle(val) {
      this.$refs[val].show();
    },
    dateQueryHand(value) {
      this.dateQuery = value.result;
    }
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  _component_cPicker();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.dateQuery),
    b: common_vendor.o(($event) => $options.toggle("date-query")),
    c: $data.dateQuery == "选择时间" ? "#a0a0a0" : "#333",
    d: common_vendor.sr("date-query", "0e62d538-0"),
    e: common_vendor.o($options.dateQueryHand),
    f: common_vendor.p({
      mode: "date"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);

"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const _sfc_main = {
  data() {
    return {
      completionStatus: "新单据",
      completionStatusList: ["新单据", "未完成", "已完成"],
      outboundList: [],
      searchOutbound: {},
      searchVal: ""
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return {
      moreSearchStore
    };
  },
  methods: {
    changeCompletionStatus(completionStatus) {
      this.completionStatus = completionStatus;
      this.$refs.paging.reload();
    },
    refreshOutboundList() {
      components_utils_request.post("outbound/selectOutbound", this.searchOutbound).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      let outbound = this.moreSearchStore.moreSearch;
      this.searchOutbound = outbound;
      this.searchOutbound.pageNum = pageNo;
      this.searchOutbound.customerNameOrPhone = this.searchVal;
      this.searchOutbound.completionStatus = this.completionStatus;
      this.refreshOutboundList();
    },
    getOutbountList() {
      this.$refs.paging.reload();
    },
    moreSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/outbound/outbound_query"
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      if (newVal != null) {
        this.searchOutbound = { "customerNameOrPhone": newVal };
        this.$refs.paging.reload();
      }
    }
  },
  onLoad() {
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
    a: common_vendor.f($data.completionStatusList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: $data.completionStatus == item ? 1 : "",
        c: common_vendor.o(($event) => $options.changeCompletionStatus(item))
      };
    }),
    b: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    c: $data.searchVal,
    d: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    e: common_vendor.o(($event) => $options.moreSearch()),
    f: common_vendor.f($data.outboundList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.customerName),
        b: common_vendor.t(item.phone),
        c: common_vendor.t(item.recordDate),
        d: common_vendor.t(item.handledBy),
        e: common_vendor.t(item.orderNumber),
        f: "/pages/outbound/outbound_details?id=" + item.id
      };
    }),
    g: common_vendor.sr("paging", "888efe3f-0"),
    h: common_vendor.o($options.queryList),
    i: common_vendor.o(($event) => $data.outboundList = $event),
    j: common_vendor.p({
      modelValue: $data.outboundList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-888efe3f"]]);
wx.createPage(MiniProgramPage);

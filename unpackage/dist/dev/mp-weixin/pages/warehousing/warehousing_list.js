"use strict";
const components_utils_request = require("../../components/utils/request.js");
const store_modules_moreSearch = require("../../store/modules/moreSearch.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchVal: "",
      completionStatus: "新单据",
      completionStatusList: ["新单据", "未完成", "已完成"],
      warehousingEntryList: [],
      searchWarehousing: {}
    };
  },
  setup() {
    const moreSearchStore = store_modules_moreSearch.useMoreSearchStore();
    return {
      moreSearchStore
    };
  },
  methods: {
    refreshWarehousingList() {
      components_utils_request.post("warehousing/selectListWarehousingEntry", this.searchWarehousing).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      let warehousing = this.moreSearchStore.moreSearch;
      this.searchWarehousing = warehousing;
      this.searchWarehousing.pageNum = pageNo;
      this.searchWarehousing.productNames = this.searchVal;
      this.searchWarehousing.completionStatus = this.completionStatus;
      this.refreshWarehousingList();
    },
    getWarehousingEntryList() {
      this.$refs.paging.reload();
    },
    changeCompletionStatus(completionStatus) {
      this.completionStatus = completionStatus;
      this.$refs.paging.reload();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(val) {
      this.$refs.paging.reload();
    }
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
    e: common_vendor.f($data.warehousingEntryList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.handledBy),
        b: common_vendor.t(item.warehousingNumber),
        c: common_vendor.t(item.recordDate),
        d: common_vendor.t(item.supplier),
        e: common_vendor.t(item.productNames),
        f: "/pages/warehousing/warehousing_details?id=" + item.id,
        g: item.id
      };
    }),
    f: common_vendor.sr("paging", "44b24dac-0"),
    g: common_vendor.o($options.queryList),
    h: common_vendor.o(($event) => $data.warehousingEntryList = $event),
    i: common_vendor.p({
      modelValue: $data.warehousingEntryList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-44b24dac"]]);
wx.createPage(MiniProgramPage);

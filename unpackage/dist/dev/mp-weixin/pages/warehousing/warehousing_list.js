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
      statusTouchStart: null,
      statusSwipeUntil: 0,
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
  onShow() {
    if (this.$refs.paging) {
      this.$refs.paging.reload();
    }
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
      if (Date.now() < this.statusSwipeUntil || completionStatus === this.completionStatus)
        return;
      this.completionStatus = completionStatus;
      this.$refs.paging.reload();
    },
    onStatusTouchStart(event) {
      this.statusTouchStart = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    },
    onStatusTouchMove(event) {
      if (!this.statusTouchStart)
        return;
      if (event.touches.length !== 1) {
        this.onStatusTouchCancel();
        return;
      }
      const dx = Math.abs(event.touches[0].clientX - this.statusTouchStart.x);
      const dy = Math.abs(event.touches[0].clientY - this.statusTouchStart.y);
      if (dy > 10 && dy > dx)
        this.onStatusTouchCancel();
    },
    onStatusTouchEnd(event) {
      const start = this.statusTouchStart;
      this.onStatusTouchCancel();
      if (!start || !event.changedTouches.length)
        return;
      const dx = event.changedTouches[0].clientX - start.x;
      const dy = event.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5)
        return;
      const index = this.completionStatusList.indexOf(this.completionStatus);
      const nextIndex = index + (dx < 0 ? 1 : -1);
      if (nextIndex >= 0 && nextIndex < this.completionStatusList.length) {
        this.statusSwipeUntil = 0;
        this.changeCompletionStatus(this.completionStatusList[nextIndex]);
      }
      this.statusSwipeUntil = Date.now() + 300;
    },
    onStatusTouchCancel() {
      this.statusTouchStart = null;
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
        b: item,
        c: $data.completionStatus == item ? 1 : "",
        d: common_vendor.o(($event) => $options.changeCompletionStatus(item), item)
      };
    }),
    b: common_vendor.o((...args) => $options.onStatusTouchStart && $options.onStatusTouchStart(...args), "b3"),
    c: common_vendor.o((...args) => $options.onStatusTouchMove && $options.onStatusTouchMove(...args), "4f"),
    d: common_vendor.o((...args) => $options.onStatusTouchEnd && $options.onStatusTouchEnd(...args), "22"),
    e: common_vendor.o((...args) => $options.onStatusTouchCancel && $options.onStatusTouchCancel(...args), "d5"),
    f: common_vendor.s("background-image:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    g: $data.searchVal,
    h: common_vendor.o(($event) => $data.searchVal = $event.detail.value, "57"),
    i: common_vendor.f($data.warehousingEntryList, (item, index, i0) => {
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
    j: common_vendor.o((...args) => $options.onStatusTouchStart && $options.onStatusTouchStart(...args), "f0"),
    k: common_vendor.o((...args) => $options.onStatusTouchMove && $options.onStatusTouchMove(...args), "19"),
    l: common_vendor.o((...args) => $options.onStatusTouchEnd && $options.onStatusTouchEnd(...args), "cb"),
    m: common_vendor.o((...args) => $options.onStatusTouchCancel && $options.onStatusTouchCancel(...args), "30"),
    n: common_vendor.sr("paging", "44b24dac-0"),
    o: common_vendor.o($options.queryList, "82"),
    p: common_vendor.o(($event) => $data.warehousingEntryList = $event, "a8"),
    q: common_vendor.p({
      ["safe-area-inset-bottom"]: true,
      ["bottom-bg-color"]: "#38c1b9",
      modelValue: $data.warehousingEntryList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-44b24dac"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/warehousing/warehousing_list.js.map

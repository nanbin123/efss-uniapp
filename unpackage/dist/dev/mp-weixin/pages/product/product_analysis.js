"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  data() {
    return {
      productAnalysisList: [],
      show: false,
      titleText: "按销额",
      titleValue: "salesAmount",
      //默认按销额排序
      itemArr: [
        {
          text: "全部",
          value: ""
        },
        {
          text: "按销额",
          value: "salesAmount"
        },
        {
          text: "按销量",
          value: "salesQuantity"
        }
      ],
      dateStart: "",
      dateEnd: ""
    };
  },
  methods: {
    resetSearch() {
      this.dateStart = "";
      this.dateEnd = "";
      this.titleText = "按销额";
      this.titleValue = "salesAmount";
      this.show = false;
      this.$refs.paging.reload();
    },
    previewImage(item) {
      const images = Array.isArray(item.productImages) ? item.productImages : [];
      const urls = images.filter((img) => img && typeof img.productUrl === "string" && img.productUrl.trim()).map((img) => {
        const url = img.productUrl.trim();
        return /^https?:\/\//i.test(url) ? url : this.BASEURL.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
      });
      if (!urls.length) {
        common_vendor.index.showToast({ title: "暂无更多图片", icon: "none" });
        return;
      }
      common_vendor.index.previewImage({ current: urls[0], urls, indicator: "number", loop: true });
    },
    async refreshOrderList(pageNo) {
      const res = await components_utils_request.post("statistics/selectListProductAnalysis", { "pageNum": pageNo, "startTime": this.dateStart, "endTime": this.dateEnd, "sort": this.titleValue });
      const rows = res.rows.map((item) => ({
        ...item,
        productImages: Array.isArray(item.productImages) ? item.productImages.filter((img) => img && typeof img.productUrl === "string" && img.productUrl.trim()) : []
      }));
      await this.$refs.paging.complete(rows);
    },
    queryList(pageNo, pageSize) {
      this.refreshOrderList(pageNo);
    },
    //显示下拉框
    itemClick() {
      this.show = !this.show;
    },
    //按销量或者按销售额度
    subItemClick(index) {
      this.titleText = this.itemArr[index]["text"];
      this.titleValue = this.itemArr[index]["value"];
      this.show = false;
      this.$refs.paging.reload();
    },
    //关闭
    maskClose() {
      this.show = false;
    },
    //关闭
    touchControl() {
      this.maskClose();
    },
    toggle(val) {
      this.$refs[val].show();
    },
    // 开始时间
    dateStartHand(value) {
      this.dateStart = value.result;
      this.$refs.paging.reload();
    },
    // 结束时间
    dateEndHand(value) {
      this.dateEnd = value.result;
      this.$refs.paging.reload();
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  }
};
if (!Array) {
  const _component_cPicker = common_vendor.resolveComponent("cPicker");
  const _easycom_z_paging2 = common_vendor.resolveComponent("z-paging");
  (_component_cPicker + _easycom_z_paging2)();
}
const _easycom_z_paging = () => "../../uni_modules/z-paging/components/z-paging/z-paging.js";
if (!Math) {
  _easycom_z_paging();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.titleText),
    b: $data.show ? 1 : "",
    c: common_vendor.o((...args) => $options.itemClick && $options.itemClick(...args), "c1"),
    d: !$data.dateStart
  }, !$data.dateStart ? {} : {
    e: common_vendor.t($data.dateStart)
  }, {
    f: common_vendor.o(($event) => $options.toggle("start_date"), "32"),
    g: common_vendor.sr("start_date", "9d2bcbee-1,9d2bcbee-0"),
    h: common_vendor.o($options.dateStartHand, "c0"),
    i: common_vendor.p({
      mode: "date"
    }),
    j: !$data.dateEnd
  }, !$data.dateEnd ? {} : {
    k: common_vendor.t($data.dateEnd)
  }, {
    l: common_vendor.o(($event) => $options.toggle("end_date"), "1e"),
    m: common_vendor.sr("end_date", "9d2bcbee-2,9d2bcbee-0"),
    n: common_vendor.o($options.dateEndHand, "37"),
    o: common_vendor.p({
      mode: "date"
    }),
    p: common_vendor.o((...args) => $options.resetSearch && $options.resetSearch(...args), "54"),
    q: common_vendor.f($data.itemArr, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.text),
        b: $data.titleValue === item.value
      }, $data.titleValue === item.value ? {} : {}, {
        c: $data.titleValue === item.value ? 1 : "",
        d: index,
        e: common_vendor.o(($event) => $options.subItemClick(index), index)
      });
    }),
    r: $data.show ? "1" : "0",
    s: $data.show ? "block" : "none",
    t: common_vendor.n($data.show ? "bg-mask-show" : ""),
    v: common_vendor.o((...args) => $options.maskClose && $options.maskClose(...args), "41"),
    w: common_vendor.o((...args) => $options.touchControl && $options.touchControl(...args), "18"),
    x: common_vendor.f($data.productAnalysisList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.production),
        d: common_vendor.t(item.texture),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.retailPrice),
        g: common_vendor.t(item.salesAmount),
        h: common_vendor.t(item.salesQuantity),
        i: item.productImages && item.productImages.length
      }, item.productImages && item.productImages.length ? {
        j: common_vendor.t(item.productImages.length)
      } : {}, {
        k: common_vendor.o(($event) => $options.previewImage(item), index),
        l: index
      });
    }),
    y: common_vendor.sr("paging", "9d2bcbee-0"),
    z: common_vendor.o($options.queryList, "23"),
    A: common_vendor.o(($event) => $data.productAnalysisList = $event, "7e"),
    B: common_vendor.p({
      modelValue: $data.productAnalysisList
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9d2bcbee"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/product/product_analysis.js.map

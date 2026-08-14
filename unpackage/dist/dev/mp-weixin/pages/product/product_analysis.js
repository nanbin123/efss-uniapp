"use strict";
const components_utils_request = require("../../components/utils/request.js");
const common_vendor = require("../../common/vendor.js");
const cPicker = () => "../../components/c-picker/c-picker.js";
const _sfc_main = {
  components: {
    cPicker
  },
  data() {
    return {
      productAnalysisList: [],
      show: false,
      titleText: "全部",
      titleValue: "",
      //排序默认全部
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
    refreshOrderList(pageNo) {
      components_utils_request.post("statistics/selectListProductAnalysis", { "pageNum": pageNo, "startTime": this.dateStart, "endTime": this.dateEnd, "sort": this.titleValue }).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
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
    b: $options.getImgUrl("static/image/product/arrow.png"),
    c: common_vendor.o((...args) => $options.itemClick && $options.itemClick(...args)),
    d: $data.dateStart == ""
  }, $data.dateStart == "" ? {} : {
    e: common_vendor.t($data.dateStart)
  }, {
    f: common_vendor.o(($event) => $options.toggle("start_date")),
    g: common_vendor.sr("start_date", "9d2bcbee-1,9d2bcbee-0"),
    h: common_vendor.o($options.dateStartHand),
    i: common_vendor.p({
      mode: "date"
    }),
    j: $data.dateEnd == ""
  }, $data.dateEnd == "" ? {} : {
    k: common_vendor.t($data.dateEnd)
  }, {
    l: common_vendor.o(($event) => $options.toggle("end_date")),
    m: common_vendor.sr("end_date", "9d2bcbee-2,9d2bcbee-0"),
    n: common_vendor.o($options.dateEndHand),
    o: common_vendor.p({
      mode: "date"
    }),
    p: common_vendor.f($data.itemArr, (item, index, i0) => {
      return {
        a: common_vendor.t(item["text"]),
        b: index,
        c: common_vendor.o(($event) => $options.subItemClick(index), index)
      };
    }),
    q: $data.show ? "1" : "0",
    r: $data.show ? "block" : "none",
    s: common_vendor.n($data.show ? "bg-mask-show" : ""),
    t: common_vendor.o((...args) => $options.maskClose && $options.maskClose(...args)),
    v: common_vendor.o((...args) => $options.touchControl && $options.touchControl(...args)),
    w: common_vendor.f($data.productAnalysisList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.productName),
        b: common_vendor.t(item.type),
        c: common_vendor.t(item.production),
        d: common_vendor.t(item.texture),
        e: common_vendor.t(item.color),
        f: common_vendor.t(item.retailPrice),
        g: common_vendor.t(item.orderCreateTime),
        h: common_vendor.t(item.salesQuantity),
        i: common_vendor.t(item.salesAmount),
        j: index
      };
    }),
    x: $options.getImgUrl("static/image/茶几.png"),
    y: common_vendor.sr("paging", "9d2bcbee-0"),
    z: common_vendor.o($options.queryList),
    A: common_vendor.o(($event) => $data.productAnalysisList = $event),
    B: common_vendor.p({
      modelValue: $data.productAnalysisList
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9d2bcbee"]]);
wx.createPage(MiniProgramPage);

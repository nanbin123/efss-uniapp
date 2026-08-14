"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      orderList: [],
      searchVal: "",
      searchImportOrder: {}
    };
  },
  methods: {
    refreshImportOrderList() {
      components_utils_request.post("receipt/selectOrderList", this.searchImportOrder).then((res) => {
        this.$refs.paging.complete(res.rows);
      });
    },
    queryList(pageNo, pageSize) {
      this.searchImportOrder.pageNum = pageNo;
      this.refreshImportOrderList();
    },
    sexConvert(sex) {
      if ("1" == sex) {
        return "男";
      } else {
        return "女";
      }
    },
    chooseOrder(id) {
      let pages = getCurrentPages();
      if (pages.length > 1) {
        pages[pages.length - 2];
        common_vendor.index.navigateBack({
          delta: 1,
          success: (event) => {
            pages[pages.length - 2].$vm.getOrderById(id);
          }
        });
      }
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  watch: {
    searchVal(newVal, oldVal) {
      if (newVal != null) {
        this.searchImportOrder = { "customerNameOrPhone": newVal };
        this.$refs.paging.reload();
      }
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
    a: common_vendor.s("backgroundImage:url(" + $options.getImgUrl("static/image/search.png") + ")"),
    b: $data.searchVal,
    c: common_vendor.o(($event) => $data.searchVal = $event.detail.value),
    d: common_vendor.f($data.orderList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.orderNumber),
        b: common_vendor.t(item.customerName),
        c: common_vendor.t($options.sexConvert(item.sex)),
        d: common_vendor.t(item.phone),
        e: common_vendor.t(item.address),
        f: common_vendor.t(item.deliveryTime),
        g: common_vendor.t(item.productNames),
        h: common_vendor.t(item.actualmoney),
        i: common_vendor.t(item.createTime),
        j: common_vendor.t(item.updateBy),
        k: common_vendor.o(($event) => $options.chooseOrder(item.id))
      };
    }),
    e: common_vendor.sr("paging", "6277de8e-0"),
    f: common_vendor.o($options.queryList),
    g: common_vendor.o(($event) => $data.orderList = $event),
    h: common_vendor.p({
      modelValue: $data.orderList
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6277de8e"]]);
wx.createPage(MiniProgramPage);

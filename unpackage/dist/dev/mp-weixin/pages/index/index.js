"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const store_modules_user = require("../../store/modules/user.js");
const _sfc_main = {
  data() {
    return {};
  },
  setup() {
    const userStore = store_modules_user.useUserStore();
    return { userStore };
  },
  methods: {
    navTo(url) {
      common_vendor.index.navigateTo({
        url
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  onLoad() {
    components_utils_request.post("getPermissions").then((res) => {
      this.userStore.addPermissions(res.permissions);
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getImgUrl("static/image/banner/banner01.png"),
    b: $options.getImgUrl("static/image/index/query_cusomer.png"),
    c: _ctx.hasPermi(["cusomer:list", "cusomer:query"]),
    d: common_vendor.o(($event) => $options.navTo("/pages/customer/customer_list")),
    e: $options.getImgUrl("static/image/index/order_list.png"),
    f: common_vendor.o(($event) => $options.navTo("/pages/order/order_list")),
    g: _ctx.hasPermi(["order:list", "order:query"]),
    h: $options.getImgUrl("static/image/index/price_list.png"),
    i: _ctx.hasPermi(["product:price:list"]),
    j: common_vendor.o(($event) => $options.navTo("/pages/product/price_list")),
    k: $options.getImgUrl("static/image/index/product_analysis.png"),
    l: _ctx.hasPermi(["product:analysis:list"]),
    m: common_vendor.o(($event) => $options.navTo("/pages/product/product_analysis")),
    n: $options.getImgUrl("static/image/index/sales_kanban.png"),
    o: _ctx.hasPermi(["sales:signage"]),
    p: common_vendor.o(($event) => $options.navTo("/pages/salesKanban/sales_kanban_list")),
    q: $options.getImgUrl("static/image/index/warehousing.png"),
    r: _ctx.hasPermi(["warehousing:list", "warehousing:query"]),
    s: common_vendor.o(($event) => $options.navTo("/pages/warehousing/warehousing_list")),
    t: $options.getImgUrl("static/image/index/receipt_doc.png"),
    v: _ctx.hasPermi(["outbound:list", "outbound:query"]),
    w: common_vendor.o(($event) => $options.navTo("/pages/outbound/outbound_list")),
    x: $options.getImgUrl("static/image/index/product_query.png"),
    y: _ctx.hasPermi(["product:list", "product:query"]),
    z: common_vendor.o(($event) => $options.navTo("/pages/product/product_list")),
    A: $options.getImgUrl("static/image/index/receipt.png"),
    B: _ctx.hasPermi(["receipt:list", "receipt:query"]),
    C: common_vendor.o(($event) => $options.navTo("/pages/receipt/receipt_list")),
    D: $options.getImgUrl("static/image/index/profit_and_loss.png"),
    E: _ctx.hasPermi(["profitloss:list"]),
    F: common_vendor.o(($event) => $options.navTo("/pages/profitLoss/index")),
    G: $options.getImgUrl("static/image/index/user.png"),
    H: _ctx.hasPermi(["personnel:list", "personnel:query"]),
    I: common_vendor.o(($event) => $options.navTo("/pages/user/user_list"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);

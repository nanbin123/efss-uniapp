"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
require("./store/modules/user.js");
const store_index = require("./store/index.js");
const components_utils_hasPermi = require("./components/utils/hasPermi.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/index/index.js";
  "./pages/product/product_analysis.js";
  "./pages/order/order_add.js";
  "./pages/order/order_list.js";
  "./pages/order/order_deatil.js";
  "./pages/order/order_product.js";
  "./pages/cusomer/cusomer_detail.js";
  "./pages/cusomer/cusomer_list.js";
  "./pages/cusomer/customer_product.js";
  "./pages/cusomer/index.js";
  "./pages/cusomer/cusomer_add.js";
  "./pages/profitLoss/index.js";
  "./pages/salesKanban/sales_kanban_list.js";
  "./pages/receipt/receipt_add.js";
  "./pages/receipt/import_order.js";
  "./pages/receipt/receipt_list.js";
  "./pages/receipt/receipt_detail.js";
  "./pages/outbound/outbound_list.js";
  "./pages/outbound/outbound_details.js";
  "./pages/outbound/outbound_add.js";
  "./pages/outbound/import_order.js";
  "./pages/warehousing/warehousing_list.js";
  "./pages/warehousing/warehousing_details.js";
  "./pages/warehousing/warehousing_add.js";
  "./pages/warehousing/warehousing_product.js";
  "./pages/warehousing/warehousing_query.js";
  "./pages/product/product_query.js";
  "./pages/product/price_list.js";
  "./pages/product/product_add.js";
  "./pages/product/category.js";
  "./pages/user/user_list.js";
  "./pages/user/user_add.js";
  "./pages/user/user_detail.js";
  "./pages/user/user_query.js";
  "./pages/test/test.js";
}
const _sfc_main = {
  data() {
    return {};
  },
  methods: {
    /* watchRouter(){
    	 let token = uni.getStorageSync("token");
    	 if(token || token ===0){
    		 useUserStore().getInfo()
    	 }
    } */
  },
  onLaunch: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "F:/efss/code/efss-uniapp/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.config.globalProperties.hasPermi = components_utils_hasPermi.hasPermi;
  app.config.globalProperties.BASEURL = "http://localhost:8080/";
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;

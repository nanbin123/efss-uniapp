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
  "./pages/order/order_query.js";
  "./pages/order/order_deatil.js";
  "./pages/order/order_product.js";
  "./pages/order/order_product_query.js";
  "./pages/customer/customer_detail.js";
  "./pages/customer/customer_list.js";
  "./pages/customer/customer_product.js";
  "./pages/customer/customer_product_query.js";
  "./pages/customer/customer_query.js";
  "./pages/customer/customer_add.js";
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
  "./pages/outbound/outbound_query.js";
  "./pages/warehousing/warehousing_list.js";
  "./pages/warehousing/warehousing_details.js";
  "./pages/warehousing/warehousing_add.js";
  "./pages/warehousing/warehousing_product.js";
  "./pages/warehousing/warehousing_product_query.js";
  "./pages/warehousing/warehousing_query.js";
  "./pages/product/product_list.js";
  "./pages/product/product_query.js";
  "./pages/product/product_detail.js";
  "./pages/product/price_list.js";
  "./pages/product/price_query.js";
  "./pages/product/price_detail.js";
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
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.hasPermi = components_utils_hasPermi.hasPermi;
  app.config.globalProperties.BASEURL = "http://127.0.0.1:8080/";
  app.use(store_index.store);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;

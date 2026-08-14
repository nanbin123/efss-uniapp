"use strict";
const common_vendor = require("../../common/vendor.js");
const useProductStore = common_vendor.defineStore("productStore", {
  state: () => {
    return {
      products: []
    };
  },
  actions: {
    addProduct(products) {
      this.products = products;
    },
    add(product) {
      this.products.push(product);
    },
    subtraction(productId) {
      const index = this.products.findIndex((item) => item.productId === productId);
      if (index !== -1) {
        this.products.splice(index, 1);
      }
    },
    clearProductStore() {
      let _this = this;
      Object.keys(this.products).forEach(function(key) {
        _this.products[key] = "";
      });
    }
  }
});
exports.useProductStore = useProductStore;

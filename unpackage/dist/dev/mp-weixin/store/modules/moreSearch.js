"use strict";
const common_vendor = require("../../common/vendor.js");
const useMoreSearchStore = common_vendor.defineStore("moreSearchStore", {
  state: () => {
    return {
      moreSearch: {}
    };
  },
  actions: {
    addMoreSearch(moreSearch) {
      this.moreSearch = moreSearch;
    },
    clearMoreSearchStore() {
      let _this = this;
      Object.keys(this.moreSearch).forEach(function(key) {
        _this.moreSearch[key] = "";
      });
    }
  }
});
exports.useMoreSearchStore = useMoreSearchStore;

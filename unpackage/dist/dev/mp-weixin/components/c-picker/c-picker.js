"use strict";
const common_vendor = require("../../common/vendor.js");
const forMatNum = (num) => {
  return num < 10 ? "0" + num : num + "";
};
const _sfc_main = {
  data() {
    return {
      result: [],
      data: {},
      pickVal: [],
      showPicker: false,
      resultStr: "",
      itemHeight: `height: 44px;`
    };
  },
  props: {
    mode: {
      type: String,
      default() {
        return "date";
      }
    },
    pageData: {
      type: String,
      default: ""
    }
  },
  methods: {
    useCurrent() {
      let aToday = /* @__PURE__ */ new Date();
      let tYear = aToday.getFullYear().toString();
      let tMonth = this.formatNum(aToday.getMonth() + 1).toString();
      let tDay = this.formatNum(aToday.getDate()).toString();
      return [tYear, tMonth, tDay];
    },
    formatNum(num) {
      return num < 10 ? "0" + num : num + "";
    },
    maskTap() {
      this.showPicker = false;
    },
    show() {
      this.showPicker = true;
    },
    hide() {
      this.showPicker = false;
    },
    pickerCancel() {
      this.$emit("cancel", {
        defaultVal: this.pickVal
      });
      this.showPicker = false;
    },
    pickerConfirm(e) {
      this.$emit("confirm", {
        result: this.resultStr
      });
      this.showPicker = false;
    },
    bindChange(val) {
      let _this = this;
      let arr = val.detail.value;
      let year = _this.data.years[arr[0]];
      let month = _this.data.months[arr[1]];
      let months = _this.initMonths(year);
      _this.data.months = months;
      let days = _this.initDays(year, month);
      _this.data.days = days;
      let day = _this.data.days[arr[2]];
      _this.resultStr = `${year + "-" + month + "-" + day}`;
    },
    initData(useCurrent) {
      let _this = this;
      let data = _this.init(useCurrent);
      let dVal = data.defaultVal;
      _this.data = data;
      let year = data.years[dVal[0]];
      let month = data.months[dVal[1]];
      let day = data.days[dVal[2]];
      _this.resultStr = `${year + "-" + month + "-" + day}`;
      _this.pickVal = dVal;
    },
    init(value) {
      let defaultVal = [];
      let curMonth = value[1];
      let curYear = value[0];
      let totalDays = new Date(curYear, curMonth, 0).getDate();
      let years = [];
      let months = [];
      let days = [];
      let endYear = (/* @__PURE__ */ new Date()).getFullYear();
      let startYear = (/* @__PURE__ */ new Date("1990")).getFullYear();
      for (let s = endYear; s >= startYear; s--) {
        years.push(s + "");
      }
      for (let m = 1; m <= 12; m++) {
        months.push(forMatNum(m));
      }
      for (let d = 1; d <= totalDays; d++) {
        days.push(forMatNum(d));
      }
      let returnArr = [
        years.indexOf(value[0]),
        months.indexOf(value[1]),
        days.indexOf(value[2])
      ];
      defaultVal = [returnArr[0], returnArr[1], returnArr[2]];
      return { years, months, days, defaultVal };
    },
    initDays: (year, month) => {
      let totalDays = new Date(year, month, 0).getDate();
      let dates = [];
      for (let d = 1; d <= totalDays; d++) {
        dates.push(forMatNum(d));
      }
      return dates;
    },
    initMonths: (year) => {
      let months = [];
      for (let m = 1; m <= 12; m++) {
        months.push(forMatNum(m));
      }
      return months;
    }
  },
  created() {
    this.initData(this.useCurrent());
  },
  watch: {
    pageData(val) {
      let aToday = new Date(val);
      let tYear = aToday.getFullYear().toString();
      let tMonth = this.formatNum(aToday.getMonth() + 1).toString();
      let tDay = this.formatNum(aToday.getDate()).toString();
      let useCurrent = [tYear, tMonth, tDay];
      let returnArr = [
        this.data.years.indexOf(useCurrent[0]),
        this.data.months.indexOf(useCurrent[1]),
        this.data.days.indexOf(useCurrent[2])
      ];
      let defaultVal = [returnArr[0], returnArr[1], returnArr[2]];
      let year = this.data.years[defaultVal[0]];
      let month = this.data.months[defaultVal[1]];
      let day = this.data.days[defaultVal[2]];
      this.resultStr = `${year + "-" + month + "-" + day}`;
      this.pickVal = defaultVal;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showPicker ? 1 : "",
    b: common_vendor.o((...args) => $options.maskTap && $options.maskTap(...args)),
    c: common_vendor.o(() => {
    }),
    d: common_vendor.o((...args) => $options.pickerCancel && $options.pickerCancel(...args)),
    e: common_vendor.o((...args) => $options.pickerConfirm && $options.pickerConfirm(...args)),
    f: common_vendor.o(() => {
    }),
    g: $props.mode == "date"
  }, $props.mode == "date" ? {
    h: common_vendor.f($data.data.years, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    i: common_vendor.f($data.data.months, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    j: common_vendor.f($data.data.days, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    }),
    k: $data.itemHeight,
    l: $data.pickVal,
    m: common_vendor.o((...args) => $options.bindChange && $options.bindChange(...args))
  } : {}, {
    n: $data.showPicker ? 1 : ""
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);

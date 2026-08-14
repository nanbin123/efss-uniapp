"use strict";
const common_vendor = require("../../common/vendor.js");
const components_utils_request = require("../../components/utils/request.js");
const _sfc_main = {
  data() {
    return {
      pageNum: 1,
      // 当前页
      status: "more",
      contentText: {
        contentdown: "上拉加载更多~",
        contentrefresh: "正在加载更多~",
        contentnomore: "我是有底线的~"
      },
      iconType: "auto",
      // 图标样式 
      show: false,
      titleText: "请选择时间段",
      itemArr: [
        {
          text: "按天查询",
          value: "day"
        },
        {
          text: "按周查询",
          value: "week"
        },
        {
          text: "按月查询",
          value: "month"
        },
        {
          text: "按季度查询",
          value: "quarter"
        },
        {
          text: "按年度查询",
          value: "year"
        }
      ],
      beforeTitle: "昨日业绩",
      nowTitle: "今日业绩",
      salesPerformanceList: []
    };
  },
  methods: {
    //选择时间段
    itemClick() {
      this.show = !this.show;
    },
    //替换标题
    subItemClick(index) {
      this.titleText = this.itemArr[index]["text"];
      this.show = false;
      this.titleValue = this.itemArr[index]["value"];
      switch (this.titleValue) {
        case "day":
          this.beforeTitle = "昨日业绩";
          this.nowTitle = "今日业绩";
          this.getList();
          break;
        case "week":
          this.beforeTitle = "上周业绩";
          this.nowTitle = "本周业绩";
          this.getList();
          break;
        case "month":
          this.beforeTitle = "上月业绩";
          this.nowTitle = "本月业绩";
          this.getList();
          break;
        case "quarter":
          this.beforeTitle = "上季度业绩";
          this.nowTitle = "本季度业绩";
          this.getList();
          break;
        case "year":
          this.beforeTitle = "上年业绩";
          this.nowTitle = "本年业绩";
          this.getList();
          break;
      }
    },
    //关闭选择时间段下拉框
    maskClose() {
      this.show = false;
    },
    //关闭选择时间段下拉框
    touchControl() {
      this.maskClose();
    },
    getList() {
      components_utils_request.post("statistics/selectListSalesPerformance", { "pageNum": this.pageNum, "queryScope": this.titleValue }).then((res) => {
        this.totalCount = res.total;
        if (this.totalCount >= 0) {
          this.salesPerformanceList = res.rows;
          common_vendor.index.hideLoading();
        }
        if (this.totalCount == this.salesPerformanceList.length) {
          this.status = "noMore";
        }
      });
    },
    getImgUrl(image) {
      return this.BASEURL + image;
    }
  },
  computed: {
    increase() {
      return function(item) {
        return item.nowData - item.beforeData;
      };
    }
  },
  onReachBottom() {
    if (this.totalCount > this.salesPerformanceList.length) {
      this.pageNum++;
      components_utils_request.post("statistics/selectListSalesPerformance", { "pageNum": this.pageNum, "queryScope": this.titleValue }).then((res) => {
        this.salesPerformanceList = this.salesPerformanceList.concat(res.rows);
        common_vendor.index.hideLoading();
      });
    } else if (this.totalCount == this.salesPerformanceList.length) {
      this.status = "noMore";
    }
  },
  onLoad() {
    components_utils_request.post("statistics/selectListSalesPerformance", { "pageNum": this.pageNum, "queryScope": "day" }).then((res) => {
      this.totalCount = res.total;
      if (this.totalCount >= 0) {
        this.salesPerformanceList = res.rows;
        common_vendor.index.hideLoading();
      }
      if (this.totalCount == this.salesPerformanceList.length) {
        this.status = "noMore";
      }
    });
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.titleText),
    b: $options.getImgUrl("static/image/product/arrow.png"),
    c: common_vendor.o((...args) => $options.itemClick && $options.itemClick(...args)),
    d: common_vendor.f($data.itemArr, (item, index, i0) => {
      return {
        a: common_vendor.t(item["text"]),
        b: index,
        c: common_vendor.o(($event) => $options.subItemClick(index), index)
      };
    }),
    e: $data.show ? "1" : "0",
    f: $data.show ? "block" : "none",
    g: common_vendor.n($data.show ? "bg-mask-show" : ""),
    h: common_vendor.o((...args) => $options.maskClose && $options.maskClose(...args)),
    i: common_vendor.o((...args) => $options.touchControl && $options.touchControl(...args)),
    j: common_vendor.t($data.beforeTitle),
    k: common_vendor.t($data.nowTitle),
    l: $options.getImgUrl("static/image/salesKanban/sales_increase.png"),
    m: common_vendor.f($data.salesPerformanceList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.nickName),
        b: common_vendor.t(item.beforeData),
        c: common_vendor.t(item.nowData),
        d: common_vendor.t($options.increase(item)),
        e: index
      };
    }),
    n: $options.getImgUrl("static/image/salesKanban/sales_increase.png"),
    o: common_vendor.o((...args) => _ctx.onReachBottom && _ctx.onReachBottom(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);

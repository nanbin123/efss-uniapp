"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 基础表单数据
      baseFormData: {
        name: "",
        age: "",
        introduction: "",
        sex: 2,
        hobby: [5],
        datetimesingle: 1627529992399,
        city: "",
        skills: 0
      },
      // 城市数据
      cityData: [{
        text: "北京",
        value: "10001"
      }, {
        text: "上海",
        value: "10002"
      }, {
        text: "深圳",
        value: "10004"
      }],
      skillsRange: [
        {
          value: 0,
          text: "编程"
        },
        {
          value: 1,
          text: "绘画"
        },
        {
          value: 2,
          text: "运动"
        }
      ],
      // 表单数据
      alignmentFormData: {
        name: "",
        age: ""
      },
      // 单选数据源
      sexs: [{
        text: "男",
        value: 0
      }, {
        text: "女",
        value: 1
      }, {
        text: "保密",
        value: 2
      }],
      // 多选数据源
      hobbys: [{
        text: "跑步",
        value: 0
      }, {
        text: "游泳",
        value: 1
      }, {
        text: "绘画",
        value: 2
      }, {
        text: "足球",
        value: 3
      }, {
        text: "篮球",
        value: 4
      }, {
        text: "其他",
        value: 5
      }],
      // 分段器数据
      current: 0,
      items: ["左对齐", "顶部对齐"],
      // 校验表单数据
      valiFormData: {
        name: "",
        age: "",
        introduction: ""
      },
      // 校验规则
      rules: {
        name: {
          rules: [{
            required: true,
            errorMessage: "姓名不能为空"
          }]
        },
        age: {
          rules: [{
            required: true,
            errorMessage: "年龄不能为空"
          }, {
            format: "number",
            errorMessage: "年龄只能输入数字"
          }]
        }
      },
      // 自定义表单数据
      customFormData: {
        name: "",
        age: "",
        hobby: []
      },
      // 自定义表单校验规则
      customRules: {
        name: {
          rules: [{
            required: true,
            errorMessage: "姓名不能为空"
          }]
        },
        age: {
          rules: [{
            required: true,
            errorMessage: "年龄不能为空"
          }]
        },
        hobby: {
          rules: [
            {
              format: "array"
            },
            {
              validateFunction: function(rule, value, data, callback) {
                if (value.length < 2) {
                  callback("请至少勾选两个兴趣爱好");
                }
                return true;
              }
            }
          ]
        }
      },
      dynamicFormData: {
        email: "",
        domains: []
      },
      dynamicLists: [],
      dynamicRules: {
        email: {
          rules: [{
            required: true,
            errorMessage: "域名不能为空"
          }, {
            format: "email",
            errorMessage: "域名格式错误"
          }]
        }
      }
    };
  },
  computed: {
    // 处理表单排列切换
    alignment() {
      if (this.current === 0)
        return "left";
      if (this.current === 1)
        return "top";
      return "left";
    }
  },
  onLoad() {
  },
  onReady() {
    this.$refs.customForm.setRules(this.customRules);
  },
  methods: {
    onClickItem(e) {
      console.log(e);
      this.current = e.currentIndex;
    },
    add() {
      this.dynamicFormData.domains.push({
        label: "域名",
        value: "",
        rules: [{
          "required": true,
          errorMessage: "域名项必填"
        }],
        id: Date.now()
      });
    },
    del(id) {
      let index = this.dynamicLists.findIndex((v) => v.id === id);
      this.dynamicLists.splice(index, 1);
    },
    submit(ref) {
      console.log(this.baseFormData);
      this.$refs[ref].validate().then((res) => {
        console.log("success", res);
        common_vendor.index.showToast({
          title: `校验通过`
        });
      }).catch((err) => {
        console.log("err", err);
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _component_uni_forms_item = common_vendor.resolveComponent("uni-forms-item");
  const _component_uni_forms = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _component_uni_forms_item + _component_uni_forms)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput_1.1.9/components/uni-easyinput/uni-easyinput.js";
if (!Math) {
  _easycom_uni_easyinput();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.baseFormData.name = $event),
    b: common_vendor.p({
      placeholder: "请输入姓名",
      modelValue: $data.baseFormData.name
    }),
    c: common_vendor.p({
      label: "姓名",
      required: true
    }),
    d: common_vendor.sr("baseForm", "72034071-0"),
    e: common_vendor.p({
      model: $data.baseFormData,
      labelWidth: "80px"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);

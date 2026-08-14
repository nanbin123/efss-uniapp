"use strict";const s=require("../../common/vendor.js").defineStore("userStore",{state:()=>({data:{permissions:[]}}),actions:{addPermissions(s){this.permissions=s}}});exports.useUserStore=s;

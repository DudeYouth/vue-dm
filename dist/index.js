var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "vue"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Model = exports.ChildModel = exports.DataModel = void 0;
    /*
     * @Descripttion:
     * @version:
     * @Author:
     * @Date: 2022-05-17 19:18:17
     */
    var vue_1 = require("vue");
    // /**
    //  * 禁用属性写入
    //  * @param obj 宿主对象
    //  * @param key 健
    //  */
    // const disabledSetData = (obj: any, key: string) => {
    //   Object.defineProperty(obj, key, {
    //     value: obj[key],
    //     writable: false,
    //   });
    // };
    // /**
    //  * 允许属性写入
    //  * @param obj 宿主对象
    //  * @param key 健
    //  */
    // const allowSetData = (obj: any, key: string) => {
    //   Object.defineProperty(obj, key, {
    //     value: obj[key],
    //     writable: true,
    //   });
    // };
    var DataModel = /** @class */ (function () {
        /**
         * 构造方法
         * @param data 主数据
         * @returns Model
         */
        function DataModel(data) {
            var _this_1 = this;
            /** 是不是模型类 */
            Object.defineProperty(this, "__isModelClass", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            /** 主数据 */
            Object.defineProperty(this, "__data", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            /** 主数据 */
            Object.defineProperty(this, "__proxyData", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            /** 主数据 */
            Object.defineProperty(this, "__templateData", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: void 0
            });
            /** 更新事件回调函数列表 */
            Object.defineProperty(this, "__updateCallbackList", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: []
            });
            var res = this.__init();
            if (!data) {
                res && (this.data = res);
            }
            else if (typeof data === 'function') {
                (0, vue_1.watchEffect)(function () {
                    typeof data === 'function' && (_this_1.data = data());
                });
            }
            else {
                this.setData(data);
            }
            var timer = setTimeout(function () {
                if (!_this_1.__isModelClass) {
                    var className = _this_1.__getProto(_this_1).constructor.name;
                    throw new Error("Please use the DataModel decorator for ".concat(className, " class"));
                }
                clearTimeout(timer);
            });
        }
        Object.defineProperty(DataModel.prototype, "data", {
            get: function () {
                return this.__data;
            },
            set: function (data) {
                if (!this.__templateData) {
                    this.__templateData = (0, vue_1.ref)(data);
                }
                else {
                    this.__templateData.value = data;
                }
                this.__data = data;
                this.__update(data);
            },
            enumerable: false,
            configurable: true
        });
        /**
         * 触发更新组数据事件
         * @param data 主数据
         */
        Object.defineProperty(DataModel.prototype, "__update", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (data) {
                this.__updateCallbackList.forEach(function (fun) {
                    fun(data);
                });
            }
        });
        /**
         * 代理的data对象
         * @param data
         * @returns
         */
        Object.defineProperty(DataModel.prototype, "__createProxyData", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                var _this_1 = this;
                var newData = null;
                if (this.data instanceof Array) {
                    newData = Object.assign([], this.data);
                }
                else {
                    newData = Object.assign({}, this.data);
                }
                if (this.__proxyData) {
                    return this.__proxyData;
                }
                this.__proxyData = new Proxy(newData, {
                    get: function (target, p, receiver) {
                        return _this_1.data[p];
                    },
                    set: function (target, p, value, receiver) {
                        _this_1.data[p] = value;
                        return true;
                    },
                });
                return this.__proxyData;
            }
        });
        /**
         * 监听主数据更新
         * @returns
         */
        Object.defineProperty(DataModel.prototype, "onDataUpdate", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (callback) {
                typeof callback === 'function' && this.__updateCallbackList.push(callback);
            }
        });
        /**
         * 类初始化时的钩子
         */
        Object.defineProperty(DataModel.prototype, "__init", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                return;
            }
        });
        /**
         * 类创建完成的钩子
         */
        Object.defineProperty(DataModel.prototype, "__created", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                return;
            }
        });
        /**
         * 类创建完成的钩子
         */
        Object.defineProperty(DataModel.prototype, "__getProto", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (_this) {
                return _this.__proto__;
            }
        });
        Object.defineProperty(DataModel.prototype, "setData", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (data) {
                this.data = data;
            }
        });
        Object.defineProperty(DataModel.prototype, "getData", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                return this.__createProxyData();
            }
        });
        Object.defineProperty(DataModel.prototype, "getTemplateData", {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function () {
                return this.__templateData;
            }
        });
        return DataModel;
    }());
    exports.DataModel = DataModel;
    /**
     * 子模型装饰器
     * @param key 关联的健名
     * @param ModelClass 模型类
     * @returns
     */
    var ChildModel = function (key, ModelClass) {
        return function (target, name, descriptor) {
            target.__created = function () {
                var _this_1 = this;
                this[name] = new ModelClass(function () {
                    return (_this_1 === null || _this_1 === void 0 ? void 0 : _this_1.data) ? _this_1.data[key] : undefined;
                });
                if (!(0, vue_1.isReactive)(this.data)) {
                    var data_1 = this.data[key];
                    Object.defineProperty(this.data, key, {
                        get: function () {
                            return data_1;
                        },
                        set: function (value) {
                            data_1 = value;
                            this[name].setData(data_1);
                        },
                    });
                }
            };
            return descriptor;
        };
    };
    exports.ChildModel = ChildModel;
    /**
     * 数据模型装饰器
     * @param constructor 类
     * @returns
     */
    var Model = function (constructor) {
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this_1 = _super.apply(this, args) || this;
                Object.defineProperty(_this_1, "__isModelClass", {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: true
                });
                _this_1.__created();
                return _this_1;
            }
            return class_1;
        }(constructor));
    };
    exports.Model = Model;
});
//# sourceMappingURL=index.js.map
/*
 * @Descripttion:
 * @version:
 * @Author:
 * @Date: 2022-05-17 19:18:17
 */
import { ref, isReactive, watchEffect } from 'vue';
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
export class DataModel {
    /** 是不是模型类 */
    __isModelClass;
    /** 主数据 */
    __data;
    /** 主数据 */
    __templateData;
    /** 更新事件回调函数列表 */
    __updateCallbackList = [];
    set data(data) {
        if (!this.__templateData) {
            this.__templateData = ref(data);
        }
        else {
            this.__templateData.value = data;
        }
        this.__data = data;
        this.__update(data);
    }
    get data() {
        return this.__data;
    }
    /**
     * 触发更新组数据事件
     * @param data 主数据
     */
    __update(data) {
        this.__updateCallbackList.forEach((fun) => {
            fun(data);
        });
    }
    /**
     * 监听主数据更新
     * @returns
     */
    onDataUpdate(callback) {
        typeof callback === 'function' && this.__updateCallbackList.push(callback);
    }
    /**
     * 类初始化时的钩子
     */
    __init() {
        return;
    }
    /**
     * 类创建完成的钩子
     */
    __created() {
        return;
    }
    /**
     * 类创建完成的钩子
     */
    __getProto(_this) {
        return _this.__proto__;
    }
    setData(data) {
        this.data = data;
    }
    getTemplateData() {
        return this.__templateData;
    }
    /**
     * 构造方法
     * @param data 主数据
     * @returns Model
     */
    constructor(data) {
        const res = this.__init();
        if (!data) {
            res && (this.data = res);
        }
        else if (typeof data === 'function') {
            watchEffect(() => {
                typeof data === 'function' && (this.data = data());
            });
        }
        else {
            this.setData(data);
        }
        const timer = setTimeout(() => {
            if (!this.__isModelClass) {
                const className = this.__getProto(this).constructor.name;
                throw new Error(`Please use the DataModel decorator for ${className} class`);
            }
            clearTimeout(timer);
        });
    }
}
/**
 * 子模型装饰器
 * @param key 关联的健名
 * @param ModelClass 模型类
 * @returns
 */
export const ChildModel = (key, ModelClass) => {
    return function (target, name, descriptor) {
        target.__created = function () {
            this[name] = new ModelClass(() => {
                return this?.data ? this.data[key] : undefined;
            });
            if (!isReactive(this.data)) {
                let data = this.data[key];
                Object.defineProperty(this.data, key, {
                    get() {
                        return data;
                    },
                    set(value) {
                        data = value;
                        this[name].setData(data);
                    },
                });
            }
        };
        return descriptor;
    };
};
/**
 * 数据模型装饰器
 * @param constructor 类
 * @returns
 */
export const Model = (constructor) => {
    return class extends constructor {
        constructor(...args) {
            super(...args);
            this.__created();
        }
    };
};
//# sourceMappingURL=index.js.map
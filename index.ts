/*
 * @Descripttion:
 * @version:
 * @Author:
 * @Date: 2022-05-17 19:18:17
 */
import { Ref, ref, isReactive, UnwrapNestedRefs, watchEffect } from 'vue';

type InitFun<T> = () => T;

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

export class DataModel<T extends object> {
  /** 是不是模型类 */
  public __isModelClass!: boolean;
  /** 主数据 */
  private __data!: UnwrapNestedRefs<T> | T;
  /** 主数据 */
  public __templateData!: Ref<T>;
  /** 更新事件回调函数列表 */
  private __updateCallbackList: Array<(data: UnwrapNestedRefs<T> | T) => void> =
    [];
  public set data(data: UnwrapNestedRefs<T> | T) {
    if (!this.__templateData) {
      this.__templateData = ref(data) as Ref<T>;
    } else {
      this.__templateData.value = data as T;
    }
    this.__data = data;
    this.__update(data);
  }
  public get data(): UnwrapNestedRefs<T> | T {
    return this.__data;
  }
  /**
   * 触发更新组数据事件
   * @param data 主数据
   */
  private __update(data: UnwrapNestedRefs<T> | T): void {
    this.__updateCallbackList.forEach((fun) => {
      fun(data);
    });
  }

  /**
   * 监听主数据更新
   * @returns
   */
  public onDataUpdate(callback: (data: UnwrapNestedRefs<T> | T) => void): void {
    typeof callback === 'function' && this.__updateCallbackList.push(callback);
  }
  /**
   * 类初始化时的钩子
   */
  protected __init(): UnwrapNestedRefs<T> | void | T {
    return;
  }
  /**
   * 类创建完成的钩子
   */
  protected __created(): void {
    return;
  }
  /**
   * 类创建完成的钩子
   */
  private __getProto(_this: any): any {
    return _this.__proto__;
  }
  public setData(data: UnwrapNestedRefs<T> | T) {
    this.data = data as UnwrapNestedRefs<T>;
  }
  public getTemplateData() {
    return this.__templateData;
  }
  /**
   * 构造方法
   * @param data 主数据
   * @returns Model
   */
  constructor(data?: T | InitFun<T>) {
    const res = this.__init();
    if (!data) {
      res && (this.data = res);
    } else if (typeof data === 'function') {
      watchEffect(() => {
        typeof data === 'function' && (this.data = (data as InitFun<T>)());
      });
    } else {
      this.setData(data);
    }
    const timer = setTimeout(() => {
      if (!this.__isModelClass) {
        const className = this.__getProto(this).constructor.name;
        throw new Error(
          `Please use the DataModel decorator for ${className} class`
        );
      }
      clearTimeout(timer);
    });
  }
}

type ModelClass = { new (data?: any): DataModel<any> };

/**
 * 子模型装饰器
 * @param key 关联的健名
 * @param ModelClass 模型类
 * @returns
 */
export const ChildModel = <T extends object>(
  key: keyof T,
  ModelClass: ModelClass
): any => {
  return function (target: any, name: string, descriptor: any) {
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
export const Model = <T extends { new (...args: any[]): any }>(
  constructor: T
) => {
  return class extends constructor {
    public __isModelClass = true;
    constructor(...args: any[]) {
      super(...args);
      this.__created();
    }
  };
};

import { Ref, UnwrapNestedRefs } from 'vue';
declare type InitFun<T> = () => T;
export declare class DataModel<T extends object> {
    /** 是不是模型类 */
    __isModelClass: boolean;
    /** 主数据 */
    private __data;
    /** 主数据 */
    __templateData: Ref<T>;
    /** 更新事件回调函数列表 */
    private __updateCallbackList;
    set data(data: UnwrapNestedRefs<T> | T);
    get data(): UnwrapNestedRefs<T> | T;
    /**
     * 触发更新组数据事件
     * @param data 主数据
     */
    private __update;
    /**
     * 监听主数据更新
     * @returns
     */
    onDataUpdate(callback: (data: UnwrapNestedRefs<T> | T) => void): void;
    /**
     * 类初始化时的钩子
     */
    protected __init(): UnwrapNestedRefs<T> | void | T;
    /**
     * 类创建完成的钩子
     */
    protected __created(): void;
    /**
     * 类创建完成的钩子
     */
    private __getProto;
    setData(data: UnwrapNestedRefs<T> | T): void;
    getTemplateData(): Ref<T>;
    /**
     * 构造方法
     * @param data 主数据
     * @returns Model
     */
    constructor(data?: T | InitFun<T>);
}
declare type ModelClass = {
    new (data?: any): DataModel<any>;
};
/**
 * 子模型装饰器
 * @param key 关联的健名
 * @param ModelClass 模型类
 * @returns
 */
export declare const ChildModel: <T extends object>(key: keyof T, ModelClass: ModelClass) => any;
/**
 * 数据模型装饰器
 * @param constructor 类
 * @returns
 */
export declare const Model: <T extends new (...args: any[]) => any>(constructor: T) => {
    new (...args: any[]): {
        [x: string]: any;
        __isModelClass: boolean;
    };
} & T;
export {};

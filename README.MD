## vue-dm
---
### vue3的数据管理模型，提供传统mvc模式的m层基类封装与设计


### 一、背景
> 1. vue、react等框架的产生，前端开发模式从事件驱动走入了数据驱动时代
> 2. vue3的出现使得vue的语法更加灵活、便于封装。已经脱离了vue2的 data、methods固化的结构设计。
> 3. vue3的灵活也带来了一些疑惑？vue3的组件该如何设计封装呢？vue3也加入了hooks思想，但hooks思想并没有明确的规范设计。导致我们在使用vue3的时候，对于组件的封装设计无从下手。
> 4. vue3的ref类导致数据操作与读取调用链变长，例如：data['value'][prop]
> 5. vue-dm为了解决以上问题而产生


### 二、vue-dm数据模型定义

> 1. 什么是数据模型？
>   + 一组数据的所有操作方法与属性集合
> 2. 为什么要抽取数据模型？
>   + 对某组数据的操作方法在所有业务逻辑上是通用的

### 三、API

> 1. Model装饰器： 所有基于vue-dm的创建的数据模型都必须使用Model装饰器
> 2. ChildModel装饰器：通过该装饰器可便捷的将子模型挂在到父模型
> 3. DataModel基类：vue-dm的核心实现，提供了data、getTemplateData、onDataUpdate等属性、方法

### 四、示例

+ 订单地址模型
```typescript
// addressList.ts
import { DataModel, Model } from 'vue-dm';

@Model
export default class AddressList extends DataModel<TypeOrder.AddressList[]> {
  public setName(name: string): void {
    this.data.forEach((item) => {
      item.name = name;
    });
  }
  public static filterAddressList(
    data: TypeOrder.AddressList[],
    list: string[]
  ): TypeOrder.AddressList[] {
    return data.filter((item) => list.indexOf(item.code) > -1);
  }
}
```

+ 订单表单模型
```typescript
// orderFormData.ts
import { reactive } from 'vue';
import { Model, ChildModel, DataModel } from 'vue-dm';
import AddressList from './addressList';
/**
 * 订单表单模型
 */
@Model
export default class OrderFormData extends DataModel<TypeOrder.FormData> {
  /**
   * 地址模型
   */
  @ChildModel<TypeOrder.FormData>('address_list', AddressList)
  public addressListModel!: AddressList;
  /**
   * 初始化表单数据
   * @returns 初始化表单数据
   */
  protected __init(): TypeOrder.FormData {
    return reactive({
      code: '',
      name: '',
      id: 0,
      address_list: [
        { name: '测试', code: '1' },
        { name: '测试1', code: '2' },
      ],
    });
  }
  /** 初始化表单数据 */
  public initFormData() {
    this.data = this.__init();
  }
  /**
   * 通过详情数据生成表单数据
   * @param detailData
   * @returns
   */
  public setFormDataByDetail(detailData: any) {
    Object.assign(this.data, {
      code: detailData.code,
      name: detailData.name,
      id: detailData.id,
    });
  }
}

```


+ 页面组件
```html
<template>
  <div class="home">
    <a-form ref="formDataRef">
      <a-form-item label="代码">
        <a-input v-model:value="formData.code" />
      </a-form-item>
      <a-form-item label="订单名称">
        <a-input v-model:value="formData.name" />
      </a-form-item>

      <a-button @click="handleSetData">设置数据</a-button>
      <div>
        <p v-for="item in formData.address_list" :key="item.code">
          {{ item.name }}
        </p>
      </div>
      <a-button
        type="primary"
        style="margin-left: 10px"
        :loading="loading"
        @click="handleSave"
        >保存</a-button
      >
      <a-button type="primary" style="margin-left: 10px" @click="handleAddress"
        >设置地址</a-button
      >
      <a-button type="primary" style="margin-left: 10px" @click="handleInitForm"
        >初始化表单数据</a-button
      >
    </a-form>
  </div>
</template>
<script lang="ts" setup>

import { ref } from 'vue';
import OrderFormData from '@/formData';
import OrderAddressList from '@/addressList';
import createLoading from '@/decorators/createLoading';

/**
 * 订单表单数据模型
 */
const orderFormData = new OrderFormData();
/**
 * 表单数据
 */
let formData = orderFormData.getTemplateData();

/**
 * 设置数据
 */
const handleSetData = () => {
  orderFormData.setFormDataByDetail({
    name: '测试订单',
    code: '123',
  });
};

/**
 * 请求方法
 */
const requestApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
};
/** 装饰器的使用 */
const { loading, fun: saveFun } = createLoading(requestApi);
/**
 * 静态方法调用
 */
console.log(
  OrderAddressList.filterAddressList(formData.value.address_list, ['1'])
);
/**
 * 保存数据
 */
const handleSave = () => {
  saveFun();
};
/**
 * 设置订单地址
 */
const handleAddress = () => {
  orderFormData.addressListModel.setName('地址');
};

/**
 * 初始化订单数据
 */
const handleInitForm = () => orderFormData.initFormData();
</script>
```


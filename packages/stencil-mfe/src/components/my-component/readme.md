# my-component



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description     | Type     | Default     |
| ---------------- | ------------------ | --------------- | -------- | ----------- |
| `first`          | `first`            | The first name  | `string` | `undefined` |
| `handleSendMess` | `handle-send-mess` |                 | `any`    | `undefined` |
| `last`           | `last`             | The last name   | `string` | `undefined` |
| `middle`         | `middle`           | The middle name | `string` | `undefined` |


## Events

| Event        | Description | Type               |
| ------------ | ----------- | ------------------ |
| `submitForm` |             | `CustomEvent<any>` |


## Methods

### `trigger(params: any) => Promise<{ response: { params: any; }; }>`



#### Returns

Type: `Promise<{ response: { params: any; }; }>`




## Dependencies

### Used by

 - [fw-sample1](../sample-component)

### Depends on

- fw-button

### Graph
```mermaid
graph TD;
  my-component --> fw-button
  fw-button --> fw-spinner
  fw-button --> fw-icon
  fw-sample1 --> my-component
  style my-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

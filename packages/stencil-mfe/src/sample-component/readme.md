# fw-sample1



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type  | Default     |
| ---------- | ----------- | ----------- | ----- | ----------- |
| `appProps` | `app-props` |             | `any` | `undefined` |


## Methods

### `trigger(params: any) => Promise<{ response: { params: any; }; }>`



#### Returns

Type: `Promise<{ response: { params: any; }; }>`




## Dependencies

### Depends on

- fw-button
- fw-modal
- fw-icon

### Graph
```mermaid
graph TD;
  fw-sample1 --> fw-button
  fw-sample1 --> fw-modal
  fw-sample1 --> fw-icon
  fw-button --> fw-spinner
  fw-button --> fw-icon
  fw-modal --> fw-icon
  fw-modal --> fw-modal-title
  fw-modal --> fw-modal-content
  fw-modal --> fw-modal-footer
  fw-modal-title --> fw-icon
  fw-modal-footer --> fw-button
  style fw-sample1 fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

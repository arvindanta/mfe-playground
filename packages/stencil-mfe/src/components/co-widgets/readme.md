# test-component



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type     | Default |
| ------------- | -------------- | ----------- | -------- | ------- |
| `componentId` | `component-id` |             | `string` | `''`    |
| `params`      | `params`       |             | `any`    | `null`  |


## Methods

### `trigger(params: any) => Promise<{ response: { params: any; }; }>`



#### Returns

Type: `Promise<{ response: { params: any; }; }>`




## Dependencies

### Depends on

- fw-accordion
- fw-accordion-title
- fw-icon
- fw-accordion-body
- fw-select
- fw-input
- fw-button

### Graph
```mermaid
graph TD;
  test-component --> fw-accordion
  test-component --> fw-accordion-title
  test-component --> fw-icon
  test-component --> fw-accordion-body
  test-component --> fw-select
  test-component --> fw-input
  test-component --> fw-button
  fw-accordion-title --> fw-icon
  fw-select --> fw-tag
  fw-select --> fw-popover
  fw-select --> fw-button
  fw-select --> fw-spinner
  fw-select --> fw-icon
  fw-select --> fw-list-options
  fw-tag --> fw-avatar
  fw-tag --> fw-icon
  fw-button --> fw-spinner
  fw-button --> fw-icon
  fw-list-options --> fw-select-option
  fw-list-options --> fw-input
  fw-select-option --> fw-icon
  fw-select-option --> fw-checkbox
  fw-select-option --> fw-avatar
  fw-checkbox --> fw-icon
  fw-input --> fw-icon
  style test-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

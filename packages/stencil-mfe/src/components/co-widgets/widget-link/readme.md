# fw-widget-link



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute             | Description | Type     | Default     |
| ------------------- | --------------------- | ----------- | -------- | ----------- |
| `componentId`       | `component-id`        |             | `any`    | `undefined` |
| `entityLabel`       | `entity-label`        |             | `string` | `''`        |
| `fetchData`         | `fetch-data`          |             | `any`    | `undefined` |
| `linkFieldLabel`    | `link-field-label`    |             | `string` | `''`        |
| `linkFieldName`     | `link-field-name`     |             | `string` | `''`        |
| `params`            | `params`              |             | `any`    | `undefined` |
| `primaryFieldLabel` | `primary-field-label` |             | `string` | `''`        |


## Events

| Event     | Description | Type               |
| --------- | ----------- | ------------------ |
| `fwClose` |             | `CustomEvent<any>` |
| `fwLink`  |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [fw-widget-card](../widget-card)

### Depends on

- fw-modal
- fw-modal-content
- fw-select
- fw-spinner
- fw-modal-footer
- fw-button

### Graph
```mermaid
graph TD;
  fw-widget-link --> fw-modal
  fw-widget-link --> fw-modal-content
  fw-widget-link --> fw-select
  fw-widget-link --> fw-spinner
  fw-widget-link --> fw-modal-footer
  fw-widget-link --> fw-button
  fw-modal --> fw-icon
  fw-modal --> fw-modal-title
  fw-modal --> fw-modal-content
  fw-modal --> fw-modal-footer
  fw-modal-title --> fw-icon
  fw-modal-footer --> fw-button
  fw-button --> fw-spinner
  fw-button --> fw-icon
  fw-select --> fw-tag
  fw-select --> fw-popover
  fw-select --> fw-button
  fw-select --> fw-spinner
  fw-select --> fw-icon
  fw-select --> fw-list-options
  fw-tag --> fw-avatar
  fw-tag --> fw-icon
  fw-list-options --> fw-select-option
  fw-list-options --> fw-input
  fw-select-option --> fw-icon
  fw-select-option --> fw-checkbox
  fw-select-option --> fw-avatar
  fw-checkbox --> fw-icon
  fw-input --> fw-icon
  fw-widget-card --> fw-widget-link
  style fw-widget-link fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# fw-widget-card



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description | Type                          | Default     |
| ------------- | -------------- | ----------- | ----------------------------- | ----------- |
| `componentId` | `component-id` |             | `string`                      | `''`        |
| `fetchData`   | `fetch-data`   |             | `any`                         | `undefined` |
| `loading`     | `loading`      |             | `boolean`                     | `true`      |
| `params`      | `params`       |             | `any`                         | `null`      |
| `trigger`     | `trigger`      |             | `any`                         | `undefined` |
| `value`       | `value`        |             | `any`                         | `null`      |
| `variation`   | `variation`    |             | `"" \| "contact" \| "ticket"` | `''`        |


## Events

| Event              | Description | Type               |
| ------------------ | ----------- | ------------------ |
| `fwLinkRecord`     |             | `CustomEvent<any>` |
| `fwNavigate`       |             | `CustomEvent<any>` |
| `fwViewAllRecords` |             | `CustomEvent<any>` |


## Methods

### `setValues(args: any) => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Used by

 - [fw-application](../fw-application)

### Depends on

- [fw-widget-label](../widget-label)
- fw-avatar
- fw-label
- fw-accordion
- fw-accordion-title
- fw-accordion-body
- fw-button
- fw-icon
- fw-skeleton
- [fw-portal-component](..)
- [fw-widget-link](../widget-link)

### Graph
```mermaid
graph TD;
  fw-widget-card --> fw-widget-label
  fw-widget-card --> fw-avatar
  fw-widget-card --> fw-label
  fw-widget-card --> fw-accordion
  fw-widget-card --> fw-accordion-title
  fw-widget-card --> fw-accordion-body
  fw-widget-card --> fw-button
  fw-widget-card --> fw-icon
  fw-widget-card --> fw-skeleton
  fw-widget-card --> fw-portal-component
  fw-widget-card --> fw-widget-link
  fw-widget-label --> fw-tooltip
  fw-tooltip --> fw-popover
  fw-accordion-title --> fw-icon
  fw-button --> fw-spinner
  fw-button --> fw-icon
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
  fw-application --> fw-widget-card
  style fw-widget-card fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

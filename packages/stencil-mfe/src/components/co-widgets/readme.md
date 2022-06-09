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
- [fw-widget-card](widget-card)
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
  test-component --> fw-widget-card
  test-component --> fw-select
  test-component --> fw-input
  test-component --> fw-button
  fw-accordion-title --> fw-icon
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
  style test-component fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

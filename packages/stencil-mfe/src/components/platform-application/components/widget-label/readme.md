# fw-widget-label



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute   | Description | Type                                                                   | Default    |
| ---------- | ----------- | ----------- | ---------------------------------------------------------------------- | ---------- |
| `label`    | `label`     |             | `string`                                                               | `''`       |
| `linkData` | `link-data` |             | `string`                                                               | `''`       |
| `type`     | `type`      |             | `"header" \| "label" \| "link" \| "section" \| "sublink" \| "subtext"` | `'header'` |


## Events

| Event           | Description | Type               |
| --------------- | ----------- | ------------------ |
| `fwAnchorClick` |             | `CustomEvent<any>` |


## Dependencies

### Used by

 - [fw-widget-card](../widget-card)

### Depends on

- fw-tooltip

### Graph
```mermaid
graph TD;
  fw-widget-label --> fw-tooltip
  fw-tooltip --> fw-popover
  fw-widget-card --> fw-widget-label
  style fw-widget-label fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

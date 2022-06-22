/* eslint-disable dot-notation */
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { i18nText } from '../../utils/platform-app-utils';
import { hasCustomProperty } from '../../utils/utils';

import {
  getCouiRoutePrefix,
  getFormattedDate,
  serializeContextRecordId,
  toJson,
} from '../../api/coui';
import FW_APP_CONSTANTS from '../../constants/FwApplicationContants';

@Component({
  tag: 'fw-widget-card',
  styleUrl: 'widget-card.scss',
  shadow: true,
})
export class WidgetCard {
  @Element() host!: HTMLElement;

  @Prop() fetchData?: any;

  @Prop() trigger?: any;

  @Prop() componentId = '';

  @Prop() params = null;

  @Prop({ mutable: true }) loading = true;

  @Prop({ mutable: true }) variation: 'contact' | 'ticket' | '' = '';

  @Prop({ mutable: true }) value = null;

  @State() showLinkModalDetails = null;

  @Event() fwNavigate!: EventEmitter;

  @Event() fwLinkRecord!: EventEmitter;

  @Event() fwViewAllRecords!: EventEmitter;

  @Method()
  async setValues(args) {
    this.value = args ? { ...args } : null;
  }

  @Watch('value')
  watchValueChangeHandler(): void {
    if (
      this.value &&
      hasCustomProperty(this.value, 'variation') &&
      this.value.variation !== ''
    ) {
      this.variation = this.value.variation;
    } else {
      this.variation = '';
    }
  }

  componentWillLoad(): void {
    this.watchValueChangeHandler();
  }

  private viewAllRecordHandler = async (event: CustomEvent) => {
    const numSchemaId = this.value?.widgetId || 0;
    const strFieldName = event.currentTarget?.['dataset']?.['fieldName'];
    const strFieldLabel = event.currentTarget?.['dataset']?.['fieldLabel'];
    const strRoutePrefix = getCouiRoutePrefix();
    const contextRecId = await serializeContextRecordId(
      this.params.contextObjectId,
      this.params.contextRecordId
    );

    const filterVal = {
      [strFieldName]: {
        value: [
          {
            text: strFieldLabel,
            value: contextRecId,
          },
        ],
      },
    };

    const strUrl = `${strRoutePrefix}/schemas/${numSchemaId}/records?${strFieldName}=${toJson(
      filterVal
    )}`;
    console.info(`View all records routing to - ${strUrl}`);

    this.fwViewAllRecords.emit({
      route: strUrl,
    });
  };

  private navigateRecordHandler = (event: CustomEvent) => {
    if (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }

    const numSchemaId = this.value?.widgetId || 0;
    const strRecordDisplayId = event.detail.linkData;
    const strRoutePrefix = getCouiRoutePrefix();
    const strUrl = `${strRoutePrefix}/schemas/${numSchemaId}/records/${strRecordDisplayId}`;

    this.fwNavigate.emit({
      route: strUrl,
    });
  };

  private showLinkModalHandler = (event: CustomEvent) => {
    const datasetLink = event.currentTarget?.['dataset'];
    const strFieldName = datasetLink?.['fieldName'];

    if (datasetLink && strFieldName && strFieldName !== '') {
      this.showLinkModalDetails = {
        fieldName: strFieldName,
        fieldLabel: datasetLink?.['fieldLabel'],
        primaryFieldLabel: datasetLink?.['primaryFieldLabel'],
      };
    }
  };

  private refreshWidget = async () => {
    this.loading = true;

    const objRefreshWidgetResponse = {};
    // await FwApplicationController.trigger(
    //   FW_APP_CONSTANTS.APP_CUSTOM_OBJECT,
    //   this.componentId
    // );

    this.trigger(this.componentId);

    this.loading = false;
    console.info('Refresh widget response - ' + objRefreshWidgetResponse);
  };

  private applyLinkHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.showLinkModalDetails = null;
    this.loading = true;
    this.refreshWidget();
  };

  private closeLinkModalHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.showLinkModalDetails = null;
  };

  private toggleAccordionHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
  };

  private renderContactHeader(dataItem, strDisplayValue, strDisplayHeader) {
    const strCardClassName = 'fw-application-widget-field-record-row';
    const strRecorId = dataItem.recordId;

    const strSubText = dataItem.subtext || '';
    const strAvatarUrl = dataItem.avatar || '';

    return (
      <div class={`${strCardClassName}`}>
        <fw-widget-label
          type='header'
          label={strDisplayHeader}
        ></fw-widget-label>
        <div class={`${strCardClassName}-contact`}>
          <fw-avatar
            size='medium'
            image={strAvatarUrl}
            name={strDisplayValue}
          ></fw-avatar>
          <div class={`${strCardClassName}-contact-description`}>
            <fw-widget-label
              type='link'
              linkData={strRecorId}
              label={strDisplayValue}
              onFwAnchorClick={this.navigateRecordHandler}
            ></fw-widget-label>
            <fw-widget-label
              type='subtext'
              label={strSubText}
            ></fw-widget-label>
          </div>
        </div>
      </div>
    );
  }

  private renderTicketHeader(dataItem, strDisplayValue, strDisplayHeader) {
    const strCardClassName = 'fw-application-widget-field-record-row';
    const strRecorId = dataItem.recordId;
    const strTag = dataItem?.tag || '';
    const strSubText = dataItem?.subtext || '';
    const boolValidTag = !!(strTag && strTag !== '');
    const boolValidSubtext = !!(strSubText && strSubText !== '');
    const boolValidLink = !!(strDisplayValue && strDisplayValue !== '');
    const boolValidHeader = !!(strDisplayValue && strDisplayValue !== '');

    return (
      <div class={`${strCardClassName}`}>
        {boolValidHeader && (
          <fw-widget-label
            type='header'
            label={strDisplayHeader}
          ></fw-widget-label>
        )}
        {boolValidLink && (
          <span class={`${strCardClassName}-header-link`}>
            {boolValidTag && <fw-label value={strTag} color='grey'></fw-label>}
            <fw-widget-label
              type='link'
              linkData={strRecorId}
              label={strDisplayValue}
              onFwAnchorClick={this.navigateRecordHandler}
            ></fw-widget-label>
          </span>
        )}
        {boolValidSubtext && (
          <fw-widget-label
            type='link'
            linkData={strRecorId}
            label={strSubText}
            onFwAnchorClick={this.navigateRecordHandler}
          ></fw-widget-label>
        )}
      </div>
    );
  }

  private renderRowElement(dataItem, boolLink, boolTitle = false) {
    const strRecorId = dataItem.recordId;
    const strCardClassName = 'fw-application-widget-field-record-row';

    const strFieldType = dataItem?.fieldType || '';
    const strDisplayHeader = dataItem.header;

    let strDisplayValue = dataItem.value || '';
    if (
      strDisplayValue &&
      strDisplayValue !== '' &&
      strFieldType &&
      strFieldType !== ''
    ) {
      if (strFieldType === FW_APP_CONSTANTS.FIELD_TYPE_DATE) {
        strDisplayValue = getFormattedDate(strDisplayValue);
      }
    }
    strDisplayValue = strDisplayValue || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;

    if (boolTitle) {
      if (this.variation === FW_APP_CONSTANTS.WIDGET_VARIATION_CONTACT) {
        return this.renderContactHeader(
          dataItem,
          strDisplayValue,
          strDisplayHeader
        );
      } else if (this.variation === FW_APP_CONSTANTS.WIDGET_VARIATION_TICKET) {
        return this.renderTicketHeader(
          dataItem,
          strDisplayValue,
          strDisplayHeader
        );
      }
    }

    if (
      !boolLink &&
      hasCustomProperty(dataItem, 'isLink') &&
      dataItem?.isLink === true
    ) {
      boolLink = true;
    }
    if (
      !strDisplayValue ||
      strDisplayValue === '' ||
      strDisplayValue === FW_APP_CONSTANTS.EMPTY_FIELD_VALUE
    ) {
      boolLink = false;
    }

    return (
      <div class={`${strCardClassName}`}>
        <fw-widget-label
          type='header'
          label={strDisplayHeader}
        ></fw-widget-label>
        {!boolLink && (
          <fw-widget-label
            type='label'
            label={strDisplayValue}
          ></fw-widget-label>
        )}
        {boolLink && (
          <fw-widget-label
            type='link'
            linkData={strRecorId}
            label={strDisplayValue}
            onFwAnchorClick={this.navigateRecordHandler}
          ></fw-widget-label>
        )}
      </div>
    );
  }

  private renderRecordElement(dataItem, intRecordsCount, intFieldCount) {
    const strCardClassName = 'fw-application-widget-field-record';
    const arrRecordRows = dataItem?.rows;
    let fieldTitleElement = null;
    let fieldBodyElements = null;

    const boolExpand = intRecordsCount <= 1 && intFieldCount <= 1;
    if (arrRecordRows && arrRecordRows.length > 0) {
      arrRecordRows.forEach((el, i1) => {
        if (i1 === 0) {
          fieldTitleElement = [this.renderRowElement(el, true, true)];
        } else {
          if (!fieldBodyElements) {
            fieldBodyElements = [];
          }
          fieldBodyElements = [
            ...fieldBodyElements,
            this.renderRowElement(el, false),
          ];
        }
      });
    }

    let strAccordionClassName = `${strCardClassName}-accordion`;
    if (!fieldBodyElements) {
      strAccordionClassName += ` ${strCardClassName}-accordion-empty-body`;
    }

    return (
      <div class={strCardClassName}>
        <fw-accordion
          class={strAccordionClassName}
          expanded={boolExpand}
          onFwAccordionToggle={this.toggleAccordionHandler}
        >
          <fw-accordion-title iconSize='small'>
            <div class={`${strCardClassName}-accordion-title`}>
              {fieldTitleElement}
            </div>
          </fw-accordion-title>
          <fw-accordion-body>
            <div class={`${strCardClassName}-accordion-body`}>
              {fieldBodyElements}
            </div>
          </fw-accordion-body>
        </fw-accordion>
      </div>
    );
  }

  private renderFieldElement(dataItem, intFieldCount, intIndex) {
    const strBaseClassName = 'fw-application-widget';
    const strFieldClassName = 'fw-application-widget-field';

    const strFieldName = dataItem?.fieldName || '';
    const strFieldLabel = dataItem?.fieldLabel || '';
    const strPrimaryFieldLabel = dataItem?.primaryFieldLabel || '';

    const strWidgetAssociationType = this.value?.associationType || '';
    const boolReverseWidgetType = strWidgetAssociationType?.includes('REVERSE');

    const objFieldRecords = dataItem?.records;
    const arrFieldRecordNames = objFieldRecords
      ? Object.keys(objFieldRecords)
      : null;
    const intRecordsLength = arrFieldRecordNames?.length || 0;
    const boolValidRecords = intRecordsLength > 0;

    let fieldRecordElements = boolValidRecords
      ? arrFieldRecordNames
          .splice(0, FW_APP_CONSTANTS.MAX_WIDGET_RECORDS_DISPLAY_COUNT)
          .map((key) =>
            this.renderRecordElement(
              objFieldRecords[key],
              intRecordsLength,
              intFieldCount
            )
          )
      : null;

    if (!boolValidRecords && !boolReverseWidgetType) {
      fieldRecordElements = [
        this.renderRecordElement(
          {
            rows: [
              {
                id: `empty_${strFieldName}`,
                header: strFieldLabel,
                fieldName: strFieldName,
                value: '-',
              },
            ],
          },
          1,
          intFieldCount
        ),
      ];
    }

    const strWidgetLabel = this.value?.widgetLabel || '';
    const boolValidRenderredRecordElements =
      fieldRecordElements && fieldRecordElements.length > 0;
    const strEmptyMessage =
      !boolValidRenderredRecordElements && strWidgetLabel
        ? i18nText('noRecordsLinked')
        : '';

    const boolShowSeparator = intFieldCount > 1 && intIndex < intFieldCount - 1;
    const boolShowViewAll = dataItem?.showViewAllRecordsCta || false;
    const boolShowLink = dataItem?.showLinkCta || false;

    let strSectionHeaderLabel = strFieldLabel;
    let boolShowSectionHeaderLabel = false;
    if (intFieldCount > 1 && boolReverseWidgetType) {
      boolShowSectionHeaderLabel = true;
      const strContextRecordLabel =
        dataItem?.contextLabel && dataItem.contextLabel !== ''
          ? dataItem.contextLabel
          : BigInt(this.params.contextRecordId).toString();

      if (strContextRecordLabel && strContextRecordLabel !== '') {
        strSectionHeaderLabel = i18nText('widgetSectionHeader', {
          fieldLabel: strFieldLabel,
          contextLabel: strContextRecordLabel,
        });
      }
    }

    return (
      <div class={strFieldClassName}>
        {boolShowSectionHeaderLabel && (
          <fw-widget-label
            type='section'
            label={strSectionHeaderLabel}
          ></fw-widget-label>
        )}
        {boolShowLink && (
          <div class={`${strBaseClassName}-link-div`}>
            <fw-button
              color='link'
              data-field-label={strFieldLabel}
              data-field-name={strFieldName}
              data-primary-field-label={strPrimaryFieldLabel}
              class={`${strBaseClassName}-link-btn`}
              onFwClick={this.showLinkModalHandler}
            >
              <fw-icon slot='before-label' name='link'></fw-icon>
              <span>{i18nText('linkWidgetButton')}</span>
            </fw-button>
          </div>
        )}
        {boolValidRenderredRecordElements && (
          <div class={`${strFieldClassName}-records-list`}>
            {fieldRecordElements}
          </div>
        )}
        {!boolValidRenderredRecordElements && (
          <div class={`${strBaseClassName}-empty`}>
            <span class={`${strBaseClassName}-empty-center-content`}>
              <span class={`${strBaseClassName}-empty-center-content-label`}>
                {strEmptyMessage}
              </span>
            </span>
          </div>
        )}
        {boolShowViewAll && (
          <div class={`${strBaseClassName}-view-all-div`}>
            <fw-button
              color='link'
              id='viewAllRecordsFromFDWidget'
              data-field-label={strFieldLabel}
              data-field-name={strFieldName}
              class={`${strBaseClassName}-view-all-btn`}
              onFwClick={this.viewAllRecordHandler}
            >
              <span>{i18nText('viewAllWidgetRecords')}</span>
            </fw-button>
          </div>
        )}
        {boolShowSeparator && (
          <span class={`${strFieldClassName}-field-separator`} />
        )}
      </div>
    );
  }

  render() {
    const strBaseClassName = 'fw-application-widget';
    const objValue = this.value;

    const arrFields = objValue?.sections;
    const arrFieldNames = arrFields ? Object.keys(arrFields) : null;
    const intFieldCount =
      arrFieldNames && arrFieldNames.length > 0 ? arrFieldNames.length : 0;
    const fieldElements =
      intFieldCount > 0
        ? arrFieldNames.map((strKey, index) =>
            this.renderFieldElement(arrFields[strKey], intFieldCount, index)
          )
        : null;

    const boolShowLinkModal = !!(
      this.showLinkModalDetails !== null && !this.loading
    );

    return (
      <Host tabIndex='-1'>
        <div class={strBaseClassName}>
          {!this.loading && (
            <div class={`${strBaseClassName}-fields-list`}>{fieldElements}</div>
          )}
          {this.loading && (
            <div class={`${strBaseClassName}-loading-container`}>
              <fw-skeleton
                class={`${strBaseClassName}-skeleton`}
                height='20px'
                count={3}
              ></fw-skeleton>
            </div>
          )}
          {boolShowLinkModal && (
            <fw-portal-component
              portalId={`fdWidget_${this.showLinkModalDetails?.fieldName}`}
            >
              <fw-widget-link
                params={this.params}
                linkFieldName={this.showLinkModalDetails?.fieldName}
                linkFieldLabel={this.showLinkModalDetails?.fieldLabel}
                primaryFieldLabel={this.showLinkModalDetails?.primaryFieldLabel}
                componentId={this.componentId}
                entityLabel={objValue?.widgetLabel}
                onFwClose={this.closeLinkModalHandler}
                onFwLink={this.applyLinkHandler}
                fetchData={this.fetchData}
              />
            </fw-portal-component>
          )}
        </div>
      </Host>
    );
  }
}

/* eslint-disable no-unneeded-ternary */
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core';

import { i18nText } from '../../utils/platform-app-utils';

@Component({
  tag: 'fw-widget-link',
  styleUrl: 'widget-link.scss',
  shadow: true,
})
export class WidgetLink {
  @Element() host!: HTMLElement;

  @Prop() fetchData?: any;

  @Prop() componentId;

  @Prop() params;

  @Prop() entityLabel = '';

  @Prop() linkFieldLabel = '';

  @Prop() linkFieldName = '';

  @Prop() primaryFieldLabel = '';

  @State() selectedRecord;

  @State() loading = false;

  @State() linking = false;

  @State() errorMessage = '';

  @Event() fwClose: EventEmitter;

  @Event() fwLink: EventEmitter;

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  @Listen('keyup')
  handleKeyUp(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  @Listen('keypress')
  handleKeyPress(event: KeyboardEvent) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  private submitHandler = async (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();

    if (this.fetchData) {
      this.linking = true;

      const objLinkResponse = await this.fetchData('LINK_RECORD', {
        params: this.params,
        fieldName: this.linkFieldName,
        recordId: this.selectedRecord.recordId,
        recordData: this.selectedRecord.linkData,
      });

      console.info(`Linking widget response - ${objLinkResponse}`);
      if (objLinkResponse?.success) {
        this.errorMessage = '';
        this.linking = false;
        this.fwLink.emit();
      } else if (
        !objLinkResponse?.success &&
        objLinkResponse?.errorMessage &&
        objLinkResponse.errorMessage !== ''
      ) {
        this.errorMessage = objLinkResponse.errorMessage;
        this.linking = false;
      }
    } else {
      this.linking = false;
    }
  };

  private closeHandler = (event: CustomEvent) => {
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.fwClose.emit();
  };

  private selectChangeHandler = async (event) => {
    const objSelectedRecord = event?.detail?.meta?.selectedOptions?.[0]?.meta;
    if (objSelectedRecord && this.fetchData) {
      this.loading = true;

      const objResponse = await this.fetchData('SEARCH_SELECT', {
        objectId: this.params.widgetObjectId,
        selectedRecord: objSelectedRecord,
      });

      if (objResponse && objResponse?.fields) {
        this.selectedRecord = {
          contextObjectId: this.params.widgetObjectId,
          contextRecordId: this.params.contextRecordId,
          recordId: objSelectedRecord.display_id,
          linkData: objSelectedRecord,
          fields: objResponse?.fields,
        };

        this.loading = false;
        this.errorMessage = '';
      } else {
        this.selectedRecord = null;
        this.loading = false;
      }
    } else {
      this.selectedRecord = null;
      this.loading = false;
    }
  };

  private searchHandler = async (strSearchText) => {
    if (!strSearchText || strSearchText === '') {
      return null;
    }

    if (!this.fetchData) {
      return null;
    }

    const objResponse = await this.fetchData('SEARCH_RECORD', {
      objectId: this.params.widgetObjectId,
      fieldName: this.linkFieldName,
      searchText: strSearchText,
    });

    if (objResponse) {
      let arrSelectData = null;

      if (objResponse.records) {
        arrSelectData = objResponse.records?.map((record) => {
          const { display_id: displayId, data } = record;
          // const strKeyName = Object.keys(data)[0];
          const strKeyName = record?.metadata?.primary_field_name;
          return {
            text: data[strKeyName],
            value: data[strKeyName] || displayId,
            meta: record,
          };
        });
      } else if (objResponse.tickets) {
        arrSelectData = objResponse?.tickets?.map((ticket) => {
          return { text: ticket.subject, value: ticket.id, meta: ticket };
        });
      } else if (objResponse.customers) {
        arrSelectData = objResponse.customers?.map((contact) => {
          return { text: contact.name, value: contact.id, meta: contact };
        });
      }

      if (arrSelectData) {
        return arrSelectData;
      }
    }
  };

  private renderRecordDetailsRowElement(dataItem) {
    const strCardClassName = 'fw-widget-link-record-row';

    return (
      <div class={`${strCardClassName}`}>
        <span class={`${strCardClassName}-header-label`}>{dataItem.label}</span>
        <span class={`${strCardClassName}-value-label`}>{dataItem.value}</span>
      </div>
    );
  }

  render() {
    const strBaseClassName = 'fw-widget-link';

    const arrSelectedRecordDetails = this.selectedRecord?.fields;
    const boolValidRecordDetails =
      arrSelectedRecordDetails && arrSelectedRecordDetails.length > 0;
    const selectedRecordElements = boolValidRecordDetails
      ? arrSelectedRecordDetails.map((dataItem) =>
          this.renderRecordDetailsRowElement(dataItem)
        )
      : null;

    const strSelectSearchHeader = i18nText('linkModalSelectSearchHeader', {
      fieldName: this.primaryFieldLabel,
    });

    const boolErrorState =
      this.errorMessage && this.errorMessage !== '' ? true : false;
    const strSelectState = boolErrorState ? 'error' : 'normal';

    return (
      <Host tabIndex='-1'>
        <fw-modal
          isOpen={true}
          slider
          class={strBaseClassName}
          titleText={i18nText('linkModalHeader')}
          onFwClose={this.closeHandler}
        >
          <fw-modal-content class={`${strBaseClassName}-content`}>
            <div class={`${strBaseClassName}-content-link`}>
              <div class={`${strBaseClassName}-select-div`}>
                <fw-select
                  required
                  state={strSelectState}
                  label={strSelectSearchHeader}
                  errorText={this.errorMessage}
                  placeholder={i18nText('linkModalSelectSearchPlaceholder')}
                  noDataText={i18nText('linkModalSelectEmptySearch')}
                  notFoundText={i18nText('linkModalSelectNoResultFound')}
                  search={this.searchHandler}
                  onFwChange={this.selectChangeHandler}
                  class={`${strBaseClassName}-fw-select`}
                />
              </div>
              {!this.loading && boolValidRecordDetails && (
                <div class={`${strBaseClassName}-record`}>
                  {selectedRecordElements}
                </div>
              )}
              {this.loading && (
                <div class={`${strBaseClassName}-loading-record`}>
                  <div class={`${strBaseClassName}-loading-div`}>
                    <fw-spinner size='large' color='#2C5CC5'></fw-spinner>
                    <span class={`${strBaseClassName}-loading-label`}>
                      {i18nText('linkModalLoadingText')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </fw-modal-content>
          <fw-modal-footer>
            <span class={`${strBaseClassName}-footer`}>
              <fw-button
                color='secondary'
                onFwClick={this.closeHandler}
                class={`${strBaseClassName}-footer-btn`}
              >
                {i18nText('linkModalCancelButton')}
              </fw-button>
              <fw-button
                loading={this.linking}
                disabled={!this.selectedRecord}
                onFwClick={this.submitHandler}
                class={`${strBaseClassName}-footer-btn`}
              >
                {i18nText('saveFieldBtn', {}, 'formBuilder')}
              </fw-button>
            </span>
          </fw-modal-footer>
        </fw-modal>
      </Host>
    );
  }
}

/* eslint-disable no-console */
import { Component, Prop, State, h, Method } from '@stencil/core';

const nativeObjects = [
  { value: 'ticket', text: 'Ticket' },
  { value: 'contact', text: 'Contact' },
];

const contactWidget = {
  id: 2,
  type: 'REVERSE',
  icon_link: 'https://d2lz1e868xzctj.cloudfront.net/icons/Agent.svg',
  title: 'Contact',
  widget: {
    componentId: 'contact_widget_test_REVERSE',
    widgetId: 5540,
    widgetLabel: 'Co-native',
    associationType: 'REVERSE',
    variation: 'contact',
    sections: {
      cf_contact11: {
        contextLabel:
          'FD-co-contact-11111111111111111-done-done-done-done-done-done',
        primaryFieldName: 'cf_name',
        primaryFieldLabel: 'Name',
        fieldName: 'cf_contact11',
        fieldType: 'RELATIONSHIP',
        fieldLabel: 'contact-1-1',
        lookupType: 'ONE_TO_ONE',
        displayIds: ['_1-3'],
        showViewAllRecordsCta: false,
        showLinkCta: false,
        records: {
          '_1-3': {
            id: '_1-3',
            rows: [
              {
                id: '_1-3_cf_name',
                recordId: '_1-3',
                header: 'Name',
                fieldName: 'cf_name',
                fieldType: 'PRIMARY',
                value: 'David Smith',
                avatar:
                  'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
                subtext:
                  'Testing Contact Designation to be displayed long name test abcd efgh ijkl mnop qrstuv wxyz',
              },
              {
                id: '_1-3_cf_ticketmany1',
                recordId: '_1-3',
                header: 'Ticket-many-1',
                fieldName: 'cf_ticketmany1',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-3_cf_ticket11',
                recordId: '_1-3',
                header: 'Ticket-1-1',
                fieldName: 'cf_ticket11',
                fieldType: 'RELATIONSHIP',
                value: 'ticket 4',
              },
              {
                id: '_1-3_cf_contactmany1',
                recordId: '_1-3',
                header: 'contact-many-1',
                fieldName: 'cf_contactmany1',
                fieldType: 'RELATIONSHIP',
                value: 'Freshdesk',
                isLink: true,
              },
              {
                id: '_1-3_cf_contact11',
                recordId: '_1-3',
                header: 'contact-1-1',
                fieldName: 'cf_contact11',
                fieldType: 'RELATIONSHIP',
                value:
                  'FD-co-contact-11111111111111111-done-done-done-done-done-done',
              },
            ],
          },
        },
      },
      cf_contactmany1: {
        contextLabel:
          'FD-co-contact-11111111111111111-done-done-done-done-done-done',
        primaryFieldName: 'cf_name',
        primaryFieldLabel: 'Name',
        fieldName: 'cf_contactmany1',
        fieldType: 'RELATIONSHIP',
        fieldLabel: 'contact-many-1',
        lookupType: 'MANY_TO_ONE',
        displayIds: ['_1-4'],
        showViewAllRecordsCta: false,
        showLinkCta: true,
        records: {
          '_1-4': {
            id: '_1-4',
            rows: [
              {
                id: '_1-4_cf_name',
                recordId: '_1-4',
                header: '',
                tag: 'Archived',
                fieldName: 'cf_name',
                fieldType: 'PRIMARY',
                value: 'Sharadha Raman',
                avatar: '',
                subtext: 'Product Manager',
              },
              {
                id: '_1-4_cf_ticketmany1',
                recordId: '_1-4',
                header: 'Ticket-many-1',
                fieldName: 'cf_ticketmany1',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-4_cf_ticket11',
                recordId: '_1-4',
                header: 'Ticket-1-1',
                fieldName: 'cf_ticket11',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-4_cf_contactmany1',
                recordId: '_1-4',
                header: 'contact-many-1',
                fieldName: 'cf_contactmany1',
                fieldType: 'RELATIONSHIP',
                value:
                  'FD-co-contact-11111111111111111-done-done-done-done-done-done',
              },
              {
                id: '_1-4_cf_contact11',
                recordId: '_1-4',
                header: 'contact-1-1',
                fieldName: 'cf_contact11',
                fieldType: 'RELATIONSHIP',
                value: 'Freshdesk',
              },
            ],
          },
        },
      },
    },
  },
};

const ticketWidget = {
  id: 1,
  type: 'REVERSE',
  icon_link: 'https://d2lz1e868xzctj.cloudfront.net/icons/Agent.svg',
  title: 'Ticket',
  widget: {
    componentId: 'ticket_widget_test_REVERSE',
    widgetId: 5540,
    widgetLabel: 'Co-native',
    associationType: 'REVERSE',
    variation: 'ticket',
    sections: {
      cf_contact11: {
        contextLabel:
          'FD-co-contact-11111111111111111-done-done-done-done-done-done',
        primaryFieldName: 'cf_name',
        primaryFieldLabel: 'Name',
        fieldName: 'cf_contact11',
        fieldType: 'RELATIONSHIP',
        fieldLabel: 'contact-1-1',
        lookupType: 'ONE_TO_ONE',
        displayIds: ['_1-3'],
        showViewAllRecordsCta: false,
        showLinkCta: false,
        records: {
          '_1-3': {
            id: '_1-3',
            rows: [
              {
                id: '_1-3_cf_name',
                recordId: '_1-3',
                header: 'Name',
                fieldName: 'cf_name',
                fieldType: 'PRIMARY',
                value: '#1237483 ',
                tag: 'Archived',
                subtext: 'My cookies are broken completely',
              },
              {
                id: '_1-3_cf_ticketmany1',
                recordId: '_1-3',
                header: 'Ticket-many-1',
                fieldName: 'cf_ticketmany1',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-3_cf_ticket11',
                recordId: '_1-3',
                header: 'Ticket-1-1',
                fieldName: 'cf_ticket11',
                fieldType: 'RELATIONSHIP',
                value: 'ticket 4',
              },
              {
                id: '_1-3_cf_contactmany1',
                recordId: '_1-3',
                header: 'contact-many-1',
                fieldName: 'cf_contactmany1',
                fieldType: 'RELATIONSHIP',
                value: 'Freshdesk',
                isLink: true,
              },
              {
                id: '_1-3_cf_contact11',
                recordId: '_1-3',
                header: 'contact-1-1',
                fieldName: 'cf_contact11',
                fieldType: 'RELATIONSHIP',
                value:
                  'FD-co-contact-11111111111111111-done-done-done-done-done-done',
              },
            ],
          },
        },
      },
      cf_contactmany1: {
        contextLabel:
          'FD-co-contact-11111111111111111-done-done-done-done-done-done',
        primaryFieldName: 'cf_name',
        primaryFieldLabel: 'Name',
        fieldName: 'cf_contactmany1',
        fieldType: 'RELATIONSHIP',
        fieldLabel: 'contact-many-1',
        lookupType: 'MANY_TO_ONE',
        displayIds: ['_1-4'],
        showViewAllRecordsCta: false,
        showLinkCta: true,
        records: {
          '_1-4': {
            id: '_1-4',
            rows: [
              {
                id: '_1-4_cf_name',
                recordId: '_1-4',
                header: 'Name',
                fieldName: 'cf_name',
                fieldType: 'PRIMARY',
                value: 'Sharadha Raman',
                avatar: '',
                subtext: 'Product Manager',
              },
              {
                id: '_1-4_cf_ticketmany1',
                recordId: '_1-4',
                header: 'Ticket-many-1',
                fieldName: 'cf_ticketmany1',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-4_cf_ticket11',
                recordId: '_1-4',
                header: 'Ticket-1-1',
                fieldName: 'cf_ticket11',
                fieldType: 'RELATIONSHIP',
                value: '-',
              },
              {
                id: '_1-4_cf_contactmany1',
                recordId: '_1-4',
                header: 'contact-many-1',
                fieldName: 'cf_contactmany1',
                fieldType: 'RELATIONSHIP',
                value:
                  'FD-co-contact-11111111111111111-done-done-done-done-done-done',
              },
              {
                id: '_1-4_cf_contact11',
                recordId: '_1-4',
                header: 'contact-1-1',
                fieldName: 'cf_contact11',
                fieldType: 'RELATIONSHIP',
                value: 'Freshdesk',
              },
            ],
          },
        },
      },
    },
  },
};

const objInputData = { current: { contextObjectId: '', contextRecordId: '' } };

@Component({
  tag: 'test-component',
  styleUrl: 'test-component.scss',
  shadow: true,
})
export class TestComponent {
  @Prop() componentId?: string = '';
  @Prop() params = null;

  @State() loading = true;

  @State() platformAppWidgets = [contactWidget, ticketWidget];

  @Method()
  async trigger(params: any) {
    (window as any).log(
      `Calling trigger in test-component <pre>${JSON.stringify(
        params,
        null,
        2
      )}</pre>`
    );
    return { response: { params } };
  }

  toggleHandler = (event) => {
    const boolExpanded = event.detail.expanded;
    const intIndex = parseInt(event.target.dataset.index);
    const arrUpdate = [...this.platformAppWidgets];
    (arrUpdate[intIndex] as any).expanded = boolExpanded;
    this.platformAppWidgets = [...arrUpdate];
  };

  renderWidget = (objWidget, index) => {
    const boolReverseWidget = objWidget.type.includes('REVERSE');
    const strWidgetHeader = boolReverseWidget
      ? `Related ${objWidget.title}`
      : objWidget.title;
    // eslint-disable-next-line no-unneeded-ternary
    const boolExpanded = !!(
      Object.prototype.hasOwnProperty.call(objWidget, 'expanded') &&
      objWidget.expanded
    );
    const strCompID = `${objInputData.current.contextObjectId}_${objWidget.id}_${objInputData.current.contextRecordId}_${objWidget.type}`;

    return (
      <fw-accordion
        class='widgetAccordion'
        key={`${strCompID}_parent`}
        expanded={boolExpanded}
        data-index={index}
        onFwAccordionToggle={this.toggleHandler}
      >
        <fw-accordion-title>
          <div class='widgetAccordionTitle'>
            <span class='widgetAccordionTitleIconContainer'>
              <fw-icon name='alert'></fw-icon>
            </span>
            <span class='widgetAccordionTitleLabel'>{strWidgetHeader}</span>
          </div>
        </fw-accordion-title>
        <fw-accordion-body>
          {boolExpanded && (
            <div>
              <fw-widget-card
                componentId={strCompID}
                loading={true}
                params={{
                  contextObjectId: objInputData.current.contextObjectId,
                  widgetObjectId: objWidget.id,
                  contextRecordId: objInputData.current.contextRecordId,
                  associationType: objWidget.type,
                }}
              />
            </div>
          )}
        </fw-accordion-body>
      </fw-accordion>
    );
  };

  render() {
    const arrFdWidgetElements = this.platformAppWidgets
      ? this.platformAppWidgets.map((dataItem, index) =>
          this.renderWidget(dataItem, index)
        )
      : null;

    return (
      <div class='create-entity'>
        <div class='widgetDemo'>
          <div class='widgetDemoSection'>
            <label class='widgetDemoButtonHeaderLabel'>
              {'Select Ticket or Contact'}
            </label>
            <fw-select options={nativeObjects} />
          </div>
          <div class='widgetDemoSection'>
            <label class='widgetDemoButtonHeaderLabel'>
              {'Enter Ticket or Contact ID'}
            </label>
            <fw-input />
          </div>

          <div class='widgetDemoSection'>
            <label class='widgetDemoButtonHeaderLabel'>
              {'Sample record ids'}
            </label>
            <label class='widgetDemoButtonHelpLabel'>
              {'1509502873814450176 - contact id of Krithi'}
            </label>
            <label class='widgetDemoButtonHelpLabel'>
              {'1511621899456786432 - contact id of FD-CO'}
            </label>
          </div>

          <div class='widgetDemoSection'>
            <fw-button>{'Submit'}</fw-button>
          </div>
        </div>

        {arrFdWidgetElements && (
          <div class='fdwidgets'>
            <label class='widgetDemoButtonHeaderLabel'>{'FD widgets'}</label>{' '}
            {arrFdWidgetElements}
          </div>
        )}
      </div>
    );
  }
}

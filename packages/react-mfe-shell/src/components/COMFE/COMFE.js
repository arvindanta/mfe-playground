/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
// eslint-disable-next-line jsx-a11y/label-has-associated-control
// eslint-disable-next-line no-case-declarations

import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  FwAccordion,
  FwAccordionBody,
  FwAccordionTitle,
  FwButton,
  FwIcon,
  FwInput,
  FwSelect,
} from '@freshworks/crayons/react';

import styles from './COMFE.module.css';
import Mfewrapper from './mfe-wrapper';

import { MFEController } from '../../controller';

const APP_ID = 'stencilMFE1';

export default function Entities() {
  const navigate = useNavigate();

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

  const [platformAppWidgets, setPlatformAppWidgets] = useState([
    contactWidget,
    ticketWidget,
  ]);

  const objInputData = useRef({ contextObjectId: '', contextRecordId: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onWidgetActionHandler = useCallback(
    (objActionData) => {
      const strAction = objActionData.action;
      const objDetails = objActionData.detail;

      switch (strAction) {
        case 'NAVIGATE':
          // eslint-disable-next-line no-case-declarations
          const strNavigateUrl = objDetails.url;
          console.info('Navigate to - ' + strNavigateUrl);
          navigate('/redirect', {
            state: { type: 'CUSTOM', path: strNavigateUrl },
          });
          break;
        default:
          break;
      }
    },
    [navigate]
  );
  const ref = useRef();

  // useEffect(() => {
  //   // coApp.current = FwApplicationController.init(appName);
  //   // coApp.current.setConfig({
  //   //   apiBasePath: 'https://coui-dev.freshworksapi.com/api/_/',
  //   //   native_objects_enabled: ['ticket', 'contact', 'company'],
  //   //   permissions: {
  //   //     schema: ['create', 'read', 'update', 'delete'],
  //   //     record: ['create', 'read', 'update', 'delete'],
  //   //     nativeObjects: {
  //   //       ticket: ['read', 'create', 'update'],
  //   //       contact: ['read', 'create', 'update'],
  //   //       company: ['read', 'create', 'update'],
  //   //     },
  //   //   },
  //   // });
  //   // coApp.current.on(onWidgetActionHandler);
  //   // // return () => {
  //   // //   FwApplicationController.destroy(appName);
  //   // // };
  // }, [onWidgetActionHandler]);

  MFEController.setApplicationConfig(APP_ID, {
    apiBasePath: 'https://coui-dev.freshworksapi.com/api/_/',
    native_objects_enabled: ['ticket', 'contact', 'company'],
    permissions: {
      schema: ['create', 'read', 'update', 'delete'],
      record: ['create', 'read', 'update', 'delete'],
      nativeObjects: {
        ticket: ['read', 'create', 'update'],
        contact: ['read', 'create', 'update'],
        company: ['read', 'create', 'update'],
      },
    },
  });

  MFEController.namespace(APP_ID).subscribe('NAVIGATE', (details) => {
    const objDetails = details.payload;
    const strNavigateUrl = objDetails.url;
    const type = objDetails.type;
    console.info('Navigate to - ' + strNavigateUrl, type);
    navigate('/redirect', {
      state: { type: 'CUSTOM', path: strNavigateUrl },
    });
  });

  const refreshWidgets = async () => {
    window.log('fkfjfj');
    setPlatformAppWidgets(null);
    const arrWidgets =
      (await MFEController.get(APP_ID, {
        action: 'FETCH_ASSOCIATION_SCHEMAS',
        contextObjectId: objInputData.current.contextObjectId,
      })) ?? [];

    arrWidgets.push(contactWidget);
    arrWidgets.push(ticketWidget);
    setPlatformAppWidgets(arrWidgets);
  };

  const objectChangeHandler = (event) => {
    objInputData.current.contextObjectId = event.detail.value;
    // setContextObjectId(event.detail.value);
  };

  const recordIdChangeHandler = (event) => {
    const strUpdatedValue = event?.target?.value?.trim() || '';
    objInputData.current.contextRecordId = parseInt(strUpdatedValue);
    // setContextRecordId(strUpdatedValue);
  };

  const refreshWidgetHandler = (event) => {
    refreshWidgets();
  };

  const toggleHandler = (event) => {
    const boolExpanded = event.detail.expanded;
    const intIndex = parseInt(event.target.dataset.index);
    const arrUpdate = [...platformAppWidgets];
    arrUpdate[intIndex].expanded = boolExpanded;
    setPlatformAppWidgets([...arrUpdate]);
  };

  // eslint-disable-next-line no-unused-vars
  const renderWidget = (objWidget, index) => {
    const iconName = 'alert';
    const boolReverseWidget = objWidget.type.includes('REVERSE');
    const strWidgetHeader = boolReverseWidget
      ? `Related ${objWidget.title}`
      : objWidget.title;
    // eslint-disable-next-line no-unneeded-ternary
    const boolExpanded =
      Object.prototype.hasOwnProperty.call(objWidget, 'expanded') &&
      objWidget.expanded;

    const strCompID = `${objInputData.current.contextObjectId}_${objWidget.id}_${objInputData.current.contextRecordId}_${objWidget.type}`;

    return (
      <FwAccordion
        class={styles.widgetAccordion}
        key={`${strCompID}_parent`}
        expanded={boolExpanded}
        onFwAccordionToggle={toggleHandler}
        data-index={index}
      >
        <FwAccordionTitle>
          <div className={styles.widgetAccordionTitle}>
            <span className={styles.widgetAccordionTitleIconContainer}>
              <FwIcon name={iconName} />
            </span>
            <span className={styles.widgetAccordionTitleLabel}>
              {strWidgetHeader}
            </span>
          </div>
        </FwAccordionTitle>
        <FwAccordionBody>
          {boolExpanded && (
            <Mfewrapper
              instanceId={strCompID}
              appProps={{
                applicationName: 'CUSTOM-OBJECT',
                componentTag: 'fw-application',
                componentType: 'WIDGET-CARD',
                componentId: strCompID,
                params: {
                  contextObjectId: objInputData.current.contextObjectId,
                  widgetObjectId: objWidget.id,
                  contextRecordId: objInputData.current.contextRecordId,
                  associationType: objWidget.type,
                },
              }}
            />
          )}
        </FwAccordionBody>
      </FwAccordion>
    );
  };

  const arrFdWidgetElements = platformAppWidgets
    ? platformAppWidgets.map((dataItem, index) => renderWidget(dataItem, index))
    : null;

  return (
    <div className={styles['create-entity']}>
      <div className={styles.widgetDemo}>
        <div className={styles.widgetDemoSection}>
          <label className={styles.widgetDemoButtonHeaderLabel}>
            {'Select Ticket or Contact'}
          </label>
          <FwSelect options={nativeObjects} onFwChange={objectChangeHandler} />
        </div>
        <div className={styles.widgetDemoSection}>
          <label className={styles.widgetDemoButtonHeaderLabel}>
            {'Enter Ticket or Contact ID'}
          </label>
          <FwInput onFwBlur={recordIdChangeHandler} />
        </div>

        <div className={styles.widgetDemoSection}>
          <label className={styles.widgetDemoButtonHeaderLabel}>
            {'Sample record ids'}
          </label>
          <label className={styles.widgetDemoButtonHelpLabel}>
            {'1509502873814450176 - contact id of Krithi'}
          </label>
          <label className={styles.widgetDemoButtonHelpLabel}>
            {'1511621899456786432 - contact id of FD-CO'}
          </label>
        </div>

        <div className={styles.widgetDemoSection}>
          <FwButton onFwClick={refreshWidgetHandler}>{'Submit'}</FwButton>
        </div>
      </div>
      {arrFdWidgetElements && (
        <div className={styles.fdwidgets}>
          <label className={styles.widgetDemoButtonHeaderLabel}>
            {'FD widgets'}
          </label>{' '}
          {arrFdWidgetElements}
        </div>
      )}
    </div>
  );
}

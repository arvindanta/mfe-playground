import { DateFormatController } from '@freshworks/crayons/react';
import { hasCustomProperty, i18nText } from '../utils/platform-app-utils';
import FW_APP_CONSTANTS from '../constants/FwApplicationContants';

let _apiResponseStore = {};
let _contactStore = {};
let _ticketStore = {};
let _configCoui = {};

export function setCouiConfig(value) {
  _configCoui = value;
}

export function getCouiConfig(localConfig = null) {
  if (localConfig) {
    return localConfig;
  }
  return _configCoui;
}

export function getCouiApiBasePath(localConfig = null) {
  const config = getCouiConfig(localConfig);
  return `${config.apiBasePath}${FW_APP_CONSTANTS.API_NAMESPACE}`;
}

export function getContactApiBasePath(localConfig = null) {
  const config = getCouiConfig(localConfig);
  return `${config.apiBasePath}`;
}

export function getCouiRoutePrefix() {
  return '';
  // return '/module/custom-objects';
}

export function hasUpdateRecordPermission() {
  try {
    const config = getCouiConfig();
    const arrRecordPermissions = config?.permissions?.record || null;
    if (arrRecordPermissions && arrRecordPermissions.length > 0) {
      const intLength = arrRecordPermissions.length;
      for (let i1 = 0; i1 < intLength; i1++) {
        if (arrRecordPermissions[i1] === 'update') {
          return true;
        }
      }
    }
  } catch (error) {}

  return false;
}

export function getFormattedDate(strInputDate) {
  const config = getCouiConfig();
  const strLocale = config?.user?.locale?.language || '';

  if (config?.user?.locale?.dateTimeFormat !== '') {
    // TODO - get the format from the config and apply
  }

  const formattedDate = DateFormatController({
    date: strInputDate,
    locale: strLocale,
    options: { month: 'short', day: 'numeric', year: 'numeric' },
  });
  return formattedDate;
}

export async function serializeContextRecordId(
  objectId,
  contextRecId,
  parseToString = true
) {
  const objNativeObjects = await getObjectId(objectId);
  if (
    objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
    (objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT ||
      objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY) &&
    contextRecId
  ) {
    const numContextRecId = BigInt(contextRecId);
    if (!parseToString) {
      return numContextRecId;
    }
    return toJson(numContextRecId);
  }
  return contextRecId;
}

export async function deserializeContextRecordId(objectId, contextRecId) {
  const objNativeObjects = await getObjectId(objectId);
  if (
    objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
    (objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT ||
      objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY) &&
    contextRecId &&
    contextRecId !== '' &&
    contextRecId !== FW_APP_CONSTANTS.EMPTY_FIELD_VALUE
  ) {
    const strDeserializedRecId = BigInt(contextRecId).toString();
    return strDeserializedRecId;
  }
  return contextRecId;
}

export function isApiResponseStored(strKey) {
  if (
    strKey &&
    strKey !== '' &&
    hasCustomProperty(_apiResponseStore, strKey) &&
    _apiResponseStore[strKey]
  ) {
    return true;
  }
  return false;
}

export function storeApiResponse(strKey, objResponse) {
  if (!_apiResponseStore) {
    _apiResponseStore = {};
  }
  _apiResponseStore[strKey] = objResponse;
}

export function destroyApi() {
  _ticketStore = null;
  _contactStore = null;
  _apiResponseStore = null;
}

async function fetchApiData(
  config,
  endPoint,
  method = 'GET',
  payload = null,
  boolGetContactApi = false,
  boolReturnFailure = false
) {
  try {
    const strAPIBasePath = !boolGetContactApi
      ? getCouiApiBasePath(config)
      : getContactApiBasePath(config);

    const url = `${strAPIBasePath}${endPoint}`;
    let fetchOptions = {
      method: method,
      body: null,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      fetchOptions = { ...fetchOptions, body: payload };
    }

    let boolSuccess = true;
    const response = await fetch(url, fetchOptions);
    if (!response || !response.ok) {
      console.info(
        `An error has occured fetching endpoint - ${endPoint} : ${response?.status}`
      );
      boolSuccess = false;
      if (!boolReturnFailure) {
        return null;
      }
    }
    const jsonResponse = await response.json();
    if (!boolReturnFailure) {
      return jsonResponse;
    } else {
      return { success: boolSuccess, response: jsonResponse };
    }
  } catch (error) {
    console.info(
      `An error has occured fetching endpoint - ${endPoint} : ${error}`
    );
    return null;
  }
}

export async function fetchNativeObjects(config) {
  // console.info(config);
  // return { ticket: 989898, contact: 898989 };

  const strStoreKey = `native_objects`;
  if (isApiResponseStored(strStoreKey)) {
    return _apiResponseStore[strStoreKey];
  }

  config = getCouiConfig(config);
  if (
    !config ||
    !config.native_objects_enabled ||
    config.native_objects_enabled.length <= 0
  ) {
    return null;
  }

  // Get native objects
  const jsonResponse = await fetchApiData(config, '/schemas/native');
  const arrNativeObjects = jsonResponse?.schemas;

  if (arrNativeObjects && arrNativeObjects.length > 0) {
    const objNativeObjects = {};
    const intLength = arrNativeObjects.length;
    for (let i1 = 0; i1 < intLength; i1++) {
      objNativeObjects[arrNativeObjects[i1]?.name?.toLowerCase()] =
        arrNativeObjects[i1].id;
    }
    storeApiResponse(strStoreKey, objNativeObjects);
    return objNativeObjects;
  }
  return null;
}

// Fetch Object details
export async function fetchEntity(config, id, force = false) {
  if (!force && isApiResponseStored(id)) {
    return _apiResponseStore[id];
  }

  const jsonResponse = await fetchApiData(config, `/schemas/${id}`);
  if (jsonResponse) {
    storeApiResponse(id, jsonResponse);
  }
  return jsonResponse;
}

// Fetch customised widget fields for an object
export async function fetchCustomisedWidgetFields(
  config,
  objectId,
  force = false
) {
  const strStoreKey = `widgets_${objectId}`;
  if (!force && isApiResponseStored(strStoreKey)) {
    return _apiResponseStore[strStoreKey];
  }

  const jsonResponse = await fetchApiData(
    config,
    `/schemas/${objectId}/customisations/default`
  );
  let arrWidgetFields = null;
  if (
    jsonResponse?.precedence_of_schema_fields &&
    jsonResponse.precedence_of_schema_fields.length > 0
  ) {
    arrWidgetFields = jsonResponse.precedence_of_schema_fields;
    storeApiResponse(strStoreKey, arrWidgetFields);
  }
  return arrWidgetFields;
}

// api call to fetch contact details
export async function fetchContactDetails(contactId) {
  if (
    contactId &&
    hasCustomProperty(_contactStore, contactId) &&
    _contactStore[contactId]
  ) {
    return _contactStore[contactId];
  }

  const config = getCouiConfig();
  if (!config) {
    return null;
  }

  const jsonResponse = await fetchApiData(
    config,
    `contacts/?org_contact_ids=${contactId}&include=company`,
    'GET',
    null,
    true
  );

  if (
    jsonResponse &&
    jsonResponse.contacts &&
    jsonResponse.contacts.length > 0
  ) {
    const objContact = jsonResponse.contacts[0];
    if (!_contactStore) {
      _contactStore = {};
    }
    _contactStore[contactId] = objContact;
    return objContact;
  }

  return null;
}

// function to check if the entity id is Contact
async function isContactEntityId(id, config = null) {
  const objNativeObjects = await getObjectId(id, config);
  if (
    objNativeObjects &&
    objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
    objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT
  ) {
    return true;
  }
  return false;
}

// function to get the contact name from the org id
async function getContactDetailFromId(entityId, contactUcrId) {
  const strDeserializedContactId = await deserializeContextRecordId(
    entityId,
    contactUcrId
  );
  const objContact = await fetchContactDetails(strDeserializedContactId);
  if (objContact && objContact?.name) {
    return objContact;
  }
}

// function to check if the entity id is company
async function isCompanyEntityId(id, config = null) {
  const objNativeObjects = await getObjectId(id, config);
  if (
    objNativeObjects &&
    objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
    objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY
  ) {
    return true;
  }
  return false;
}

// function to get the company name from the org id
async function getCompanyDetailFromId(entityId, companyId) {
  const strDeserializedId = await deserializeContextRecordId(
    entityId,
    companyId
  );
  const objRecord = await fetchContactDetails(strDeserializedId);
  if (objRecord && objRecord?.name) {
    return objRecord;
  }
}

// function to check if the entity id is Contact
async function isTicketEntityId(id, config = null) {
  const objNativeObjects = await getObjectId(id, config);
  if (
    objNativeObjects &&
    objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
    objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_TICKET
  ) {
    return true;
  }
  return false;
}

// api call to fetch ticket details
async function fetchTicketDetails(ticketId) {
  if (
    ticketId &&
    hasCustomProperty(_contactStore, ticketId) &&
    _contactStore[ticketId]
  ) {
    return _contactStore[ticketId];
  }

  const config = getCouiConfig();
  if (!config) {
    return null;
  }

  const jsonResponse = await fetchApiData(
    config,
    `tickets/?ids=${ticketId}&include=requester`,
    'GET',
    null,
    true
  );

  if (jsonResponse && jsonResponse.tickets && jsonResponse.tickets.length > 0) {
    const objTicket = jsonResponse.tickets[0];
    if (!_ticketStore) {
      _ticketStore = {};
    }
    _ticketStore[ticketId] = objTicket;
    return objTicket;
  }

  return null;
}

// function to get the ticket name from the ticket id
async function getTicketDetailFromId(ticketId) {
  const objTicket = await fetchTicketDetails(ticketId);
  if (objTicket) {
    return objTicket;
  }
  return null;
}

// function to resolve native object display values
export async function resolveNativeFieldValue(entityId, nativeRecordId) {
  let strDisplayValue = FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;

  const isEntityContact = await isContactEntityId(entityId);
  if (isEntityContact) {
    const objContact = await getContactDetailFromId(entityId, nativeRecordId);
    if (objContact) {
      strDisplayValue = objContact?.name || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
      return { value: strDisplayValue, detail: objContact };
    }
    return { value: strDisplayValue, detail: null };
  }

  const isEntityTicket = await isTicketEntityId(entityId);
  if (isEntityTicket) {
    const objTicket = await getTicketDetailFromId(nativeRecordId);
    if (objTicket) {
      strDisplayValue =
        objTicket?.subject || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
      return { value: strDisplayValue, detail: objTicket };
    }
    return { value: strDisplayValue, detail: null };
  }

  const isEntityCompany = await isCompanyEntityId(entityId);
  if (isEntityCompany) {
    const objCompany = await getCompanyDetailFromId(entityId, nativeRecordId);
    if (objCompany) {
      strDisplayValue = objCompany?.name || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
      return { value: strDisplayValue, detail: objCompany };
    }
    return { value: strDisplayValue, detail: null };
  }

  return null;
}

// function to get the entity id by parsing "contacts" and "tickets" to id
export async function getObjectId(id, config = null) {
  const objNativeObjects = await fetchNativeObjects(config);
  const isValidNumericObjectId = !!(!isNaN(id) && id > 0);

  if (isValidNumericObjectId) {
    const arrNativeObjectKeys = Object.keys(objNativeObjects);
    const intLength = arrNativeObjectKeys.length;
    for (let i1 = 0; i1 < intLength; i1++) {
      const strEntityName = arrNativeObjectKeys[i1]?.toLowerCase();
      if (objNativeObjects[strEntityName] === id) {
        return {
          id: id,
          name: strEntityName,
          type: FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE,
        };
      }
    }
  } else if (id && id !== '') {
    const strObjectName = id.toLowerCase();
    if (hasCustomProperty(objNativeObjects, strObjectName)) {
      return {
        id: objNativeObjects[id],
        name: strObjectName,
        type: FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE,
      };
    }
  }
  return { id: id, type: FW_APP_CONSTANTS.SCHEMA_TYPE_CUSTOM, name: '' };
}

function getPrimaryField(objEntity) {
  if (objEntity && objEntity.fields && objEntity.fields.length > 0) {
    const objPrimaryField = objEntity.fields.filter((el) => {
      return el.type === FW_APP_CONSTANTS.PRIMARY_FIELD;
    })?.[0];

    if (!objPrimaryField) {
      return objEntity.fields[0];
    }
    return objPrimaryField;
  }
  return null;
}

export function bringPrimaryFieldOnTop(arrFields) {
  if (arrFields && arrFields.length > 1) {
    if (arrFields[0].type !== FW_APP_CONSTANTS.PRIMARY_FIELD) {
      const intPrimaryIndex = arrFields.findIndex(
        (el) => el.type === FW_APP_CONSTANTS.PRIMARY_FIELD
      );
      if (intPrimaryIndex > 0) {
        const arrPrimaryField = arrFields.splice(intPrimaryIndex, 1);
        arrFields.unshift(arrPrimaryField[0]);
      }
    }
  }
  return arrFields;
}

// Fetch forward and inverse associations with other objects for the provided object ID
export async function fetchObjectAssociations(config, objectId) {
  const objNativeObjects = await getObjectId(objectId, config);
  const strObjectType = objNativeObjects.type;
  const targetObjectID = objNativeObjects.id;
  const objAssociationEntities = { forward: {}, reverse: {} };

  // Get forward associations
  const jsonResponseForward = await fetchApiData(
    config,
    `/schemas/associations?target_object_id=${targetObjectID}&target_object_type=${strObjectType}`
  );
  const arrForwardAssociations = jsonResponseForward?.associations;

  // Parse forward asssociated widgets and store the field names
  const arrParsedForwardAssociations = [];
  let intLength = arrForwardAssociations?.length;
  for (let i1 = 0; i1 < intLength; i1++) {
    const objItem = arrForwardAssociations[i1].schema;
    _apiResponseStore[objItem.id] = objItem;
    arrParsedForwardAssociations.push({
      id: objItem.id,
      type: 'REVERSE',
      icon_link: objItem.icon_link,
      title: objItem.title || objItem.name || objItem.id,
    });
    objAssociationEntities.forward[objItem.id] = {
      fieldNames: arrForwardAssociations[i1].field_names,
    };
  }

  // Get inverse associations
  const jsonResponseInverse = await fetchApiData(
    config,
    `/schemas/inverse-associations?source_object_id=${targetObjectID}`
  );
  const arrReverseAssociations = jsonResponseInverse?.inverse_associations;

  // Parse reverse asssociated widgets and store the field names
  const arrParsedReverseAssociations = [];
  intLength = arrReverseAssociations?.length;
  for (let i2 = 0; i2 < intLength; i2++) {
    let boolValidReverseSchema = false;
    const objItem = arrReverseAssociations[i2];
    const itemSchemaId = objItem.schema_id;

    if (!objAssociationEntities.reverse[itemSchemaId]) {
      const objEntity = await fetchEntity(config, itemSchemaId);
      if (
        hasCustomProperty(objEntity, 'id') &&
        !isNaN(objEntity.id) &&
        objEntity.id > 0
      ) {
        boolValidReverseSchema = true;
      }

      if (boolValidReverseSchema) {
        objAssociationEntities.reverse[itemSchemaId] = { fieldNames: [] };
        arrParsedReverseAssociations.push({
          id: itemSchemaId,
          type: 'FORWARD', // Although, we are using the inverse api call for this, on the tickets page - this will be considered forward association
          icon_link: objEntity.icon_link,
          title: objEntity.title || objEntity.name || objEntity.id,
        });
      }
    } else {
      boolValidReverseSchema = true;
    }

    if (boolValidReverseSchema) {
      if (!objAssociationEntities.reverse[itemSchemaId].fieldNames) {
        objAssociationEntities.reverse[itemSchemaId].fieldNames = [];
      }
      objAssociationEntities.reverse[itemSchemaId].fieldNames.push(objItem);
    }
  }

  const arrWidgetAccordions = [
    ...arrParsedReverseAssociations,
    ...arrParsedForwardAssociations,
  ];
  const objResponse = {
    widgets: arrWidgetAccordions,
    params: objAssociationEntities,
  };
  const strStoreKey = `association_${objectId}`;
  storeApiResponse(strStoreKey, objResponse);
  return objResponse;
}

// Fetch widget details
export async function fetchWidget(config, params, renderComponentId = '') {
  const boolHasUpdateRecordPermission = hasUpdateRecordPermission();
  const nativeObjectId = params.contextObjectId;
  const widgetObjectId = params.widgetObjectId;
  const strAssociationType = params.associationType;
  const contextRecordId = await serializeContextRecordId(
    nativeObjectId,
    params.contextRecordId
  );

  let strContextLabel = '';
  const objNativeFieldDetail = await resolveNativeFieldValue(
    nativeObjectId,
    contextRecordId
  );
  if (objNativeFieldDetail && objNativeFieldDetail.value) {
    strContextLabel = objNativeFieldDetail.value;
  }

  console.info(
    `Fetching Widget - NativeObject ID- ${nativeObjectId} , Widget object ID - ${widgetObjectId} , context Record ID -  ${contextRecordId} , association type - ${strAssociationType}`
  );

  // Fetch Native objects to map their IDs - FD will be sending the name of contact and ticket instead of ids
  const objNativeObjects = await getObjectId(nativeObjectId, config);
  const contextObjectId = objNativeObjects.id;

  const objEntity = await fetchEntity(config, widgetObjectId);
  const arrFields = objEntity.fields;
  bringPrimaryFieldOnTop(arrFields);
  const objPrimaryField = getPrimaryField(objEntity);

  // Fetch customised widget fields
  let arrEntityWidgetFields = await fetchCustomisedWidgetFields(
    config,
    widgetObjectId
  );
  if (
    arrFields &&
    arrFields.length > 0 &&
    (!arrEntityWidgetFields || arrEntityWidgetFields.length === 0)
  ) {
    arrEntityWidgetFields = [];
    const intDefaultWidgetFieldLength = arrFields.length;
    for (let d1 = 0; d1 < intDefaultWidgetFieldLength; d1++) {
      arrEntityWidgetFields.push(arrFields[d1].id);
      if (d1 >= FW_APP_CONSTANTS.MAX_WIDGET_FIELDS_COUNT - 1) {
        break;
      }
    }
  }

  const boolValidWidgetFields =
    arrEntityWidgetFields && arrEntityWidgetFields.length > 0;
  const intEntityWidgetFieldsLength = boolValidWidgetFields
    ? arrEntityWidgetFields.length
    : 0;
  // get the field names of the widget fields from their respective ids
  const arrEntityWidgetFieldNames = boolValidWidgetFields
    ? arrFields.filter((el) => {
        return arrEntityWidgetFields.some((f) => {
          return f === el.id;
        });
      })
    : null;

  // Get params data stored for the widget object id
  const strAssociationStoreKey = `association_${nativeObjectId}`;
  const objAssociationParams =
    _apiResponseStore[strAssociationStoreKey]?.params;
  const isForwardAssociation = strAssociationType?.includes('FORWARD');

  // Forward association from FD page will be treated as reverse in the api calls
  const objAssociatedEntity = !isForwardAssociation
    ? objAssociationParams?.forward?.[widgetObjectId]
    : objAssociationParams?.reverse?.[widgetObjectId];
  const arrAssociatedFieldNames = objAssociatedEntity?.fieldNames;

  // widget display structure
  const objParsedWidgetValue = {
    componentId: renderComponentId,
    widgetId: objEntity.id,
    widgetLabel: objEntity.name,
    associationType: strAssociationType,
    sections: {},
  };

  // Get forward record associations
  const arrRecordDisplayIds = [];
  let arrAssociatedRecords = null;
  const intAssociatedFieldNamesLength = arrAssociatedFieldNames?.length;

  for (let f1 = 0; f1 < intAssociatedFieldNamesLength; f1++) {
    const objAssociatedFieldName = arrAssociatedFieldNames[f1];
    const strAssociatedFieldName = !isForwardAssociation
      ? objAssociatedFieldName
      : objAssociatedFieldName.source_field_name;

    const strAssociatedFieldRecordsUrl = !isForwardAssociation
      ? `/schemas/records/associations?schema_id=${widgetObjectId}&target_object_id=${contextObjectId}&target_record_id=${contextRecordId}&field_name=${strAssociatedFieldName}`
      : `/schemas/records/inverse-associations?source_object_id=${contextObjectId}&schema_id=${widgetObjectId}&source_record_id=${contextRecordId}&source_field_name=${strAssociatedFieldName}`;

    console.info(
      `Fetching associated field name - ${strAssociatedFieldName} - url - ${strAssociatedFieldRecordsUrl}`
    );

    const jsonResponseAssociatedFieldRecords = await fetchApiData(
      config,
      strAssociatedFieldRecordsUrl
    );

    const arrAssociatedFieldRecords = !isForwardAssociation
      ? jsonResponseAssociatedFieldRecords?.record_associations
      : jsonResponseAssociatedFieldRecords?.inverse_record_associations;

    if (!arrAssociatedRecords) {
      arrAssociatedRecords = [];
    }

    const arrAssociatedRecordDisplayIds = arrAssociatedFieldRecords?.map(
      (item) => item.display_id
    );

    if (
      arrAssociatedRecordDisplayIds &&
      arrAssociatedRecordDisplayIds.length > 0
    ) {
      const intDisplayIdsLength = arrAssociatedRecordDisplayIds.length;
      for (let d1 = 0; d1 < intDisplayIdsLength; d1++) {
        arrRecordDisplayIds.push(arrAssociatedRecordDisplayIds[d1]);
      }
    }

    if (!objParsedWidgetValue.sections[strAssociatedFieldName]) {
      let objAssociatedField;
      if (!isForwardAssociation) {
        objAssociatedField = arrFields?.filter((el) => {
          return strAssociatedFieldName === el.name;
        })?.[0];
      } else {
        objAssociatedField = {
          type: 'RELATIONSHIP',
          label: objAssociatedFieldName.source_field_label,
          relationshipType: objAssociatedFieldName.relationship_type,
        };
      }

      if (!objAssociatedField) {
        console.info(
          `No matching field found - ${strAssociatedFieldName} in the object id - ${objEntity.id}`
        );
      }

      if (objAssociatedField) {
        const strFieldType = objAssociatedField.type;
        const strUniqueField = objAssociatedField.field_options?.unique;
        const boolUniqueField = !!(
          strUniqueField &&
          (strUniqueField === 'true' || strUniqueField === true)
        );
        let strRelationshipType = '';
        if (!isForwardAssociation) {
          strRelationshipType =
            strFieldType === FW_APP_CONSTANTS.FIELD_TYPE_RELATIONSHIP
              ? boolUniqueField
                ? FW_APP_CONSTANTS.LOOKUP_ONE_TO_ONE
                : FW_APP_CONSTANTS.LOOKUP_MANY_TO_ONE
              : '';
        } else {
          strRelationshipType = objAssociatedField.relationshipType;
        }

        objParsedWidgetValue.sections[strAssociatedFieldName] = {
          contextLabel: strContextLabel,
          primaryFieldName: objPrimaryField?.name,
          primaryFieldLabel: objPrimaryField?.label,
          fieldName: strAssociatedFieldName,
          fieldType: objAssociatedField.type,
          fieldLabel: objAssociatedField.label,
          lookupType: strRelationshipType,
          displayIds: arrAssociatedRecordDisplayIds,
          showViewAllRecordsCta: false,
          showLinkCta: false,
          records: {},
        };
      }
    }
  }

  // Bulk get call to fetch the widget details
  const strRecordDisplayIds = arrRecordDisplayIds
    ? arrRecordDisplayIds.join(',')
    : '';

  let arrBulkRecords = null;
  if (strRecordDisplayIds !== '') {
    const jsonResponseBulkRecords = await fetchApiData(
      config,
      `/schemas/${widgetObjectId}/records/bulk?display_ids=${strRecordDisplayIds}&include=associations`
    );
    arrBulkRecords = jsonResponseBulkRecords?.records;
  }

  if (boolValidWidgetFields) {
    const arrParsedFieldSections = objParsedWidgetValue
      ? Object.keys(objParsedWidgetValue.sections)
      : null;
    const intParsedFieldSections = arrParsedFieldSections?.length || 0;

    // Loop through the field sections
    for (let s1 = 0; s1 < intParsedFieldSections; s1++) {
      const strAssociatedFieldName = arrParsedFieldSections[s1];
      const objFieldSection =
        objParsedWidgetValue.sections[strAssociatedFieldName];
      const strSectionFieldLabel = objFieldSection?.fieldLabel;
      const strSectionFieldRelationshipType = objFieldSection?.lookupType;
      const arrFieldSectionDisplayIds = objFieldSection?.displayIds;
      const intFieldSectionDisplayIdsLength = arrFieldSectionDisplayIds?.length;

      if (intFieldSectionDisplayIdsLength > 0) {
        // Loop through the records in each field
        for (let fd1 = 0; fd1 < intFieldSectionDisplayIdsLength; fd1++) {
          const strRecordDisplayId = arrFieldSectionDisplayIds[fd1];

          if (strRecordDisplayId && strRecordDisplayId !== '') {
            const objDisplayIdRecord = arrBulkRecords?.filter((el) => {
              return el.display_id === strRecordDisplayId;
            })?.[0];

            if (objDisplayIdRecord) {
              const objWidgetData = objDisplayIdRecord.data;
              const objBulkRecordAssociations = objDisplayIdRecord.associations;

              if (
                !objParsedWidgetValue.sections[strAssociatedFieldName].records[
                  strRecordDisplayId
                ]
              ) {
                objParsedWidgetValue.sections[strAssociatedFieldName].records[
                  strRecordDisplayId
                ] = {
                  id: strRecordDisplayId,
                  rows: [],
                };
              }

              const arrRecordData =
                objParsedWidgetValue.sections[strAssociatedFieldName].records[
                  strRecordDisplayId
                ].rows;

              for (let w2 = 0; w2 < intEntityWidgetFieldsLength; w2++) {
                const objEntityWidgetField = arrEntityWidgetFieldNames[w2];
                const strEntityWidgetFieldName = objEntityWidgetField?.name;
                let strDisplayCardHeader = objEntityWidgetField?.label;
                if (w2 === 0) {
                  if (isForwardAssociation) {
                    strDisplayCardHeader = strSectionFieldLabel;
                  } else {
                    strDisplayCardHeader = objPrimaryField?.label;
                  }
                }

                const strDisplayFieldType = objEntityWidgetField?.type;
                let strDisplayValue =
                  objWidgetData[strEntityWidgetFieldName] ||
                  FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;

                if (
                  strDisplayFieldType === FW_APP_CONSTANTS.FIELD_TYPE_CHECKBOX
                ) {
                  strDisplayValue =
                    strDisplayValue === true || strDisplayValue === 'true'
                      ? i18nText('checkBoxYesValue')
                      : i18nText('checkBoxNoValue');
                } else if (
                  strDisplayFieldType ===
                  FW_APP_CONSTANTS.FIELD_TYPE_MULTISELECT
                ) {
                  if (Array.isArray(strDisplayValue)) {
                    strDisplayValue = strDisplayValue.join(', ');
                  }
                } else if (
                  strDisplayFieldType === FW_APP_CONSTANTS.FIELD_TYPE_DATE
                ) {
                  strDisplayValue = getFormattedDate(strDisplayValue);
                } else if (
                  strDisplayFieldType ===
                    FW_APP_CONSTANTS.FIELD_TYPE_RELATIONSHIP &&
                  strDisplayValue &&
                  strDisplayValue !== '' &&
                  strDisplayValue !== FW_APP_CONSTANTS.EMPTY_FIELD_VALUE
                ) {
                  const numRelatedEntityId =
                    objEntityWidgetField.related_entity_id;
                  const objEntityType = await getObjectId(
                    numRelatedEntityId,
                    config
                  );
                  const strEntityType = objEntityType.type;

                  if (strEntityType === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE) {
                    const objNativeFieldValue = await resolveNativeFieldValue(
                      objEntityWidgetField.related_entity_id,
                      strDisplayValue
                    );
                    if (objNativeFieldValue && objNativeFieldValue.value) {
                      strDisplayValue = objNativeFieldValue.value;
                    }
                  } else if (
                    hasCustomProperty(
                      objBulkRecordAssociations,
                      strDisplayValue
                    ) &&
                    objBulkRecordAssociations[strDisplayValue]
                  ) {
                    const objCoEntityRecordData =
                      objBulkRecordAssociations[strDisplayValue];
                    const strCoEntityRecordPrimaryValue =
                      objCoEntityRecordData?.data[
                        objCoEntityRecordData?.metadata?.primary_field_name
                      ];
                    if (
                      strCoEntityRecordPrimaryValue &&
                      strCoEntityRecordPrimaryValue !== ''
                    ) {
                      strDisplayValue = strCoEntityRecordPrimaryValue;
                    }
                  }
                }

                arrRecordData.push({
                  id: `${strRecordDisplayId}_${strEntityWidgetFieldName}`,
                  recordId: strRecordDisplayId,
                  header: strDisplayCardHeader,
                  fieldName: strEntityWidgetFieldName,
                  fieldType: strDisplayFieldType,
                  value: strDisplayValue,
                });
              }
            }
          }
        }
      } else {
        // Empty field with no records
      }

      // Set View all records CTA
      const objFieldRecords =
        objParsedWidgetValue.sections[strAssociatedFieldName].records;
      const arrFieldRecordNames = objFieldRecords
        ? Object.keys(objFieldRecords)
        : null;
      const intFieldRecordsCount = arrFieldRecordNames?.length || 0;
      objParsedWidgetValue.sections[
        strAssociatedFieldName
      ].showViewAllRecordsCta =
        intFieldRecordsCount >
        FW_APP_CONSTANTS.MAX_WIDGET_RECORDS_DISPLAY_COUNT;

      // Set Link CTA
      if (!isForwardAssociation && boolHasUpdateRecordPermission) {
        if (
          strSectionFieldRelationshipType ===
            FW_APP_CONSTANTS.LOOKUP_ONE_TO_ONE &&
          intFieldRecordsCount <= 0
        ) {
          objParsedWidgetValue.sections[strAssociatedFieldName].showLinkCta =
            true;
        } else if (
          strSectionFieldRelationshipType ===
          FW_APP_CONSTANTS.LOOKUP_MANY_TO_ONE
        ) {
          objParsedWidgetValue.sections[strAssociatedFieldName].showLinkCta =
            true;
        }
      }
    }
  }
  return objParsedWidgetValue;
}

// Searching Records
export async function searchEntityRecords(params) {
  const objNativeObjects = await getObjectId(params.objectId);
  const targetObjectID = objNativeObjects.id;
  // const strObjectType = objNativeObjects.type;

  const jsonResponse = await fetchApiData(
    null,
    `/schemas/records/search?term=${params.searchText}&schema_id=${targetObjectID}&page_size=10&include=associations`
  );
  return jsonResponse;
}

// Form data to be displayed on selecting search record in Link screen
export async function getSelectedSearchRecord(params) {
  if (params && params.selectedRecord) {
    const objSelectedRecord = params.selectedRecord;
    let arrWidgetFields = null;

    try {
      const objSchemaType = await getObjectId(params.objectId);

      if (objSchemaType.type === 'CUSTOM') {
        const targetObjectID = objSchemaType.id;
        const objEntity = await fetchEntity(null, targetObjectID);

        if (
          hasCustomProperty(objEntity, 'id') &&
          !isNaN(objEntity.id) &&
          objEntity.id > 0
        ) {
          const arrFields = objEntity.fields;

          // Fetch customised widget fields
          let arrEntityWidgetFields = await fetchCustomisedWidgetFields(
            null,
            targetObjectID
          );

          if (
            arrFields &&
            arrFields.length > 0 &&
            (!arrEntityWidgetFields || arrEntityWidgetFields.length === 0)
          ) {
            arrEntityWidgetFields = [];
            const intDefaultWidgetFieldLength = arrFields.length;
            for (let d1 = 0; d1 < intDefaultWidgetFieldLength; d1++) {
              arrEntityWidgetFields.push(arrFields[d1].id);
              if (d1 >= FW_APP_CONSTANTS.MAX_WIDGET_FIELDS_COUNT - 1) {
                break;
              }
            }
          }

          const boolValidWidgetFields =
            arrEntityWidgetFields && arrEntityWidgetFields.length > 0;

          // get the field names of the widget fields from their respective ids
          arrWidgetFields = boolValidWidgetFields
            ? arrFields.filter((el) => {
                return arrEntityWidgetFields.some((f) => {
                  return f === el.id;
                });
              })
            : null;
        }
      }
    } catch (error) {}

    let arrRecordDetails = null;
    if (arrWidgetFields && arrWidgetFields.length > 0) {
      const objBulkRecordAssociations = objSelectedRecord.associations;
      const objSelRecordFields = objSelectedRecord.data;
      const intWidgetFieldsLength = arrWidgetFields.length;

      for (let i1 = 0; i1 < intWidgetFieldsLength; i1++) {
        const objEntityWidgetField = arrWidgetFields[i1];
        const strEntityWidgetFieldType = objEntityWidgetField?.type;
        const strEntityWidgetFieldName = objEntityWidgetField?.name;

        const objField = {
          value: '',
          name: strEntityWidgetFieldName,
          label: objEntityWidgetField?.label,
          related_entity_id: objEntityWidgetField.related_entity_id,
        };

        let strDisplayValue = FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
        if (hasCustomProperty(objSelRecordFields, strEntityWidgetFieldName)) {
          strDisplayValue = objSelRecordFields[strEntityWidgetFieldName];

          if (strDisplayValue) {
            if (
              strEntityWidgetFieldType ===
                FW_APP_CONSTANTS.FIELD_TYPE_MULTISELECT &&
              Array.isArray(strDisplayValue)
            ) {
              strDisplayValue = strDisplayValue.join(', ');
            }

            const objNativeFieldValue = await resolveNativeFieldValue(
              objField.related_entity_id,
              strDisplayValue
            );
            if (
              objNativeFieldValue &&
              objNativeFieldValue?.value &&
              objNativeFieldValue.value !== ''
            ) {
              strDisplayValue = objNativeFieldValue.value;
            } else if (
              hasCustomProperty(objBulkRecordAssociations, strDisplayValue) &&
              objBulkRecordAssociations[strDisplayValue]
            ) {
              const objCoEntityRecordData =
                objBulkRecordAssociations[strDisplayValue];
              const strCoEntityRecordPrimaryValue =
                objCoEntityRecordData?.data[
                  objCoEntityRecordData?.metadata?.primary_field_name
                ];
              if (
                strCoEntityRecordPrimaryValue &&
                strCoEntityRecordPrimaryValue !== ''
              ) {
                strDisplayValue = strCoEntityRecordPrimaryValue;
              }
            }
          }

          objField.value =
            strDisplayValue || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
        }

        if (!arrRecordDetails) {
          arrRecordDetails = [];
        }
        arrRecordDetails = [...arrRecordDetails, objField];
      }
    }

    if (arrRecordDetails) {
      return {
        recordId: objSelectedRecord.display_id,
        linkData: objSelectedRecord,
        fields: arrRecordDetails,
      };
    } else {
      return null;
    }
  }
  return null;
}

// Link native/contact to a new Record
export async function linkNewRecord(objLinkData, config = null) {
  const paramsWidget = objLinkData?.params;
  const objNativeObjects = await getObjectId(paramsWidget.contextObjectId);
  const nativeObjectID = objNativeObjects.id;
  const strSourceObjectType = objNativeObjects.type;

  if (
    objLinkData &&
    objLinkData.recordData &&
    strSourceObjectType === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE
  ) {
    const recordId = paramsWidget.contextRecordId;
    const isEntityContact =
      objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT;
    const isEntityCompany =
      objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY;

    const contextRecordId =
      isEntityContact || isEntityCompany
        ? await serializeContextRecordId(nativeObjectID, recordId, false)
        : parseInt(recordId);

    const widgetEntityId = paramsWidget.widgetObjectId;
    const objWidgetEntity = await fetchEntity(config, widgetEntityId);
    const arrFields = objWidgetEntity.fields;

    const objSelectedRecord = objLinkData.recordData;
    const objSelectedRecordData = objSelectedRecord.data;

    try {
      for (const fieldName in objSelectedRecordData) {
        const objBaseField = arrFields.filter((el) => {
          return el.name === fieldName;
        })?.[0];

        if (
          objBaseField &&
          objBaseField.type === FW_APP_CONSTANTS.FIELD_TYPE_RELATIONSHIP
        ) {
          const numRelatedEntityId = objBaseField.related_entity_id;
          const isRelatedEntityContact = await isContactEntityId(
            numRelatedEntityId
          );
          const isRelatedEntityCompany = await isCompanyEntityId(
            numRelatedEntityId
          );
          if (isRelatedEntityContact || isRelatedEntityCompany) {
            const contactUcrId = await serializeContextRecordId(
              numRelatedEntityId,
              objSelectedRecordData[fieldName],
              false
            );
            objSelectedRecordData[fieldName] = contactUcrId;
          }
        }
      }
    } catch (error) {}

    const objRecordData = {
      ...objSelectedRecordData,
      [objLinkData.fieldName]: contextRecordId,
    };

    const payload = { data: objRecordData, version: objSelectedRecord.version };
    const strPayload = toJson(payload);
    console.info('Link payload string - ' + strPayload);
    const jsonResponse = await fetchApiData(
      config,
      `/schemas/${paramsWidget.widgetObjectId}/records/${objLinkData.recordId}`,
      'PUT',
      strPayload,
      false,
      true
    );

    const objResponse = jsonResponse?.response;
    if (
      jsonResponse?.success &&
      objResponse &&
      objResponse?.display_id === objLinkData.recordId
    ) {
      return { success: true, fieldName: objLinkData.fieldName };
    } else if (!jsonResponse.success) {
      return { success: false, errorMessage: objResponse.message };
    } else {
      return null;
    }
  } else {
    console.info('Trying to link a CO instead of a native - not implemented');
    return null;
  }
}

// function to convert BigInt into Json string without n
export function toJson(data) {
  if (data !== undefined) {
    return JSON.stringify(data, (_, v) =>
      typeof v === 'bigint' ? `${v}n` : v
    ).replace(/"(-?\d+)n"/g, (_, a) => a);
  }
}

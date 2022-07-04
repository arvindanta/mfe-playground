// import { DateFormatController } from '@freshworks/crayons/react';
import { hasCustomProperty } from '../utils/utils';
import FW_APP_CONSTANTS, { APP_ID } from '../constants/FwApplicationContants';
import { MFEController } from '../../../controller';

export let _apiResponseStore = {};
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

export function getFormattedDate(_strInputDate) {
  const config = getCouiConfig();
  const strLocale = config?.user?.locale?.language || '';

  if (config?.user?.locale?.dateTimeFormat !== '') {
    // TODO - get the format from the config and apply
  }

  // const formattedDate = DateFormatController({
  //   date: strInputDate,
  //   locale: strLocale,
  //   options: { month: 'short', day: 'numeric', year: 'numeric' },
  // });
  return strLocale;
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
  MFEController.setAppStoreCache(APP_ID, strKey, objResponse);
}

export function destroyApi() {
  _ticketStore = null;
  _contactStore = null;
  _apiResponseStore = null;
}

export async function fetchApiData(
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

export function getPrimaryField(objEntity) {
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

  (window as any).log(`fetch object associations`);

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
    MFEController.setAppStoreCache(APP_ID, objItem.id, objItem);
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
  (window as any).log(
    `store key ${strStoreKey}, <pre>${JSON.stringify(
      objResponse,
      null,
      2
    )}</pre>`
  );
  storeApiResponse(strStoreKey, objResponse);
  return objResponse;
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

export async function getApi(params) {
  const config = MFEController.getApplicationConfig(APP_ID);
  const objResponse = await fetchObjectAssociations(
    config,
    params.contextObjectId
  );
  return objResponse?.widgets || null;
}

const coAPISDK = ((window as any).coAPISDK = (window as any).coAPISDK || {
  get: getApi,
  destroy: destroyApi,
});
export { coAPISDK };

// function to check if a key existis in the object
function hasCustomProperty(objSource, strProperty) {
    if (strProperty &&
        strProperty !== '' &&
        objSource &&
        Object.prototype.hasOwnProperty.call(objSource, strProperty)) {
        return true;
    }
    return false;
}

const FW_APP_CONSTANTS = {
    APP_CUSTOM_OBJECT: 'CUSTOM-OBJECT',
    COMPONENT_CO_WIDGET_CARD: 'WIDGET-CARD',
    COMPONENT_FD_SEARCH_CARD: 'SEARCH-CARD',
    COMPONENT_TAG: {
        'WIDGET-CARD': 'fw-widget-card',
        'SEARCH-CARD': 'fw-search-card',
    },
    API_NAMESPACE: 'custom_objects',
    ACTION_NAVIGATE: 'NAVIGATE',
    SCHEMA_TYPE_NATIVE: 'NATIVE',
    SCHEMA_TYPE_CUSTOM: 'CUSTOM',
    SCHEMA_COMPANY: 'company',
    SCHEMA_CONTACT: 'contact',
    SCHEMA_TICKET: 'ticket',
    WIDGET_VARIATION_TICKET: 'ticket',
    WIDGET_VARIATION_CONTACT: 'contact',
    PRIMARY_FIELD: 'PRIMARY',
    FIELD_TYPE_DATE: 'DATE',
    FIELD_TYPE_CHECKBOX: 'CHECKBOX',
    FIELD_TYPE_PARAGRAPH: 'PARAGRAPH',
    FIELD_TYPE_MULTISELECT: 'MULTI_SELECT',
    FIELD_TYPE_RELATIONSHIP: 'RELATIONSHIP',
    LOOKUP_ONE_TO_ONE: 'ONE_TO_ONE',
    LOOKUP_MANY_TO_ONE: 'MANY_TO_ONE',
    MAX_WIDGET_RECORDS_DISPLAY_COUNT: 3,
    MAX_WIDGET_FIELDS_COUNT: 5,
    EMPTY_FIELD_VALUE: '-',
};
const APP_ID = 'stencilMFE1';

const stub = {
    initialiseInstance: () => {
        return stub.namespace();
    },
    namespace: () => {
        return {
            publish: () => { },
            subscribe: () => {
                return () => { };
            },
        };
    },
    registerAppInstance: () => { },
    getInstanceId: () => { },
    getMFEQueryParams: () => { },
    get: async () => { },
};
const MFEController = window.MFEController || stub;

// import { DateFormatController } from '@freshworks/crayons/react';
let _apiResponseStore = {};
let _contactStore = {};
let _ticketStore = {};
let _configCoui = {};
function setCouiConfig(value) {
    _configCoui = value;
}
function getCouiConfig(localConfig = null) {
    if (localConfig) {
        return localConfig;
    }
    return _configCoui;
}
function getCouiApiBasePath(localConfig = null) {
    const config = getCouiConfig(localConfig);
    return `${config.apiBasePath}${FW_APP_CONSTANTS.API_NAMESPACE}`;
}
function getContactApiBasePath(localConfig = null) {
    const config = getCouiConfig(localConfig);
    return `${config.apiBasePath}`;
}
function getCouiRoutePrefix() {
    return '';
    // return '/module/custom-objects';
}
function hasUpdateRecordPermission() {
    var _a;
    try {
        const config = getCouiConfig();
        const arrRecordPermissions = ((_a = config === null || config === void 0 ? void 0 : config.permissions) === null || _a === void 0 ? void 0 : _a.record) || null;
        if (arrRecordPermissions && arrRecordPermissions.length > 0) {
            const intLength = arrRecordPermissions.length;
            for (let i1 = 0; i1 < intLength; i1++) {
                if (arrRecordPermissions[i1] === 'update') {
                    return true;
                }
            }
        }
    }
    catch (error) { }
    return false;
}
function getFormattedDate(_strInputDate) {
    var _a, _b, _c, _d;
    const config = getCouiConfig();
    const strLocale = ((_b = (_a = config === null || config === void 0 ? void 0 : config.user) === null || _a === void 0 ? void 0 : _a.locale) === null || _b === void 0 ? void 0 : _b.language) || '';
    if (((_d = (_c = config === null || config === void 0 ? void 0 : config.user) === null || _c === void 0 ? void 0 : _c.locale) === null || _d === void 0 ? void 0 : _d.dateTimeFormat) !== '') ;
    // const formattedDate = DateFormatController({
    //   date: strInputDate,
    //   locale: strLocale,
    //   options: { month: 'short', day: 'numeric', year: 'numeric' },
    // });
    return strLocale;
}
async function serializeContextRecordId(objectId, contextRecId, parseToString = true) {
    const objNativeObjects = await getObjectId(objectId);
    if (objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
        (objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT ||
            objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY) &&
        contextRecId) {
        const numContextRecId = BigInt(contextRecId);
        if (!parseToString) {
            return numContextRecId;
        }
        return toJson(numContextRecId);
    }
    return contextRecId;
}
async function deserializeContextRecordId(objectId, contextRecId) {
    const objNativeObjects = await getObjectId(objectId);
    if (objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
        (objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT ||
            objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY) &&
        contextRecId &&
        contextRecId !== '' &&
        contextRecId !== FW_APP_CONSTANTS.EMPTY_FIELD_VALUE) {
        const strDeserializedRecId = BigInt(contextRecId).toString();
        return strDeserializedRecId;
    }
    return contextRecId;
}
function isApiResponseStored(strKey) {
    if (strKey &&
        strKey !== '' &&
        hasCustomProperty(_apiResponseStore, strKey) &&
        _apiResponseStore[strKey]) {
        return true;
    }
    return false;
}
function storeApiResponse(strKey, objResponse) {
    if (!_apiResponseStore) {
        _apiResponseStore = {};
    }
    _apiResponseStore[strKey] = objResponse;
    window.log(`strkey is ${strKey} and ${JSON.stringify(objResponse)}`);
    MFEController.setAppStoreCache(APP_ID, strKey, objResponse);
}
function destroyApi() {
    _ticketStore = null;
    _contactStore = null;
    _apiResponseStore = null;
}
async function fetchApiData(config, endPoint, method = 'GET', payload = null, boolGetContactApi = false, boolReturnFailure = false) {
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
            fetchOptions = Object.assign(Object.assign({}, fetchOptions), { body: payload });
        }
        let boolSuccess = true;
        const response = await fetch(url, fetchOptions);
        if (!response || !response.ok) {
            console.info(`An error has occured fetching endpoint - ${endPoint} : ${response === null || response === void 0 ? void 0 : response.status}`);
            boolSuccess = false;
            if (!boolReturnFailure) {
                return null;
            }
        }
        const jsonResponse = await response.json();
        if (!boolReturnFailure) {
            return jsonResponse;
        }
        else {
            return { success: boolSuccess, response: jsonResponse };
        }
    }
    catch (error) {
        console.info(`An error has occured fetching endpoint - ${endPoint} : ${error}`);
        return null;
    }
}
async function fetchNativeObjects(config) {
    // console.info(config);
    // return { ticket: 989898, contact: 898989 };
    var _a, _b;
    const strStoreKey = `native_objects`;
    if (isApiResponseStored(strStoreKey)) {
        return _apiResponseStore[strStoreKey];
    }
    config = getCouiConfig(config);
    if (!config ||
        !config.native_objects_enabled ||
        config.native_objects_enabled.length <= 0) {
        return null;
    }
    // Get native objects
    const jsonResponse = await fetchApiData(config, '/schemas/native');
    const arrNativeObjects = jsonResponse === null || jsonResponse === void 0 ? void 0 : jsonResponse.schemas;
    if (arrNativeObjects && arrNativeObjects.length > 0) {
        const objNativeObjects = {};
        const intLength = arrNativeObjects.length;
        for (let i1 = 0; i1 < intLength; i1++) {
            objNativeObjects[(_b = (_a = arrNativeObjects[i1]) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()] =
                arrNativeObjects[i1].id;
        }
        storeApiResponse(strStoreKey, objNativeObjects);
        return objNativeObjects;
    }
    return null;
}
// Fetch Object details
async function fetchEntity(config, id, force = false) {
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
async function fetchCustomisedWidgetFields(config, objectId, force = false) {
    const strStoreKey = `widgets_${objectId}`;
    if (!force && isApiResponseStored(strStoreKey)) {
        return _apiResponseStore[strStoreKey];
    }
    const jsonResponse = await fetchApiData(config, `/schemas/${objectId}/customisations/default`);
    let arrWidgetFields = null;
    if ((jsonResponse === null || jsonResponse === void 0 ? void 0 : jsonResponse.precedence_of_schema_fields) &&
        jsonResponse.precedence_of_schema_fields.length > 0) {
        arrWidgetFields = jsonResponse.precedence_of_schema_fields;
        storeApiResponse(strStoreKey, arrWidgetFields);
    }
    return arrWidgetFields;
}
// api call to fetch contact details
async function fetchContactDetails(contactId) {
    if (contactId &&
        hasCustomProperty(_contactStore, contactId) &&
        _contactStore[contactId]) {
        return _contactStore[contactId];
    }
    const config = getCouiConfig();
    if (!config) {
        return null;
    }
    const jsonResponse = await fetchApiData(config, `contacts/?org_contact_ids=${contactId}&include=company`, 'GET', null, true);
    if (jsonResponse &&
        jsonResponse.contacts &&
        jsonResponse.contacts.length > 0) {
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
    if (objNativeObjects &&
        objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
        objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT) {
        return true;
    }
    return false;
}
// function to get the contact name from the org id
async function getContactDetailFromId(entityId, contactUcrId) {
    const strDeserializedContactId = await deserializeContextRecordId(entityId, contactUcrId);
    const objContact = await fetchContactDetails(strDeserializedContactId);
    if (objContact && (objContact === null || objContact === void 0 ? void 0 : objContact.name)) {
        return objContact;
    }
}
// function to check if the entity id is company
async function isCompanyEntityId(id, config = null) {
    const objNativeObjects = await getObjectId(id, config);
    if (objNativeObjects &&
        objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
        objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY) {
        return true;
    }
    return false;
}
// function to get the company name from the org id
async function getCompanyDetailFromId(entityId, companyId) {
    const strDeserializedId = await deserializeContextRecordId(entityId, companyId);
    const objRecord = await fetchContactDetails(strDeserializedId);
    if (objRecord && (objRecord === null || objRecord === void 0 ? void 0 : objRecord.name)) {
        return objRecord;
    }
}
// function to check if the entity id is Contact
async function isTicketEntityId(id, config = null) {
    const objNativeObjects = await getObjectId(id, config);
    if (objNativeObjects &&
        objNativeObjects.type === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE &&
        objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_TICKET) {
        return true;
    }
    return false;
}
// api call to fetch ticket details
async function fetchTicketDetails(ticketId) {
    if (ticketId &&
        hasCustomProperty(_contactStore, ticketId) &&
        _contactStore[ticketId]) {
        return _contactStore[ticketId];
    }
    const config = getCouiConfig();
    if (!config) {
        return null;
    }
    const jsonResponse = await fetchApiData(config, `tickets/?ids=${ticketId}&include=requester`, 'GET', null, true);
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
async function resolveNativeFieldValue(entityId, nativeRecordId) {
    let strDisplayValue = FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
    const isEntityContact = await isContactEntityId(entityId);
    if (isEntityContact) {
        const objContact = await getContactDetailFromId(entityId, nativeRecordId);
        if (objContact) {
            strDisplayValue = (objContact === null || objContact === void 0 ? void 0 : objContact.name) || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
            return { value: strDisplayValue, detail: objContact };
        }
        return { value: strDisplayValue, detail: null };
    }
    const isEntityTicket = await isTicketEntityId(entityId);
    if (isEntityTicket) {
        const objTicket = await getTicketDetailFromId(nativeRecordId);
        if (objTicket) {
            strDisplayValue =
                (objTicket === null || objTicket === void 0 ? void 0 : objTicket.subject) || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
            return { value: strDisplayValue, detail: objTicket };
        }
        return { value: strDisplayValue, detail: null };
    }
    const isEntityCompany = await isCompanyEntityId(entityId);
    if (isEntityCompany) {
        const objCompany = await getCompanyDetailFromId(entityId, nativeRecordId);
        if (objCompany) {
            strDisplayValue = (objCompany === null || objCompany === void 0 ? void 0 : objCompany.name) || FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
            return { value: strDisplayValue, detail: objCompany };
        }
        return { value: strDisplayValue, detail: null };
    }
    return null;
}
// function to get the entity id by parsing "contacts" and "tickets" to id
async function getObjectId(id, config = null) {
    var _a;
    const objNativeObjects = await fetchNativeObjects(config);
    const isValidNumericObjectId = !!(!isNaN(id) && id > 0);
    if (isValidNumericObjectId) {
        const arrNativeObjectKeys = Object.keys(objNativeObjects);
        const intLength = arrNativeObjectKeys.length;
        for (let i1 = 0; i1 < intLength; i1++) {
            const strEntityName = (_a = arrNativeObjectKeys[i1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (objNativeObjects[strEntityName] === id) {
                return {
                    id: id,
                    name: strEntityName,
                    type: FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE,
                };
            }
        }
    }
    else if (id && id !== '') {
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
    var _a;
    if (objEntity && objEntity.fields && objEntity.fields.length > 0) {
        const objPrimaryField = (_a = objEntity.fields.filter((el) => {
            return el.type === FW_APP_CONSTANTS.PRIMARY_FIELD;
        })) === null || _a === void 0 ? void 0 : _a[0];
        if (!objPrimaryField) {
            return objEntity.fields[0];
        }
        return objPrimaryField;
    }
    return null;
}
function bringPrimaryFieldOnTop(arrFields) {
    if (arrFields && arrFields.length > 1) {
        if (arrFields[0].type !== FW_APP_CONSTANTS.PRIMARY_FIELD) {
            const intPrimaryIndex = arrFields.findIndex((el) => el.type === FW_APP_CONSTANTS.PRIMARY_FIELD);
            if (intPrimaryIndex > 0) {
                const arrPrimaryField = arrFields.splice(intPrimaryIndex, 1);
                arrFields.unshift(arrPrimaryField[0]);
            }
        }
    }
    return arrFields;
}
// Fetch forward and inverse associations with other objects for the provided object ID
async function fetchObjectAssociations(config, objectId) {
    const objNativeObjects = await getObjectId(objectId, config);
    const strObjectType = objNativeObjects.type;
    const targetObjectID = objNativeObjects.id;
    const objAssociationEntities = { forward: {}, reverse: {} };
    window.log(`fetch object associations`);
    // Get forward associations
    const jsonResponseForward = await fetchApiData(config, `/schemas/associations?target_object_id=${targetObjectID}&target_object_type=${strObjectType}`);
    const arrForwardAssociations = jsonResponseForward === null || jsonResponseForward === void 0 ? void 0 : jsonResponseForward.associations;
    // Parse forward asssociated widgets and store the field names
    const arrParsedForwardAssociations = [];
    let intLength = arrForwardAssociations === null || arrForwardAssociations === void 0 ? void 0 : arrForwardAssociations.length;
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
    const jsonResponseInverse = await fetchApiData(config, `/schemas/inverse-associations?source_object_id=${targetObjectID}`);
    const arrReverseAssociations = jsonResponseInverse === null || jsonResponseInverse === void 0 ? void 0 : jsonResponseInverse.inverse_associations;
    // Parse reverse asssociated widgets and store the field names
    const arrParsedReverseAssociations = [];
    intLength = arrReverseAssociations === null || arrReverseAssociations === void 0 ? void 0 : arrReverseAssociations.length;
    for (let i2 = 0; i2 < intLength; i2++) {
        let boolValidReverseSchema = false;
        const objItem = arrReverseAssociations[i2];
        const itemSchemaId = objItem.schema_id;
        if (!objAssociationEntities.reverse[itemSchemaId]) {
            const objEntity = await fetchEntity(config, itemSchemaId);
            if (hasCustomProperty(objEntity, 'id') &&
                !isNaN(objEntity.id) &&
                objEntity.id > 0) {
                boolValidReverseSchema = true;
            }
            if (boolValidReverseSchema) {
                objAssociationEntities.reverse[itemSchemaId] = { fieldNames: [] };
                arrParsedReverseAssociations.push({
                    id: itemSchemaId,
                    type: 'FORWARD',
                    icon_link: objEntity.icon_link,
                    title: objEntity.title || objEntity.name || objEntity.id,
                });
            }
        }
        else {
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
    window.log(`fstore key ${strStoreKey}, ${JSON.stringify(objResponse)}`);
    storeApiResponse(strStoreKey, objResponse);
    return objResponse;
}
// Searching Records
async function searchEntityRecords(params) {
    const objNativeObjects = await getObjectId(params.objectId);
    const targetObjectID = objNativeObjects.id;
    // const strObjectType = objNativeObjects.type;
    const jsonResponse = await fetchApiData(null, `/schemas/records/search?term=${params.searchText}&schema_id=${targetObjectID}&page_size=10&include=associations`);
    return jsonResponse;
}
// Form data to be displayed on selecting search record in Link screen
async function getSelectedSearchRecord(params) {
    var _a;
    if (params && params.selectedRecord) {
        const objSelectedRecord = params.selectedRecord;
        let arrWidgetFields = null;
        try {
            const objSchemaType = await getObjectId(params.objectId);
            if (objSchemaType.type === 'CUSTOM') {
                const targetObjectID = objSchemaType.id;
                const objEntity = await fetchEntity(null, targetObjectID);
                if (hasCustomProperty(objEntity, 'id') &&
                    !isNaN(objEntity.id) &&
                    objEntity.id > 0) {
                    const arrFields = objEntity.fields;
                    // Fetch customised widget fields
                    let arrEntityWidgetFields = await fetchCustomisedWidgetFields(null, targetObjectID);
                    if (arrFields &&
                        arrFields.length > 0 &&
                        (!arrEntityWidgetFields || arrEntityWidgetFields.length === 0)) {
                        arrEntityWidgetFields = [];
                        const intDefaultWidgetFieldLength = arrFields.length;
                        for (let d1 = 0; d1 < intDefaultWidgetFieldLength; d1++) {
                            arrEntityWidgetFields.push(arrFields[d1].id);
                            if (d1 >= FW_APP_CONSTANTS.MAX_WIDGET_FIELDS_COUNT - 1) {
                                break;
                            }
                        }
                    }
                    const boolValidWidgetFields = arrEntityWidgetFields && arrEntityWidgetFields.length > 0;
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
        }
        catch (error) { }
        let arrRecordDetails = null;
        if (arrWidgetFields && arrWidgetFields.length > 0) {
            const objBulkRecordAssociations = objSelectedRecord.associations;
            const objSelRecordFields = objSelectedRecord.data;
            const intWidgetFieldsLength = arrWidgetFields.length;
            for (let i1 = 0; i1 < intWidgetFieldsLength; i1++) {
                const objEntityWidgetField = arrWidgetFields[i1];
                const strEntityWidgetFieldType = objEntityWidgetField === null || objEntityWidgetField === void 0 ? void 0 : objEntityWidgetField.type;
                const strEntityWidgetFieldName = objEntityWidgetField === null || objEntityWidgetField === void 0 ? void 0 : objEntityWidgetField.name;
                const objField = {
                    value: '',
                    name: strEntityWidgetFieldName,
                    label: objEntityWidgetField === null || objEntityWidgetField === void 0 ? void 0 : objEntityWidgetField.label,
                    related_entity_id: objEntityWidgetField.related_entity_id,
                };
                let strDisplayValue = FW_APP_CONSTANTS.EMPTY_FIELD_VALUE;
                if (hasCustomProperty(objSelRecordFields, strEntityWidgetFieldName)) {
                    strDisplayValue = objSelRecordFields[strEntityWidgetFieldName];
                    if (strDisplayValue) {
                        if (strEntityWidgetFieldType ===
                            FW_APP_CONSTANTS.FIELD_TYPE_MULTISELECT &&
                            Array.isArray(strDisplayValue)) {
                            strDisplayValue = strDisplayValue.join(', ');
                        }
                        const objNativeFieldValue = await resolveNativeFieldValue(objField.related_entity_id, strDisplayValue);
                        if (objNativeFieldValue &&
                            (objNativeFieldValue === null || objNativeFieldValue === void 0 ? void 0 : objNativeFieldValue.value) &&
                            objNativeFieldValue.value !== '') {
                            strDisplayValue = objNativeFieldValue.value;
                        }
                        else if (hasCustomProperty(objBulkRecordAssociations, strDisplayValue) &&
                            objBulkRecordAssociations[strDisplayValue]) {
                            const objCoEntityRecordData = objBulkRecordAssociations[strDisplayValue];
                            const strCoEntityRecordPrimaryValue = objCoEntityRecordData === null || objCoEntityRecordData === void 0 ? void 0 : objCoEntityRecordData.data[(_a = objCoEntityRecordData === null || objCoEntityRecordData === void 0 ? void 0 : objCoEntityRecordData.metadata) === null || _a === void 0 ? void 0 : _a.primary_field_name];
                            if (strCoEntityRecordPrimaryValue &&
                                strCoEntityRecordPrimaryValue !== '') {
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
        }
        else {
            return null;
        }
    }
    return null;
}
// Link native/contact to a new Record
async function linkNewRecord(objLinkData, config = null) {
    var _a;
    const paramsWidget = objLinkData === null || objLinkData === void 0 ? void 0 : objLinkData.params;
    const objNativeObjects = await getObjectId(paramsWidget.contextObjectId);
    const nativeObjectID = objNativeObjects.id;
    const strSourceObjectType = objNativeObjects.type;
    if (objLinkData &&
        objLinkData.recordData &&
        strSourceObjectType === FW_APP_CONSTANTS.SCHEMA_TYPE_NATIVE) {
        const recordId = paramsWidget.contextRecordId;
        const isEntityContact = objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_CONTACT;
        const isEntityCompany = objNativeObjects.name === FW_APP_CONSTANTS.SCHEMA_COMPANY;
        const contextRecordId = isEntityContact || isEntityCompany
            ? await serializeContextRecordId(nativeObjectID, recordId, false)
            : parseInt(recordId);
        const widgetEntityId = paramsWidget.widgetObjectId;
        const objWidgetEntity = await fetchEntity(config, widgetEntityId);
        const arrFields = objWidgetEntity.fields;
        const objSelectedRecord = objLinkData.recordData;
        const objSelectedRecordData = objSelectedRecord.data;
        try {
            for (const fieldName in objSelectedRecordData) {
                const objBaseField = (_a = arrFields.filter((el) => {
                    return el.name === fieldName;
                })) === null || _a === void 0 ? void 0 : _a[0];
                if (objBaseField &&
                    objBaseField.type === FW_APP_CONSTANTS.FIELD_TYPE_RELATIONSHIP) {
                    const numRelatedEntityId = objBaseField.related_entity_id;
                    const isRelatedEntityContact = await isContactEntityId(numRelatedEntityId);
                    const isRelatedEntityCompany = await isCompanyEntityId(numRelatedEntityId);
                    if (isRelatedEntityContact || isRelatedEntityCompany) {
                        const contactUcrId = await serializeContextRecordId(numRelatedEntityId, objSelectedRecordData[fieldName], false);
                        objSelectedRecordData[fieldName] = contactUcrId;
                    }
                }
            }
        }
        catch (error) { }
        const objRecordData = Object.assign(Object.assign({}, objSelectedRecordData), { [objLinkData.fieldName]: contextRecordId });
        const payload = { data: objRecordData, version: objSelectedRecord.version };
        const strPayload = toJson(payload);
        console.info('Link payload string - ' + strPayload);
        const jsonResponse = await fetchApiData(config, `/schemas/${paramsWidget.widgetObjectId}/records/${objLinkData.recordId}`, 'PUT', strPayload, false, true);
        const objResponse = jsonResponse === null || jsonResponse === void 0 ? void 0 : jsonResponse.response;
        if ((jsonResponse === null || jsonResponse === void 0 ? void 0 : jsonResponse.success) &&
            objResponse &&
            (objResponse === null || objResponse === void 0 ? void 0 : objResponse.display_id) === objLinkData.recordId) {
            return { success: true, fieldName: objLinkData.fieldName };
        }
        else if (!jsonResponse.success) {
            return { success: false, errorMessage: objResponse.message };
        }
        else {
            return null;
        }
    }
    else {
        console.info('Trying to link a CO instead of a native - not implemented');
        return null;
    }
}
// function to convert BigInt into Json string without n
function toJson(data) {
    if (data !== undefined) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}n` : v).replace(/"(-?\d+)n"/g, (_, a) => a);
    }
}
async function getAPI(params) {
    const config = MFEController.getApplicationConfig(APP_ID);
    const objResponse = await fetchObjectAssociations(config, params.contextObjectId);
    return (objResponse === null || objResponse === void 0 ? void 0 : objResponse.widgets) || null;
}
const coFetchAPI = (window.coFetchAPI =
    window.coFetchAPI || getAPI);

export { _apiResponseStore, bringPrimaryFieldOnTop, coFetchAPI, deserializeContextRecordId, destroyApi, fetchApiData, fetchContactDetails, fetchCustomisedWidgetFields, fetchEntity, fetchNativeObjects, fetchObjectAssociations, getAPI, getContactApiBasePath, getCouiApiBasePath, getCouiConfig, getCouiRoutePrefix, getFormattedDate, getObjectId, getPrimaryField, getSelectedSearchRecord, hasUpdateRecordPermission, isApiResponseStored, linkNewRecord, resolveNativeFieldValue, searchEntityRecords, serializeContextRecordId, setCouiConfig, storeApiResponse, toJson };

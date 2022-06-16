// Fetch widget details
import { i18nText } from '../utils/platform-app-utils';
import { hasCustomProperty } from '../utils/utils';
import FW_APP_CONSTANTS, { APP_ID } from '../constants/FwApplicationContants';

import {
  hasUpdateRecordPermission,
  resolveNativeFieldValue,
  serializeContextRecordId,
  getObjectId,
  fetchEntity,
  bringPrimaryFieldOnTop,
  fetchCustomisedWidgetFields,
  fetchApiData,
  getFormattedDate,
  getPrimaryField,
  _apiResponseStore,
} from './coui';
import { MFEController } from '../../../controller';

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
  // const objAssociationParams =
  //   _apiResponseStore[strAssociationStoreKey]?.params;
  const objAssociationParams = MFEController.getAppStoreCache(
    APP_ID,
    strAssociationStoreKey
  )?.params;

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

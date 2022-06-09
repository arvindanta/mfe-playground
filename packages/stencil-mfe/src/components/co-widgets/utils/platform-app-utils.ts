import { TranslationController } from '../Translations/Translation';

// function to translate and return the language text
export function i18nText(
  strKey,
  context = {},
  strParentNode = 'platformCouiWidgets'
) {
  try {
    if (strKey && context) {
      return TranslationController.t(`${strParentNode}.${strKey}`, context);
    } else if (strKey) {
      return TranslationController.t(`${strParentNode}.${strKey}`);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`unable to translate ${strKey} : `, error);
  }
  return '';
}

// function to check if a key existis in the object
export function hasCustomProperty(objSource, strProperty): boolean {
  if (
    strProperty &&
    strProperty !== '' &&
    objSource &&
    Object.prototype.hasOwnProperty.call(objSource, strProperty)
  ) {
    return true;
  }
  return false;
}

// function to validate url icon and split to to pass the source to fw-icon
export function getIconDetailsFromUrl(iconUrl) {
  if (!iconUrl) {
    return { src: '', name: '' };
  }
  try {
    const arrIconUrl = iconUrl?.split('/');
    const iconName = arrIconUrl?.pop()?.split('.')[0];
    return { src: arrIconUrl.join('/'), name: iconName };
  } catch (error) {
    console.error(error);
  }
  return { src: '', name: '' };
}

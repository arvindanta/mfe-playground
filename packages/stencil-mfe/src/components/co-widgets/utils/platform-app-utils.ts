/* eslint-disable no-console */
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
    console.warn(`unable to translate ${strKey} : `, error);
  }
  return '';
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

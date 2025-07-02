import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import icoMoonConfig from '../assets/fonts/selection.json';

const CustomIconSet = createIconSetFromIcoMoon(
  icoMoonConfig,
  'icons',
  require('../assets/fonts/icons.ttf')
);

export default CustomIconSet;

export const getIconNames = () =>
  Array.isArray(icoMoonConfig.icons)
    ? icoMoonConfig.icons.map(icon => icon.properties && icon.properties.name).filter(Boolean)
    : []; 
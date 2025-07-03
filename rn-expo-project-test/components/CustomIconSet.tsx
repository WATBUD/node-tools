import { createIconSetFromIcoMoon } from '@expo/vector-icons';
import icoMoonConfig1 from '../assets/fonts/selection.json';
// 如有第二組，請放 selection2.json
import icoMoonConfig2 from '../assets/fonts/selection2.json';

const iconSets = [
  {
    key: 'Node-Tools',
    config: icoMoonConfig1,
    font: require('../assets/fonts/icons.ttf'),
    name: 'icons1',
  },
  // 範例：如有第二組，取消註解
  {
    key: 'Current',
    config: icoMoonConfig2,
    font: require('../assets/fonts/icons2.ttf'),
    name: 'icons2',
  },
];

const IconSetComponents = iconSets.map(set => ({
  ...set,
  IconSet: createIconSetFromIcoMoon(set.config, set.name, set.font),
  iconNames: Array.isArray(set.config.icons)
    ? set.config.icons.map(icon => icon.properties && icon.properties.name).filter(Boolean)
    : [],
}));

export default IconSetComponents; 
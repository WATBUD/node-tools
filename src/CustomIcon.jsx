import React from "react";
import IcomoonReact from "icomoon-react";
import iconSet from "./assets/font/selection.json";

const CustomIcon = ({ name, size = 24, color = "#0000", style }) => (
  <IcomoonReact
    iconSet={iconSet}
    icon={name}
    size={size}
    color={color}
    style={style}
  />
);

export default CustomIcon; 
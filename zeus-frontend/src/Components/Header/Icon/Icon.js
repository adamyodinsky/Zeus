import React from "react";
import icon from './Icon.module.scss';
import iconSvg from '../../../assets/default.svg';

const Icon = props => {
  return (
      <img className={icon.icon}
          src={iconSvg}
          style={{ height: '10vh' }}
          alt="icon_logo"
      />
  );
};

export default Icon;

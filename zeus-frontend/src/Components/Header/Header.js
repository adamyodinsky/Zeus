import React from "react";
import header from './Header.module.scss'
import Icon from './Icon/Icon';

const Header = props => {
  return (
      <header className={header.header}>
        <Icon/>
      </header>
  );
};

export default Header;

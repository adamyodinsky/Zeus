import React from 'react';
import {BrowserRouter as Router, NavLink, Link} from "react-router-dom";
import navigation from './Navigation.module.scss'

const Navigation = (props) => {
  return (
      <nav className={navigation.navigation}>
        <NavLink className={navigation.navigation_inner} to="/">Cluster</NavLink>
        <NavLink className={navigation.navigation_inner} to="/deployments">Deployments</NavLink>
        <NavLink className={navigation.navigation_inner} to="/nodes">Nodes</NavLink>
      </nav>
  )
};

export default Navigation;

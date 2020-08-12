import React from 'react';
import {NavLink} from "react-router-dom";
import navigation from './Navigation.module.scss'

class Navigation extends React.Component {
  render() {
    return (
        <nav className={navigation.navBar}>
          <ul>
            <li><NavLink exact to="/">Cluster</NavLink></li>
            <li><NavLink to="/nodes">Nodes</NavLink></li>
            <li><NavLink to="/deployments">Controllers</NavLink></li>
          </ul>
        </nav>
    )
  }
};

export default Navigation;

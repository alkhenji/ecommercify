/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

type PropsType = {};
type StateType = {};

export default class NavBar extends React.Component<PropsType, StateType> {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <NavLink className="navbar-brand" activeClassName="active" to="/">E-Commercify</NavLink>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" exact to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" exact to="/about">About</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" activeClassName="active" exact to="/cart">Cart</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

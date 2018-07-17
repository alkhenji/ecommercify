/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

type PropsType = {};
type StateType = {};

export default class NavBar extends React.Component<PropsType, StateType> {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">E-Commercify</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Cart</Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a className="nav-link" href="/signup">Sign up</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/signin">Sign in</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import axios from 'axios';

type PropsType = {};

type StateType = {
  current_user: {
    first_name: string,
    last_name: string,
    email: string,
  } | null
};

export default class NavBar extends React.Component<PropsType, StateType> {

  state: StateType = {
    current_user: null
  };

  componentDidMount() {
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    axios.get('/api-v1/customers/current/').then(response => {
      if ('user' in response.data) {
        this.setState({
          current_user: {...response.data.user}
        });
      }
    }).catch(error => {
      console.error(error);
      this.setState({
        current_user: null
      });
    });
  }

  renderNavbarRightSide() {
    const { current_user } = this.state;

    if (current_user) {
      return (
        <React.Fragment>
          <li className="nav-item">
            <a className="nav-link" href="/signout">Sign out</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">{`${current_user.first_name} ${current_user.last_name}`}</a>
          </li>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <li className="nav-item">
          <a className="nav-link" href="/signup">Sign up</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/signin">Sign in</a>
        </li>
      </React.Fragment>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <NavLink className="navbar-brand" activeClassName="active" to="/">Click-It</NavLink>
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
            <ul className="navbar-nav ml-auto">
              {this.renderNavbarRightSide()}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default class NavBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">E-Commercify</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to='/'>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/about'>About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to='/cart'>Cart</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

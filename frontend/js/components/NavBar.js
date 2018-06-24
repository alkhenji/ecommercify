import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default class NavBar extends React.Component {
  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <a className='navbar-brand' href='#'>E-Commercify</a>

        <button className='navbar-toggle' type='button' data-toggle='collapse'
          data-target='#navbar' aria-controls='navbarNavbarDropdown'
          aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbar'>
          <ul className='navbar-nav'>
            <li className='nav-item active'>
              <Link to='/'>Home</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

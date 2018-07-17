/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import CategoryPage from '../pages/CategoryPage';

import type { CategoryWithSubcategoriesType } from '../flowtypes';

type PropsType = {};
type StateType = {
  categories: Array<CategoryWithSubcategoriesType>
};

export default class CategoriesBar extends React.Component<PropsType, StateType> {

  state: StateType = {
    categories: []
  };

  componentDidMount() {
    this.fetchAllCategories();
  }

  fetchAllCategories() {
    const { categories } = this.state;

    axios.get('/api-v1/categories/').then(response => {
      this.setState({
        categories: categories.concat(response.data)
      });
    }).catch(error => {
      console.error(error)
    })
  }

  renderCategory(category: CategoryWithSubcategoriesType) {
    return (
      <li className="nav-item" key={category.slug}>
        <NavLink className="nav-link" activeClassName="active" to={"/category/" + category.slug}>
          {category.name}
        </NavLink>
      </li>
    );
  }

  render() {
    const { categories } = this.state;

    return (
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <div className="container">
          <ul className="navbar-nav mr-auto">
            {categories.map(this.renderCategory.bind(this))}
          </ul>
        </div>
      </nav>
    );
  }
}

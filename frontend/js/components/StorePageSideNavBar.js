/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import type { CategoryWithSubcategoriesType } from '../flowtypes';


type PropsType = {
  store_slug: string
};

type StateType = {
  categories: Array<CategoryWithSubcategoriesType>,
  loading: boolean
};

export default class StorePageSideNavBar extends
  React.Component<PropsType, StateType> {


  static defaultProps: PropsType = {
    store_slug: ''
  };

  state: StateType = {
    categories: [],
    loading: true,
  }

  componentDidMount() {
    this.fetchStoreCategories();
  }

  fetchStoreCategories() {
    const { store_slug } = this.props;

    axios.get('/api-v1/categories/?store=' + store_slug).then(response => {
      this.setState({
        categories: response.data,
        loading: false
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        loading: false
      });
    });
  }

  renderCategoriesList() {
    const { categories } = this.state;

    return categories.map(category => (
      <button key={category.slug} type="button"
        className="list-group-item list-group-item-action">
        {category.name}
      </button>
    ));
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="list-group">
          <li className="list-group-item">
            Loading...
          </li>
        </div>
      );
    }

    return (
      <div className="list-group">
        {this.renderCategoriesList()}
      </div>
    );
  }
}

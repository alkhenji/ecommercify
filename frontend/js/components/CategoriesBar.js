/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Media from 'react-media';
import QueryString from 'query-string'

import CategoryPage from '../pages/CategoryPage';
import CategoriesBarMenu from './CategoriesBarMenu';

import type { CategoryWithSubcategoriesType, StoreType } from '../flowtypes';

type PropsType = {
  history: Object
};
type StateType = {
  categories: Array<CategoryWithSubcategoriesType>,
  stores: Array<StoreType>,
  isMenuOpen: boolean,
  hoveringOver: CategoryWithSubcategoriesType | null
};

export default class CategoriesBar extends React.Component<PropsType, StateType> {
  _urlChangedListenerUnsubscribe: Function = () => null;

  state: StateType = {
    categories: [],
    stores: [],
    isMenuOpen: false,
    hoveringOver: null,
  };

  onUrlChange() {
    this.setState({
      isMenuOpen: false,
      hoveringOver: null,
    });
  }

  componentDidMount() {
    const { history } = this.props;
    this._urlChangedListenerUnsubscribe = history.listen(() => this.onUrlChange());
    this.fetchRequiredData();
  }

  componentWillUnmount() {
    this._urlChangedListenerUnsubscribe();
  }

  async fetchRequiredData() {
    const response = await this.fetchAllCategories();
    const { categories } = this.state;

    if (!categories) {
      return;
    }
    this.fetchCategoriesStores();
  }

  fetchAllCategories() {
    const { categories } = this.state;

    return (
      axios.get('/api-v1/categories/').then(response => {
        this.setState({
          categories: categories.concat(response.data)
        });
      }).catch(error => {
        console.error(error)
      })
    );
  }

  fetchCategoriesStores() {
    const { categories } = this.state;
    var categoriesQuery = {category: categories.map((category) => category.slug)};
    var categoriesQuery = QueryString.stringify(categoriesQuery);

    axios.get('/api-v1/stores/?' + categoriesQuery).then(response => {
      this.setState({
        stores: response.data
      });
    }).catch(error => {
      console.error(error);
    })
  }

  openCategoryMenu(category: CategoryWithSubcategoriesType) {
    this.setState({
      isMenuOpen: true,
      hoveringOver: category,
    })
  }

  closeCategoryMenu() {
    this.setState({
      isMenuOpen: false,
      hoveringOver: null,
    });
  }

  renderCategory(category: CategoryWithSubcategoriesType, index: number) {
    const { hoveringOver } = this.state;

    return (
      <div key={category.slug} style={ hoveringOver && hoveringOver.slug == category.slug ? {...styles.categoryOnHover} : {}} >
        <li className='nav-item' onMouseOver={() => this.openCategoryMenu(category)}>
          <NavLink className='nav-link' activeClassName='active' to={'/category/' + category.slug}>
            {category.name}
          </NavLink>
        </li>
      </div>
    );
  }

  renderCategoriesBar() {
    const { categories, isMenuOpen, hoveringOver, stores } = this.state;

    return (
      <React.Fragment>
        <div style={{ ...styles.overlayDiv, display: isMenuOpen ? 'block' : 'none' }}></div>
        <div onMouseLeave={ () => this.closeCategoryMenu() }>
          <nav className='navbar navbar-expand-md navbar-light bg-light' style={ styles.navBar } >
            <div className='container'>
              <ul className='navbar-nav mr-auto'>
                { categories.map((category, i) => this.renderCategory(category, i)) }
              </ul>
            </div>
          </nav>
          { isMenuOpen ? <CategoriesBarMenu category={hoveringOver} stores={stores} /> : null }
        </div>
      </React.Fragment>
    );
  }

  render() {

    return (
      <Media
        query={{ minWidth: '992px' }}
        render={() => this.renderCategoriesBar()}>
      </Media>
    );
  }
}

const styles: Object = {
  overlayDiv: {
    position: 'fixed', /* Sit on top of the page content */
    display: 'none', /* Hidden by default */
    width: '100%', /* Full width (cover the whole page) */
    height: '100%', /* Full height (cover the whole page) */
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', /* Black background with opacity */
    zIndex: 2, /* Specify a stack order in case you're using a different order for other elements */
    cursor: 'pointer', /* Add a pointer on hover */
  },
  navBar: {
    zIndex: 3, /* keep it higher than overlay */
    paddingTop: 0,
    paddingBottom: 0,
  },
  categoryOnHover: {
    boxShadow: '0 5px 4px 0 rgba(0, 0, 0, 0.16)',
    backgroundColor: '#ffffff',
  },
};

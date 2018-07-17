/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import type { StoreType, CategoryType, SubcategoryType } from '../flowtypes';

type PropsType = {
  /*
  *   store: Store (StoreType) => displays only this store
  *   store: true (boolean) => fetches all stores
  *   store: false => does not fetch or display any stores
  *
  *   category: Category (CategoryType) => fetches only this category with its subcategories
  *   category: true (boolean) => fetches all categories with subcategories
  *   category: false (boolean) => does not fetch or display categories/subcategories
  *
  */
  store?: StoreType | boolean,
  category?: CategoryType | boolean,
};

type StateType = {
  stores: Array<StoreType>,
  categories: Array<CategoryType>,
};

export default class SideNavBar extends React.Component<PropsType, StateType> {

  state = {
    stores: [],
    categories: [],
  };

  static defaultProps = {
    store: true,
    category: true,
  }

  determineSideNavBarContent(props: PropsType) {
    const { store, category } = props;

    if (store !== false) {
      if (store === true) {
        this.fetchAllStores();
      }
      else {
        this.setState({
          stores: Array(store),
        });
      }
    }

    if (category !== false) {
      if(category === true) {
        this.fetchAllCategories();
      }
      else {
        this.setState({
          categories: Array(category),
        });
      }
    }
  }

  componentWillReceiveProps(nextProps: PropsType) {
    this.determineSideNavBarContent(this.props);
  };

  componentDidMount() {
    this.determineSideNavBarContent(this.props);

  }

  fetchAllCategories() {
    axios.get('/api-v1/categories/').then(response => {
      this.setState({
        categories: response.data,
      });
    }).catch(error => {
      this.setState({
        categories: [],
      })
    })
  }

  fetchAllStores() {
    axios.get('/api-v1/stores/').then(response => {
      this.setState({
        stores: response.data
      });
    }).catch(error => {
      this.setState({
        stores: []
      });
    });
  };

  onlyCategoryUrl(pathName: string): boolean {
    var onlyCategoryRegex = new RegExp('^\/category\/[^\/ ]*\/?$');
    return onlyCategoryRegex.test(pathName);
  }

  categoryAndStoreOrSubcatUrl(pathName: string): boolean {
    var categoryAndStoreOrSubcatRegex = new RegExp('^\/category\/[^\/ ]*\/[^\/ ]*\/?$');
    return categoryAndStoreOrSubcatRegex.test(pathName);
  }

  categoryAndStoreAndSubcatUrl(pathName: string): boolean {
    var categoryAndStoreAndSubcatRegex = new RegExp('^\/category\/[^\/ ]*\/[^\/ ]*\/[^\/ ]*\/?$');
    return categoryAndStoreAndSubcatRegex.test(pathName);
  }

  isStore(pathName: string): boolean | null {
    const { stores } = this.state;
    var lastSubpathRegex = new RegExp('\/[^\/ ]*\/?$(?!.*\/[^\/ ]*\/?$)');

    var lastSubpath = pathName.match(lastSubpathRegex);
    if (lastSubpath){
      var lastSubpathWithoutSlashes = lastSubpath[0].replace(/\//g, '');
      var filteredStores = stores.filter((store) => store.slug == lastSubpathWithoutSlashes);
      return filteredStores.length > 0;
    }
    return null;
  }

  generateStoreUrl(pathName: string, storeSlug: string): string {
    /**
     * Based on current url path we need to generate store url accordingly:
     *
     *  1. if current page is only category, eg: /category/face or /category/face/
     *    - end result -> /category/face/<storeSlug>
     *
     *  2. if current page is category and store, eg: /category/face/mac or /category/face/mac/
     *    - end result -> /category/face/<storeSlug>
     *
     *  3. if current page is category and subcategory, eg: /category/face/lipstick or /category/face/lipstick/
     *    - end result -> /category/face/lipstick/<storeSlug>
     *
     *  4. if current page is category, subcategory and store, eg: /category/face/lipstick/mac or /category/face/lipstick/mac/
     *    - end result -> /category/face/lipstick/<storeSlug>
     *
     */

    var lastSubpathRegex = new RegExp('\/[^\/ ]*\/?$(?!.*\/[^\/ ]*\/?$)');

    /* Case 1 */
    if (this.onlyCategoryUrl(pathName)) {
      /* check if last char is a slash */
      var generatedUrl = pathName.slice(-1) === '/' ? pathName + storeSlug : pathName + '/' + storeSlug;
      return generatedUrl;
    }
    /* Case 2 & 3 */
    else if (this.categoryAndStoreOrSubcatUrl(pathName)) {
      /* determine if pathname is store or subcat */
      if (this.isStore(pathName)) {
        return pathName.replace(lastSubpathRegex, '/' + storeSlug);
      }
      else {
        var generatedUrl = pathName.slice(-1) === '/' ? pathName + storeSlug : pathName + '/' + storeSlug;
        return generatedUrl;
      }
    }
    /* Case 4 */
    else if (this.categoryAndStoreAndSubcatUrl(pathName)) {
      return pathName.replace(lastSubpathRegex, '/' + storeSlug);
    }
    /* Case should not happen, but just in case we return the full store url */
    else {
      return '/store/' + storeSlug;
    }
  }

  removeStoreFromUrl(pathName: string): string {
    /* we simply generate a store url with an empty slug and remove the extra / in the url */
    var urlWithoutStore = this.generateStoreUrl(pathName, '').replace(/\/\//g, '/');
    return urlWithoutStore;
  }

  renderStores(): Array<any> {
    const { stores } = this.state;

    var currentPathName = window.location.pathname;

    var storesTabsList = stores.map((store, i) =>
      <li className='nav-item' key={'store-'+store.slug+'-'+i}>
        <NavLink to={this.generateStoreUrl(currentPathName, store.slug)} className='nav-link' activeClassName='active'>
          { store.name }
        </NavLink>
      </li>
    );

    var allStoresTab = <li className='nav-item' key={'store-all'}>
        <NavLink exact to={this.generateStoreUrl(currentPathName, '')} className='nav-link' activeClassName='active'>
          All
        </NavLink>
      </li>

    storesTabsList.push(allStoresTab);

    return storesTabsList;
  };

  isSubcategory(category: CategoryType, pathName: string): boolean | null {

    var lastSubpathRegex = new RegExp('\/[^\/ ]*\/?$(?!.*\/[^\/ ]*\/?$)');

    var lastSubpath = pathName.match(lastSubpathRegex);
    if (lastSubpath){
      var lastSubpathWithoutSlashes = lastSubpath[0].replace(/\//g, '');
      var filteredSubcats = category.subcategories.filter((subcat) => subcat.slug == lastSubpathWithoutSlashes);
      return filteredSubcats.length > 0;
    }
    return null;
  }

  generateSubcatUrl(pathName: string, category: CategoryType, subcatSlug: string): string {
    /**
     * Based on current url path we need to generate subcategory url accordingly:
     *
     *  1. if current page is only category, eg: /category/face or /category/face/
     *    - end result -> /category/face/<subcatSlug>
     *
     *  2. if current page is category and subcategory, eg: /category/face/lipstick or /category/face/lipstick/
     *    - end result -> /category/face/<subcatSlug>
     *
     *  3. if current page is category and store, eg: /category/face/mac or /category/face/mac/
     *    - end result -> /category/face/<subcatSlug>/mac
     *
     *  4. if current page is category, subcategory and store, eg: /category/face/lipstick/mac or /category/face/lipstick/mac/
     *    - end result -> /category/face/<subcatSlug>/mac
     *
     */

    var lastSubpathRegex = new RegExp('\/[^\/ ]*\/?$(?!.*\/[^\/ ]*\/?$)');

    /* Case 1 */
    if (this.onlyCategoryUrl(pathName)) {
      /* check if last char is a slash */
      var generatedUrl = pathName.slice(-1) === '/' ? pathName + subcatSlug : pathName + '/' + subcatSlug;
      return generatedUrl;

    }
    /* Case 2 & 3 */
    else if (this.categoryAndStoreOrSubcatUrl(pathName)) {
      /* determine if pathname is store or subcat */
      if (this.isSubcategory(category, pathName)) {
        return pathName.replace(lastSubpathRegex, '/' + subcatSlug);
      }
      else {
        /* since it's a store we need to prepend the subcat to it in url */
        var storeSubpath = pathName.match(lastSubpathRegex);
        if (storeSubpath){
          var storeSlug = storeSubpath[0].replace(/\//g, '');
        }
        return pathName.replace(lastSubpathRegex, '/' + subcatSlug + '/' + storeSlug);
      }
    }
    /* Case 4 */
    else if (this.categoryAndStoreAndSubcatUrl(pathName)) {

      var storeSubpath = pathName.match(lastSubpathRegex);
      if (storeSubpath) {
        var storeSlug = storeSubpath[0].replace(/\//g, '');
      }

      var pathNameWithoutStore = pathName.replace(lastSubpathRegex, '');

      return pathNameWithoutStore.replace(lastSubpathRegex, '/' + subcatSlug + '/' + storeSlug);
    }
    /* Case should not happen, but just in case we return the full category/subcategory url */
    else {
      return '/category/' + category.slug + '/' + subcatSlug;
    }
  }

  removeSubcatFromUrl(pathName: string, category: CategoryType): string {
    /* we simply generate a subcat url with an empty slug and remove the extra / in the url */
    var urlWithoutSubcat = this.generateSubcatUrl(pathName, category, '').replace(/\/\//g, '/');
    return urlWithoutSubcat;
  }

  renderSubcategories(category: CategoryType): Array<any> {
    var currentPathName =  window.location.pathname;

    var subcategoriesTabsList = category.subcategories.map((subcategory, i) =>
      <li className='nav-item' key={'subcategory-'+subcategory.slug+'-'+i}>
        <NavLink to={this.generateSubcatUrl(currentPathName, category, subcategory.slug)} className='nav-link' activeClassName='active'>
          { subcategory.name }
        </NavLink>
      </li>
    );

    var allSubcatsTab = <li className='nav-item' key={'subcategory-all'}>
      <NavLink exact to={this.removeSubcatFromUrl(currentPathName, category)} className='nav-link' activeClassName='active'>
        All
      </NavLink>
    </li>

    subcategoriesTabsList.push(allSubcatsTab);

    return subcategoriesTabsList;
  };

  renderCategories(): Array<any> {
    const { categories } = this.state;

    return (
      categories.map((category, i) =>
        <li className='nav-item' key={'store-'+category.slug+'-'+i}>
          <a className='nav-link' href='#' data-toggle='pill' href='#v-pills-profile-2' role='tab' aria-controls='v-pills-profile-2' aria-selected='false'>{ category.name }</a>
            <ul style={{listStyleType: 'none' }}>
              { this.renderSubcategories(category) }
            </ul>
        </li>
      )
    );
  }

  render() {
    const { category } = this.props;

    return (
      <div>
        <ul className='nav nav-pills flex-column' role='tablist' aria-orientation='vertical'>

          { category instanceof Object ? <h5>Subcategories</h5> : <h5>Categories</h5> }
          { category instanceof Object ? this.renderSubcategories(category) : this.renderCategories() }
          <hr />
          <h5>Stores</h5>
          { this.renderStores() }

        </ul>
      </div>

    );
  }
}

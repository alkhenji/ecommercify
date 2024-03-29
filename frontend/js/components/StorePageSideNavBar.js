/* @flow */

import React from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import QueryString from 'query-string';
import Radium from 'radium';

import type { CategoryWithSubcategoriesType, SubcategoryWithCategoryType, SubcategoryType } from '../flowtypes';


type PropsType = {
  storeSlug: string
};

type StateType = {
  categories: Array<CategoryWithSubcategoriesType>,
  loading: boolean
};

class StorePageSideNavBar extends React.Component<PropsType, StateType> {


  static defaultProps: PropsType = {
    storeSlug: ''
  };

  state: StateType = {
    categories: [],
    loading: true,
  }


  componentWillReceiveProps () {
    this.fetchStoreCategoriesAndSubcats();
  }

  componentDidMount() {
    this.fetchStoreCategoriesAndSubcats();
  }

  subcategoryInList(subcategoryDict, subcategoriesList) {
    for (var i = 0; i < subcategoriesList.length; i++) {
      if (subcategoriesList[i].name == subcategoryDict.name && subcategoriesList[i].slug == subcategoryDict.slug) {
        return true;
      }
    }
    return false;
  }

  buildCategoriesFromSubcats(subcategories: Array<SubcategoryWithCategoryType>) {

    var categoriesDict = {};
    for (var i = 0; i < subcategories.length; i++) {
      var category = subcategories[i].category
      var subcategoryDict = {
        name: subcategories[i].name,
        slug: subcategories[i].slug
      }
      var lookedUpCategory = categoriesDict[category.slug];
      if (lookedUpCategory) {
        /* only add it if we did not already add from before */
        if (!this.subcategoryInList(subcategoryDict, lookedUpCategory.subcategories)) {
          lookedUpCategory.subcategories.push(subcategoryDict);
        }
      }
      else {
        categoriesDict[category.slug] = {
          name: category.name,
          slug: category.slug,
          subcategories: [subcategoryDict]
        };
      }
    }
    return Object.values(categoriesDict);

  }

  fetchStoreCategoriesAndSubcats() {
    const { storeSlug } = this.props;

    axios.get('/api-v1/subcategories/?store=' + storeSlug).then(response => {
      this.setState({
        categories: this.buildCategoriesFromSubcats(response.data),
        loading: false
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        categories: [],
        loading: false
      })
    });
  }

  getCurrentSubcategoryFilterParamsFromURL() {
    var currentQueryParams = QueryString.parse(window.location.search);
    var subcategoryFilterParams = currentQueryParams.subcategory || [];

    if (typeof subcategoryFilterParams == 'string') {
      subcategoryFilterParams = [subcategoryFilterParams];
    }
    return subcategoryFilterParams;
  }

  addSubcategoryFilterParam(subcategorySlug: string) {
    var subcategoryFilterParams = this.getCurrentSubcategoryFilterParamsFromURL();

    /* make sure subcategory not already there before adding */
    if (!subcategoryFilterParams.includes(subcategorySlug)) {
      subcategoryFilterParams.push(subcategorySlug);
    }
    return subcategoryFilterParams
  }

  removeSubcategoryFilterParam(subcategorySlug: string) {
    var subcategoryFilterParams = this.getCurrentSubcategoryFilterParamsFromURL();

    return subcategoryFilterParams.filter((param) => param !== subcategorySlug);
  }

  determineQueryParams(subcategorySlug: string) {
    var subcategoryFilterParams = this.getCurrentSubcategoryFilterParamsFromURL()
    var currentQueryParams = QueryString.parse(window.location.search);

    /* if subcategory filter already applied, remove it */
    if (subcategoryFilterParams.includes(subcategorySlug)) {
      subcategoryFilterParams = this.removeSubcategoryFilterParam(subcategorySlug);
    }
    /* otherwise apply this subcategory filter */
    else {
      subcategoryFilterParams = this.addSubcategoryFilterParam(subcategorySlug);
    }

    currentQueryParams.subcategory = subcategoryFilterParams;
    return QueryString.stringify(currentQueryParams);
  }

  renderSubcategories(category: CategoryWithSubcategoriesType) {
    const { storeSlug } = this.props;
    var filteredSubcategories = this.getCurrentSubcategoryFilterParamsFromURL();

    return category.subcategories.map((subcategory, i) =>
      <li className='nav-item' key={'subcategory-'+subcategory.slug+'-'+i}>
        <div key={'subcategory-div-'+subcategory.slug+'-'+i} style={styles.subcategoryTabStyle}>
          <NavLink  to={'/store/' + storeSlug + '/?' + this.determineQueryParams(subcategory.slug) }
                    className={ filteredSubcategories.includes(subcategory.slug) ? 'nav-link active' : 'nav-link' }
                    activeClassName='active'
                    style={ filteredSubcategories.includes(subcategory.slug) ? { backgroundColor: '#343a40' } : {color: 'black'} }
                    activeStyle={{backgroundColor: '#343a40'}}>
            { subcategory.name }
          </NavLink>
        </div>
      </li>
    );
  }

  determineQueryParamsForCategory(category: CategoryWithSubcategoriesType) {
    var currentQueryParams = QueryString.parse(window.location.search);
    var filteredSubcategories = this.getCurrentSubcategoryFilterParamsFromURL();

    var subcatCount = 0
    for (var i = 0; i < category.subcategories.length; i++) {
      if (filteredSubcategories.includes(category.subcategories[i].slug)) {
        subcatCount++;
      }
    }

    /* if all subcats under this cat are selected unselect them all */
    if (subcatCount === category.subcategories.length) {
      for (var i = 0; i < category.subcategories.length; i++) {
        var subcategorySlug = category.subcategories[i].slug;
        filteredSubcategories = filteredSubcategories.filter((param) => param !== subcategorySlug);
      }
    }
    /* otherwise select all of them */
    else {
      for (var i = 0; i < category.subcategories.length; i++) {
        var subcategorySlug = category.subcategories[i].slug;
        if (!filteredSubcategories.includes(subcategorySlug)) {
          filteredSubcategories.push(subcategorySlug);
        }
      }
    }
    currentQueryParams.subcategory = filteredSubcategories;
    return QueryString.stringify(currentQueryParams)
  }

  renderCategories() {
    const { storeSlug } = this.props;
    const { categories } = this.state;

    return categories.map((category, i) => (
      <li className='nav-item' key={'category-'+category.slug+'-'+i}>
        <div style={styles.categoryTabStyle} key={'category-div-'+category.slug+'-'+i}>
          <NavLink  to={'/store/' + storeSlug + '/?' + this.determineQueryParamsForCategory(category) }
                    className='nav-link'
                    style={styles.navlinkStyle}>
            { category.name }
          </NavLink>
        </div>
        <ul style={{listStyleType: 'none' }}>
          { this.renderSubcategories(category) }
        </ul>
      </li>
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
      <div>
        <ul className='nav nav-pills flex-column' role='tablist' aria-orientation='vertical'>
          <h5>Categories</h5>
            {this.renderCategories()}
        </ul>
      </div>
    );
  }
}

const styles: Object = {
  categoryTabStyle: {
    color: 'black',
    backgroundClip: 'border-box',
    border: '1px solid rgba(0,0,0,.125)',
    borderRadius: '.25rem',

    ':hover': {
      backgroundColor: 'lightgrey',
    },
  },
  subcategoryTabStyle: {
    ':hover': {
      backgroundColor: 'lightgrey',
    },
  },
  navlinkStyle: {
    color: 'black'
  }
};

export default StorePageSideNavBar = Radium(StorePageSideNavBar);

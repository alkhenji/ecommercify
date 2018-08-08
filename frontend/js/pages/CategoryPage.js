/* @flow */

import React from 'react';
import axios from 'axios';
import Media from 'react-media';

import type { CategoryType, ProductType } from '../flowtypes';
import ProductCard from '../components/ProductCard';
import CategoryPageSideNavBar from '../components/CategoryPageSideNavBar';

type PropsType = {
  match: Object,
};

type StateType = {
  category: CategoryType | null,
  productsUnderCategory: Array<ProductType>,
};


export default class CategoryPage extends React.Component<PropsType, StateType> {

  state = {
    category: {
      name: '',
      slug: '',
      subcategories: [],
    },
    productsUnderCategory: [],
  };

  /* This is an async function as we need to fetchCategoryDetails
     to determine if the slug is a Store or Subcategory so we need
     to "wait" for it.
   */
  async fetchProductsUnderSubcategoryOrStore(categorySlug:string, storeOrSubcategorySlug: string): boolean {
    const response = await this.fetchCategoryDetails(categorySlug)
    const { category } = this.state;

    if (!category) {
      return;
    }

    var filteredSubcats = category.subcategories.filter((subcat) => subcat.slug == storeOrSubcategorySlug);
    var isSubcategory = filteredSubcats.length > 0 ? true : false;

    /* check if Subcategory */
    if (isSubcategory) {
      /* only Subcategory selected to filter products under Category
       * we do not need to pass category slug here because all subcategories are unique
       * across all categroies
      */
      this.fetchProductsUnderSubcategory(storeOrSubcategorySlug);
    }
    else {
      /* only Store selected to filter products under Category */
      this.fetchProductsUnderStore(categorySlug, storeOrSubcategorySlug);
    }
  }

  determineAndFetchProducts(categorySlug, storeOrSubcategorySlug, storeSlug) {
    if (storeOrSubcategorySlug !== undefined && storeSlug !== undefined) {
      /* both Subcategory and Store selected to filter products under Category */
      this.fetchProductsUnderSubcategoryAndStore(storeOrSubcategorySlug, storeSlug);
    }
    else if (storeOrSubcategorySlug !== undefined) {
      /* either Subcategory or Store selected under Category */
      this.fetchProductsUnderSubcategoryOrStore(categorySlug, storeOrSubcategorySlug);
    }
    else if (storeSlug !== undefined) {
      /* only Store selected to filter products under Category */
      this.fetchProductsUnderStore(categorySlug, storeSlug);
    }
    else {
      /* all products under Category no further filters */
      this.fetchProductsUnderCategory(categorySlug);
    }
  }

  componentWillReceiveProps(newProps: PropsType) {
    var categorySlug = newProps.match.params.categorySlug;
    var storeOrSubcategorySlug = newProps.match.params.storeOrSubcategorySlug;
    var storeSlug = newProps.match.params.storeSlug;

    this.fetchCategoryDetails(categorySlug);

    this.determineAndFetchProducts(categorySlug, storeOrSubcategorySlug, storeSlug);

  }

  componentDidMount() {
    var categorySlug = this.props.match.params.categorySlug;
    var storeOrSubcategorySlug = this.props.match.params.storeOrSubcategorySlug;
    var storeSlug = this.props.match.params.storeSlug;

    this.fetchCategoryDetails(categorySlug);

    this.determineAndFetchProducts(categorySlug, storeOrSubcategorySlug, storeSlug);

  }

  fetchCategoryDetails(categorySlug: string) {
    return axios.get('/api-v1/categories/' + categorySlug + '/').then(response => {
      this.setState({
        category: response.data
      });
    }).catch(error => {
      this.setState({
        category: null,
      });
    });
  }

  fetchProductsUnderSubcategoryAndStore(storeOrSubcategorySlug: string, storeSlug: string) {
    axios.get('/api-v1/products/?subcategory='+storeOrSubcategorySlug+'&store='+storeSlug).then(response => {
      this.setState({
        productsUnderCategory: response.data
      });
    }).catch(error => {
      this.setState({
        productsUnderCategory: []
      });
    });
  }

  fetchProductsUnderStore(categorySlug:string, storeSlug: string) {
    axios.get('/api-v1/products/?category='+categorySlug+'&store='+storeSlug).then(response => {
      this.setState({
        productsUnderCategory: response.data
      });
    }).catch(error => {
      this.setState({
        productsUnderCategory: []
      });
    });
  }

  fetchProductsUnderSubcategory(subcategorySlug: string) {
    axios.get('/api-v1/products/?subcategory='+subcategorySlug).then(response => {
      this.setState({
        productsUnderCategory: response.data
      });
    }).catch(error => {
      this.setState({
        productsUnderCategory: []
      });
    });
  }

  fetchProductsUnderCategory(categorySlug: string) {
    axios.get('/api-v1/products/?category='+categorySlug).then(response => {
      this.setState({
        productsUnderCategory: response.data
      });
    }).catch(error => {
      this.setState({
        productsUnderCategory: []
      });
    });
  }

  renderProductsUnderCategory(): Array<any> {
    const { productsUnderCategory } = this.state;

    return productsUnderCategory.length === 0 ? <h3>No Products found.</h3> : productsUnderCategory.map((product) => <ProductCard key={'product_under_cat_card-'+product.slug} product={ product } />);
  }

  render() {
    const { category } = this.state;

    if (category == null) {
      return (
        <div className='container' style={styles.container}>
          <h1>No such category.</h1>
        </div>
      )
    }
    else if (category.name !== '') {
      return (
        <div style={styles.container}>
          <div className='container'>
            <div className='row'>

              <Media
                query={{ minWidth: '992px' }}
                render={() => <div className='col-md-3'><CategoryPageSideNavBar category={category} /></div>}>
              </Media>

              <div className='col'>
                <div className='row justify-content-center'>
                  { this.renderProductsUnderCategory() }
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    else {
      return null;
    }
  }
}

const styles: Object = {
  container: {
    paddingTop: 30,
    paddingBottom: 30
  }
};

/* @flow */

import React from 'react';
import axios from 'axios';

import type { CategoryType, ProductType } from '../flowtypes';
import ProductCard from '../components/ProductCard';

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
    },
    productsUnderCategory: [],
  };

  componentWillReceiveProps(newProps: PropsType) {
    var categorySlug = newProps.match.params.slug;
    this.fetchCategoryDetails(categorySlug);
    this.fetchProductsUnderCategory(categorySlug);
  }

  componentDidMount() {
    var categorySlug = this.props.match.params.slug;
    this.fetchCategoryDetails(categorySlug);
    this.fetchProductsUnderCategory(categorySlug);
  }

  fetchCategoryDetails(categorySlug: string) {
    axios.get('/api-v1/categories/' + categorySlug + '/').then(response => {
      this.setState({
        category: response.data
      });
    }).catch(error => {
      this.setState({
        category: null,
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

  renderProductsUnderCategory(): Array<React.ComponentType> {
    const { productsUnderCategory } = this.state;

    return productsUnderCategory.map((product) => <ProductCard key={'product_under_cat_card-'+product.slug} product={ product } />);
  }

  render() {
    const { category } = this.state;

    if (category == null) {
      return <h1>No such category.</h1>
    }
    else if (category.name !== '') {
      return (
        <div className='container' style={styles.container}>
          <div className="row">
            { this.renderProductsUnderCategory() }
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
    marginTop: 30,
    marginBottom: 30
  }
};

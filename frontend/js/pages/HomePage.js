import React from 'react';
import axios from 'axios';

import ProductCard from '../components/ProductCard';
import CategoriesBar from '../components/CategoriesBar';

import type { CategoryWithSubcategoriesType, ProductType, StoreType }
  from '../flowtypes';

type PropsType = {};
type StateType = {
  categories: Array<CategoryWithSubcategoriesType>,
  products: Array<ProductType>,
  stores: Array<StoreType>
};

export default class HomePage extends React.Component<PropsType, StateType> {

  state: StateType = {
    categories: [],
    products: [],
    stores: []
  };

  componentDidMount() {
    // this.fetchAllCategories();
    this.fetchAllProducts();
    // this.fetchAllStores();
  }

  fetchAllProducts(): null {
    axios.get('/api-v1/products/').then(response => {
      this.setState({
        products: response.data
      });
    }).catch(error => {
      console.error(error);
    });
  }

  // fetchAllCategories(): null {
  //   axios.get('/api-v1/categories/').then(response => {
  //     this.setState({
  //       categories: response.data
  //     });
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // }
  //
  // fetchAllStores(): null {
  //   axios.get('/api-v1/stores/').then(response => {
  //     this.setState({
  //       stores: response.data
  //     });
  //   }).catch(error => {
  //     console.error(error);
  //   });
  // }

  // listCategories() {
  //   const { categories } = this.state;
  //   return categories.map(category => <p key={category.slug}>{category.name}</p>);
  // }

  listProducts() {
    const { products } = this.state;
    return products.map(product => <ProductCard key={product.slug} product={product} />);
  }

  // listStores() {
  //   const { stores } = this.state;
  //   return stores.map(store => <p key={store.slug}>{store.name}</p>);
  // }

  render() {
    const { categories } = this.state;

    return (
      <div>
        <h1>Home Page</h1>
        <div className="row">
          { this.listProducts() }
        </div>

      </div>
    );
  }
}

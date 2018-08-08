import React from 'react';
import axios from 'axios';

import ProductCard from '../components/ProductCard';
import ShopByStores from '../components/ShopByStore';

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

  listProducts() {
    const { products } = this.state;
    return products.map(product => <ProductCard key={product.slug} product={product} />);
  }

  render() {
    const { categories } = this.state;

    return (
      <React.Fragment>
        <div style={styles.container} className="container">
          <div className="row">
            { this.listProducts() }
          </div>
        </div>
        <ShopByStores />
      </React.Fragment>
    );
  }
}

const styles: Object = {
  container: {
    paddingTop: 30,
    paddingBottom: 30
  }
};

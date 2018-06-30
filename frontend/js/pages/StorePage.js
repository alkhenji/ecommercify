/* @flow */

import React from 'react';
import axios from 'axios';

import ProductCard from '../components/ProductCard';
import CategoriesAndSubcategoriesListPicker from
  '../components/CategoriesAndSubcategoriesListPicker';

import type { StoreType, ProductType } from '../flowtypes';

type PropsType = {
  match: {
    params: {
      slug: string
    }
  }
};

type StateType = {
  store: StoreType | null,
  products: Array<ProductType>,
  loading: boolean
};

export default class StorePage extends React.Component<PropsType, StateType> {

  static defaultProps: PropsType = {
    match: {
      params: {
        slug: ''
      }
    }
  }

  state: StateType = {
    store: null,
    products: [],
    loading: true,
  };

  componentDidMount() {
    const { slug } = this.props.match.params;
    if (slug) {
      this.fetchStore(slug);
      this.fetchStoreProducts(slug);
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  fetchStore(slug: string) {
    axios.get('/api-v1/stores/' + slug + '/').then(response => {
      this.setState({
        store: response.data,
        loading: false,
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        loading: false
      });
    });
  }

  fetchStoreProducts(slug: string) {
    axios.get('/api-v1/products/?store=' + slug).then(response => {
      this.setState({
        products: response.data,
      });
    }).catch(error => {
      console.error(error);
    });
  }

  listProducts() {
    const { products } = this.state;
    return products.map(product =>
      <ProductCard key={product.slug} product={product} />
    );
  }

  render() {
    const { store, loading } = this.state;
    const { slug } = this.props.match.params;

    if (loading) {
      return <h1>Loading...</h1>;
    }

    if (!store) {
      return <h1>No such store.</h1>;
    }

    return (
      <div style={styles.container} className="container">
        <h1>{store.name}</h1>
        <hr/>
        <div className="row">
          <div className="col-md-3">
            <CategoriesAndSubcategoriesListPicker store_slug={slug}/>
          </div>
          <div className="col-md-9">
            <div className="row">
              {this.listProducts()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  container: {
    marginTop: 30,
    marginBottom: 30
  }
};

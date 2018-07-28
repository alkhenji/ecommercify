/* @flow */

import React from 'react';
import axios from 'axios';
import queryString from 'query-string';

import ProductCard from '../components/ProductCard';
import StorePageSideNavBar from '../components/StorePageSideNavBar';

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

  componentWillReceiveProps(newProps: PropsType) {
    const { slug } = newProps.match.params;

    var filterParameters = queryString.parse(newProps.location.search);

    if (slug) {
      this.fetchStore(slug);
      this.fetchStoreProducts(slug, filterParameters);
    } else {
      this.setState({
        loading: false,
      });
    }

  }

  componentDidMount() {
    const { slug } = this.props.match.params;
    var filterParameters = queryString.parse(this.props.location.search);

    if (slug) {
      this.fetchStore(slug);
      this.fetchStoreProducts(slug, filterParameters);
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

  fetchStoreProducts(slug: string, filterParameters: Object) {
    filterParameters.store = slug;
    var queryParameters = queryString.stringify(filterParameters);
    axios.get('/api-v1/products/?' + queryParameters).then(response => {
      this.setState({
        products: response.data,
      });
    }).catch(error => {
      console.error(error);
    });
  }

  listProducts() {
    const { products } = this.state;
    if (products.length == 0) {
      return <h1>No matching products.</h1>
    }
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
            <StorePageSideNavBar storeSlug={slug} />
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

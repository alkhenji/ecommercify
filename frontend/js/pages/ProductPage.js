/* @flow */

import React from 'react';
import axios from 'axios';

import type { ProductType } from '../flowtypes';

type PropsType = {};
type StateType = {
  product: ProductType | Object | null,
};

export default class ProductPage extends React.Component<ProductType, StateType> {

  state: StateType = {
    product: {},
  }

  componentDidMount() {
    var productSlug = this.props.match.params.slug;
    this.fetchProductDetails(productSlug);
  }

  fetchProductDetails(productSlug: string) {
    axios.get('/api-v1/products/'+ productSlug + '/').then(response => {
      this.setState({
        product: response.data
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        product: null
      });
    });
  }

  determineImageUrl(thumbnail: Object) {
    return thumbnail ? thumbnail.image : 'http://via.placeholder.com/500x500';
  }

  render() {
    const { product } = this.state;

    if (product == null) {
      return <h1>No such product.</h1>
    }

    return (
      <div style={styles.container} className='container'>
        <div className='row featurette'>
          <div className='col-md-5 order-md-1'>
            <img className='featurette-image img-fluid mx-auto' src={ this.determineImageUrl(product.thumbnail) } data-holder-rendered='true' />
          </div>
          <div className='col-md-7 order-md-2'>
            <h2 className='featurette-heading'>{ product.name }</h2>
            <hr/>
            <p className='lead'>{ product.description }</p>
            <h5>{ product.price } QAR</h5>
            <br/>
            <button type='button' className='btn btn-lg btn-outline-secondary'>Add to Cart</button>
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

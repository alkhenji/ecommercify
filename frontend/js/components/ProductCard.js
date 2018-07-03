/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import qs from 'qs';

import type { ProductType } from '../flowtypes';

type PropsType = {
  product: ProductType,
};

type StateType = {
  cart_loading: boolean
};

export default class ProductCard extends React.Component<PropsType, StateType> {

  state: StateType = {
    cart_loading: false
  };

  addProductToCard(quantity: number) {
    this.setState({
      cart_loading: true
    });

    const { product } = this.props;

    axios.post('/api-v1/cart/',
      qs.stringify({
        product: product.slug,
        quantity
      }), {
      headers: {
				'X-CSRFToken': cookie.load('csrftoken'),
			}
    }).then(response => {
      this.setState({
        cart_loading: false
      });
    }).catch(error => {
      console.error(error);
    });
  }

  renderDescription(desc: string) {
    if (desc.length > 125) {
      return desc.substring(0, 125) + "...";
    }
    return desc;
  }

  render() {
    const { product } = this.props;
    const { cart_loading } = this.state;

    return (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow">
          <img className="card-img-top" src="http://via.placeholder.com/348x255" alt="Card image cap" />
          <div className="card-body">
            <Link className="card-title" to={ '/product/'+ product.slug }><h5>{ product.name }</h5></Link>
            <h5 className="card-title">{ product.price } QAR</h5>
            <p className="card-text" style={ styles.descriptionStyle }>{ this.renderDescription(product.description) }</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-md btn-outline-secondary"
                  onClick={() => this.addProductToCard(1)}>
                  {(cart_loading) ? 'Loading...' : 'Add to Cart'}
                </button>
              </div>
              <small className="text-muted"><Link to={ '/category/'+ product.subcategory.category.slug }> { product.subcategory.category.name } </Link> > { product.subcategory.name }</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const styles = {
  descriptionStyle: {
    height: 72
  }
};

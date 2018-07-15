/* @flow */

import React from 'react';
import { Link  } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import qs from 'qs';

import type { CartProductType } from '../flowtypes';


type PropsType = {
  cartProduct: CartProductType,
  refreshCart: () => {}
};

type StateType = {
  loading: boolean
};


export default class CartProduct extends React.Component<PropsType, StateType> {

  state: StateType = {
    loading: false
  };

  renderQuantityDropdownItems(maximum: number) {
    const items = [];
    for (var i = 0; i < maximum; i++) {
      const quantity = i + 1;
      items.push(
        <button key={i} className="dropdown-item"
          onClick={() => this.updateCartProductQuantity(quantity)}>
          {quantity}
        </button>
      );
    }
    return items;
  }

  removeCartProduct() {
    const { cartProduct, refreshCart } = this.props;

    axios.delete('/api-v1/cart/' + cartProduct.id + '/', {
      headers: {
        'X-CSRFToken': cookie.load('csrftoken')
      }
    }).then(response => {
      refreshCart();
    }).catch(error => {
      console.error(error);
    });
  }

  updateCartProductQuantity(quantity: number) {
    const { cartProduct, refreshCart } = this.props;

    axios.post('/api-v1/cart/' + cartProduct.id + '/update_quantity/',
      qs.stringify({
        quantity
      }), {
      headers: {
        'X-CSRFToken': cookie.load('csrftoken'),
      }
    }).then(response => {
      refreshCart();
    }).catch(error => {
      console.error(error);
    });
  }

  render() {
    const { cartProduct } = this.props;

    const category = cartProduct.product.subcategory.category;
    const subcategory = cartProduct.product.subcategory;

    const total_price = cartProduct.quantity * cartProduct.product.price;

    return (
      <div className="card w-75">
        <div className="card-body">
          <div className="row">
            <div className="col-md-7">
              <small className="text-muted">
                <Link to={'/category/' + category.slug}>
                  {category.name}
                </Link> > <Link to={'/category/' + category.slug + '/' +
                  subcategory.slug}>
                  {subcategory.name}
                </Link>
                <hr/>
              </small>
              <Link className="card-title" to={'/product/' + cartProduct.product.slug}>
                <h5>{cartProduct.product.name}</h5>
              </Link>
              <h5 className="card-title">{cartProduct.product.price} QAR</h5>
            </div>
            <div className="col-md-5">
              <div className="h-100 d-flex flex-column justify-content-end align-items-end">
                <h4 className="card-title">{total_price} QAR</h4>
                <div className="btn-group">
                  <button type="button" className="btn btn-outline-secondary" disabled>
                    Quantity
                  </button>

                  <div className="btn-group">
                    <button id="quantityDropdown" type="button" className="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {cartProduct.quantity}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="quantityDropdown">
                      {this.renderQuantityDropdownItems(cartProduct.product.quantity)}
                    </div>
                  </div>

                  <button type="button" className="btn btn-outline-danger"
                    onClick={this.removeCartProduct.bind(this)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

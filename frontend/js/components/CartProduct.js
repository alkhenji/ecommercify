/* @flow */

import React from 'react';
import { Link  } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import qs from 'qs';
import { connect } from 'react-redux';

import { removeProductFromCart, updateProductDataInCart } from '../redux/actions/Cart';

import type { CartProductType } from '../flowtypes';

type PropsType = {
  cartProduct: CartProductType,
  removeProductFromCart: (product: CartProductType) => {},
  updateProductDataInCart: (product: CartProductType, data: Object) => {}
};

type StateType = {
  loading: boolean
};

const mapDispatchToProps = dispatch => ({
  removeProductFromCart: (product) => dispatch(removeProductFromCart(product)),
  updateProductDataInCart: (product, data) => dispatch(updateProductDataInCart(product, data))
});

class CartProduct extends React.Component<PropsType, StateType> {

  state: StateType = {
    loading: false
  };

  renderQuantityDropdownItems(maximum: number) {
    const { cartProduct, updateProductDataInCart } = this.props;
    const items = [];

    for (var i = 0; i < maximum; i++) {
      const quantity = i + 1;
      items.push(
        <button key={i} className="dropdown-item"
          onClick={() => updateProductDataInCart(cartProduct, {quantity})}>
          {quantity}
        </button>
      );
    }
    return items;
  }

  render() {
    const { cartProduct, removeProductFromCart } = this.props;

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
                    onClick={() => removeProductFromCart(cartProduct)}>
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

export default connect(null, mapDispatchToProps) (CartProduct);

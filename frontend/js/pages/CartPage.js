/* @flow */

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

import CartProduct from '../components/CartProduct';

import LoadingSpinner from '../components/LoadingSpinner';

import { fetchCartProducts } from '../redux/actions/Cart';

import type { CartProductType } from '../flowtypes';

type PropsType = {
  cartProducts: Array<CartProductType>,
  loading: boolean,
  error: Object,
};

type StateType = {};

const mapStateToProps = state => ({
  cartProducts: state.cartProducts,
  loading: state.loading,
  error: state.error
});

class CartPage extends React.Component<PropsType, StateType> {

  renderCartProducts() {
    const { cartProducts } = this.props;

    return cartProducts.map(product => (
      <CartProduct key={product.id} cartProduct={product} />
    ));
  }

  render() {
    const { loading } = this.props;

    return (
      <div className='container'>
        <h1>Your Cart</h1>
        <div style={{ position: 'relative' }} >
          { loading ? <LoadingSpinner /> : null }
          { this.renderCartProducts() }
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null) (CartPage);

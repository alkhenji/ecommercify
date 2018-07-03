/* @flow */

import React from 'react';
import axios from 'axios';

import CartProduct from '../components/CartProduct';

type PropsType = {};
type StateType = {
  cart: Array<CartProductType>,
  loading: boolean
};

export default class CartPage extends React.Component<PropsType, StateType> {

  state: StateType = {
    cart: [],
    loading: true
  };

  componentDidMount() {
    this.fetchCart();
  }

  fetchCart() {
    axios.get('/api-v1/cart/').then(response => {
      this.setState({
        cart: response.data,
        loading: false
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        loading: false
      });
    });
  }

  renderCartProducts() {
    const { cart } = this.state;

    return cart.map(product => (
      <CartProduct key={product.id} cartProduct={product}
        refreshCart={this.fetchCart.bind(this)} />
    ));
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="container">
          <h1>Loading...</h1>
        </div>
      );
    }

    return (
      <div className="container">
        <h1>Your Cart</h1>
        {this.renderCartProducts()}
      </div>
    );
  }
}

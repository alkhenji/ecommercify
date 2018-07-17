import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';

const CartAndCheckoutApp = ({ match }) => {
  console.log('CartAndCheckoutApp');
  console.log(match);

  return (
    <React.Fragment>
      <Route exact path={match.url + '/checkout'} component={CheckoutPage} />
      <Route exact path={match.url} component={CartPage} />
    </React.Fragment>
  );
};

export default CartAndCheckoutApp;

import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import CartPage from './pages/CartPage';

export default class CartAndCheckoutApp extends React.Component {
    render() {
        return (
            <div className="container">
                <CartPage />
            </div>
        );
    }
}

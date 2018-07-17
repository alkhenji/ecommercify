/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AsyncComponent from './AsyncComponent';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

import ProductPage from './pages/ProductPage';
import CategoriesBar from './components/CategoriesBar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

let reactAppElement = document.getElementById('react-app');

/* Asynchronously load component (chunk) when needed */
const StoreApp = AsyncComponent(
    () => { return import('./StoreApp').then(module => module.default) },
    { name: 'StoreApp' }
);

/* Asynchronously load component (chunk) when needed */
const CartAndCheckoutApp = AsyncComponent(
    () => { return import('./CartAndCheckoutApp').then(module => module.default) },
    { name: 'CartAndCheckoutApp' }
);

/* Asynchronously load component (chunk) when needed */
const AboutAndReturnApp = AsyncComponent(
    () => { return import('./AboutAndReturnApp').then(module => module.default) },
    { name: 'AboutAndReturnApp' }
);

/* Asynchronously load component (chunk) when needed */
const SignUpAndSignInApp = AsyncComponent(
    () => { return import('./SignUpAndSignInApp').then(module => module.default) },
    { name: 'SignUpAndSignInApp' }
);

const IndexApp = () => (
    <Router>
        <React.Fragment>
            <NavBar />
            <div style={styles.container}>
                <Switch>
                    <Route path='/cart' component={CartAndCheckoutApp} />
                    <Route path='/about' component={AboutAndReturnApp} />
                    <Route path='/auth' component={SignUpAndSignInApp} />
                    <Route path='/' component={StoreApp} />
                </Switch>
            </div>
            <Footer />
        </React.Fragment>
    </Router>
);

const styles = {
    /* To get sticky NavBar & Footer */
    container: {
        overflowY: 'scroll',
        maxHeight: 'calc(100vh - 116px)', /* view height - navbar height (56px) - footer height (60px) */
        // paddingTop: 35, /* some space under navbar before adding content */
    }
}

ReactDOM.render((
    <IndexApp />
), reactAppElement);

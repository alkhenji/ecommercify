import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AsyncComponent from './AsyncComponent';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

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

const IndexApp = () => (
    <Router>
        <div>
            <NavBar />
            <div style={styles.containerStyle}>
                <div className='container'>
                    <Route path='/cart' component={CartAndCheckoutApp} />
                    <Route path='/about' component={AboutAndReturnApp} />
                    <Route exact path='/' component={StoreApp} />
                </div>
            </div>
            <Footer />
        </div>
    </Router>
);

const styles = {
    /* To get sticky NavBar & Footer */
    containerStyle: {
        overflowY: 'scroll',
        maxHeight: 'calc(100vh - 116px)', /* view height - navbar height (56px) - footer height (60px) */
    }
}

ReactDOM.render((
    <IndexApp />
), reactAppElement);

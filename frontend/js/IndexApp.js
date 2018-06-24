import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AsyncComponent from './AsyncComponent';

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
            <Route path='/cart' component={CartAndCheckoutApp} />
            <Route path='/about' component={AboutAndReturnApp} />
            <Route exact path='/' component={StoreApp} />
        </div>
    </Router>
);

ReactDOM.render((
    <IndexApp />
), reactAppElement);

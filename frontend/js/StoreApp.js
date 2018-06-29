import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';

const StoreApp = ({ match }) => (
  <div>
    <Route exact path={match.url + 'product/:slug/'} component={ProductPage} />
    <Route exact path={match.url + 'category/:slug/'} component={CategoryPage} />
    <Route exact path={match.url} component={HomePage}/>
  </div>
)

export default StoreApp;

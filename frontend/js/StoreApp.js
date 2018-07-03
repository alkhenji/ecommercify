import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import StorePage from './pages/StorePage';
import CategoriesBar from './components/CategoriesBar';

const StoreApp = ({ match }) => (
  <React.Fragment>
      <CategoriesBar />
      <Route exact path={match.url + 'product/:slug/'} component={ProductPage} />
      <Route exact path={match.url + 'store/:slug/'} component={StorePage} />
      <Route exact path={match.url + 'category/:slug/'} component={CategoryPage} />
      <Route exact path={match.url} component={HomePage}/>
  </React.Fragment>
);

export default StoreApp;

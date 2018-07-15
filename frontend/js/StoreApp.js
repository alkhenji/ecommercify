import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import StorePage from './pages/StorePage';
import CategoriesBar from './components/CategoriesBar';

const StoreApp = ({ match }) => (
  <div>
      <CategoriesBar />
      <Route exact path={match.url + 'product/:slug/'} component={ProductPage} />
      <Route exact path={match.url + 'store/:slug/'} component={StorePage} />
      <Route path={match.url + 'category/:categorySlug/:storeOrSubcategorySlug/:storeSlug'} component={CategoryPage} />
      <Route exact path={match.url + 'category/:categorySlug/:storeOrSubcategorySlug'} component={CategoryPage} />
      <Route exact path={match.url + 'category/:categorySlug/'} component={CategoryPage} />
      <Route exact path={match.url} component={HomePage}/>
  </div>
);

export default StoreApp;

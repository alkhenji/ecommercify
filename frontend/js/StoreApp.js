import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CategoriesBar from './components/CategoriesBar';

const StoreApp = ({ match }) => (
  <div>
      <CategoriesBar />
      <div className="container">
          <Route exact path={match.url + 'product/:slug/'} component={ProductPage} />
          {/* <Route path={match.url + 'category/:slug/'} component={CategoryPage} /> */}
          <Route exact path={match.url} component={HomePage}/>
      </div>
  </div>
);

export default StoreApp;

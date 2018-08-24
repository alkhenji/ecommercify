/* @flow */

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import cartProductsReducer from './reducers/Cart';

const store = createStore(
  cartProductsReducer,
  applyMiddleware(thunk)
);

export default store;

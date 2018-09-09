/* @flow */

import { toast } from 'react-toastify';

import {
  FETCH_CART_PRODUCTS_BEGIN,
  FETCH_CART_PRODUCTS_SUCCESS,
  FETCH_CART_PRODUCTS_FAILURE,

  ADD_PRODUCT_TO_CART_BEGIN,
  ADD_PRODUCT_TO_CART_SUCCESS,
  ADD_PRODUCT_TO_CART_FAILURE,

  UPDATE_PRODUCT_DATA_IN_CART_BEGIN,
  UPDATE_PRODUCT_DATA_IN_CART_SUCCESS,
  UPDATE_PRODUCT_DATA_IN_CART_FAILURE,

  REMOVE_PRODUCT_FROM_CART_BEGIN,
  REMOVE_PRODUCT_FROM_CART_SUCCESS,
  REMOVE_PRODUCT_FROM_CART_FAILURE,
} from '../actions/Cart';

const initialState = {
  cartProducts: [],
  loading: false,
  error: null,
  addingProduct: false,
};

export default function cartProductsReducer(state = initialState, action) {
  switch(action.type) {

    /*** FETCHING CART DATA ***/

    case FETCH_CART_PRODUCTS_BEGIN:
      /* Set loading to 'true' so we can show a spinner or something
      /* Reset any errors
      */
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CART_PRODUCTS_SUCCESS:
      /* Set loading to 'false'
      /* Replace the cartProducts with the ones from server
      */
      return {
        ...state,
        loading: false,
        cartProducts: action.payload.cartProducts
      };

    case FETCH_CART_PRODUCTS_FAILURE:
      /* Request failed so set loading to 'false'
      /* Save the error, and we can display it somewhere
      /* Since it failed, we don't have cartProducts to display anymore, so set it empty
      */
      toast.error('Oops! Something went wrong. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        cartProducts: []
      };

    /*** ADDING PRODUCT TO CART ***/

    case ADD_PRODUCT_TO_CART_BEGIN:
      /* Set addingProduct to 'true' so we can disable 'add to cart' button for all products
      /* Set loading to 'true' to show spinner
      /* Reset any errors
      */
      return {
        ...state,
        loading: true,
        error: null,
        addingProduct: true
      };

    case ADD_PRODUCT_TO_CART_SUCCESS:
      /* Set addingProduct to 'false'
      /* Replace the cartProducts with the ones from server
      /* Notify user with toast
      */
      toast('🛒 Added to cart!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        addingProduct: false,
        cartProducts: action.payload.cartProducts,
      };

    case ADD_PRODUCT_TO_CART_FAILURE:
      /* Set addingProduct to 'false'
      /* Save the error so we can display it somewhere
      /* cartProducts remains as is
      /* Notify user with toast
      */
      toast.error('Oops! Something went wrong. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        addingProduct: false,
        error: action.payload.error
      };

    /*** UPDATING PRODUCT DATA IN CART ***/

    case UPDATE_PRODUCT_DATA_IN_CART_BEGIN:
      /* Set loading to 'true' so we show spinner
      /* Reset any errors
      /* Set addingProduct to 'true' so we 'disable' add to cart button
      */
      return {
        ...state,
        loading: true,
        error: null,
        addingProduct: true,
      };

    case UPDATE_PRODUCT_DATA_IN_CART_SUCCESS:
      /* Set loading to 'false'
      /* Replace the cartProducts with the ones from server
      /* Set addingProduct to 'false' so 'enable' add to cart button
      /* Notify user with toast
      */
      toast('🛒 Updated cart!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        addingProduct: false,
        cartProducts: action.payload.cartProducts
      }

    case UPDATE_PRODUCT_DATA_IN_CART_FAILURE:
      /* Set loading to 'false'
      /* Set addingProduct to 'false' so 'enable' add to cart button
      /* Save error so we can display it somewhere
      /* cartProducts remains as is
      */
      return {
        ...state,
        loading: false,
        addingProduct: false,
        error: action.payload.error
      }

    /*** REMOVING PRODUCT FROM CART ***/

    case REMOVE_PRODUCT_FROM_CART_BEGIN:
      /* Set loading to 'true'
      /* Reset any errors
      */
      return {
        ...state,
        loading: true,
        error: null
      }

    case REMOVE_PRODUCT_FROM_CART_SUCCESS:
      /* Set loading to 'false'
      /* Replace the cartProducts with ones from server
      /* Notify user with toast
      */
      toast('🛒 Removed from cart!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        cartProducts: action.payload.cartProducts
      }

    case REMOVE_PRODUCT_FROM_CART_FAILURE:
      /* Set loading to 'false'
      /* Save error so we can display it somewhere
      /* Notify user using toast
      */
      toast.error('Oops! Something went wrong. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }

    default:
      return state;
  }
}

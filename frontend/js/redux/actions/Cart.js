import axios from 'axios';
import qs from 'qs';
import cookie from 'react-cookies';


/* FETCHING CART DATA */

export const FETCH_CART_PRODUCTS_BEGIN   = 'FETCH_CART_PRODUCTS_BEGIN';
export const FETCH_CART_PRODUCTS_SUCCESS = 'FETCH_CART_PRODUCTS_SUCCESS';
export const FETCH_CART_PRODUCTS_FAILURE = 'FETCH_CART_PRODUCTS_FAILURE';

export const fetchCartProductsBegin = () => ({
  type: FETCH_CART_PRODUCTS_BEGIN
});

export const fetchCartProductsSuccess = cartProducts => ({
  type: FETCH_CART_PRODUCTS_SUCCESS,
  payload: { cartProducts }
});

export const fetchCartProductsError = error => ({
  type: FETCH_CART_PRODUCTS_FAILURE,
  payload: { error }
});

export const fetchCartProducts = () => {
  return dispatch => {
    dispatch(fetchCartProductsBegin());
    axios.get('/api-v1/cart/').then(response => {
      dispatch(fetchCartProductsSuccess(response.data));
      return response.data
    }).catch(error => {
      console.error(error);
      dispatch(fetchCartProductsError(error));
    });
  }
}


/* ADDING PRODUCT TO CART */

export const ADD_PRODUCT_TO_CART_BEGIN = 'ADD_PRODUCT_TO_CART_BEGIN';
export const ADD_PRODUCT_TO_CART_SUCCESS = 'ADD_PRODUCT_TO_CART_SUCCESS';
export const ADD_PRODUCT_TO_CART_FAILURE = 'ADD_PRODUCT_TO_CART_FAILURE';

export const addProductToCartBegin = (product, quantity) => ({
  type: ADD_PRODUCT_TO_CART_BEGIN,
  payload: { product, quantity }
});

export const addProductToCartSuccess = cartProducts => ({
  type: ADD_PRODUCT_TO_CART_SUCCESS,
  payload: { cartProducts }
});

export const addProducttoCartFailure = error => ({
  type: ADD_PRODUCT_TO_CART_FAILURE,
  payload: { error }
});

export const addProductToCart = (product, quantity) => {
  return dispatch => {
    dispatch(addProductToCartBegin(product, quantity));
    axios.post('/api-v1/cart/',
      qs.stringify({
        product: product.slug,
        quantity
      }), {
      headers: {
        'X-CSRFToken': cookie.load('csrftoken'),
      }
    }).then(response => {
      dispatch(addProductToCartSuccess(response.data))
      return response.data;
    }).catch(error => {
      console.error(error);
      dispatch(addProducttoCartFailure(error));
    });
  }
};


/* UPDATING PRODUCT DATA IN CART */

export const UPDATE_PRODUCT_DATA_IN_CART_BEGIN = 'UPDATE_PRODUCT_DATA_IN_CART_BEGIN';
export const UPDATE_PRODUCT_DATA_IN_CART_SUCCESS = 'UPDATE_PRODUCT_DATA_IN_CART_SUCCESS';
export const UPDATE_PRODUCT_DATA_IN_CART_FAILURE = 'UPDATE_PRODUCT_DATA_IN_CART_FAILURE';

export const updateProductDataInCartBegin = (product, data) => ({
  type: UPDATE_PRODUCT_DATA_IN_CART_BEGIN,
  payload: { product, data }
});

export const updateProductDataInCartSuccess = cartProducts => ({
  type: UPDATE_PRODUCT_DATA_IN_CART_SUCCESS,
  payload: { cartProducts }
});

export const updateProductDataInCartFailure = error => ({
  type: UPDATE_PRODUCT_DATA_IN_CART_FAILURE,
  payload: { error }
});

export const updateProductDataInCart = (product, data) => {
  return dispatch => {
    dispatch(updateProductDataInCartBegin(product, data));
    axios.post('/api-v1/cart/' + product.id + '/update_quantity/',
      qs.stringify(
        data
      ), {
      headers: {
        'X-CSRFToken': cookie.load('csrftoken'),
      }
    }).then(response => {
      dispatch(updateProductDataInCartSuccess(response.data));
      return response.data;
    }).catch(error => {
      console.error(error);
      dispatch(updateProductDataInCartFailure(error));
    });
  };
}


/* REMOVING PRODUCT FROM CART */

export const REMOVE_PRODUCT_FROM_CART_BEGIN = 'REMOVE_PRODUCT_FROM_CART_BEGIN';
export const REMOVE_PRODUCT_FROM_CART_SUCCESS = 'REMOVE_PRODUCT_FROM_CART_SUCCESS';
export const REMOVE_PRODUCT_FROM_CART_FAILURE = 'REMOVE_PRODUCT_FROM_CART_FAILURE';

export const removeProductFromCartBegin = product => ({
  type: REMOVE_PRODUCT_FROM_CART_BEGIN,
  payload: { product }
});

export const removeProductFromCartSuccess = cartProducts => ({
  type: REMOVE_PRODUCT_FROM_CART_SUCCESS,
  payload: { cartProducts }
});

export const removeProductFromCartFailure = error => ({
  type: REMOVE_PRODUCT_FROM_CART_FAILURE,
  payload: { error }
});

export const removeProductFromCart = product => {
  return dispatch => {
    dispatch(removeProductFromCartBegin(product));
    axios.delete('/api-v1/cart/' + product.id + '/', {
      headers: {
        'X-CSRFToken': cookie.load('csrftoken')
      }
    }).then(response => {
      dispatch(removeProductFromCartSuccess(response.data));
      return response.data
    }).catch(error => {
      console.error(error);
      dispatch(removeProductFromCartFailure(error));
    });
  };
};


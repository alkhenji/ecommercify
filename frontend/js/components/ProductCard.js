/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import qs from 'qs';
import { connect } from 'react-redux';

import { addProductToCart, updateProductDataInCart } from '../redux/actions/Cart';

import type { ProductType, CartProductType } from '../flowtypes';

type PropsType = {
  product: ProductType,
  cartProducts: Array<CartProductType>,
  addingProduct: boolean,
  error: Object,
  addProductToCart: (product: ProductType, quantity: number) => {},
  updateProductDataInCart: (product: CartProductType, data: Object) => {},
};

type StateType = {};

const mapStateToProps = state => ({
  cartProducts: state.cartProducts,
  addingProduct: state.addingProduct,
  error: state.error,
});

const mapDispatchToProps = dispatch => ({
  addProductToCart: (product, quantity) => dispatch(addProductToCart(product, quantity)),
  updateProductDataInCart: (product, data) => dispatch(updateProductDataInCart(product, data)),
});

class ProductCard extends React.Component<PropsType, StateType> {

  handleAddProductToCart(product: ProductType, quantity: number) {
    const { cartProducts, addProductToCart, updateProductDataInCart } = this.props;

    /* we check if product exists in cart */
    for (var i = 0; i < cartProducts.length; i++) {
      if (product.slug === cartProducts[i].product.slug) {
        /* product exists in cart, update it's quantity */
        updateProductDataInCart(cartProducts[i], {quantity: cartProducts[i].quantity + quantity})
        return;
      }
    }
    /* new product not found in cart, add to cart */
    addProductToCart(product, quantity);
  }

  renderDescription(desc: string) {
    if (desc.length > 85) {
      return desc.substring(0, 85) + '...';
    }
    return desc;
  }

  determineImageUrl(thumbnail: Object) {
    return thumbnail ? thumbnail.image : 'http://via.placeholder.com/348x245'
  }

  render() {
    const { product, cartProducts, addingProduct } = this.props;

    return (
      <div className='col-md-4'>
        <div className='card mb-4 box-shadow'>
          <Link className='card-title' to={ '/product/'+ product.slug }>
            <div style={{ backgroundImage: 'url(' + this.determineImageUrl(product.thumbnail) + ')', ...styles.imageDiv }} ></div>
          </Link>
          <div className='card-body'>
            <Link className='card-title' to={ '/product/'+ product.slug }><h5>{ product.name }</h5></Link>
            <h5 className='card-title'>{ product.price } QAR</h5>
            <p className='card-text' style={ styles.descriptionStyle }>{ this.renderDescription(product.description) }</p>
            <div className='d-flex justify-content-between align-items-center'>
              <div className='btn-group'>
                <button type='button' className='btn btn-md btn-outline-secondary'
                  onClick={() => this.handleAddProductToCart(product, 1)}
                  disabled={addingProduct}>
                  Add to Cart
                </button>
              </div>
              <small className='text-muted'><Link to={ '/category/'+ product.subcategory.category.slug }> { product.subcategory.category.name } </Link> > { product.subcategory.name }</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (ProductCard);

const styles = {
  descriptionStyle: {
    height: 85,
    overflow: 'hidden'
  },
  imageDiv: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    height: '255px'
  }
};

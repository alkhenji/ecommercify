/* @flow */

import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux'

import { addProductToCart, updateProductDataInCart } from '../redux/actions/Cart';

import LoadingSpinner from '../components/LoadingSpinner';

import type { ProductType, CartProductType } from '../flowtypes';

type PropsType = {
  cartProducts: Array<CartProductType>,
  addingProduct: boolean,
  error: Object,
  addProductToCart: (product: ProductType, quantity: number) => {},
  updateProductDataInCart: (product: CartProductType, data: Object) => {}
};
type StateType = {
  product: ProductType | Object | null,
  loading: boolean
};

const mapStateToProps = state => ({
  cartProducts: state.cartProducts,
  addingProduct: state.addingProduct,
  error: state.error,
});

const mapDispatchToProps = dispatch => ({
  addProductToCart: (product, quantity) => dispatch(addProductToCart(product, quantity)),
  updateProductDataInCart: (product, data) => dispatch(updateProductDataInCart(product, data)),
});

class ProductPage extends React.Component<ProductType, StateType> {

  state: StateType = {
    product: {},
    loading: true,
  }

  componentDidMount() {
    var productSlug = this.props.match.params.slug;
    this.fetchProductDetails(productSlug);
  }

  fetchProductDetails(productSlug: string) {
    axios.get('/api-v1/products/'+ productSlug + '/').then(response => {
      this.setState({
        product: response.data,
        loading: false
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        product: null,
        loading: false
      });
    });
  }

  determineImageUrl(thumbnail: Object) {
    return thumbnail ? thumbnail.image : 'http://via.placeholder.com/500x500';
  }

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

  render() {
    const { product, loading } = this.state;
    const { addingProduct } = this.props;

    if (product == null) {
      return <h1>No such product.</h1>
    }

    return (
      <div style={styles.container} className='container'>
        { loading ? <LoadingSpinner /> : null }
        <div className='row featurette'>
          <div className='col-md-5 order-md-1'>
            <img className='featurette-image img-fluid mx-auto' src={ this.determineImageUrl(product.thumbnail) } data-holder-rendered='true' />
          </div>
          <div className='col-md-7 order-md-2'>
            <h2 className='featurette-heading'>{ product.name }</h2>
            <hr/>
            <p className='lead'>{ product.description }</p>
            <h5>{ product.price } QAR</h5>
            <br/>
            <button
              type='button'
              className='btn btn-lg btn-outline-secondary'
              onClick={ () => this.handleAddProductToCart(product, 1) }
              disabled={ product.quantity == 0 || addingProduct }>
                { product.quantity != 0 ? <span>Add to Cart</span> : <span>Out of Stock</span> }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    position: 'relative',
    minHeight: 300,
  }
};

export default connect(mapStateToProps, mapDispatchToProps) (ProductPage);

import React from 'react';
import axios from 'axios';

export default class ProductPage extends React.Component {

  state = {
    product: {},
  }

  componentDidMount() {
    var productSlug = this.props.match.params.slug;
    this.fetchProductDetails(productSlug);
  }

  fetchProductDetails(productSlug) {
    axios.get('/api-v1/products/'+ productSlug + '/').then(response => {
      this.setState({
        product: response.data
      });
    }).catch(error => {
      // console.error(error);
      this.setState({
        product: null
      });
    });
  }

  render() {
    const { product } = this.state;

    if (product == null) {
      return <h1>No such product.</h1>
    }

    else if (product) {
      return (
        <div>
          <h3>{ product.name }</h3>
          <h3>{ product.price }</h3>
          <h3>{ product.description }</h3>
        </div>
      );
    }
  }

}

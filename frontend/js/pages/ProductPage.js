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

    return (
      <div style={styles.container} className="container">
        <div className="row featurette">
          <div className="col-md-7 order-md-2">
            <h2 className="featurette-heading">{ product.name }</h2>
            <hr/>
            <p className="lead">{ product.description }</p>
            <h5>{ product.price } QAR</h5>
            <br/>
            <button type="button" className="btn btn-lg btn-outline-secondary">Add to Cart</button>
          </div>
          <div className="col-md-5 order-md-1">
            <img className="featurette-image img-fluid mx-auto" data-src="holder.js/500x500/auto" alt="500x500" src="http://via.placeholder.com/500x500" data-holder-rendered="true" />
          </div>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  container: {
    marginTop: 30,
    marginBottom: 30
  }
};

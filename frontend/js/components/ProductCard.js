import React from 'react';
import { Link } from 'react-router-dom';


export default class ProductCard extends React.Component {
  render() {
    const { product } = this.props;

    return (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow">
          <img className="card-img-top" src="http://via.placeholder.com/348x255" alt="Card image cap" />
          <div className="card-body">
            <Link className="card-title" to={ '/product/'+ product.slug }><h5>{ product.name }</h5></Link>
            <h5 className="card-title">{ product.price } QAR</h5>
            <p className="card-text">{ product.description }</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-md btn-outline-secondary">Add to Cart</button>
              </div>
              <small className="text-muted">{ product.subcategory.category.name } > { product.subcategory.name }</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

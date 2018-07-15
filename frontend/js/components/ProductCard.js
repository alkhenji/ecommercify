/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';

import type { ProductType } from '../flowtypes';

type PropsType = {
  product: ProductType,
};
type StateType = {};

export default class ProductCard extends React.Component<PropsType, StateType> {

  renderDescription(desc: string) {
    if (desc.length > 125) {
      return desc.substring(0, 125) + "..."
    }
    return desc
  }

  render() {
    const { product } = this.props;

    return (
      <div className="col-md-4">
        <div className="card mb-4 box-shadow">
          <img className="card-img-top" src="http://via.placeholder.com/348x255" alt="Card image cap" />
          <div className="card-body">
            <Link className="card-title" to={ '/product/'+ product.slug }><h5>{ product.name }</h5></Link>
            <h5 className="card-title">{ product.price } QAR</h5>
            <p className="card-text" style={ styles.descriptionStyle }>{ this.renderDescription(product.description) }</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-md btn-outline-secondary">Add to Cart</button>
              </div>
              <small className="text-muted"><Link to={ '/category/'+ product.subcategory.category.slug }> { product.subcategory.category.name } </Link> > { product.subcategory.name }</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const styles = {
  descriptionStyle: {
    height: 85
  }
};

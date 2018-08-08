/* @flow */

import React from 'react';

import { Link } from 'react-router-dom';

import type { CategoryWithSubcategoriesType, StoreType } from '../flowtypes';

type PropsType = {
  category: CategoryWithSubcategoriesType,
  stores: Array<StoreType>
};
type StateType = {};

export default class CategoriesBarMenu extends React.Component<PropsType, StateType> {

  renderSubcategories() {
    const { category } = this.props;

    return (
      category.subcategories.map(subcat =>
        <Link key={subcat.slug} className='list-group-item' to={ '/category/' + category.slug + '/' + subcat.slug + '/' } >{ subcat.name }</Link>
      )
    );
  }

  renderTopBrandsRow(currentRow: Array<StoreType>, index: number) {
    return (
      <React.Fragment key={'top-brands-'+index}>
        <div className='row'>
          {
            currentRow.map(store =>
              <Link to={'/store/' + store.slug} className='col-sm-4' key={ store.slug }>
                <div className='img-thumbnail' style={{ backgroundImage: 'url(' +  store.image + ')', ...styles.imageDiv }}></div>
              </Link>
            )
          }
        </div>
        <br/>
      </React.Fragment>
    );
  }

  renderTopBrands() {
    const { stores } = this.props;

    var topBrands = [];

    /* render 3x3 grid of stores */
    var currentRow = [];
    for(var i = 0; i < stores.length; i++) {
      if (i % 3 != 0) {
        /* can still fit in row */
        currentRow.push(stores[i]);
      }
      else {
        if (i == 0) {
          /* first store add to row */
          currentRow.push(stores[i]);
        }
        else {
          /* we maxed out row, we should render and start a new one */
          topBrands.push(this.renderTopBrandsRow(currentRow, i));
          currentRow = [];
          currentRow.push(stores[i]);
        }
      }
    }

    if (currentRow.length > 0) {
      /* render remaining stores in row if any */
      topBrands.push(this.renderTopBrandsRow(currentRow, currentRow.length));
      currentRow = [];
    }

    return topBrands;
  }

  render() {
    const { category } = this.props;

    return (
      <div className='container-fluid' style={{ ...styles.menuFixedDiv }}>
        <div className='container' style={ styles.menuDiv }>
          <br/>
          <div className='row'>
            <div className='col-md-3'>
              <h5>Subcategories</h5>
              <ul className='list-group'>
                { this.renderSubcategories() }
              </ul>
            </div>
            <div className='col-md-4'>
              <h5>Top Brands</h5>
              { this.renderTopBrands() }
            </div>
            <div className='col-md-5'>
              <h5>Some images</h5>
            </div>
          </div>
          <br/>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  menuFixedDiv: {
    position: 'fixed',
    zIndex: '3',
    top: '96px', /* position menu top right at the end of category navbar */
  },
  menuDiv: {
    backgroundColor: '#ffffff',
  },
  imageDiv: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    height: '80px'
  }
};

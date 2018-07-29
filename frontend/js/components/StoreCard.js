/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import type { StoreType } from '../flowtypes';

type PropsType = {
  store: StoreType,
};
type StateType = {};

export default class StoreCard extends React.Component<PropsType, StateType> {

  determineImageUrl(image: string) {
    return image.length > 0 ? image : 'http://via.placeholder.com/348x245';
  }

  render() {
    const { store } = this.props;

    return (
      <div className="col-md-4" key={store.slug}>
        <Link className="card-title" to={"/store/" + store.slug}>
        <div className="card mb-4 box-shadow">
          <div style={{ backgroundImage: 'url(' +  this.determineImageUrl(store.image) + ')', ...styles.imageDiv }} ></div>
          <div className="card-body">
            <h5>{ store.name }</h5>
          </div>
        </div>
        </Link>
      </div>
    );
  }
}

const styles: Object = {
  imageDiv: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: '50% 50%',
    height: '200px'
  }
};


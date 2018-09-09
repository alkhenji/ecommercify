/* @flow */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import type { StoreType } from '../flowtypes';

import StoreCard from './StoreCard';
import LoadingSpinner from '../components/LoadingSpinner';

type PropsType = {};
type StateType = {
  stores: Array<StoreType>,
  loading: boolean
};

export default class ShopByStores extends React.Component<PropsType, StateType> {

  state: StateType = {
    stores: [],
    loading: true
  };

  componentDidMount() {
    this.fetchAllStores();
  }

  fetchAllStores() {
    axios.get('/api-v1/stores/').then(response => {
      this.setState({
        stores: response.data,
        loading: false
      });
    }).catch(error => {
      console.error(error);
      this.setState({
        loading: false
      });
    });
  }

  listStores() {
    const { stores } = this.state;
    return stores.map(store => <StoreCard key={store.slug} store={store} />);
  }

  render() {
    const { stores, loading } = this.state;

    return (
      <div style={styles.container} className="bg-light">
        <div className="container">
          <h3 style={styles.header}>Shop by Store</h3>
          <div className="row justify-content-center" style={ styles.mainRowStyle }>
            { loading ? <LoadingSpinner /> : null }
            { this.listStores() }
          </div>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  container: {
    paddingTop: 20,
    paddingBottom: 20,
    minHeight: 200,
  },
  header: {
    textAlign: 'center'
  },
  storeCard: {
    margin: 10
  },
  mainRowStyle: {
    position: 'relative'
  }
};

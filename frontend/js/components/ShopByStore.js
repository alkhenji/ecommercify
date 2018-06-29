import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import type { StoreType } from '../flowtypes';

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

  renderStoreCard(store: StoreType): HTMLDivElement {
    console.log(store.image);
    return (
      <Link style={styles.storeCard} key={store.slug} to={"/store/" + store.slug}>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{store.name}</h5>
          </div>
        </div>
      </Link>
    );
  }

  render() {
    const { stores, loading } = this.state;

    if (loading) {
      return <h1>Loading stores...</h1>;
    }

    return (
      <div style={styles.container} className="bg-light">
        <div className="container">
          <h3 style={styles.header}>Shop by Store</h3>
          <div className="row justify-content-center">
            {stores.map(this.renderStoreCard.bind(this))}
          </div>
        </div>
      </div>
    );
  }
}

const styles: Object = {
  container: {
    paddingTop: 20,
    paddingBottom: 20
  },
  header: {
    textAlign: 'center'
  },
  storeCard: {
    margin: 10
  }
};

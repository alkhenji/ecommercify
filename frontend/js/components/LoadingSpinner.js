/* @flow */

import React from 'react';
import loader from '../../assets/loader4.gif';

type PropsType = {};
type StateType = {};

export default class LoadingSpinner extends React.Component<PropsType, StateType> {

  render() {
    return (
      <div style={ styles.overlayDiv }>
        <img style={ styles.loader } src={ loader } alt='loading...' />
      </div>
    )
  }
}

const styles: Object = {
  overlayDiv: {
    position: 'absolute', /* Sit on top of the page content */
    width: '100%', /* Full width (cover the whole page) */
    height: '100%', /* Full height (cover the whole page) */
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', /* Black background with opacity */
    zIndex: 2, /* Specify a stack order in case you're using a different order for other elements */
    cursor: 'pointer', /* Add a pointer on hover */
  },
  loader: {
    width: '75px',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    margin: 'auto',
  }
};

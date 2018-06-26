import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className='footer' style={styles.footerStyle}>
        <div className='container'>
          <span className='text-muted'>2018 E-Commercify. All Rights Reserved.</span>
        </div>
      </footer>
    );
  }
}


const styles = {
  footerStyle: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60px',
    lineHeight: '60px',
    backgroundColor: '#f5f5f5',
  }
}

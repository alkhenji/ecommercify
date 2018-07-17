/* @flow */

import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

const SignUpAndSignInApp = ({ match }) => {
  console.log('SignUpAndSignInApp');
  console.log(match);

  return (
    <React.Fragment>
      <Route exact path={match.url + '/signup'} component={SignUpPage} />
      <Route exact path={match.url + '/signin'} component={SignInPage} />
    </React.Fragment>
  );
};

export default SignUpAndSignInApp;

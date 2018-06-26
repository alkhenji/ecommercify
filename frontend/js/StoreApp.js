import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';

export default class StoreApp extends React.Component {
    render() {
        return (
            <HomePage />
        );
    }
}

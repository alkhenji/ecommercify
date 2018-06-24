import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';

export default class StoreApp extends React.Component {
    render() {
        return (
            <div>
                <NavBar />
                <HomePage />
                <Footer />
            </div>
        );
    }
}

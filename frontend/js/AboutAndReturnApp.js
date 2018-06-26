import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import AboutPage from './pages/AboutPage';

export default class AboutAndReturnApp extends React.Component {
    render() {
        return (
            <div>
                <AboutPage />
            </div>
        );
    }
}

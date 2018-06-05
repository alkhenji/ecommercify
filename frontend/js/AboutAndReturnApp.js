import React from 'react';

export default class AboutAndReturnApp extends React.Component {
    render() {
        const { name } = this.props
        return (
            <h1>THIS IS ABOUT AND RETURN APP: { name }</h1>
        );
    }
}

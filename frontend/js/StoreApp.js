import React from 'react';

export default class StoreApp extends React.Component {
    render() {
        const { name } = this.props;
        return (
            <h1>THIS IS STORE APP: { name }</h1>
        );
    }
}

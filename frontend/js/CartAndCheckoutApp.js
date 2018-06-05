import React from 'react';

export default class CartAndCheckoutApp extends React.Component {
    render() {
        const { name } = this.props;
        return (
            <h1>THIS IS CART AND CHECKOUT APP: { name }</h1>
        );
    }
}

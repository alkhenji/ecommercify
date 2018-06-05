import React, { Component } from 'react';

/* A function that returns a component that is loaded asynchronously
 * Evertime importComponentLoader is called, React will try to import
 * the component and download a `[chunk].js` file containing that component
*/
const AsyncComponent = (importComponentLoader, collection) => {
    return class extends Component {

        state = {
            component: null
        }

        componentDidMount() {
            importComponentLoader().then(cmp => {
                this.setState({component: cmp})
            });
        }

        render() {
            return this.state.component ? <this.state.component { ...this.props } {...collection} /> : null;
        }
    }
}

export default AsyncComponent;

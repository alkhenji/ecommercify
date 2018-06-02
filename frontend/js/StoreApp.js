import * as React from 'react';
import ReactDOM from 'react-dom';

let reactAppElement = document.getElementById("react-app");

const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;

ReactDOM.render((
    <h1>We gots the react...</h1>
), reactAppElement);

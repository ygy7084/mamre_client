// import Promise from 'promise-polyfill';
// if (!window.Promise) {
//     window.Promise = Promise;
// } // Promise explorer 호환
// import 'whatwg-fetch'; // fetch explorer 호환

import es6_promise from 'es6-promise';
es6_promise.polyfill();

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './containers';


const rootElement = document.getElementById('root');

const render = (Component) => {
    ReactDOM.render(
            <Component/>
        , rootElement);
};

render(App);

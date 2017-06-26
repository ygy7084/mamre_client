// import Promise from 'promise-polyfill';
// if (!window.Promise) {
//     window.Promise = Promise;
// } // Promise explorer 호환
// import 'whatwg-fetch'; // fetch explorer 호환

import es6_promise from 'es6-promise';
es6_promise.polyfill();
import 'isomorphic-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './containers';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';

const store = createStore(reducers, applyMiddleware(thunk));

const rootElement = document.getElementById('root');

const render = (Component) => {
    ReactDOM.render(
        <Provider store = {store}>
            <Component/>
        </Provider>
        , rootElement);
};

render(App);

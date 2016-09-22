import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

const logger = createLogger();

export default class BindReact extends Component {
    render() {
        
        const {
            reducers,
            Module
        } = this.props;

        const store = createStore(combineReducers(reducers), compose(
            applyMiddleware(thunk, logger),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        ));

        return (
            <Provider store={store}>
                <Module />
            </Provider>
        );
    }
}
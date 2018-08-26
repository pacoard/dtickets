import { Provider } from 'react-redux';
import reducers from './../reducers/reducers';
import { createStore } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './App';

const initialState = {
        ticketContract: '',
        web3: null
    };

export default class ReduxProvider extends React.Component {
    constructor(props) {
        super(props);
        this.initialState = initialState;
        this.store = this.configureStore();
    }
    render() {
        return (
          <AppContainer>
           <Provider store={ this.store }>
            <div style={{ height: '100%' }}>
            <App store={ this.store } />
            </div>
            </Provider>
          </AppContainer>
        );
    }
    configureStore() {
        const store = createStore(reducers, this.initialState);
        if (module.hot) {
            module.hot.accept('./../reducers/reducers', () => {
                const nextRootReducer = require('./../reducers/reducers').default;
                store.replaceReducer(nextRootReducer);
            });
        }
        return store;
    }
}
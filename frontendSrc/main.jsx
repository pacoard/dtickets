// React
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './components/App'
// Redux
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/reducers'; 
import INITIAL_STATE from './constants/constants'


// Redux wrapper component for the React application
class ReduxProvider extends React.Component {
	constructor(props) {
		super(props);
		this.initialState = INITIAL_STATE;
		this.store = this.configureStore();
	}
	
	configureStore() {
		const store = createStore(reducers, this.initialState);
		if (module.hot) {
			module.hot.accept('./reducers/reducers', () => {
				const nextRootReducer = require('./reducers/reducers').default;
				store.replaceReducer(nextRootReducer);
			});
		}
		return store;
	}

	render() {
		return (
            <AppContainer>
                <Provider store={ this.store }>
                    <App />
                </Provider>
            </AppContainer>
		);
	} // style={{ height: '100%' }}
}


// Render application
ReactDOM.render( <ReduxProvider />, document.getElementById('root'));


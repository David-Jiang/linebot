import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import itemApp from './reducer';
import MyComponent from './MyComponent';

const store = createStore(itemApp);

ReactDOM.render(
	<Provider store={store}>
		<MyComponent />
	</Provider>,
	document.getElementById('app'));
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducer';
import Layout from './component/Layout';
import Home from './component/Home';
import First from './component/First';
import Second from './component/Second';
import Third from './component/Third';

const store = createStore(reducer);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={Layout}>
				<IndexRoute component={Home} />
				<Route path="first" component={First} />
				<Route path="second" component={Second} />
				<Route path="third" component={Third} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('app'));
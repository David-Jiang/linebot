import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducer';
import Layout from './component/Layout';
import Home from './component/Home';
import First from './component/First';
import StockList from './component/StockList';
import StockPrice from './component/StockPrice';

const store = createStore(reducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={Layout}>
				<IndexRoute component={Home} />
				<Route path="first" component={First} />
				<Route path="stockList" component={StockList} />
				<Route path="stockPrice" component={StockPrice} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('app'));
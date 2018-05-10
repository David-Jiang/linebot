import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import reducer from './reducer';
import App from './component/App';
import State from './component/State';
import Foo from './component/Foo';
import Bar from './component/Bar';
import MyComponent from './component/MyComponent';

const store = createStore(reducer);
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Provider store={store}>
		<Router history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Foo} />
				<Route path="state" component={State} />
				<Route path="bar" component={Bar} />
				<Route path="myComponent" component={MyComponent} />
			</Route>
		</Router>
	</Provider>,
	document.getElementById('app'));
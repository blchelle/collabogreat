import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Loading from './pages/Loading/Loading.page';
import App from './App';

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={<Loading />} persistor={persistor}>
			<CssBaseline>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</CssBaseline>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import theme from './theme';
import Loading from './pages/Loading/Loading.page';
import App from './App';

ReactDOM.render(
	<Provider store={store}>
		<PersistGate loading={<Loading />} persistor={persistor}>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</CssBaseline>
			</ThemeProvider>
		</PersistGate>
	</Provider>,
	document.getElementById('root')
);

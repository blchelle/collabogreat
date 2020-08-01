import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from './theme';
import App from './App';

ReactDOM.render(
	<ThemeProvider theme={theme}>
		<CssBaseline>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</CssBaseline>
	</ThemeProvider>,
	document.getElementById('root')
);

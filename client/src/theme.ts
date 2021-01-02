import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#21bf54',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#373FBF',
			contrastText: '#ffffff',
		},
		warning: {
			main: '#ffd11f',
		},
		error: {
			main: '#e81410',
		},
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 480,
			md: 700,
			lg: 1000,
			xl: 1200,
		},
	},
});

export default theme;

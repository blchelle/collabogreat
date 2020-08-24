import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: '#65f383',
			main: '#21bf54',
			dark: '#008d26',
			contrastText: '#fff',
		},
		secondary: {
			light: '#373fbf',
			main: '#726af3',
			dark: '#00188e',
			contrastText: '#fff',
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

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
});

export default theme;

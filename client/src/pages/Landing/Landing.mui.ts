import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		landing: {
			minHeight: '100vh',
			height: 'auto',
			width: '100%',
			background: `linear-gradient(to right bottom, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
		},
		appBar: {
			boxShadow: 'none',
		},
		teamSvg: {
			width: '100%',
			height: 'auto',
		},
	};
});

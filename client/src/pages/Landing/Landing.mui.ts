import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		landing: {
			minHeight: '100vh',
			height: 'auto',
			width: '100%',
			background: `linear-gradient(to right bottom, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
		},
		container: {
			position: 'fixed',
			left: '50%',
			top: '50%',
			transform: 'translate(-50%, -50%)',
		},
		appBar: {
			boxShadow: 'none',
		},
		teamSvg: {
			width: '100%',
			height: 'auto',
		},
		teamSvgMobile: {
			width: '100%',
			height: '300px',
		},
	};
});

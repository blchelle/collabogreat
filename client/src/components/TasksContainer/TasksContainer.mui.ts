import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		noTasksSVG: {
			marginTop: theme.spacing(4),
			marginBottom: theme.spacing(4),
			width: '40%',
			height: 'auto',
		},

		noTasksSVGMobile: {
			marginTop: theme.spacing(4),
			marginBottom: theme.spacing(4),
			width: '80%',
			height: '300px',
		},
	};
});

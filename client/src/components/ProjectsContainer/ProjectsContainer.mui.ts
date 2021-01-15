import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		header: {
			alignSelf: 'stretch',
		},
		noProjectsSVG: {
			width: '60%',
			height: 'auto',
			marginTop: theme.spacing(4),
			marginBottom: theme.spacing(4),
		},
		noProjectsSVGMobile: {
			width: '90%',
			height: '200px',
			marginTop: theme.spacing(4),
			marginBottom: theme.spacing(4),
		},
	};
});

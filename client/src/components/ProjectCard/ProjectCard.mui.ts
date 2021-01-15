import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		container: {
			height: '100%',
		},
		cardHead: {
			marginBottom: theme.spacing(1),
		},
		cardDescription: {
			marginBottom: theme.spacing(2),
		},
		cardButtons: {
			marginTop: 'auto',
			alignSelf: 'flex-end',
		},
	};
});

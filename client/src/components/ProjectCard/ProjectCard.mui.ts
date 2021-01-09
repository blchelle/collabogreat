import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		container: {
			height: '100%',
		},
		cardButtons: {
			marginTop: theme.spacing(1),
			alignSelf: 'flex-end',
		},
	};
});

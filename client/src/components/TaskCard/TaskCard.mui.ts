import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		container: {
			height: '100%',
		},
		cardDescription: {
			marginBottom: theme.spacing(2),
		},
		cardStatus: {
			marginBottom: theme.spacing(2),
		},
		cardProject: {
			marginTop: 'auto',
		},
		assigneeAvatar: {
			marginRight: theme.spacing(2),
			height: theme.spacing(4),
			width: theme.spacing(4),
		},
	};
});

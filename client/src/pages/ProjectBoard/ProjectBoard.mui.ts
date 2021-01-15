import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		addStageButton: {
			height: 50,
			width: 270,
		},
		addStageForm: {
			padding: theme.spacing(1),
			backgroundColor: theme.palette.background.paper,
			height: 100,
			width: 270,
		},
	};
});

import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => {
	return {
		addMemberButton: {
			backgroundColor: theme.palette.primary.main,
			fill: theme.palette.common.white,
		},
		invitationSentCard: {
			backgroundColor: theme.palette.primary.light,
		},
	};
});

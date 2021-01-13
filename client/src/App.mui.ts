import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => {
	return {
		app: {
			width: '100vw',
			height: '100vh',
			display: 'flex',
			borderRadius: 0,
			flexDirection: 'column',
			position: 'relative',
			boxSizing: 'content-box',
			overflowX: 'hidden',
		},
	};
});

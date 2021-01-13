import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => {
	return {
		app: {
			width: '100vw',
			height: '100vh',
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			boxSizing: 'content-box',
			overflowX: 'hidden',
		},
	};
});

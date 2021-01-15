/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Avatar, AvatarProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface ColoredAvaterProps extends AvatarProps {
	id?: string;
	text: string;
}

const useStyles = makeStyles((theme) => {
	return {
		green: {
			color: theme.palette.primary.contrastText,
			backgroundColor: theme.palette.primary.main,
		},
		blue: {
			color: theme.palette.secondary.contrastText,
			backgroundColor: theme.palette.secondary.main,
		},
		yellow: {
			color: theme.palette.warning.contrastText,
			backgroundColor: theme.palette.warning.main,
		},
		red: {
			color: theme.palette.error.contrastText,
			backgroundColor: theme.palette.error.main,
		},
		grey: {
			color: theme.palette.grey[500],
			backgroundColor: theme.palette.getContrastText(theme.palette.grey[500]),
		},
	};
});

const ColoredAvatar: React.FC<ColoredAvaterProps> = (props) => {
	// MUI
	const classes = useStyles();

	const generateColor = () => {
		if (props.id) {
			const hashCode = Math.floor(parseInt(props.id[props.id.length - 1], 16) / 4);
			if (hashCode === 0) return classes.green;
			if (hashCode === 1) return classes.blue;
			if (hashCode === 2) return classes.yellow;
			return classes.red;
		}

		return classes.grey;
	};

	return (
		<Avatar {...props} className={generateColor()}>
			{props.text[0]}
		</Avatar>
	);
};

export default ColoredAvatar;

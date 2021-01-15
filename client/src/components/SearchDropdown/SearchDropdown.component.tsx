import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Card, Divider, List, MenuItem, Typography, useTheme } from '@material-ui/core';

import { ProjectSearchResult, TaskSearchResult } from '../CGAppBar/CGAppBar.component';
import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { closeModal } from '../../redux/modals/modals.actions';
import { ModalNames } from '../../redux/modals/modals.reducer';
import { RootState } from '../../redux/root.reducer';

const SearchDropdown = () => {
	// MUI
	const theme = useTheme();

	// React Router
	const history = useHistory();

	// Redux
	const results = useSelector((state: RootState) => state.modals.SEARCH_DROPDOWN.extra) as (
		| ProjectSearchResult
		| TaskSearchResult
	)[];
	const dispatch = useDispatch();

	const projectResults = results.filter(({ type }) => type === 'project') as ProjectSearchResult[];
	const taskResults = results.filter(({ type }) => type === 'task') as TaskSearchResult[];

	if (results.length > 0) {
		return (
			<List style={{ minWidth: 400 }}>
				{projectResults.length > 0 ? (
					<>
						<Typography>Projects</Typography>
						<Divider />
						{projectResults.map((result) => (
							<MenuItem
								onClick={() => {
									dispatch(closeModal(ModalNames.SEARCH_DROPDOWN));
									history.push(`/projects/${result._id}`);
								}}
							>
								<ColoredAvatar
									id={result._id}
									text={result.title}
									src={result.image}
									variant='rounded'
									style={{
										width: theme.spacing(4),
										height: theme.spacing(4),
										marginRight: theme.spacing(2),
									}}
								/>
								<Typography>{result.title}</Typography>
							</MenuItem>
						))}
					</>
				) : null}
				{taskResults.length > 0 ? (
					<>
						<Typography style={{ marginTop: theme.spacing(2) }}>Tasks</Typography>
						<Divider />
						{taskResults.map((result) => (
							<MenuItem
								onClick={() => {
									dispatch(closeModal(ModalNames.SEARCH_DROPDOWN));
									history.push(`/projects/${result.projectId}/board`);
								}}
							>
								<Card
									style={{
										width: theme.spacing(3),
										height: theme.spacing(3),
										backgroundColor: result.color,
										marginRight: theme.spacing(2),
									}}
									elevation={0}
								/>
								<Typography>{result.title}</Typography>
							</MenuItem>
						))}
					</>
				) : null}
			</List>
		);
	}

	return <Typography style={{ minWidth: 400 }}>No Search Results Found...</Typography>;
};

export default SearchDropdown;

import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, List, MenuItem, Typography } from '@material-ui/core';

import { SearchResult } from '../CGAppBar/CGAppBar.component';
import ColoredAvatar from '../ColoredAvatar/ColoredAvatar.component';
import { RootState } from '../../redux/root.reducer';
import theme from '../../theme';

const SearchDropdown = () => {
	const results = useSelector(
		(state: RootState) => state.modals.SEARCH_DROPDOWN.extra
	) as SearchResult[];

	const projectResults = results.filter(({ type }) => type === 'project');
	const taskResults = results.filter(({ type }) => type === 'task');

	if (results.length > 0) {
		return (
			<List style={{ minWidth: 400 }}>
				{projectResults.length > 0 ? (
					<>
						<Typography>Projects</Typography>
						<Divider />
						{projectResults.map((result) => (
							<MenuItem>
								<ColoredAvatar
									id={result._id}
									text={result.title}
									src={result.image}
									variant='rounded'
									style={{
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
							<MenuItem>
								<ColoredAvatar
									id={result._id}
									text={result.title}
									src={result.image}
									variant='rounded'
									style={{
										marginRight: theme.spacing(2),
									}}
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

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { Avatar, List, ListItem, Typography } from '@material-ui/core';

interface ProjectMember {
	displayName: string;
	image: string;
	_id: string;
}

interface Project {
	title: string;
	members: ProjectMember[];
}

interface ProjectHubProps {}

const ProjectHub: React.FC<ProjectHubProps> = () => {
	const { id } = useParams();
	const [project, setProject] = useState<Project | null>(null);

	const fetchProject = async () => {
		const res = await axios(`http://localhost:8000/api/v0/projects/${id}`, {
			method: 'GET',
			withCredentials: true,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Credentials': true,
			},
		});

		setProject(res.data.project);
	};

	useEffect(() => {
		fetchProject();
	}, []);

	return (
		<>
			<Typography variant='h4'>{project?.title}</Typography>
			<List>
				{project?.members.map((member) => (
					<ListItem button component='a' href='/me'>
						<Avatar src={member.image} alt={member.displayName} />
						<Typography variant='h6'>{member.displayName}</Typography>
					</ListItem>
				))}
			</List>
		</>
	);
};

export default ProjectHub;

import React from 'react';

import CGLoadingSpinner from '../../components/CGLoadingSpinner/CGLoadingSpinner.component';
import './Loading.styles.css';

const Loading: React.FC = () => {
	return (
		<div id='loading-page'>
			<CGLoadingSpinner size={128} />
		</div>
	);
};

export default Loading;

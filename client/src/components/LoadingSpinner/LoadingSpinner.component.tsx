import React from 'react';
import { ReactComponent as CollaboGreatLogo } from '../../assets/logo-icon-circular.svg';
import './LoadingSpinner.component.css';

const LoadingSpinner = () => {
	return (
		<>
			<CollaboGreatLogo className='loading-spinner' />
		</>
	);
};

export default LoadingSpinner;

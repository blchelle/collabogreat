import React from 'react';
import { ReactComponent as CollaboGreatLogo } from '../../assets/logo-icon-circular.svg';
import './LoadingSpinner.component.css';

const LoadingSpinner = () => {
	return (
		<div className='loading-spinner'>
			<CollaboGreatLogo />
		</div>
	);
};

export default LoadingSpinner;

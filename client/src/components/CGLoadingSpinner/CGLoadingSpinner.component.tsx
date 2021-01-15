import React from 'react';
import { ReactComponent as CollaboGreatLogo } from '../../assets/logo-animated.svg';
import './CGLoadingSpinner.styles.css';

interface CGLoadingSpinnerProps {
	size: number;
}

const CGLoadingSpinner: React.FC<CGLoadingSpinnerProps> = ({ size }) => {
	return (
		<>
			<CollaboGreatLogo style={{ width: `${size}px`, height: `${size}px` }} />
		</>
	);
};

export default CGLoadingSpinner;

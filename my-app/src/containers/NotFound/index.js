import React from 'react';
import { Link } from 'react-router-dom';

// Components
import Header from '../../components/Header';

// Styles
import './style.css';

const NotFound = () => (
	<div className="app-container component-home">
		<div className="page">
			<Header />

			<div className="home-inner">
				<div className="NotFound-title">404</div>
				<Link to="/practitioners" className="home-link">
					Return to list
				</Link>
			</div>
		</div>
	</div>
);

export default NotFound;

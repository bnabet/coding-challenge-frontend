import React from 'react';
import { NavLink } from 'react-router-dom';

// Components
import Navigation from '../Navigation';

// Styles
import './style.css';

const Header = () => (
	<header className="component-header">
		<Navigation />

		<div className="header-profile">
			<a
				href="https://github.com/bnabet/coding-challenge-frontend"
				target="_blank"
				rel="noopener noreferrer"
				title="Go to the Github project - new window"
				className="btn btn--github">
				Benjamin Nabet
				<i className="icon icon--right icon--github"></i>
			</a>
		</div>
	</header>
);

export default Header;

import React from 'react';
import { NavLink } from 'react-router-dom';

// Components
import Navigation from '../Navigation';

// Styles
import './style.css';

const Header = () => (
	<header className="component-header">
		<NavLink to="/" className="header-title link--default">
			<h1>Leah</h1>
		</NavLink>

		<Navigation />

		<div className="header-profile">
			<a
				href="https://github.com/bnabet/coding-challenge-frontend"
				target="_blank"
				rel="noopener noreferrer"
				title="Go to the Github project - new window"
				className="profile-link link--default">
				Benjamin Nabet
			</a>
		</div>
	</header>
);

export default Header;

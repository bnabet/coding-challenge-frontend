import React from 'react';
import { Link } from 'react-router-dom';

// Components
import Header from '../../components/Header';

// Styles
import './style.css';

const Home = () => (
	<div className="app-container component-home">
		<div className="page">
			<Header />

			<div className="home-inner">
				<div className="home-icon"></div>
				<Link to="/practitioners" className="home-link">
					Search a doctor
				</Link>
			</div>
		</div>
	</div>
);

export default Home;

import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams } from 'react-router-dom';

const Home = props => (
	<div>
		Hello Leah ! <Link to="/practitioners">List of practitioners</Link>
	</div>
);

export default Home;

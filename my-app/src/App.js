import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Components
import Home from './containers/Home';
import List from './containers/List';
import Practitioner from './containers/Practitioner';
import NotFound from './containers/NotFound';

// Styles
import './App.css';
import './reset.css';

const App = () => (
	<div className="App">
		<Router basename="/">
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/practitioners" component={List} />
				<Route path="/practitioners/:practitionerId" component={Practitioner} />
				<Route component={NotFound} />
			</Switch>
		</Router>
	</div>
);

export default App;

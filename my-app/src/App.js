import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Components
import Home from './containers/Home';
import List from './containers/List';
import Practitioner from './containers/Practitioner';

// Styles
import './App.css';
import './reset.css';

const App = () => (
	<div className="App">
		<Router>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/practitioners" component={List} />
				<Route path="/practitioners/:practitionerId" component={Practitioner} />
			</Switch>
		</Router>
	</div>
);

export default App;

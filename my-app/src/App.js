import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Components
import Home from './containers/Home';
import List from './containers/List';
import Practitioner from './containers/Practitioner';

// Styles
import './App.css';

class App extends React.Component {
	render() {
		return (
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
	}
}

export default App;

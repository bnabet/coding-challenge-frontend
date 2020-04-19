import React from 'react';

// Components
import List from './components/List';

// Styles
import './App.css';

class App extends React.Component {
	state = {
		practitioners: [],
	};

	componentDidMount() {
		fetch('http://hapi.fhir.org/baseDstu3/Practitioner?_format=json')
			.then(response => response.json())
			.then(data => {
				// Verify if name exists
				const practitioners = data.entry.filter(contact => contact.resource.name);

				this.setState({ practitioners: practitioners });
			})
			.catch(console.log);
	}

	render() {
		const { practitioners } = this.state;

		return (
			<div className="App">
				<List practitioners={practitioners} />
			</div>
		);
	}
}

export default App;

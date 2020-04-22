import React from 'react';

// Components
import Card from '../../components/Card';

class List extends React.Component {
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

		const distinctNames = practitioners => {
			let MAP = [];
			let uniqueNames = [];

			// Distinct names
			practitioners.map(item => {
				const familyName = item.resource.name[item.resource.name.length - 1].family
					? item.resource.name[item.resource.name.length - 1].family.split(' ').pop()
					: item.resource.name[item.resource.name.length - 1]._family.extension
						.map(item => item.valueString)
						.join(' ');

				if (MAP.indexOf(familyName) === -1) {
					MAP.push(familyName);
					uniqueNames.push(item);
				}
			});

			return uniqueNames;
		};

		return distinctNames(practitioners).map(item => <Card key={item.resource.id} practitioner={item} />);
	}
}

export default List;

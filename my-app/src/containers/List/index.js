import React from 'react';

// Components
import Card from '../../components/Card';

const defaultUrl = 'http://hapi.fhir.org/baseDstu3/Practitioner?_format=json';

class List extends React.Component {
	state = {
		practitioners: [],
		searchId: null,
		link: []
	};

	fetchList = (url) => {
		fetch(url ? url : defaultUrl)
			.then(response => response.json())
			.then(data => {
				// Verify if name exists
				const practitioners = data.entry.filter(contact => contact.resource.name);

				this.setState({
					practitioners: practitioners,
					searchId: data.id,
					link: data.link
				});

			})
			.catch(error => {
				console.error(error);
			});
	}

	componentDidMount() {
		this.fetchList();
	}

	render() {
		const { link, practitioners } = this.state;

		const distinctNames = practitioners => {
			let MAP = [];
			let uniqueNames = [];

			// Distinct names
			practitioners.length && practitioners.map(item => {
				const familyName = item.resource.name[item.resource.name.length - 1].family
					? item.resource.name[item.resource.name.length - 1].family
					: item.resource.name[item.resource.name.length - 1]._family
						? item.resource.name[item.resource.name.length - 1]._family.extension.map(item => item.valueString).join(' ')
						: '';

				if (MAP.indexOf(familyName) === -1) {
					MAP.push(familyName);
					uniqueNames.push(item);
				}
			});

			return uniqueNames;
		};

		console.log(distinctNames(practitioners))

		return (
			<div>
				{practitioners.length > 0 && distinctNames(practitioners).map(item => <Card key={item.resource.id} practitioner={item} />)}

				{link.length
					&& link[2]
					&& link[2].relation === 'previous'
					&& <button onClick={() => this.fetchList(link[2].url)}>PREV</button>
				}

				{link.length
					&& link[1]
					&& link[1].relation === 'next'
					&& <button onClick={() => this.fetchList(link[1].url)}>NEXT</button>
				}
			</div>
		);
	}
}

export default List;

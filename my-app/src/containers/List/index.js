import React from 'react';

// Components
import Card from '../../components/Card';

const defaultUrl = 'http://hapi.fhir.org/baseDstu3/Practitioner?_format=json';

class List extends React.Component {
	state = {
		practitioners: [],
		link: [],
		searchId: null,
		query: '',
		totalResults: null
	};

	handleChange = (event) => {
		this.setState({ query: event.target.value })
	}

	handleSubmit(event, given) {
		const searchUrl = `http://hapi.fhir.org/baseDstu3/Practitioner?given=${given}&_format=json&_pretty=true`
		this.fetchList(searchUrl);

		event.preventDefault();
	}

	distinctNames = practitioners => {
		let MAP = [];
		let uniqueNames = [];

		// Distinct names
		practitioners.length && practitioners.map(item => {
			const familyName = item.resource.name[item.resource.name.length - 1].family
				? item.resource.name[item.resource.name.length - 1].family.split(' ').pop()
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

	fetchList = (url) => {
		fetch(url ? url : defaultUrl)
			.then(response => response.json())
			.then(data => {
				// Verify if name exists
				let practitioners = data.entry.filter(contact => contact.resource.name);
				// Remove duplicates
				practitioners = this.distinctNames(practitioners);

				this.setState({
					practitioners: practitioners,
					link: data.link,
					searchId: data.id,
					totalResults: data.total ? practitioners.length : null
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
		const { practitioners, link, query, totalResults } = this.state;

		return (
			<div>
				<form onSubmit={event => this.handleSubmit(event, query)}>
					<label>Search a practitioner:</label>
					<input
						type="search"
						name="query"
						placeholder="given name"
						onChange={this.handleChange} />
					<button>Search</button>
				</form>

				{link[2]
					&& link[2].relation === 'previous'
					&& <button onClick={() => this.fetchList(link[2].url)}>PREV</button>
				}

				{link[1]
					&& link[1].relation === 'next'
					&& <button onClick={() => this.fetchList(link[1].url)}>NEXT</button>
				}

				{totalResults > 0 && <div>Result{totalResults > 1 ? 's' : ''}: {totalResults}</div>}

				{practitioners.length > 0 && this.distinctNames(practitioners).map(item => <Card key={item.resource.id} practitioner={item} />)}
			</div>
		);
	}
}

export default List;

import React from 'react';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SearchBar from '../../components/SearchBar';
import Article from '../../components/Article';
import Loader from '../../components/Loader';

// hoc
import Wrapper from '../../hoc/Wrapper';

// Styles
import './style.css';

const defaultUrl = 'https://hapi.fhir.org/baseDstu3/Practitioner?_format=json';

class List extends React.Component {
	state = {
		practitioners: [],
		link: [],
		searchId: null,
		query: '',
		totalResults: null,
		loading: false,
	};

	distinctNames = practitioners => {
		let MAP = [];
		let uniqueNames = [];

		// Distinct names
		practitioners.length &&
			practitioners.forEach(item => {
				let familyName;

				if (item.resource.name[item.resource.name.length - 1].family) {
					familyName = item.resource.name[item.resource.name.length - 1].family.split(' ').pop();
				} else if (item.resource.name[item.resource.name.length - 1]._family) {
					familyName = item.resource.name[item.resource.name.length - 1]._family.extension
						.map(item => item.valueString)
						.join(' ');
				} else {
					familyName = '';
				}

				if (MAP.indexOf(familyName) === -1) {
					MAP.push(familyName);
					uniqueNames.push(item);
				}
			});

		return uniqueNames;
	};

	fetchList = url => {
		this.setState({ loading: true });

		fetch(url ? url : defaultUrl)
			.then(response => response.json())
			.then(data => {
				// Verify if "name" object and "given" property exist
				let practitioners = data.entry
					.filter(contact => contact.resource.name)
					.filter(contact => contact.resource.name[0].given);
				// Remove duplicates
				practitioners = this.distinctNames(practitioners);

				this.setState({
					practitioners: practitioners,
					link: data.link,
					searchId: data.id,
					totalResults: data.total ? practitioners.length : null,
					loading: false,
				});
			})
			.catch(error => {
				console.error(error);
			});
	};

	componentDidMount() {
		this.fetchList();
	}

	render() {
		const { practitioners, link, totalResults, loading } = this.state;

		let content = null;

		if (loading) {
			content = <Loader />;
		} else {
			content = (
				<Wrapper>
					{totalResults > 0 && (
						<div className="content-totalResults">We found {totalResults} practitioner(s).</div>
					)}

					{practitioners.length > 0 &&
						this.distinctNames(practitioners).map(item => {
							const avatar = Math.floor(Math.random() * 10);

							return <Article key={item.resource.id} practitioner={item} avatar={avatar} />;
						})}

					{practitioners.length === 0 && (
						<div className="content-noResults" id="noResults">
							No results on this page...
							<span role="img" aria-label="smiley sorry">
								😰
							</span>
						</div>
					)}

					<div className="content-pagination">
						{link[2] && link[2].relation === 'previous' && (
							<button className="pagination-button" onClick={() => this.fetchList(link[2].url)}>
								PREV
							</button>
						)}

						{link[1] && link[1].relation === 'next' && (
							<button className="pagination-button" onClick={() => this.fetchList(link[1].url)}>
								NEXT
							</button>
						)}
					</div>
				</Wrapper>
			);
		}

		return (
			<div className="app-container component-list">
				<div className="page">
					<Header />

					<SearchBar fetchList={this.fetchList} />

					<section className="page-content">
						<div className="content-title">
							{totalResults > 0 ? 'Results of your search' : 'List of the practitioners'}
						</div>

						<div className="content-container">{content}</div>
					</section>
				</div>

				{!loading && <Footer />}
			</div>
		);
	}
}

export default List;

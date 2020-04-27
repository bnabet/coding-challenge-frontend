import React from 'react';
import { Link } from 'react-router-dom';

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

		// Fix HTTPS issue (mixed content type)
		if (url && url.indexOf('https:') === -1) {
			let urlArray = url.split('http:');
			url = 'https:' + urlArray[1];
		}

		fetch(url ? url : defaultUrl)
			.then(response => response.json())
			.then(data => {
				let practitioners = [];
				// Verify if "name" object and "given" property exist
				if (data.entry) {
					practitioners = data.entry
						.filter(contact => contact.resource.name)
						.filter(contact => contact.resource.name[0].given);
					// Remove duplicates
					practitioners = this.distinctNames(practitioners);
				}

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

	backHistory = () => {
		this.props.history.push(`/practitioners`);
	}

	componentDidMount() {
		this.fetchList();
	}

	render() {
		const { practitioners, link, totalResults, loading } = this.state;
		const title = totalResults > 0 ? 'Results of your search' : 'List of the practitioners';

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
						<div className="content-noResults">
							<div className="noResults-notification" id="noResults">
								No results... <span role="img" aria-label="smiley sorry" className="noResults-smiley">😰</span>
							</div>
							<Link to="/" className="content-back link--default">Back to home</Link>
						</div>
					)}

					{(link[1] || link[2]) &&
						<div className="content-pagination">
							{link[2] && link[2].relation === 'previous' && (
								<Wrapper>
									<div className="pagination-button" onClick={() => this.fetchList(link[2].url)}>
										<i className="icon icon--left icon--previous"></i>
										Prev
									</div>
									<span className="pagination-divider">|</span>
								</Wrapper>
							)}

							{link[1] && link[1].relation === 'next' && (
								<div className="pagination-button" onClick={() => this.fetchList(link[1].url)}>
									Next
									<i className="icon icon--right icon--next"></i>
								</div>
							)}
						</div>
					}
				</Wrapper>
			);
		}

		return (
			<div className="app-container component-list">
				<div className="page">
					<Header />

					<SearchBar fetchList={this.fetchList} />

					<section className="page-content">
						<div className="content-title">{title}</div>
						<div className="content-container">{content}</div>
					</section>
				</div>

				{!loading && <Footer />}
			</div>
		);
	}
}

export default List;

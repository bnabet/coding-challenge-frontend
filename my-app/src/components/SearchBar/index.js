import React from 'react';

// Styles
import './style.css';

class SearchBar extends React.Component {
	state = {
		query: '',
	};

	handleChange = event => {
		this.setState({ query: event.target.value });
	};

	handleSubmit = (event, query) => {
		const searchUrl = `https://hapi.fhir.org/baseDstu3/Practitioner?given=${query}&_format=json&_pretty=true`;
		this.props.fetchList(searchUrl);
		event.preventDefault();
	};

	render() {
		const { query } = this.state;

		return (
			<section className="component-search">
				<form className="search-form" onSubmit={event => this.handleSubmit(event, query)}>
					<label className="search-label">Looking for a practitioner ?</label>
					<div className="search-description">
						Search a doctor by his first name. If you are looking for a baker you are on the wrong site ...
					</div>
					<div className="search-inner">
						<input
							type="search"
							name="query"
							placeholder="Your search..."
							className="search-input input--default"
							onChange={this.handleChange}
						/>
						<button className={'search-submit' + (query !== '' ? ' active' : '')}>search</button>
					</div>
				</form>
			</section>
		);
	}
}

export default SearchBar;

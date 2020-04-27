import React from 'react';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Form from '../../components/Form';
import Name from '../../components/Name';
import Loader from '../../components/Loader';

// hoc
import Wrapper from '../../hoc/Wrapper';

// Styles
import './style.css';

class Practitioner extends React.Component {
	state = {
		practRef: {},
		loading: false
	};

	fetchingPractitioner = () => {
		this.setState({ loading: true });
		const practitionerId = this.props.match.params.practitionerId;

		fetch(`https://hapi.fhir.org/baseDstu3/Practitioner/${practitionerId}`)
			.then(response => response.json())
			.then(data => {
				this.setState({
					practRef: data,
					loading: !Object.keys(data).length
				});
			});
	};

	componentDidMount() {
		this.fetchingPractitioner();
	}

	render() {
		const { practRef, loading } = this.state;
		const { avatar } = this.props.location.state || '';

		let qualification = 'Practitioner';

		if (practRef.qualification && practRef.qualification[0].code.coding[0].display) {
			qualification = practRef.qualification[0].code.coding[0].display;
		}

		let content = null;

		if (practRef && Object.entries(practRef).length && !loading) {
			content = (
				<Wrapper>
					<div className="profile-top">
						<div className={`profile-icon avatar-${avatar}`}></div>
						<div className="profile-identity">
							<h2 className="profile-title">
								<Name name={practRef.name} />
							</h2>
							<span className="profile-description">{qualification}</span>
						</div>
					</div>

					<Form practRef={practRef} />

					<span className="profile-updated">
						<b>Last updated : </b>
						{new Date(practRef.meta.lastUpdated).toLocaleString()}
					</span>
				</Wrapper>
			);
		} else {
			content = <Loader />;
		}

		return (
			<div className="app-container component-practitioner">
				<div className="page">
					<div className="page-banner">
						<Header />
					</div>

					<section className="page-content">
						<div className="content-container content-container--profile">{content}</div>
					</section>
				</div>
				{!loading && <Footer />}
			</div>
		);
	}
}

export default Practitioner;

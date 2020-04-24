import React from 'react';

// Components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Form from '../../components/Form';
import Loader from '../../components/Loader';

// hoc
import Wrapper from '../../hoc/Wrapper';

// Styles
import './style.css';

class Practitioner extends React.Component {
	state = {
		practitioner: {},
		loading: false,
	};

	addContact = () => {
		const practitioner = this.state.practitioner;
		let contacts = practitioner.telecom || [];
		contacts.push({
			system: 'phone',
		});
		practitioner.telecom = contacts;
		this.setState({ practitioner: practitioner });
	};

	deleteContact = index => {
		const practitioner = this.state.practitioner;
		let contacts = practitioner.telecom || [];
		contacts.splice(index, 1);
		practitioner.telecom = contacts;
		this.setState({ practitioner: practitioner });
	};

	handleInputChange = (event, index, extensionIndex) => {
		const target = event.target;
		const inputName = target.name;
		const dataName = target.name.split('_')[0];
		const dataKey = target.name.split('_')[1];
		let practitioner = this.state.practitioner;

		switch (inputName) {
			// Name
			case 'name_use':
			case 'name_text':
			case 'name_family':
			case 'name_given':
			case 'name_prefix':
				if (extensionIndex !== undefined) {
					practitioner[dataName][index]['_' + dataKey].extension[extensionIndex].valueString = target.value;
				} else {
					practitioner[dataName][index][dataKey] =
						dataKey === 'given' || dataKey === 'prefix' ? [target.value] : target.value;
				}
				break;

			// Qualification
			case 'qualification_system':
			case 'qualification_code':
			case 'qualification_display':
				if (practitioner.qualification) {
					practitioner[dataName][0].code.coding[0][dataKey] = target.value;
				} else {
					const qualification = [
						{
							code: {
								coding: [{ [dataKey]: target.value }],
							},
						},
					];
					practitioner[dataName] = qualification;
				}
				if (target.value === '') {
					delete practitioner[dataName][0].code.coding[0][dataKey];
					if (Object.keys(practitioner[dataName][0].code.coding[0]).length === 0)
						delete practitioner[dataName];
				}
				break;

			// Address
			case 'address_text':
			case 'address_line':
			case 'address_city':
			case 'address_state':
			case 'address_postalCode':
			case 'address_country':
			case 'address_use':
			case 'address_type':
				if (practitioner.address) {
					if (practitioner.address[0].text && dataKey !== 'text') {
						Object.defineProperty(
							practitioner.address[0],
							'line',
							Object.getOwnPropertyDescriptor(practitioner.address[0], 'text')
						);
						delete practitioner.address[0]['text'];
					}
					practitioner[dataName][0][dataKey] = target.value;
				} else {
					const address = [{ [dataKey]: target.value }];
					practitioner[dataName] = address;
				}

				if (target.value === '') {
					delete practitioner.address[0][dataKey];

					if (practitioner.address[0].line && Object.keys(practitioner.address[0]).length < 2) {
						Object.defineProperty(
							practitioner.address[0],
							'text',
							Object.getOwnPropertyDescriptor(practitioner.address[0], 'line')
						);
						delete practitioner.address[0]['line'];
					}

					if (Object.keys(practitioner.address[0]).length === 0) delete practitioner.address;
				}
				break;

			// Telecom
			case 'telecom_system':
			case 'telecom_use':
			case 'telecom_value':
				practitioner[dataName][index][dataKey] = target.value;
				if (target.value === '') delete practitioner[dataName][index][dataKey];
				break;

			// Profile
			case 'profile_gender':
			case 'profile_birthDate':
			case 'profile_active':
				practitioner[dataKey] = dataKey === 'active' ? target.checked : target.value;
				if (target.value === '' || (dataKey === 'active' && !target.checked)) delete practitioner[dataKey];
				break;

			default:
				break;
		}

		this.setState({ practitioner });
	};

	handleSubmit = event => {
		const putMethod = {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-type': 'application/fhir+json',
			},
			body: JSON.stringify(this.state.practitioner),
		};

		fetch(`http://hapi.fhir.org/baseDstu3/Practitioner/${this.state.practitioner.id}`, putMethod)
			.then(response => response.json())
			.then(json => this.props.history.push(`/practitioners`))
			.catch(error => {
				console.error(error);
			});

		event.preventDefault();
	};

	fetchingPractitioner = () => {
		this.setState({ loading: true });
		const practitionerId = this.props.match.params.practitionerId;

		fetch(`http://hapi.fhir.org/baseDstu3/Practitioner/${practitionerId}`)
			.then(response => response.json())
			.then(data => {
				const hasPractitioner = Object.keys(data).length;
				this.setState({ practitioner: data, loading: !hasPractitioner });
			});
	};

	componentDidMount() {
		this.fetchingPractitioner();
	}

	render() {
		const { practitioner, loading } = this.state;
		const { title } = this.props.location.state;

		let content = null;

		if (Object.entries(practitioner).length && !loading) {
			content = (
				<Wrapper>
					<div className="profile-top">
						<div className="profile-icon">{}</div>
						<div className="profile-identity">
							<h2 className="profile-title">{title}</h2>
							<span className="profile-description">Practitioner</span>
						</div>
					</div>

					<Form
						practitioner={practitioner}
						handleSubmit={this.handleSubmit}
						handleInputChange={this.handleInputChange}
						addContact={this.addContact}
						deleteContact={this.deleteContact}
					/>

					<span className="profile-updated">
						<b>Last updated : </b>
						{new Date(practitioner.meta.lastUpdated).toLocaleString()}
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

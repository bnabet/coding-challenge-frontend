import React from 'react';
import { Link } from 'react-router-dom';

import './style.css';

class Practitioner extends React.Component {
	state = {
		practitioner: {},
	};

	addContact = () => {
		const practitioner = this.state.practitioner;
		let contacts = practitioner.telecom || [];
		contacts.push({
			system: 'phone'
		});
		practitioner.telecom = contacts;
		this.setState({ practitioner: practitioner });
	};

	deleteContact = (index) => {
		const practitioner = this.state.practitioner;
		let contacts = practitioner.telecom || [];
		contacts.splice(index, 1);
		practitioner.telecom = contacts;
		this.setState({ practitioner: practitioner });
	};

	handleInputChange(event, index, extensionIndex) {
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
					if (Object.keys(practitioner[dataName][0].code.coding[0]).length === 0) delete practitioner[dataName];
				};
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
						Object.defineProperty(practitioner.address[0], 'line', Object.getOwnPropertyDescriptor(practitioner.address[0], 'text'));
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
						Object.defineProperty(practitioner.address[0], 'text', Object.getOwnPropertyDescriptor(practitioner.address[0], 'line'));
						delete practitioner.address[0]['line'];
					}

					if (Object.keys(practitioner.address[0]).length === 0) delete practitioner.address;
				};
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

			case 'default':
				break;
		}

		this.setState({ practitioner });
	}

	handleSubmit(event) {
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
			.then(json => console.log(json))
			.catch(error => {
				console.error(error);
			});

		event.preventDefault();
	}

	fetchingPractitioner = () => {
		const practitionerId = this.props.match.params.practitionerId;

		fetch(`http://hapi.fhir.org/baseDstu3/Practitioner/${practitionerId}`)
			.then(response => response.json())
			.then(data => {
				this.setState({ practitioner: data });
			});
	};

	componentDidMount() {
		this.fetchingPractitioner();
	}

	render() {
		const { practitioner } = this.state;

		return (
			<div className="page page--practitioner">
				{Object.entries(practitioner).length && (
					<form onSubmit={event => this.handleSubmit(event)}>

						<small><b>Last updated : </b>{new Date(practitioner.meta.lastUpdated).toLocaleString()}</small>

						{/* Name */}
						<fieldset>
							<legend>name</legend>
							{practitioner.name.map((obj, index) =>
								Object.entries(obj).map(([key, value]) => (
									<div className="entries" key={key}>
										<label>{key === '_family' ? 'extensions' : key}</label>
										{key !== '_family' && (key === 'use'
											? <select
												name="name_use"
												value={practitioner.name[practitioner.name.length - 1].use}
												onChange={event => this.handleInputChange(event, index)}
												className={practitioner.name[practitioner.name.length - 1].use ? 'selected' : ''}>
												<option value="">Choose a use:</option>
												<option value="usual">usual</option>
												<option value="official">official</option>
											</select>
											: <input
												type="text"
												name={'name_' + key}
												value={value}
												onChange={event => this.handleInputChange(event, index)}
												className={value.length ? 'valid' : ''}
											/>)}
										{key === '_family' && Object.entries(value.extension).map(([key, value], extensionIndex) => (
											<input
												type="text"
												name="name_family"
												value={value.valueString}
												onChange={event => this.handleInputChange(event, index, extensionIndex)}
												className={value.valueString ? 'valid' : ''}
												key={key}
											/>
										))}
									</div>
								))
							)}
						</fieldset>

						{/* Qualification */}
						<fieldset>
							<legend>qualification</legend>
							<label>system</label>
							<input
								type="text"
								name="qualification_system"
								value={(practitioner.qualification && practitioner.qualification[0].code.coding[0].system) || ''}
								placeholder="http://yoursite.com"
								onChange={event => this.handleInputChange(event)}
								className={practitioner.qualification && practitioner.qualification[0].code.coding[0].system ? 'valid' : ''}
							/>
							<br />
							<label>code</label>
							<input
								type="number"
								name="qualification_code"
								value={(practitioner.qualification && practitioner.qualification[0].code.coding[0].code) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.qualification && practitioner.qualification[0].code.coding[0].code ? 'valid' : ''}
							/>
							<br />
							<label>display</label>
							<input
								name="qualification_display"
								type="text"
								value={(practitioner.qualification && practitioner.qualification[0].code.coding[0].display) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.qualification && practitioner.qualification[0].code.coding[0].display ? 'valid' : ''}
							/>
						</fieldset>

						{/* Address */}
						<fieldset>
							<legend>address</legend>
							<label>use</label>
							<select
								name="address_use"
								value={practitioner.address && practitioner.address[0].use}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].use ? 'selected' : ''}>
								<option value="">Choose a use</option>
								<option value="work">work</option>
								<option value="home">home</option>
							</select>
							<br />
							<label>type</label>
							<select
								name="address_type"
								value={practitioner.address && practitioner.address[0].type}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].type ? 'selected' : ''}>
								<option value="">Choose a type</option>
								<option value="physical">physical</option>
								<option value="virtual">virtual</option>
							</select>
							<br />
							<label>line/text</label>
							<input
								type="text"
								name={!practitioner.address
									|| (practitioner.address && Object.keys(practitioner.address[0]).length === 1 && practitioner.address[0].text)
									|| (practitioner.address && Object.keys(practitioner.address[0]).length === 1 && practitioner.address[0].line)
									? 'address_text'
									: 'address_line'
								}
								value={(practitioner.address && (practitioner.address[0].line || practitioner.address[0].text)) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && (practitioner.address[0].line || practitioner.address[0].text) ? 'valid' : ''}
							/>
							<br />
							<label>city</label>
							<input
								type="text"
								name="address_city"
								value={practitioner.address && practitioner.address[0].city || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].city ? 'valid' : ''}
							/>
							<br />
							<label>state</label>
							<input
								type="text"
								name="address_state"
								value={(practitioner.address && practitioner.address[0].state) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].state ? 'valid' : ''}
							/>
							<br />
							<label>postal code</label>
							<input
								type="number"
								name="address_postalCode"
								value={(practitioner.address && practitioner.address[0].postalCode) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].postalCode ? 'valid' : ''}
							/>
							<br />
							<label>country</label>
							<input
								type="text"
								name="address_country"
								value={(practitioner.address && practitioner.address[0].country) || ''}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.address && practitioner.address[0].country ? 'valid' : ''}
							/>
						</fieldset>

						{/* Contacts */}
						<fieldset>
							<legend>telecom</legend>
							{practitioner.telecom && practitioner.telecom.map((item, index) => (
								<div key={index}>
									<label>contact {index + 1}</label>
									<select
										name="telecom_system"
										value={item.system}
										onChange={event => this.handleInputChange(event, index)}
										className="selected">
										<option value="phone">phone</option>
										<option value="fax">fax</option>
										<option value="email">email</option>
									</select>
									<select
										name="telecom_use"
										value={item.use}
										onChange={event => this.handleInputChange(event, index)}
										className={item.use ? 'selected' : ''}>
										<option value="">Choose a use</option>
										<option value="work">work</option>
										<option value="mobile">mobile</option>
										<option value="home">home</option>
									</select>
									<input
										type="text"
										name="telecom_value"
										value={item.value || ''}
										onChange={event => this.handleInputChange(event, index)}
										className={item.value ? 'valid' : ''}
									/>
									<span className="contact-delete" onClick={() => this.deleteContact(index)}>delete</span>
								</div>
							))}

							<div className="contact-add" onClick={this.addContact}>add contact</div>
						</fieldset>

						{/* Gender */}
						<fieldset>
							<legend>gender</legend>
							<select
								name="profile_gender"
								value={practitioner.gender}
								onChange={event => this.handleInputChange(event)}
								className={practitioner.gender ? 'selected' : ''}>
								<option value="">Choose a gender:</option>
								<option value="male">male</option>
								<option value="female">female</option>
							</select>
						</fieldset>

						{/* Birthdate */}
						<fieldset>
							<legend>birthdate</legend>
							<input
								type="date"
								name="profile_birthDate"
								value={practitioner.birthDate || ''}
								onChange={event => this.handleInputChange(event)}
							/>
						</fieldset>

						{/* Active */}
						<fieldset>
							<legend>active</legend>
							<input
								type="checkbox"
								name="profile_active"
								value="active"
								checked={practitioner.active || false}
								onChange={event => this.handleInputChange(event)}
							/>
						</fieldset>

						<input type="submit" value="Update" />
					</form>
				)}

				<hr></hr>

				<Link to={'/practitioners'}>Back to list</Link>
			</div>
		);
	}
}

export default Practitioner;

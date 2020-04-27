import React from 'react';

// Styles
import './style.css';

class Form extends React.Component {
	state = {
		practObj: {},
		formErrors: {
			name_use: false,
			name_prefix: false,
			name_given: false,
			name_family: false,
			name_text: false,
			name_patate: false,
			name_extension_0: false,
			name_extension_1: false,
			name_extension_2: false,
			qualification_system: false,
			qualification_code: false,
			qualification_display: false,
			address_use: false,
			address_type: false,
			address_line: false,
			address_text: false,
			address_city: false,
			address_state: false,
			address_postalCode: false,
			address_country: false,
			telecom_contact_0: false,
			telecom_contact_1: false,
			telecom_contact_2: false,
			gender: false,
			birthdate: false,
			active: false
		},
		formValid: true,
		showSubmitError: false
	};

	addContact = () => {
		const practObj = { ...this.state.practObj };
		let contacts = practObj.telecom || [];
		contacts.push({
			system: 'phone',
		});
		practObj.telecom = contacts;
		this.setState({ practObj });
	};

	deleteContact = index => {
		const practObj = { ...this.state.practObj };
		let contacts = practObj.telecom || [];
		contacts.splice(index, 1);
		practObj.telecom = contacts;
		this.setState({ practObj });
	};

	handleInputChange = (event, index) => {
		const target = event.target;
		const inputName = target.name;
		const dataKey = target.name.split('_')[1];
		const practRef = this.props.practRef;
		let practObj = { ...this.state.practObj };
		let errors = { ...this.state.formErrors };

		switch (inputName) {
			// Name
			case 'name_use':
			case 'name_text':
			case 'name_prefix':
			case 'name_given':
			case 'name_family':
				practObj.name[0][dataKey] = Array.isArray(practRef.name[0][dataKey]) ? [target.value] : target.value;

				if (practRef.name && practRef.name[0][dataKey]) {
					errors[inputName] = target.value === '';
				}
				break;

			case 'name_extension':
				practObj.name[0]._family.extension[index].valueString = target.value;

				if (practRef.name && practRef.name[0]._family.extension[index].valueString) {
					errors[`name_extension_${index}`] = target.value === '';
				}
				break;

			// Qualification
			case 'qualification_system':
			case 'qualification_code':
			case 'qualification_display':
				if (practObj.qualification) {
					practObj.qualification[0].code.coding[0][dataKey] = target.value;
				} else {
					const qualification = [
						{
							code: {
								coding: [{ [dataKey]: target.value }],
							},
						},
					];
					practObj.qualification = qualification;
				}

				if (practRef.qualification && practRef.qualification[0].code.coding[0][dataKey]) {
					errors[inputName] = target.value === '';
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
				if (practObj.address) {
					practObj.address[0][dataKey] = (practRef.address && Array.isArray(practRef.address[0][dataKey])) ? [target.value] : target.value;
				} else {
					const address = [{ [dataKey]: target.value }];
					practObj.address = address;
				}

				if (practRef.address && practRef.address[0][dataKey]) {
					errors[inputName] = target.value === '';
				}
				break;

			// Telecom
			case 'telecom_system':
			case 'telecom_use':
			case 'telecom_value':
				practObj.telecom[index][dataKey] = target.value;
				break;

			// Profile
			case 'profile_gender':
			case 'profile_birthDate':
			case 'profile_active':
				practObj[dataKey] = dataKey === 'active' ? target.checked : target.value;

				if (practRef[dataKey]) {
					errors[inputName] = (target.value === '' || !target.checked);
				}
				break;

			default:
				break;
		}

		this.setState({
			practObj,
			formErrors: errors,
			showSubmitError: false,
			formValid: Object.keys(errors).every((key) => !errors[key])
		});
	};

	handleSubmit = event => {
		if (this.state.formValid) {
			const putMethod = {
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-type': 'application/fhir+json',
				},
				body: JSON.stringify(this.state.practObj),
			};

			fetch(`https://hapi.fhir.org/baseDstu3/Practitioner/${this.state.practRef.id}`, putMethod)
				.then(response => response.json())
				.then(json => this.props.history.push(`/practitioners`))
				.catch(error => {
					console.error(error);
				});
		} else {
			this.setState({ showSubmitError: true });
		}

		event.preventDefault();
	};

	componentDidMount() {
		this.setState({
			practObj: JSON.parse(JSON.stringify(this.props.practRef))
		});
	}

	render() {
		const { practObj, formErrors, formValid, showSubmitError } = this.state;

		let nameObj = {};
		if (practObj && practObj.name) {
			nameObj = practObj.name[0];
		}

		const errorFieldMessage = <span className="form-error">This field is required.</span>;
		const errorSubmitMessage = <span className="form-error">Sorry, your form is not valid... Please verify.</span>;

		return (
			<form className="component-form" onSubmit={event => this.handleSubmit(event)}>
				{/* Name */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">identity</legend>
					<div className="form-field">
						<select
							name="name_use"
							value={nameObj.use}
							onChange={event => this.handleInputChange(event, 0)}
							className="form-select">
							<option value="">Choose a use</option>
							<option value="usual">usual</option>
							<option value="official">official</option>
						</select>
						{formErrors.name_use && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Full text name</label>
						<input
							type="text"
							name="name_text"
							value={(Array.isArray(nameObj.text) ? nameObj.text.join(' ') : nameObj.text) || ''}
							placeholder="Text"
							onChange={event => this.handleInputChange(event, 0)}
							className="input--default"
						/>
						{formErrors.name_text && errorFieldMessage}
					</div>

					<hr className="form-divider" />

					<div className="form-field">
						<label className="form-label">Prefix</label>
						<input
							type="text"
							name="name_prefix"
							value={(Array.isArray(nameObj.prefix) ? nameObj.prefix.join(' ') : nameObj.prefix) || ''}
							placeholder="Prefix"
							onChange={event => this.handleInputChange(event, 0)}
							className="input--default"
						/>
						{formErrors.name_prefix && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Firstname</label>
						<input
							type="text"
							name="name_given"
							value={(Array.isArray(nameObj.given) ? nameObj.given.join(' ') : nameObj.given) || ''}
							placeholder="Given"
							onChange={event => this.handleInputChange(event, 0)}
							className="input--default"
						/>
						{formErrors.name_given && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Lastname</label>
						<input
							type="text"
							name="name_family"
							value={(Array.isArray(nameObj.family) ? nameObj.family.join(' ') : nameObj.family) || ''}
							placeholder="Lastname"
							onChange={event => this.handleInputChange(event, 0)}
							className="input--default"
						/>
						{formErrors.name_family && errorFieldMessage}
					</div>

					{nameObj._family &&
						<div className="form-field">
							<label className="form-label">Extensions</label>
							<div className="form-grid">
								{nameObj._family.extension.map((input, index) => (
									<div className="flex flex-column" key={index}>
										<input
											type="text"
											name="name_extension"
											value={input.valueString || ''}
											placeholder="Name"
											onChange={event => this.handleInputChange(event, index)}
											className="input--default input--small"
										/>
										{formErrors[`name_extension_${index}`] && errorFieldMessage}
									</div>
								))}
							</div>
						</div>
					}
				</fieldset>

				{/* Qualification */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">qualification</legend>
					<div className="form-field">
						<label className="form-label">System</label>
						<input
							type="text"
							name="qualification_system"
							value={(practObj.qualification && practObj.qualification[0].code.coding[0].system) || ''}
							placeholder="http://yoursite.com"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.qualification_system && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Code</label>
						<input
							type="number"
							name="qualification_code"
							value={(practObj.qualification && practObj.qualification[0].code.coding[0].code) || ''}
							placeholder="code"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.qualification_code && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Display</label>
						<input
							name="qualification_display"
							type="text"
							value={(practObj.qualification && practObj.qualification[0].code.coding[0].display) || ''}
							placeholder="display"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.qualification_display && errorFieldMessage}
					</div>
				</fieldset>

				{/* Address */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">address</legend>

					<div className="form-field">
						<label className="form-label">Use</label>
						<select
							name="address_use"
							value={(practObj.address && practObj.address[0].use) || ''}
							onChange={event => this.handleInputChange(event)}
							className="form-select">
							<option value="">Choose a use</option>
							<option value="work">work</option>
							<option value="home">home</option>
						</select>
						{formErrors.address_use && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Type</label>
						<select
							name="address_type"
							value={(practObj.address && practObj.address[0].type) || ''}
							onChange={event => this.handleInputChange(event)}
							className="form-select">
							<option value="">Choose a type</option>
							<option value="physical">physical</option>
							<option value="virtual">virtual</option>
						</select>
						{formErrors.address_type && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Full text address</label>
						<input
							type="text"
							name="address_text"
							value={(practObj.address && practObj.address[0].text) || ''}
							placeholder="text"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_text && errorFieldMessage}
					</div>

					<hr className="form-divider" />

					<div className="form-field">
						<label className="form-label">Line</label>
						<input
							type="text"
							name="address_line"
							value={(practObj.address && practObj.address[0].line) || ''}
							placeholder="line"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_line && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">City</label>
						<input
							type="text"
							name="address_city"
							value={(practObj.address && practObj.address[0].city) || ''}
							placeholder="city"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_city && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">State</label>
						<input
							type="text"
							name="address_state"
							value={(practObj.address && practObj.address[0].state) || ''}
							placeholder="state"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_state && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Postal code</label>
						<input
							type="number"
							name="address_postalCode"
							value={(practObj.address && practObj.address[0].postalCode) || ''}
							placeholder="postal code"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_postalCode && errorFieldMessage}
					</div>

					<div className="form-field">
						<label className="form-label">Country</label>
						<input
							type="text"
							name="address_country"
							value={(practObj.address && practObj.address[0].country) || ''}
							placeholder="country"
							onChange={event => this.handleInputChange(event)}
							className="input--default"
						/>
						{formErrors.address_country && errorFieldMessage}
					</div>
				</fieldset>

				{/* Contacts */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">telecom</legend>
					{practObj.telecom &&
						practObj.telecom.map((item, index) => (
							<div className="form-field" key={index}>
								<label className="form-label">Contact {index + 1}</label>
								<div className="form-group">
									<div className="form-group-inner">
										<select
											name="telecom_system"
											value={item.system}
											onChange={event => this.handleInputChange(event, index)}
											className="form-select">
											<option value="phone">phone</option>
											<option value="fax">fax</option>
											<option value="email">email</option>
										</select>
									</div>
									<div className="form-group-inner">
										<select
											name="telecom_use"
											value={item.use}
											onChange={event => this.handleInputChange(event, index)}
											className="form-select">
											<option value="">Choose a use</option>
											<option value="work">work</option>
											<option value="mobile">mobile</option>
											<option value="home">home</option>
										</select>
									</div>
									<div className="form-group-inner">
										<input
											type="text"
											name="telecom_value"
											value={item.value || ''}
											placeholder="contact"
											size="10"
											onChange={event => this.handleInputChange(event, index)}
											className="input--default"
										/>
									</div>
									<button
										className={'icon form-delete' + ((index < (this.props.practRef.telecom.length)) ? ' icon--disabled' : '')}
										onClick={() => this.deleteContact(index)}>
										delete
									</button>
								</div>
							</div>
						))}

					<div className="btn btn--green form-add" onClick={this.addContact}>Add contact</div>
				</fieldset>

				{/* Gender */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">gender</legend>
					<div className="form-field">
						<select
							name="profile_gender"
							value={practObj.gender}
							onChange={event => this.handleInputChange(event)}
							className="form-select">
							<option value="">Choose a gender</option>
							<option value="male">male</option>
							<option value="female">female</option>
						</select>
						{formErrors.profile_gender && errorFieldMessage}
					</div>
				</fieldset>

				{/* Birthdate */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">birthdate</legend>
					<div className="form-field">
						<input
							type="date"
							name="profile_birthDate"
							value={practObj.birthDate || ''}
							placeholder="birthdate"
							onChange={event => this.handleInputChange(event)}
							className="input--default input--default--date"
						/>
						{formErrors.profile_birthDate && errorFieldMessage}
					</div>
				</fieldset>

				{/* Active */}
				<fieldset className="form-fieldset">
					<legend className="form-legend">active</legend>
					<input
						type="checkbox"
						id="profile_active"
						name="profile_active"
						value="active"
						checked={practObj.active || false}
						onChange={event => this.handleInputChange(event)}
						className="form-checkbox"
					/>
					<label htmlFor="profile_active">Are you active ?</label>
					<div><br />{formErrors.profile_active && errorFieldMessage}</div>
				</fieldset>

				<div className="form-bottom">
					<div className="submit-error">{showSubmitError && errorSubmitMessage}</div>
					<input type="submit" value="Update profile" className={'btn btn--large form-submit ' + (formValid ? 'btn--green' : 'btn--disabled')} />
				</div>
			</form>
		);
	}
};

export default Form;

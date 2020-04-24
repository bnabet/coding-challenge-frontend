import React from 'react';

// Styles
import './style.css';

const Form = props => {
	const { practitioner, handleSubmit, handleInputChange, addContact, deleteContact } = props;

	return (
		<form className="component-form" onSubmit={event => handleSubmit(event)}>
			{/* Name */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">name</legend>
				{practitioner.name.map((obj, index) =>
					Object.entries(obj).map(([key, value]) => (
						<div className="form-field" key={key}>
							<label className="form-label">{key === '_family' ? 'extensions' : key}</label>
							{key !== '_family' &&
								(key === 'use' ? (
									<select
										name="name_use"
										value={practitioner.name[practitioner.name.length - 1].use}
										onChange={event => handleInputChange(event, index)}
										className={
											'form-select' +
											(practitioner.name[practitioner.name.length - 1].use ? ' selected' : '')
										}>
										<option value="">Choose a use</option>
										<option value="usual">usual</option>
										<option value="official">official</option>
									</select>
								) : (
									<input
										type="text"
										name={'name_' + key}
										value={value}
										onChange={event => handleInputChange(event, index)}
										className={'input--default' + (value.length ? ' valid' : '')}
									/>
								))}
							{key === '_family' && (
								<div className="form-field-extensions">
									{Object.entries(value.extension).map(([key, value], extensionIndex) => (
										<input
											type="text"
											name="name_family"
											value={value.valueString}
											onChange={event => handleInputChange(event, index, extensionIndex)}
											className="input--default input--default--extension"
											key={key}
										/>
									))}
								</div>
							)}
						</div>
					))
				)}
			</fieldset>

			{/* Qualification */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">qualification</legend>
				<div className="form-field">
					<label className="form-label">system</label>
					<input
						type="text"
						name="qualification_system"
						value={
							(practitioner.qualification && practitioner.qualification[0].code.coding[0].system) || ''
						}
						placeholder="http://yoursite.com"
						onChange={event => handleInputChange(event)}
						className={
							'input--default' +
							(practitioner.qualification && practitioner.qualification[0].code.coding[0].system
								? ' valid'
								: '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">code</label>
					<input
						type="number"
						name="qualification_code"
						value={(practitioner.qualification && practitioner.qualification[0].code.coding[0].code) || ''}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' +
							(practitioner.qualification && practitioner.qualification[0].code.coding[0].code
								? ' valid'
								: '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">display</label>
					<input
						name="qualification_display"
						type="text"
						value={
							(practitioner.qualification && practitioner.qualification[0].code.coding[0].display) || ''
						}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' +
							(practitioner.qualification && practitioner.qualification[0].code.coding[0].display
								? ' valid'
								: '')
						}
					/>
				</div>
			</fieldset>

			{/* Address */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">address</legend>

				<div className="form-field">
					<label className="form-label">use</label>
					<select
						name="address_use"
						value={practitioner.address && practitioner.address[0].use}
						onChange={event => handleInputChange(event)}
						className={
							'form-select' + (practitioner.address && practitioner.address[0].use ? ' selected' : '')
						}>
						<option value="">Choose a use</option>
						<option value="work">work</option>
						<option value="home">home</option>
					</select>
				</div>

				<div className="form-field">
					<label className="form-label">type</label>
					<select
						name="address_type"
						value={practitioner.address && practitioner.address[0].type}
						onChange={event => handleInputChange(event)}
						className={
							'form-select' + (practitioner.address && practitioner.address[0].type ? ' selected' : '')
						}>
						<option value="">Choose a type</option>
						<option value="physical">physical</option>
						<option value="virtual">virtual</option>
					</select>
				</div>

				<div className="form-field">
					<label className="form-label">line/text</label>
					<input
						type="text"
						name={
							!practitioner.address ||
							(practitioner.address &&
								Object.keys(practitioner.address[0]).length === 1 &&
								practitioner.address[0].text) ||
							(practitioner.address &&
								Object.keys(practitioner.address[0]).length === 1 &&
								practitioner.address[0].line)
								? 'address_text'
								: 'address_line'
						}
						value={
							(practitioner.address && (practitioner.address[0].line || practitioner.address[0].text)) ||
							''
						}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' +
							(practitioner.address && (practitioner.address[0].line || practitioner.address[0].text)
								? ' valid'
								: '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">city</label>
					<input
						type="text"
						name="address_city"
						value={(practitioner.address && practitioner.address[0].city) || ''}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' + (practitioner.address && practitioner.address[0].city ? ' valid' : '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">state</label>
					<input
						type="text"
						name="address_state"
						value={(practitioner.address && practitioner.address[0].state) || ''}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' + (practitioner.address && practitioner.address[0].state ? ' valid' : '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">postal code</label>
					<input
						type="number"
						name="address_postalCode"
						value={(practitioner.address && practitioner.address[0].postalCode) || ''}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' +
							(practitioner.address && practitioner.address[0].postalCode ? ' valid' : '')
						}
					/>
				</div>

				<div className="form-field">
					<label className="form-label">country</label>
					<input
						type="text"
						name="address_country"
						value={(practitioner.address && practitioner.address[0].country) || ''}
						onChange={event => handleInputChange(event)}
						className={
							'input--default' + (practitioner.address && practitioner.address[0].country ? ' valid' : '')
						}
					/>
				</div>
			</fieldset>

			{/* Contacts */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">telecom</legend>
				{practitioner.telecom &&
					practitioner.telecom.map((item, index) => (
						<div className="form-field" key={index}>
							<label className="form-label">contact {index + 1}</label>
							<div className="form-group">
								<select
									name="telecom_system"
									value={item.system}
									onChange={event => handleInputChange(event, index)}
									className={'form-select form-select--' + item.system}>
									<option value="phone">phone</option>
									<option value="fax">fax</option>
									<option value="email">email</option>
								</select>
								&nbsp;
								<select
									name="telecom_use"
									value={item.use}
									onChange={event => handleInputChange(event, index)}
									className={'form-select form-select--' + item.system}>
									<option value="">Choose a use</option>
									<option value="work">work</option>
									<option value="mobile">mobile</option>
									<option value="home">home</option>
								</select>
								&nbsp;
								<input
									type="text"
									name="telecom_value"
									value={item.value || ''}
									onChange={event => handleInputChange(event, index)}
									className={'input--default' + (item.value ? ' valid' : '')}
								/>
								<span className="form-delete" onClick={() => deleteContact(index)}>
									delete
								</span>
							</div>
						</div>
					))}

				<div className="form-add form-submit" onClick={addContact}>
					Add contact
				</div>
			</fieldset>

			{/* Gender */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">gender</legend>
				<div className="form-field">
					<select
						name="profile_gender"
						value={practitioner.gender}
						onChange={event => handleInputChange(event)}
						className={'form-select' + (practitioner.gender ? ' selected' : '')}>
						<option value="">Choose a gender</option>
						<option value="male">male</option>
						<option value="female">female</option>
					</select>
				</div>
			</fieldset>

			{/* Birthdate */}
			<fieldset className="form-fieldset">
				<legend className="form-legend">birthdate</legend>
				<div className="form-field">
					<input
						type="date"
						name="profile_birthDate"
						value={practitioner.birthDate || ''}
						onChange={event => handleInputChange(event)}
						className="input--default input--default--date"
					/>
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
					checked={practitioner.active || false}
					onChange={event => handleInputChange(event)}
					className="form-checkbox"
				/>
				<label htmlFor="profile_active">Are you active ?</label>
			</fieldset>

			<div className="form-bottom">
				<input type="submit" value="Update profile" className="form-submit" />
			</div>
		</form>
	);
};

export default Form;

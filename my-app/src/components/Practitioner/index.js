import React from 'react';

// Styles
import './style.css';

const Practitioner = props => {
	const { practitioner } = props;
	const resource = practitioner.resource;

	// Format address
	let addressObj = {};

	if (resource.address) {
		let resourceAddress = resource.address[0];

		if (resource.address[0].text) {
			let textAddress = resourceAddress.text.split(',');

			addressObj.city = textAddress[1].trim();
			addressObj.country = (textAddress[3] || '').trim();
			addressObj.line = textAddress[0].trim();
			addressObj.state = textAddress[2].trim();
		} else {
			addressObj.city = resourceAddress.city;
			addressObj.country = resourceAddress.country;
			addressObj.line = resourceAddress.line[0];
			addressObj.state = resourceAddress.state;
		}

		addressObj.postalCode = resourceAddress.postalCode;
		addressObj.type = resourceAddress.type;
		addressObj.use = resourceAddress.use;
	}

	const profile = {
		active: resource.active,
		address: addressObj,
		birthDate: resource.birthDate,
		familyName: resource.name[resource.name.length - 1].family.split(' ').pop(),
		gender: resource.gender,
		given: resource.name[resource.name.length - 1].given,
		prefix: resource.name[0].prefix,
		qualification: resource.qualification ? resource.qualification[0].code.coding[0].display : '',
		telecom: resource.telecom || [],
		use: resource.name[resource.name.length - 1].use,
	};

	return (
		<div className="practitioner" key={resource.id}>
			<div>
				identity: {profile.prefix} {profile.given} {profile.familyName}
			</div>
			<div>qualification: {profile.qualification}</div>

			<div>
				address
				{profile.address.type && (
					<span>
						({profile.address.type} - {profile.address.use})
					</span>
				)}
				:
				<span>
					{profile.address.line}
					{profile.address.city && <span>, {profile.address.city}</span>}
					{profile.address.state && <span>, {profile.address.state}</span>}
					{profile.address.postalCode && <span>, {profile.address.postalCode}</span>}
					{profile.address.country && <span>, {profile.address.country}</span>}
				</span>
			</div>

			<div>
				contacts:
				<ul>
					{profile.telecom.map((item, index) => (
						<li key={index}>
							{item.system} {item.use && <span>({item.use})</span>}: {item.value}
						</li>
					))}
				</ul>
			</div>

			<div>use: {profile.use}</div>
			<div>gender: {profile.gender}</div>
			<div>birthdate: {profile.birthDate}</div>
			<div>active: {profile.active ? 'yes' : ''}</div>
		</div>
	);
};

export default Practitioner;

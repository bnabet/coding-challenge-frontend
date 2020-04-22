import React from 'react';
import { Link } from 'react-router-dom';

// Styles
import './style.css';

const Card = props => {
	const { practitioner } = props;

	const practitionerId = practitioner.resource.id;
	const active = practitioner.resource.active;
	const name = practitioner.resource.name;
	const familyName = name[name.length - 1].family
		? name[name.length - 1].family.split(' ').pop()
		: name[name.length - 1]._family.extension.map(item => <span key={item.url}>{item.valueString} </span>);
	const given = name[name.length - 1].given;
	const prefix = name[0].prefix;

	return (
		<div className={'practitioner' + (active ? ' active' : '')} key={practitionerId}>
			<div>
				{prefix} {given} {familyName}
			</div>
			<Link to={`/practitioners/${practitionerId}`}>Details</Link>
		</div>
	);
};

export default Card;

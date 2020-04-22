import React from 'react';
import { Link } from 'react-router-dom';

// Styles
import './style.css';

const Card = props => {
	const { practitioner } = props;
	const practitionerId = practitioner.resource.id;
	const active = practitioner.resource.active;
	const name = practitioner.resource.name;

	// prefix/suffix
	const prefix = name[0].prefix;
	const suffix = name[0].suffix;

	// text (firstname + name)
	const text = name[0].text;

	// given (firstname)
	const given = name[name.length - 1].given
		? name[name.length - 1].given.join(' ')
		: '';

	// familyName (name)
	const familyName = name[name.length - 1].family
		? name[name.length - 1].family
		: name[name.length - 1]._family
			? name[name.length - 1]._family.extension.map(item => <span key={item.url}>{item.valueString} </span>)
			: '';

	return (
		<div className={'practitioner' + (active ? ' active' : '')} key={practitionerId}>
			<div>
				{prefix || suffix} {(familyName || given) ? <span>{given} {familyName}</span> : text}
			</div>
			<Link to={`/practitioners/${practitionerId}`}>Details</Link>
		</div>
	);
};

export default Card;

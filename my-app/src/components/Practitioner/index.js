import React from 'react';

const Practitioner = props => {
	const { practitioner } = props;
	const name = practitioner.resource.name;
	const familyName = name[name.length - 1].family.split(' ').pop();

	return <div key={practitioner.resource.id}>{familyName}</div>;
};

export default Practitioner;

import React from 'react';

// Components
import Practitioner from '../Practitioner';

const List = props => {
	const { practitioners } = props;

	const distinctNames = practitioners => {
		let MAP = [];
		let uniqueNames = [];

		// Distinct names
		practitioners.map(item => {
			const given = item.resource.name[item.resource.name.length - 1].given;
			const familyName = item.resource.name[item.resource.name.length - 1].family.split(' ').pop();

			if (MAP.indexOf(familyName) === -1 && given !== undefined) {
				MAP.push(familyName);
				uniqueNames.push(item);
			}
		});

		return uniqueNames;
	};

	return distinctNames(practitioners).map(item => <Practitioner key={item.resource.id} practitioner={item} />);
};

export default List;

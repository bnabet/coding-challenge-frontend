import React from 'react';

// Components
import Practitioner from '../Practitioner';

const List = props => {
	const { practitioners } = props;

	return practitioners.map(item => <Practitioner key={item.resource.id} practitioner={item} />);
};

export default List;

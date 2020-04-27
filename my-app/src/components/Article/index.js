import React from 'react';
import { Link } from 'react-router-dom';

// Components
import Name from '../Name'

// Styles
import './style.css';

const Article = props => {
	const { practitioner, avatar } = props;
	const data = practitioner.resource;

	let qualification = 'Practitioner';

	if (data.qualification && data.qualification[0].code.coding[0].display) {
		qualification = data.qualification[0].code.coding[0].display;
	}

	const id = data.id;
	const name = data.name;
	const active = data.active ? 'active' : 'inactive';

	return (
		<article className="component-practitioner article" key={id}>
			<div className={`article-icon avatar-${avatar}`}></div>
			<div className="article-identity">
				<Link
					to={{
						pathname: `/practitioners/${id}`,
						state: {
							avatar: avatar
						}
					}}
					className="article-link">
					<Name name={name} />
				</Link>
				<span className="article-resourceType">{qualification}</span>
			</div>
			<div className="article-status">
				<div className={`status-label ${active}`}>{active}</div>
			</div>
		</article>
	);
};

export default Article;

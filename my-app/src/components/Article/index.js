import React from 'react';
import { Link } from 'react-router-dom';

// Styles
import './style.css';

const Article = props => {
	const { practitioner, avatar } = props;
	const practitionerId = practitioner.resource.id;
	const active = practitioner.resource.active;
	const name = practitioner.resource.name;

	// civility
	const prefix = name[0].prefix ? name[0].prefix[0] : '';
	const suffix = name[0].suffix ? name[0].suffix[0] : '';

	// firstname
	const firstname = name[name.length - 1].given ? name[name.length - 1].given.join(' ') : '';

	// lastname
	let lastname;

	if (name[name.length - 1].family) {
		lastname = name[name.length - 1].family;
	} else if (name[name.length - 1]._family) {
		lastname = name[name.length - 1]._family.extension.map(item => item.valueString).join(' ');
	} else {
		lastname = name[0].text;
	}

	const identity = [prefix, suffix, firstname, lastname]
		.filter(item => item !== undefined)
		.filter(item => item !== '')
		.join(' ');

	return (
		<article className="component-practitioner article" key={practitionerId}>
			<div className={'article-icon avatar-' + avatar}></div>
			<div className="article-identity">
				<Link
					to={{
						pathname: `/practitioners/${practitionerId}`,
						state: {
							title: identity,
						},
					}}
					className="article-link">
					{identity}
				</Link>
				<span className="article-resourceType">{practitioner.resource.resourceType}</span>
			</div>
			<div className="article-status">
				<div className={'status-label' + (active ? ' active' : '')}>{active ? 'active' : 'inactive'}</div>
			</div>
		</article>
	);
};

export default Article;

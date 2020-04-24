import React from 'react';

// Styles
import './style.css';

const Footer = () => (
	<footer className="footer">
		<div className="footer-container">
			<div className="footer-infos">
				<div className="footer-bloc">
					<div className="footer-title">Need a front-end developper ?</div>
					<div className="footer-subtitle">
						Contact me{' '}
						<span role="img" aria-label="smiley smiling">
							😁
						</span>
					</div>
				</div>
				<div className="footer-bloc footer-bloc--contact">
					<div className="contact-mail">
						<small className="contact-label">Email</small>
						<a
							href="mailto:ben.nabet08@gmail.com"
							className="contact-link link--default"
							title="Send a mail to ben.nabet08@gmail.com">
							ben.nabet08@gmail.com
						</a>
					</div>
					<div className="contact-phone">
						<small className="contact-label">Phone</small>
						<a
							href="tel:+33695168424"
							className="contact-link link--default"
							title="Call Benjamin Nabet to +33 6 95 16 84 24">
							+33 6 95 16 84 24
						</a>
					</div>
				</div>
			</div>
			<hr className="footer-divider" />
			<div className="footer-copyright">Created by Benjamin Nabet - 2020</div>
		</div>
	</footer>
);

export default Footer;

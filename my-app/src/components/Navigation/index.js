import React from 'react';
import { NavLink } from 'react-router-dom';

// Styles
import './style.css';

const Navigation = () => (
    <nav className="header-nav">
        <ul className="nav-list">
            <NavLink
                exact to="/"
                className="nav-link link--default"
                activeClassName="active">
                Home
            </NavLink>
            <NavLink
                exact
                to="/practitioners"
                className="nav-link link--default"
                activeClassName="active">
                Practitioners
            </NavLink>
        </ul>
    </nav>
);

export default Navigation;
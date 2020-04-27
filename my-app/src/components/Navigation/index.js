import React from 'react';
import { NavLink } from 'react-router-dom';

// Styles
import './style.css';

const Navigation = () => (
    <nav className="header-nav">
        <ul className="nav-list">
            <li>
                <h1>
                    <NavLink
                        to="/"
                        className="header-title link--default">
                        Leah
                    </NavLink>
                </h1>
            </li>
            <li>
                <NavLink
                    exact to="/"
                    className="nav-link link--default"
                    activeClassName="active">
                    Home
                </NavLink>
            </li>
            <li>
                <NavLink
                    exact
                    to="/practitioners"
                    className="nav-link link--default"
                    activeClassName="active">
                    Practitioners
                </NavLink>
            </li>
        </ul>
    </nav>
);

export default Navigation;
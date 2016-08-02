import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import HeaderComponent from './components/HeaderComponent';

function RootView({ children }) {
	return (
		<div>
			<HeaderComponent />
			<Link to="/">Index</Link> | <Link to="/counter">Counter</Link>
			{children}
		</div>
	);
}

RootView.propTypes = {
	children: PropTypes.object,
};

export default RootView;

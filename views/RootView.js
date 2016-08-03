import React, { PropTypes } from 'react';
import css from '../gfx/css/main.scss'; // eslint-disable-line no-unused-vars

import HeaderComponent from './components/HeaderComponent';

function RootView({ children }) {
	return (
		<div>
			<HeaderComponent />
			{children}
		</div>
	);
}

RootView.propTypes = {
	children: PropTypes.object,
};

export default RootView;

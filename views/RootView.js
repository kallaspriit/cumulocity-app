import React, { PropTypes } from 'react';

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

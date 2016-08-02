import React from 'react';
import { Link } from 'react-router';

export default function MenuComponent() {
	return (
		<div>
			<Link to="/">Index</Link>
			{' | '}
			<Link to="/counter">Counter</Link>
			{' | '}
			<Link to="/user">User</Link>
		</div>
	);
}

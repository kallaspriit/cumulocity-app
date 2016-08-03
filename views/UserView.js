import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as userActions from '../actions/user-actions';

import HeaderComponent from './components/HeaderComponent';

class UserView extends Component {

	render() {
		const {
			user,
			fetchUser,
		} = this.props;

		return (
			<div>
				<HeaderComponent title="User" />
				{this.renderUserInfo(user)}
				<div>
					<button onClick={() => fetchUser(1)}>Load user #1</button>
					<button onClick={() => fetchUser(2)}>Load user #2</button>
					<button onClick={() => fetchUser('x')}>Load invalid user</button>
				</div>
			</div>
		);
	}

	renderUserInfo(user) {
		if (user.isLoading) {
			return (
				<em>loading user</em>
			);
		} else if (user.error !== null) {
			return (
				<em>loading user failed ({user.error.message})</em>
			);
		} else if (!user.info) {
			return (
				<em>click on the buttons below to load a user</em>
			);
		}

		return (
			<div>
				#{user.info.id} - {user.info.name}
			</div>
		);
	}
}

UserView.propTypes = {
	user: PropTypes.object,
	fetchUser: PropTypes.func.isRequired,
};

export default connect(
	state => ({ user: state.user }),
	{
		...userActions,
	}
)(UserView);

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as userActions from '../actions/user-actions';

class UserView extends Component {

	render() {
		const {
			user,
			fetchUser,
		} = this.props;

		return (
			<div>
				<h2>User view</h2>
				{this.renderUserInfo(user)}
				<div>
					<button onClick={() => fetchUser(1)}>Load user #1</button>
					<button onClick={() => fetchUser(2)}>Load user #2</button>
				</div>
			</div>
		);
	}

	renderUserInfo(user) {
		console.log('renderUserInfo', user);

		if (!user.info) {
			return (
				<em>user not loaded</em>
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

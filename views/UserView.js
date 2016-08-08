import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import RaisedButton from 'material-ui/RaisedButton';

import HeaderComponent from './components/HeaderComponent';

import * as userActions from '../actions/user-actions';

class UserView extends Component {

	static propTypes = {
		user: PropTypes.object,

		fetchUser: PropTypes.func.isRequired,
	};

	render() {
		const {
			user,
			fetchUser,
		} = this.props;

		const btnStyle = {
			margin: '0 5px',
		};

		return (
			<div className="user-view">
				<HeaderComponent title="User" />
				<Card className="main-contents">
					<CardText>
						{this.renderUserInfo(user)}
						<div>
							<RaisedButton onTouchTap={() => fetchUser(1)} style={btnStyle}>Load user #1</RaisedButton>
							<RaisedButton onTouchTap={() => fetchUser(2)} style={btnStyle}>Load user #2</RaisedButton>
							<RaisedButton onTouchTap={() => fetchUser('x')} style={btnStyle}>Load invalid</RaisedButton>
						</div>
					</CardText>
				</Card>
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
			<CardHeader
				title={user.info.name}
				subtitle="Telia"
				avatar="/gfx/images/avatar.png"
			/>
		);
	}
}

export default connect(
	state => ({
		user: state.user,
	}), {
		...userActions,
	}
)(UserView);

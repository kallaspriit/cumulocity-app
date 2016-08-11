import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Card from 'material-ui/Card/Card';
import CardTitle from 'material-ui/Card/CardTitle';
import CardMedia from 'material-ui/Card/CardMedia';
import CardText from 'material-ui/Card/CardText';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';

import HeaderComponent from './components/HeaderComponent';
import ErrorMessageComponent from './components/ErrorMessageComponent';

import * as platformActions from '../actions/platform-actions';

class AuthenticationView extends Component {

	static propTypes = {
		authentication: PropTypes.object.isRequired,

		setCredentials: PropTypes.func.isRequired,
		authenticate: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {
			tenant: props.authentication.info.tenant,
			username: props.authentication.info.username,
			password: props.authentication.info.password,
		};
	}

	render() {
		const {
			authentication,
		} = this.props;


		const isLoading = authentication.isLoading;
		const loaderStyle = {
			visibility: isLoading ? 'visible' : 'hidden',
		};

		return (
			<div className="authentication-view">
				<HeaderComponent title="Authentication" menus={this.renderHeaderMenus()} />
				<Card className="main-contents">
					<CardMedia
						overlay={
							<CardTitle
								title="Login"
								subtitle="Authenticate using your credentials"
							/>
						}
					>
						<img
							src="/gfx/images/authentication-background.jpg"
							alt="Login"
						/>
					</CardMedia>
					<LinearProgress mode="indeterminate" style={loaderStyle} />
					<CardText>
						<ErrorMessageComponent
							message="Invalid credentials, please try again"
							isVisible={authentication.info.isInvalidCredentials}
						/>
						<TextField
							id="tenant"
							hintText="Tenant"
							fullWidth
							disabled={isLoading}
							value={this.state.tenant}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<TextField
							id="username"
							hintText="Username"
							fullWidth
							disabled={isLoading}
							value={this.state.username}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<TextField
							id="password"
							hintText="Password"
							type="password"
							fullWidth
							disabled={isLoading}
							value={this.state.password}
							onChange={(event) => this.handleTextFieldChange(event)}
						/>
						<RaisedButton
							label="Login"
							className="login-button"
							primary
							fullWidth
							disabled={isLoading}
							onTouchTap={() => this.handleLogin()}
						/>
					</CardText>
				</Card>
			</div>
		);
	}

	renderHeaderMenus() {
		return [
			<MenuItem key={1} onTouchTap={() => this.handleLogout()}>Logout</MenuItem>,
		];
	}

	handleLogin() {
		this.props.setCredentials(
			this.state.tenant,
			this.state.username,
			this.state.password,
		);

		this.props.authenticate();
	}

	handleLogout() {
		console.log('logout');
	}

	handleTextFieldChange(event) {
		this.setState({
			[event.target.id]: event.target.value,
		});
	}
}

export default connect(
	state => ({
		authentication: state.authentication,
	}), {
		...platformActions,
	}
)(AuthenticationView);

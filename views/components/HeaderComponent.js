import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';

import * as menuActions from '../../actions/menu-actions';

class HeaderComponent extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,

		openMainMenu: PropTypes.func.isRequired,
	}

	static contextTypes = {
		router: React.PropTypes.object.isRequired,
		history: React.PropTypes.object.isRequired,
	}

	render() {
		return (
			<AppBar
				title={this.props.title}
				iconElementLeft={this.renderIconElementLeft()}
				iconElementRight={this.renderIconElementRight()}
				className="header-component"
			/>
		);
	}

	renderIconElementLeft() {
		const canGoBack = window.history.length > 1; // eslint-disable-line

		console.log('canGoBack', canGoBack, window.history.length, this.context.router, this.context.history);

		window.r = this.context.router;
		window.h = this.context.history;

		if (!canGoBack) {
			return (
				<IconButton onTouchTap={() => this.handleOpenMenu()}>
					<ArrowForwardIcon />
				</IconButton>
			);
		}

		return (
			<IconButton onTouchTap={() => this.handleBack()}>
				<ArrowBackIcon />
			</IconButton>
		);
	}

	renderIconElementRight() {
		const menuOrigin = {
			horizontal: 'right',
			vertical: 'top',
		};

		return (
			<IconMenu
				iconButtonElement={
					<IconButton><MoreVertIcon /></IconButton>
				}
				targetOrigin={menuOrigin}
				anchorOrigin={menuOrigin}
			>
				<MenuItem onTouchTap={this.handleOpen('device')}>Device</MenuItem>
				<MenuItem onTouchTap={this.handleOpen('user')}>User</MenuItem>
			</IconMenu>
		);
	}

	handleOpenMenu() {
		this.props.openMainMenu();
	}

	handleBack() {
		browserHistory.goBack();
	}

	handleOpen(view) {
		return () => {
			browserHistory.push(`/${view}`);
		};
	}

}

export default connect(
	state => ({}), {
		...menuActions,
	}
)(HeaderComponent);

import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router'

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';

import MenuComponent from './MenuComponent';

export default class HeaderComponent extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired
	}

	render() {
		return (
			<AppBar
			    title={this.props.title}
			    iconElementLeft={this.renderIconElementLeft()}
				iconElementRight={this.renderIconElementRight()}
			/>
		);
	}

	renderIconElementLeft() {
		return (
			<IconButton onTouchTap={this.handleBack}>
				<ArrowBackIcon />
			</IconButton>
		);
	}

	renderIconElementRight() {
		const menuOrigin = {
			horizontal: 'right',
			vertical: 'top'
		};

		return (
			<IconMenu
				iconButtonElement={
					<IconButton><MoreVertIcon /></IconButton>
				}
				targetOrigin={menuOrigin}
				anchorOrigin={menuOrigin}
			>
				<MenuItem primaryText="Counter" onTouchTap={this.handleOpen('counter')} />
				<MenuItem primaryText="User" onTouchTap={this.handleOpen('user')} />
			</IconMenu>
		);
	}

	handleBack() {
		browserHistory.goBack();
	}

	handleOpen(view) {
		return () => {
			browserHistory.push(`/${view}`)
		}
	}

}

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ErrorMessageComponent extends Component {

	static propTypes = {
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	};

	static defaultProps = {
		message: 'Something went wrong',
		isVisible: true,
	};

	render() {
		const className = classNames({
			'error-message-component': true,
			'is-visible': this.props.isVisible,
		});

		return (
			<div className={className}>
				{this.props.message}
			</div>
		);
	}

}

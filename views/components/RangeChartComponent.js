import React, { Component, PropTypes } from 'react';
import Chart from 'react-highcharts';
import highchartsMore from 'highcharts-more';

highchartsMore(Chart.Highcharts);

export default class RangeChartComponent extends Component {

	static propTypes = {
		title: PropTypes.string.isRequired,
		data: PropTypes.array.isRequired,
		height: PropTypes.number,
	};

	static defaultProps = {
		height: 400,
		unit: '',
	};

	constructor(props) {
		super(props);

		this.chart = null;
	}

	componentWillReceiveProps({
		value,
	}) {
		const chart = this.chart.getChart();

		chart.series[0].points[0].update(this.formatValue(value));
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		const {
			title,
			height,
			data,
		} = this.props;

		const config = {
			chart: {
				type: 'arearange',
				zoomType: 'x',
				backgroundColor: 'rgba(255, 255, 255, 0)',
				height,
			},

			title: {
				text: title,
			},

			xAxis: {
				type: 'datetime',
			},

			yAxis: {
				title: {
					text: null,
				},
			},

			legend: {
				enabled: false,
			},

			credits: {
				enabled: false,
			},

			series: [{
				name: 'USD to EUR',
				data: data.map((item) => [
					item[0].getTime() - (item[0].getTimezoneOffset() * 60 * 1000),
					item[1],
					item[2],
				]),
			}],
		};

		return (
			<Chart
				ref={c => (this.chart = c)}
				config={config}
			/>
		);
	}

	formatValue(value) {
		return Math.round(value * 10) / 10;
	}

}

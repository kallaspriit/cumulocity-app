import keyMirror from 'keymirror';
import AbstractModel from '../src/AbstractModel';

export default class MeasurementModel extends AbstractModel {

	static Type = keyMirror({
		UNSUPPORTED: null,
		LIGHT: null,
		MOTION: null,
		RELAY: null,
	});

	getSchema() {
		return {
			type: Object.keys(MeasurementModel.Type),
			info: Object,
		};
	}

}

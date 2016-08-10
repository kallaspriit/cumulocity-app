import keyMirror from 'keymirror';
import AbstractModel from '../src/AbstractModel';
import CapabilityModel from '../models/CapabilityModel';

export default class MeasurementModel extends AbstractModel {

	static Type = keyMirror({
		UNSUPPORTED: null,
		LIGHT: null,
	});

	getSchema() {
		return {
			capability: Object.keys(CapabilityModel.Type),
			type: Object.keys(MeasurementModel.Type),
			info: Object,
		};
	}

}

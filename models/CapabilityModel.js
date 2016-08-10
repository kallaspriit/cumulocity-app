import keyMirror from 'keymirror';
import AbstractModel from '../src/AbstractModel';

export default class CapabilityModel extends AbstractModel {

	static Type = keyMirror({
		UNSUPPORTED: null,
		HARDWARE: null,
		RELAY: null,
		LIGHT: null,
		MOTION: null,
	});

	getSchema() {
		return {
			type: Object.keys(CapabilityModel.Type),
			info: Object,
		};
	}

}

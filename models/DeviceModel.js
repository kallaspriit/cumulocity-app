import AbstractModel from '../src/AbstractModel';

export default class DeviceModel extends AbstractModel {

	getSchema() {
		return {
			id: String,
			name: String,
			serial: [String, null],
			model: [String, null],
			isOnline: Boolean,
			childDevices: Array.of(DeviceModel),
		};
	}

}

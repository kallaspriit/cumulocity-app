export default class DeviceModel {

	constructor({
		id,
		name,
		serial,
		model,
		isOnline,
	}) {
		this.id = id;
		this.name = name;
		this.serial = serial;
		this.model = model;
		this.isOnline = isOnline;
	}

}

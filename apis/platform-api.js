import AbstractPlatform from '../libs/platform/AbstractPlatform';

export class PlatformApi extends AbstractPlatform {

	setProvider(provider) {
		this.provider = provider;

		this._setupProxy();
	}

	getDevices() {
		return this.provider.getDevices();
	}

	_getProviderMethodNames() {
		return Object.getOwnPropertyNames(Object.getPrototypeOf(this.provider));
	}

	_getExpectedMethodNames() {
		return Object.getOwnPropertyNames(AbstractPlatform.prototype).filter(
			this._isProxiedMethodName
		);
	}

	_isProxiedMethodName(methodName) {
		if (methodName.substr(0, 1) === '_') {
			return false;
		}

		if (methodName === 'constructor') {
			return false;
		}

		return true;
	}

	_setupProxy() {
		const proxiedMethodNames = [];
		const expectedMethodNames = this._getExpectedMethodNames();

		this._getProviderMethodNames().forEach((methodName) => {
			if (!this._isProxiedMethodName(methodName)) {
				return;
			}

			this[methodName] = (...args) => this.provider[methodName](...args);

			proxiedMethodNames.push(methodName);
		});

		this._verifyAbstractPlatformImplemented(proxiedMethodNames, expectedMethodNames);
	}

	_verifyAbstractPlatformImplemented(proxiedMethodNames, expectedMethodNames) {
		expectedMethodNames.forEach((expectedMethodName) => {
			if (proxiedMethodNames.indexOf(expectedMethodName) === -1) {
				throw new Error(`Expected platform provider to implement "${expectedMethodName}"`);
			}
		});
	}
}

export default new PlatformApi();

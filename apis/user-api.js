export class UserApi {

	fetchUser(id) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (typeof id !== 'number') {
					reject(new Error(`User with id ${id} could not be found`));

					return;
				}

				const userInfo = {
					id,
					name: `User ${id}`,
				};

				resolve(userInfo);
			}, 1000);
		});
	}
}

export default new UserApi();

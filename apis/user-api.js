export class UserApi {

	fetchUser(id) {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					id,
					name: `User ${id}`,
				});
			}, 3000);
		});
	}
}

export default new UserApi();

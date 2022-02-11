import AuthenticationControllerPlanner from '../controllersPlanner/authenticationControllerPlanner';

export default (router, app) => {
	const authenticationControllerPlanner = new AuthenticationControllerPlanner(app, 'user');

	router.post(`/auth/login`, authenticationControllerPlanner.login);

	router.post(`/auth/confirmCode`, authenticationControllerPlanner.confirmCode);

	router.post(
		`/auth/loginWithToken`,
		authenticationControllerPlanner.loginWithToken
	);
};

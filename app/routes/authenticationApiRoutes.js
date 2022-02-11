import AuthenticationController from '../controllers/authenticationController';

export default (router, app) => {
	const authenticationController = new AuthenticationController(app, 'user');

	router.post(`/auth/login`, authenticationController.login);

	router.post(`/auth/confirmCode`, authenticationController.confirmCode);

	router.post(
		`/auth/loginWithToken`,
		authenticationController.loginWithToken
	);
};

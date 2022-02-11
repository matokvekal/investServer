import AuthenticationControllerMobile from '../controllersMobile/authenticationControllerMobile';

export default (router, app) => {
	const authenticationControllerMobile = new AuthenticationControllerMobile(app, 'user');

	router.post(`/auth/login`, authenticationControllerMobile.login);

	router.post(`/auth/confirmCode`, authenticationControllerMobile.confirmCode);

	router.post(
		`/auth/loginWithToken`,
		authenticationControllerMobile.loginWithToken
	);
};

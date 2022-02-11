import SmsControllerMobile from '../controllersMobile/smsControllerMobile';

export default (router) => {
	const smsControllerMobile = new SmsControllerMobile();

	router.post(`/sms/sendSms`, smsControllerMobile.sendSms);
};

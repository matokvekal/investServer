import SmsControllerPlanner from '../controllersPlanner/smsControllerPlanner';

export default (router) => {
	const smsControllerPlanner = new SmsControllerPlanner();

	router.post(`/sms/sendSms`, smsControllerPlanner.sendSms);
};

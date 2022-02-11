import SmsController from '../controllers/smsController';

export default (router) => {
	const smsController = new SmsController();

	router.post(`/sms/sendSms`, smsController.sendSms);
};

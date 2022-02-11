import moment from 'moment';
import { Op } from 'sequelize';
import { ServerLoginMessages } from '../constants/ServerMessages';
import { createSingleLog } from '../utils/apiLoggerUtils';
import {
	confirmConfirmationCode,
	createConfirmationCode,
	createToken,
	getFixedPhoneNumber,
	sendConfirmationCodeBySMS,
} from '../utils/authenticationUtils';
import BaseController from './baseController';

class AuthenticationController extends BaseController {
	constructor(app, modelName) {
		super(app, modelName);
		this.modelName = modelName || 'user';
	}

	// POST /auth/login
	login = async (req, res) => {
		try {
			// await createSingleLog(this.allModel, req, 'TEST FROM CREATE SINGLE LOG IN LOGIN'); // EXAMPLE FOR LOG
			const { phoneNumber } = req.body;
			// console.log('at login,',phoneNumber)
			const fixedPhoneNumber = getFixedPhoneNumber(phoneNumber);
			const { confirmationCode, lastConfirmationCodeDate } =
				createConfirmationCode();

			const smsTrys = await this.dbModel.increment(
				{
					sms_trys: 1,
				},
				{
					where: {
						user_name: fixedPhoneNumber,
						is_active: true,
						sms_trys: {
							[Op.lt]: 500,
						},
					},
				}
			);

			if (!(smsTrys && smsTrys[0] && smsTrys[0][1])) {
				// return res.status(400).send({
				//   message: ServerLoginMessages.TO_MANY_SMS_TRYS,
				// });
				return await res.createErrorLogAndSend({
					message: ServerLoginMessages.TO_MANY_SMS_TRYS,
					status: 400,
				});
			}
			const result = await this.dbModel.update(
				{
					otp: confirmationCode,
					otp_sent_date: lastConfirmationCodeDate,
				},
				{
					where: {
						user_name: fixedPhoneNumber,
						is_active: true,
					},
				}
			);
			if (result && result[0]) {
				const smsResult = await sendConfirmationCodeBySMS(
					fixedPhoneNumber,
					confirmationCode
				);
				if (smsResult) {
					return res.status(200).send({ result: true });
				}
				// return res.status(400).send({
				//   message: ServerLoginMessages.FAILED_TO_SEND_SMS,
				// });
				return await res.createErrorLogAndSend({
					message: ServerLoginMessages.FAILED_TO_SEND_SMS,
					status: 400,
				});
			}
			return await res.createErrorLogAndSend({
				message: ServerLoginMessages.CANT_FIND_USER,
				status: 400,
			});
		} catch (err) {
			return await res.createErrorLogAndSend({ err });
		}
	};

	// POST /auth/confirmCode
	confirmCode = async (req, res) => {
		try {
			const { phoneNumber, confirmationCode } = req.body;
			const fixedPhoneNumber = getFixedPhoneNumber(phoneNumber);
			const usersResult = await this.dbModel.findAll({
				where: {
					user_name: fixedPhoneNumber,
				},
			});
			if (usersResult) {
				const user = usersResult[0];
				if (
					confirmConfirmationCode(
						confirmationCode,
						user.otp,
						user.otp_sent_date
					)
				) {
					const token = createToken(fixedPhoneNumber);
					await this.dbModel.update(
						{ last_login: moment() },
						{
							where: {
								user_name: phoneNumber,
							},
						}
					);
					return res.send({ token, zones: user.zones });
				} else {
					// return res.status(401).send({
					//   message: ServerLoginMessages.WRONG_OTP,
					// });
					return await res.createErrorLogAndSend({
						message: ServerLoginMessages.WRONG_OTP,
						status: 401,
					});
				}
			}
			// return res.status(401).send({
			//   message: ServerLoginMessages.CANT_FIND_USER,
			// });
			return await res.createErrorLogAndSend({
				message: ServerLoginMessages.CANT_FIND_USER,
				status: 401,
			});
		} catch (err) {
			return await res.createErrorLogAndSend({ err });
		}
	};

	loginWithToken = async (req, res) => {
		try {
			// this is from the middleware - 'authenticationMiddleware'
			if (req.user) {
				const userName =
					req.user.user_name || req.user.dataValues.user_name;
				await this.dbModel.update(
					{ last_login: moment() },
					{
						where: {
							user_name: userName,
						},
					}
				);
				return res.send(req.user.dataValues || req.user);
			}
			// if (req.canBypass) {
			// 	const fakeUser = {
			// 		user_name: '9720502223753',
			// 		first_name: 'TEST',
			// 		last_name: 'TESTING',
			// 		zones: 'no_zone',
			// 		company_id: 100,
			// 	};
			// 	return res.send({ ...fakeUser, fake: true });
			// }
			// return res.status(401).send(ServerLoginMessages.ERROR_PARSING_TOKEN);
			return await res.createErrorLogAndSend({
				message: ServerLoginMessages.ERROR_PARSING_TOKEN,
				status: 401,
			});
		} catch (err) {
			return await res.createErrorLogAndSend({ err });
		}
	};
}
export default AuthenticationController;

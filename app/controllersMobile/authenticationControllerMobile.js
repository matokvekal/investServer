import moment from 'moment';
import config from '../config';
import { ServerLoginMessages } from '../constants/ServerMessages';
import {
	confirmConfirmationCode,
	createConfirmationCode,
	createToken,
	getFixedPhoneNumber,
	sendConfirmationCodeBySMS,
} from '../utils/authenticationUtils';
import BaseControllerMobile from './baseControllerMobile';

class AuthenticationControllerMobile extends BaseControllerMobile {
	constructor(app, modelName) {
		super(app, modelName);
		this.modelName = modelName || 'user';
	}

	// POST /auth/login
	login = async (req, res) => {
		try {
			const { phoneNumber } = req.body;
			const fixedPhoneNumber = getFixedPhoneNumber(phoneNumber);
			const { confirmationCode, lastConfirmationCodeDate } =
				createConfirmationCode();

			if (
				fixedPhoneNumber &&
				fixedPhoneNumber === config.googlePhonenumber
			) {
				const controlTable =
					this.app && this.app.get('dbModels')
						? this.app.get('dbModels').control
						: null;
				if (controlTable) {
					const canBypassLoginFromDbResult =
						await controlTable.findAll({
							where: {
								key: 'bypass_google',
							},
						});
					if (
						canBypassLoginFromDbResult &&
						canBypassLoginFromDbResult.length &&
						canBypassLoginFromDbResult[0].dataValues.value === '1'
					) {
						return res.status(200).send({ result: true });
					}
				}
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
				// 	message: ServerLoginMessages.FAILED_TO_SEND_SMS,
				// });
				return await res.createErrorLogAndSend({
					message: ServerLoginMessages.FAILED_TO_SEND_SMS,
					status: 400,
				});
			}
			// return res.status(400).send({
			// 	message: ServerLoginMessages.CANT_FIND_USER,
			// });
			return await res.createErrorLogAndSend({
				message: ServerLoginMessages.CANT_FIND_USER,
				status: 400,
			});
		} catch (err) {
			console.log(err);
			return await res.createErrorLogAndSend({ err });
		}
	};

	// POST /auth/confirmCode
	confirmCode = async (req, res) => {
		try {
			const { phoneNumber, confirmationCode } = req.body;
			const usersResult = await this.dbModel.findAll({
				where: {
					user_name: phoneNumber,
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
					const token = createToken(phoneNumber);
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
					// 	message: ServerLoginMessages.WRONG_OTP,
					// });
					return await res.createErrorLogAndSend({
						message: ServerLoginMessages.WRONG_OTP,
						status: 401,
					});
				}
			}
			// return res.status(401).send({
			// 	message: ServerLoginMessages.CANT_FIND_USER,
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
			if (req.canBypass) {
				const fakeUser = {
					user_name: 'TEST',
					first_name: 'TEST',
					last_name: 'TESTING',
					zones: 'no_zone',
					company_id: 1,
				};
				return res.send({ ...fakeUser, fake: true });
			}
			// return res
			// 	.status(401)
			// 	.send(ServerLoginMessages.ERROR_PARSING_TOKEN);
			return await res.createErrorLogAndSend({
				message: ServerLoginMessages.ERROR_PARSING_TOKEN,
				status: 401,
			});
		} catch (err) {
			return await res.createErrorLogAndSend({ err });
		}
	};
}
export default AuthenticationControllerMobile;

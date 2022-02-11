import moment from 'moment';
import jwt from 'jsonwebtoken';
import config from '../config';
import sendSms from '../services/smsProviders/sendMsg';

export const createConfirmationCode = () => {
	const confirmationCode = Math.floor(1000 + Math.random() * 9000);
	return { confirmationCode, lastConfirmationCodeDate: moment() };
};

export const sendConfirmationCodeBySMS = async (
	phoneNumber,
	confirmationCode
) => {
	const result = await sendSms(
		[phoneNumber],
		`Your Confirmation Code: ${confirmationCode}`
	);
	if (result) {
		return confirmationCode;
	}
	return result;
};

export const confirmConfirmationCode = (
	confirmationCode,
	lastConfirmationCode,
	lastConfirmationCodeDate
) => {
	const amountOfTimeAllowedInMinutes = config.confirmationCodeLimit;
	return (
		// checks its the same code and that 5 minutes didnt pass
		lastConfirmationCode === confirmationCode &&
		moment().diff(moment(lastConfirmationCodeDate), 'minutes') <
		amountOfTimeAllowedInMinutes
	);
};

export const createToken = (phoneNumber) => {
	const token = jwt.sign(
		{ user_name: phoneNumber, last_login: moment() },
		config.TOKEN_KEY,
		{
			expiresIn: `${config.tokenExpireDayLimit}d`,
		}
	);
	return token;
};

export const getTokenFromReq = (req) => {
	return req.body.token || req.query.token || req.headers['token'];
};

export const getEnv = () => {
	return process.env.MODE || 'development';
};

export const getFixedPhoneNumber = (phoneNumber) => {
	return phoneNumber && phoneNumber[3] === '0' ? phoneNumber : `${phoneNumber.slice(0, 3)}0${phoneNumber.slice(3)}`;
}
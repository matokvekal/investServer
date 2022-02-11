import { ServerLoginMessages } from '../constants/ServerMessages';
import jwt from 'jsonwebtoken';
import config from '../config';
import {
	getTokenFromReq,
	getEnv,
	getFixedPhoneNumber,
} from '../utils/authenticationUtils';
import { Op } from 'sequelize';
import moment from 'moment';

const bypassPathsWhiteList = ['/auth/login', '/auth/confirmCode'];
const bypassEnvsWhiteList = ['local', 'development'];

const bypass = async (req, db) => {
	const isPathCanBypass = bypassPathsWhiteList.find((allowedPath) =>
		req.path.includes(allowedPath)
	);
	if (!isPathCanBypass) {
		const env = getEnv();
		const isEnvCanBypass = bypassEnvsWhiteList.includes(env);
		if (isEnvCanBypass && db.control) {
			const canBypassLoginFromDbResult = await db.control.findAll({
				where: {
					key: 'canBypassLogin',
				},
			});
			if (
				canBypassLoginFromDbResult &&
				canBypassLoginFromDbResult.length
			) {
				return (
					canBypassLoginFromDbResult[0].dataValues.value === '1' &&
					canBypassLoginFromDbResult[0].dataValues.company_id === 1 &&
					isEnvCanBypass
				);
			}
			return isEnvCanBypass;
		}
		return isEnvCanBypass;
	}
	return isPathCanBypass;
};

const authenticationMiddleware = (db) => async (req, res, next) => {
	const token = getTokenFromReq(req);
	const canBypass = await bypass(req, db);
	if (token) {
		try {
			const verifiedTokenValue = jwt.verify(token, config.TOKEN_KEY);
			const { user_name, last_login } = verifiedTokenValue;
			const fixedPhoneNumber = getFixedPhoneNumber(user_name);
			if (fixedPhoneNumber && last_login) {
				const userRsult = await db.user.findAll({
					where: {
						user_name: fixedPhoneNumber,
						last_login: {
							[Op.gte]: moment(last_login)
								.add(-1, 'days')
								.toDate(),
							[Op.lte]: moment(last_login)
								.add(config.tokenExpireDayLimit, 'days')
								.toDate(),
						},
					},
				});
				const validFoundUser =
					userRsult && (userRsult.length > 0 || userRsult.dataValues)
						? userRsult.length > 0
							? userRsult[0]
							: userRsult
						: null;
				if (!validFoundUser) {
					if (!canBypass) {
						return await res.createErrorLogAndSend({
							message: ServerLoginMessages.INVALID_TOKEN,
							status: 403,
						});
					} else {
						req.canBypass = true;
						req.zones = 'no_zone';
						req.company_id = 100;
						return next();
					}
				}

				req.company_id = validFoundUser.company_id;
				req.user = {
					user_name: validFoundUser.user_name,
					first_name: validFoundUser.first_name,
					last_name: validFoundUser.last_name,
					zones: validFoundUser.zones,
					user_role: validFoundUser.user_role,
					blocked: validFoundUser.blocked,
					block_date: validFoundUser.block_date,
				};
			}
			return next();
		} catch (err) {
			if (!canBypass) {
				return await res.createErrorLogAndSend({
					err,
					message: ServerLoginMessages.INVALID_TOKEN,
					status: 403,
				});
			} else {
				req.canBypass = true;
				req.zones = 'no_zone';
				req.company_id = 100;
				return next();
			}
		}
	}
	if (!canBypass) {
		return await res.createErrorLogAndSend({
			message: ServerLoginMessages.TOKEN_REQUIRED,
			status: 403,
		});
	}
	req.canBypass = true;
	req.zones = 'no_zone';
	req.company_id = 100;
	return next();
};

export default authenticationMiddleware;

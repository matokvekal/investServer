// TODO: Support multiple environments

import Logger from '../utils/Logger';

const mode = process.env.MODE || 'development';
// const mode = process.env.MODE || 'localhost';

Logger.debug(`Server is running in ${mode} mode`);

const configByEnv = {
	connection: {
		multipleStatements: true,
		host: '.eu-central-1.rds.amazonaws.com',
		user: 'admin',
		password: '!',
		DB: '-dev',
		dialect: 'mysql',
	},
	development: {
		database: {
			HOST: '.eu-central-1.rds.amazonaws.com',
			USER: 'admin',
			PORT: 3306,
			PASSWORD: '!',
			NAME: 'dev',
			dialect: 'mysql',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		port: process.env.PORT || 5000,
		allowedOrigins:
			'http-website.eu-central-1.amazonaws.com',
		TOKEN_KEY: 'invest_KEY_LOCAL',
		confirmationCodeLimit: 10,
		tokenExpireDayLimit: 30,
		loggerDebounceAmountInMS: 60000,
		smsSiteID: 35749,
		smsSitePassword: '07b5f2b2dDcF',
		smsSenderPhone: 'invest',
		smsMessageInnerName: 'investSMS',
		allowedAmountOfRequestsForIpPerMinute: 100,
		allowedAmountOfRequestsForIpPerFullDay: 5000,
		googlePhonenumber: '9720001116660',
	},
	preprod: {
		database: {
			HOST: 'eu-central-1.rds.amazonaws.com',
			USER: 'admin',
			PORT: 3306,
			PASSWORD: '',
			NAME: 'preprod',
			dialect: 'mysql',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		port: process.env.PORT || 5000,
		allowedOrigins:
			'.s3-website.eu-central-1.amazonaws.com',
		TOKEN_KEY: 'invest_KEY_LOCAL',
		confirmationCodeLimit: 10,
		tokenExpireDayLimit: 30,
		loggerDebounceAmountInMS: 60000,
		smsSiteID: 35749,
		smsSitePassword: '07b5f2b2dDcF',
		smsSenderPhone: 'invest',
		smsMessageInnerName: 'investSMS',
		allowedAmountOfRequestsForIpPerMinute: 100,
		allowedAmountOfRequestsForIpPerFullDay: 5000,
		googlePhonenumber: '9720001116660',
	},
	localhost: {
		database: {
			HOST: 'localhost',
			USER: 'root',
			PORT: 3306,
			PASSWORD: '',
			NAME: 'gf-temp',
			dialect: 'mysql',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		port: process.env.PORT || 5000,
		allowedOrigins:
			'stg.s-central-1.amazonaws.com',
		TOKEN_KEY: 'KEY_DEVELOPMENT',
		confirmationCodeLimit: 5,
		tokenExpireDayLimit: 30,
		loggerDebounceAmountInMS: 60000,
		smsSiteID: 35749,
		smsSitePassword: '',
		smsSenderPhone: '',
		smsMessageInnerName: 'GrSMS',
		allowedAmountOfRequestsForIpPerMinute: 100,
		allowedAmountOfRequestsForIpPerFullDay: 5000,
		googlePhonenumber: '97206660',
	},
	production: {
		database: {
			HOST: '-prod.eu-central-1.rds.amazonaws.com',
			USER: 'admin',
			PORT: 3306,
			PASSWORD: 'v2',
			NAME: 'prod',
			dialect: 'mysql',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		},
		port: process.env.PORT || 5000,
		allowedOrigins:'prod.s3al-1.amazonaws.com',
		TOKEN_KEY: 'ION',
		confirmationCodeLimit: 5,
		tokenExpireDayLimit: 30,
		loggerDebounceAmountInMS: 60000,
		smsSiteID: 35749,
		smsSitePassword: '',
		smsSenderPhone: '',
		smsMessageInnerName: '',
		allowedAmountOfRequestsForIpPerMinute: 200,
		allowedAmountOfRequestsForIpPerFullDay: 8000,
		googlePhonenumber: '972010',
	},
};

export default configByEnv[mode];

export default (sequelize, Types) => {
	const User = sequelize.define("user", {
		user_name: {
			type: Types.STRING,
			allowNull: false,
		},
		first_name: {
			type: Types.STRING,
		},
		last_name: {
			type: Types.STRING,
		},
		user_role: {
			type: Types.STRING,
		},
		company_id: {
			type: Types.INTEGER,
			allowNull: true,
		},
		is_active: {
			type: Types.INTEGER,
		},
		otp: {
			type: Types.STRING,
		},
		otp_sent_date: {
			type: Types.DATE,
		},
		last_login: {
			type: Types.DATE,
		},
		zones: {
			type: Types.STRING,
		},
		sms_trys: {
			type: Types.INTEGER,
		},
		blocked: {
			type: Types.INTEGER,
		},
		block_date: {
			type: Types.DATE,
		},
		requestsPerMinute: {
			type: Types.INTEGER,
		},
		requestsPerDay: {
			type: Types.INTEGER,
		},
	},
		{
			timestamps: false,
			indexes: [
				{
					unique: true,
					fields: ['user_name', 'company_id']
				}
			]
		}
	);

	User.removeAttribute('id');

	return User;
};

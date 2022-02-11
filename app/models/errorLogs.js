export default (sequelize, DataTypes) => {
	const errorLogs = sequelize.define('log_errors', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_name: {
			type: DataTypes.STRING,
		},
		company_id: {
			type: DataTypes.INTEGER,
		},
		date: {
			type: DataTypes.DATE,
		},
		ip: {
			type: DataTypes.STRING,
		},
		path: {
			type: DataTypes.STRING,
		},
		err: {
			type: DataTypes.STRING,
		},
	});
	return errorLogs;
};

export default (sequelize, DataTypes) => {
	const systemLogs = sequelize.define('system_logs', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		MS_name: {
			type: DataTypes.STRING,
		},
		company_id: {
			type: DataTypes.INTEGER,
		},
		date: {
			type: DataTypes.DATE,
		},
		start_time: {
			type: DataTypes.STRING,
		},
		finish_time: {
			type: DataTypes.STRING,
		},
	});
	return systemLogs;
};

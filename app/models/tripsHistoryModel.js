module.exports = (sequelize, DataTypes) => {
	const TripsHistory = sequelize.define('trips_history', {
		company_id: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
		},
		resource_id: {
			type: DataTypes.INTEGER,
		},
		trip_status: {
			type: DataTypes.STRING,
		},
		client_code: {
			type: DataTypes.INTEGER,
		},
		start_time: {
			type: DataTypes.TIME,
		},
		end_time: {
			type: DataTypes.TIME,
		},
		line_code: {
			type: DataTypes.INTEGER,
		},
		course_code: {
			type: DataTypes.INTEGER,
		},
		line_description: {
			type: DataTypes.STRING,
		},
		stations: {
			type: DataTypes.TEXT,
		},
		client_name: {
			type: DataTypes.STRING,
		},
		client_classification: {
			type: DataTypes.STRING,
		},
		comment: {
			type: DataTypes.TEXT,
		},
	});

	// Trips.associate = function (models) {

	//     Trips.belongsToMany(models.resources, {
	//         through: models.trips_to_resource,
	//         constraints: false
	//     });
	//     Trips.hasMany(models.trips_to_resource, { constraints: false })
	// }

	return TripsHistory;
};

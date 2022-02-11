export default (sequelize, DataTypes) => {
  const Stations = sequelize.define("stations", {
    station_code: {
      type: DataTypes.INTEGER,
    },
    company_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    trip_id: {
      type: DataTypes.INTEGER,
    },
    expected_to_arrive_time: {
      type: DataTypes.DATE,
    },
    actual_arrived_time: {
      type: DataTypes.DATE,
    },
    station_status: {
      type: DataTypes.INTEGER,
    },
    station_city: {
      type: DataTypes.STRING,
    },
    station_street: {
      type: DataTypes.STRING,
    },
    station_house: {
      type: DataTypes.STRING,
    },
    station_index: {
      type: DataTypes.INTEGER,
    },
    last_action: {
      type: DataTypes.STRING,
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
    },
    place: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
  });
  return Stations;
};

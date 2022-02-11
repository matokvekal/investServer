export default (sequelize, Types) => {
  const AllStations = sequelize.define("all_stations", {
    company_id: {
      type: Types.INTEGER,
      defaultValue: 1,
    },
    station_name: {
      type: Types.STRING,
    },
    station_code: {
      type: Types.INTEGER,
    },
    latitude: {
      type: Types.STRING,
    },
    longitude: {
      type: Types.STRING,
    },
  });

  return AllStations;
};

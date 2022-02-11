export default (sequelize, Types) => {
  const PointsOfInterest = sequelize.define("points_of_interest", {
    company_id: {
      type: Types.INTEGER,
      defaultValue: 1,
    },
    point_name: {
      type: Types.STRING,
    },
    point_code: {
      type: Types.INTEGER,
    },
    latitude: {
      type: Types.STRING,
    },
    longitude: {
      type: Types.STRING,
    },
  });

  return PointsOfInterest;
};

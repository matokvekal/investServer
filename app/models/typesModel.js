export default (sequelize, DataTypes) => {
  const Types = sequelize.define("types", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    color: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.DATE,
    },
  },
  {
      timestamps: false,
  });
  return Types;
};

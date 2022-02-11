export default (sequelize, DataTypes) => {
  const Company = sequelize.define("company", {
    // id
    company_id: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    url: {
      type: DataTypes.STRING,
    },
    company_name: {
      type: DataTypes.STRING(100),
    },
    company_name_eng: {
      type: DataTypes.STRING(100),
    },
    comments: {
      type: DataTypes.STRING,
    },
  });

  return Company;
};

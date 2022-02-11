export default (sequelize, Types) => {
  const FixedFilter = sequelize.define("fixed_filter", {
    company_id: {
      type: Types.INTEGER,
      defaultValue: 1,
    },
    filter_name: {
      type: Types.STRING,
    },
    resource_type: {
      type: Types.STRING(45),
      allowNull: false,
    },
  });

  return FixedFilter;
};

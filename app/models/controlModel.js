export default (sequelize, Types) => {
	const Control = sequelize.define(
		'control',
		{
			id: {
				type: Types.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			key: {
				type: Types.STRING,
			},
			value: {
				type: Types.STRING,
			},
			company_id: {
				type: Types.INTEGER,
			},
			started_on: {
				type: Types.DATE,
			}
		},
		{
			timestamps: false,
		}
	);

	return Control;
};

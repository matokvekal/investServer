module.exports = (sequelize, DataTypes) => {
    const Customers = sequelize.define("customers", {
        company_id: {
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING,
        },
        nick_name: {
            type: DataTypes.STRING
        },
        poc_name: {
            type: DataTypes.STRING
        },
        poc_phone_number: {
            type: DataTypes.STRING
        },
        classification: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING
        }
    });
    return Customers;
};
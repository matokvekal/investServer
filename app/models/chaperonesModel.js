module.exports = (sequelize, DataTypes) => {
    const Chaperones = sequelize.define("chaperones", {
        company_id: {
            type: DataTypes.INTEGER
        },
        given_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING
        },
        nick_name: {
            type: DataTypes.STRING
        },
        display_number: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING,
        },
    
    
    });
    return Chaperones;
};

import BaseControllerMobile from "./baseControllerMobile";
const { QueryTypes } = require("sequelize");
class HrIssuesControllerMobile extends BaseControllerMobile {
    constructor(app, modelName, sequelize) {
        super(app, modelName, sequelize);
    }

    getHrIssues = async (req, res) => {
        try {
            let driverPhone = req.user.user_name;
            let start_date = req.query.start_date;
            let whereStartDate = '';
            if (start_date) {
                whereStartDate = ' AND start_date = "' + start_date + '" ';
            }
            let hrIssues = await this.sequelize.query(`SELECT * FROM hr_issues WHERE user_phone = "${driverPhone}" AND issue_type = 'constraint' ${whereStartDate} AND is_active=1`, { type: QueryTypes.SELECT })

            for (let i = 0; i < hrIssues.length; i++) {
                if (!hrIssues[i].id) {
                    continue;
                }
                let hrConstraints = await this.sequelize.query(`SELECT * FROM hr_constraints WHERE hr_issue_id = ${hrIssues[i].id}`, { type: QueryTypes.SELECT })
                hrIssues[i].constraints = hrConstraints;
            }
            return res.send(hrIssues);
        }
        catch (e) {
            return await res.createErrorLogAndSend({ message: e.message || "Some error occurred while getting data." });
        }
    };

    updateHrIssues = async (req, res) => {
        const data = req.body.data;
        const updateId = parseInt(req.query.id);
        // let _company_id = req.company_id;

        if (!updateId) {
            return await res.createErrorLogAndSend({ message: "Some error occurred while updating - id: required." });
        }

        if (!data || Object.values(data).length == 0) {
            return await res.createErrorLogAndSend({ message: "Some error occurred while updating station for order - data: required." });
        }

        let updateSql = [];
        for (let i = 0; i < Object.values(data).length; i++) {
            updateSql.push(" `" + Object.keys(data)[i] + "` = '" + Object.values(data)[i] + "' ");
        }

        let updateSqlQuery = `UPDATE hr_issues SET ${updateSql.join()} WHERE id = ${updateId} `;

        const response = this.sequelize.query(updateSqlQuery);

        response
            .then(d =>
                res.status(200).send(d)
            )
            .catch((err) => {
                // console.log(`err`, err)
                // res.status(500).send({
                //   message: err
                // });
                res.createErrorLogAndSend({ message: err.message || "Some error occurred while getting orders." });
            });
    }


    deleteHrIssues = async (req, res) => {
        const updateId = parseInt(req.query.id);

        if (!updateId) {
            return await res.createErrorLogAndSend({ err: "Some error occurred! The field: 'id' are required." });
        }

        let updateSqlQuery = `UPDATE hr_issues SET is_active = 0 WHERE id = ${updateId};`;

        const response = this.sequelize.query(updateSqlQuery);

        response
            .then(d =>
                res.status(200).send(d)
            )
            .catch((err) => {
                // res.status(500).send({
                //   message:
                //     "Some error occurred while getting orders.",
                // });
                res.createErrorLogAndSend({ message: err.message || "Some error occurred while deleteing driver constraints" });
            });

    }

    addHrIssues = async (req, res) => {
        let data = req.body.data;
        let _company_id = req.company_id;

        let issue_type = "constraint";
        let { first_name, last_name, user_role, user_name } = req.user;
        // let day_at_week = data.start_date ? data.start_date : null;

        data.issue_type = issue_type;
        data.user_phone = user_name
        data.nick_name = first_name + ' ' + last_name;
        data.user_role = user_role;
        if (!data.day && data.start_date) {
            data.day = new Date(data.start_date).getDay();
        }

        if (!data || Object.values(data).length == 0) {
            // return res.status(500).send({
            //     message: "Some error occurred while adding passenger for order - data: required.",
            // });
            return res.createErrorLogAndSend({
                message: "Some error occurred while adding passenger for order - data: required."
            });
        }

        let columnsSql = [];
        for (let i = 0; i < Object.values(data).length; i++) {
            columnsSql.push(Object.keys(data)[i]);
        }

        let dataSql = [];
        for (let i = 0; i < Object.values(data).length; i++) {
            dataSql.push("'" + Object.values(data)[i] + "'");
        }

        // if (columnsSql.indexOf('company_id') == -1) {
        //     columnsSql.push('company_id');
        //     dataSql.push("'" + _company_id + "'");
        // }

        let insertSql = 'INSERT INTO hr_issues (`' + columnsSql.join("`,`") + '`) VALUES (' + dataSql.join() + ')';

        const response = this.sequelize.query(insertSql);

        response
            .then(d =>
                res.status(200).send(d)
            )
            .catch((err) => {
                // res.status(500).send({
                //     message:
                //         err.message ||
                //         "Some error occurred while getting orders.",
                // });
                res.createErrorLogAndSend({
                    message: err.message ||
                        "Some error occurred while inserting.",
                });
            });

    }

};

export default HrIssuesControllerMobile;

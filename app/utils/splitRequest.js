const { Op } = require("sequelize");

export const takeCompanyId = (_companyIds) => {
  const company_id = _companyIds.toString();
  const whereOr = [];

  if (company_id && company_id.indexOf(",") != -1) {
    let companyIdWhere = [];
    let count = (company_id.match(/,/g) || []).length;

    for (let i = 0; i < count + 1; i++) {
      companyIdWhere.push({ company_id: company_id.split(",")[i] });
    }
    whereOr.push({ [Op.or]: companyIdWhere });
  } else if (company_id && company_id != "null") {
    whereOr.push({ company_id: company_id });
  }

  return whereOr;
};

export const takeZones = (_zones) => {
  const zone = _zones; // east,west
  const whereOr = [];

  if (zone && zone.indexOf(",") != -1) {
    let zoneWhere = [];
    let count = (zone.match(/,/g) || []).length;

    for (let i = 0; i < count + 1; i++) {
      zoneWhere.push({ zone: { [Op.like]: `%${zone.split(",")[i]}%` } });
    }
    whereOr.push({ [Op.or]: zoneWhere });
  } else if (zone && zone != "null") {
    whereOr.push({ zone: { [Op.like]: `%${zone}%` } });
  }
  return whereOr;
};

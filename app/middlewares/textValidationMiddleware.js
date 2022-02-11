import { ServerLoginMessages } from "../constants/ServerMessages";

const shouldCleanValues = true;
// format: sign | sign, double back slash means the sign to right to it
const signsRegexString =
  "\\[|\\]|`|!|@|#|$|%|\\^|&|*|+|\\_|\\-|\\/|(|)|=|{|}|:|;|<|>";
const strongerSignsRegexString = `${signsRegexString}|'|,|\\.`;

const regexLevel2 = new RegExp(`[${signsRegexString}]`, "gi");
const regexLevel3 = new RegExp(`[${strongerSignsRegexString}]`, "gi");
// TODO: Gilad: there are some tricks to bypass this
const regexSqlInjection = new RegExp(
  "\\band|exec|insert|select|delete|update|count|LIMIT|and|chr|mid|master|truncate|UNION|char|declare|or\\b",
  "gi"
);

// REGEX LEVELS
const fieldsToCheckLevel1 = [
  "date",
  "from",
  "to",
  "fire_base_token_recived",
  "cars",
  "drivers",
  "text",
  "filters",
  "data",
  "0",
  "new_start_time",
  "startDate",
  "new_end_time",
  "time_to_arrive",
  "planning_ids",
  "start_date",
  "end_date",
  "start_time",
  "end_time"
]; // array of fields that are allowed all signs
const fieldsToCheckLevel2 = ["lat", "long"]; // array of fields that are allowed only some signs - regexLevel2
// level 3 - fields that are in the arrays are not allowed all the signs in 'strongerSignsRegexString'

// LENGTH LEVELS

const lengthLevel1 = 200;
const lengthLevel2 = 75;
const lengthLevel3 = 50;
const lengthLevel1Array = ['fire_base_token']; // allowed 200 characters
const lengthLevel2Array = []; // allowed 75 characters
// level 3 - allowed 50 characters

const isValueLengthOk = (key, value) => {
  if (value) {
    const stringValue = value.toString();
    if (lengthLevel1Array.includes(key)) {
      return stringValue.length <= lengthLevel1;
      // return true;
    }
    if (lengthLevel2Array.includes(key)) {
      return stringValue.length <= lengthLevel2;

    }
    return stringValue.length <= lengthLevel3;
  }
  return true;
}

const cleanValueFromSqlInjection = (value) => {
  if (value) {
    const stringValue = value.toString();
    const cleanValue = stringValue.replace(regexSqlInjection, "");
    return cleanValue.toString();
  }
  return value;
};

const cleanValueFromSigns = (key, value) => {
  if (value) {
    const stringValue = value.toString();
    if (fieldsToCheckLevel1.includes(key)) {
      return stringValue;
    }
    if (fieldsToCheckLevel2.includes(key)) {
      const cleanValue = stringValue.replace(regexLevel2, "");
      return cleanValue.toString();
    }
    const cleanValue = stringValue.replace(regexLevel3, "");
    return cleanValue.toString();
  }
  return value;
};

const cleanAllValuesFromObject = (object) => {
  if (object) {
    const cleanObject = Array.isArray(object) ? [] : {};
    const keysToCheck = Object.keys(object);
    if (shouldCleanValues && keysToCheck && keysToCheck.length) {
      for (const key of keysToCheck) {
        if (typeof object[key] === "object") {
          cleanObject[key] = cleanAllValuesFromObject(object[key]);
        } else {
          const cleanValue = cleanValueFromSigns(
            key,
            cleanValueFromSqlInjection(object[key])
          );
          if (isValueLengthOk(key, cleanValue)) {
            cleanObject[key] = cleanValue;
          } else {
            throw `LENGTH OF ${key} IS TOO LONG.`
          }
        }
      }
    }
    return cleanObject;
  }
  return object;
};

const textValidationMiddleware = (req, res, next) => {
  try {
    req.body = req.body ? { ...cleanAllValuesFromObject(req.body) } : req.body;
    // req.query = req.query // blocks filter response with a lot of previous searches TODO: this is quick fix
    // ? { ...cleanAllValuesFromObject(req.query) }
    // : req.query;
    return next();
  } catch (err) {
    res.createErrorLogAndSend({ message: `${ServerLoginMessages.FIELD_NOT_VALID} => ${err.message || err}`, status: 406 });
  }
};

export default textValidationMiddleware;

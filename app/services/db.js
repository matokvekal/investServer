// var config = require("./config.json");
import config from '../config/index';
var mysql = require("mysql");

function db() {
  try {
    //let gpdb = require('./server/services/db-pg');
    return mysql.createConnection(config.configByEnv.connection);
    // return mysql.createConnection(config.connection);
    //return  gpdb.db;
  } catch (err) {
    console.log(err);
  }
}

function query(query, callback, onerror) {
  try {
    //console.log('query gilad1',query)
    var con = db();
    con.connect(function (err) {
      if (err) {
        con.end();
        if (onerror) return onerror(err.message);
        return console.log("err1", err.message);
      }
      con.query(query, function (err, result, fields) {
        con.end();
        if (err && onerror) {
          if (onerror) return onerror(err.message);
          return console.log("err2", err.message);
        }
        if (callback) callback(result, fields);
      });
    });
  } catch (err) {
    console.log(err);
  }
}



module.exports = {
  query
}

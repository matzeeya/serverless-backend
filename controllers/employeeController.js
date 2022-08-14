const mysql = require('mysql2/promise');
const winston = require('winston');
const config = require('../config');
const emp = require('../models/employee');

const pool = mysql.createPool({
  host: config.mysql_host,
  user: config.mysql_user,
  password: config.mysql_password,
  database: config.mysql_database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.on('connection', (connection) => {
  console.log('DB Connection established');
  winston.info('Mysql Db Connected......');

  connection.on('error', (err) => {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', (err) => {
    console.error(new Date(), 'MySQL close', err);
    winston.info('Mysql Db close......');
  });
});

const geEmpById = async (req, res, next) => {
  const { empId } = req.params;
  console.log(`geEmpById: ${empId}`);
  try {
    e = new emp.Exployee('นาย', 'ธงชัย', 'เลี่ยมสกุล', 'M', 'นายช่างเทคนิค');
    res.send({
      data_lable: e.getInfo(),
      result: e,
      total_record: 1,
      message: `Result OK. `,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  geEmpById,
};

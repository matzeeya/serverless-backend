const express = require('express');
const cors = require('cors');
const winston = require('winston');
const config = require('./config');
const employeeRoutes = require('./routes/employee_route');
const lineRoutes = require('./routes/line_route');
require('./logging')();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) =>
  res.send({
    error: false,
    message: 'Welcome to RESTful CRUD API with NodeJS, Express,MYSQL',
  }),
);

app.use('/api/v1', employeeRoutes.routes);
app.use('/api/line', lineRoutes.routes);

app.listen(config.port, (err) => {
  if (err) {
    console.log(err);
    winston.info(err.message, err);
  } else {
    winston.info(`Node App is running on  port: ${config.port}`);
    console.log(`Node App is running on  port: ${config.port}`);
  }
});

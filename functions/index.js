const functions = require('firebase-functions');
// const builderFunction = functions.region('asia-southeast1').https;
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employee_route');

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

app.use(express.urlencoded({ extended: true }));

app.get('/welcome', (req, res) =>
  res.send({
    error: false,
    message: 'Welcome to RESTful CRUD API with NodeJS, Express,MYSQL',
  }),
);

app.use('/v1', employeeRoutes.routes);

const api = functions.https.onRequest((request, response) => {
  //  response.send('Hello from Firebase!');
  if (!request.path) {
    request.url = `/${request.url}`; // prepend '/' to keep query params if any
  }
  return app(request, response);
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// exports.stripeEvent = functions.https.onRequest((request, response) => {
//  response.send('Hello from Firebase!');
// });

// exports.musiclist = builderFunction.onRequest(app);

module.exports = {
  api,
};

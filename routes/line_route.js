const express = require('express');
const { linebot } = require('../controllers/lineController');

/* eslint new-cap: ["error", { "capIsNewExceptionPattern": "^express\\.." }]*/
const router = express.Router();

router.get('/bot', linebot);

module.exports = {
  routes: router,
};

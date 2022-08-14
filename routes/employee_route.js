const express = require('express');
const { geEmpById } = require('../controllers/employeeController');

const router = express.Router();

// router.post('/student', addStudent);
// router.get('/student', getStudents);
router.get('/employee/:empId', geEmpById);
// router.put('/student/:studentId', updateStudent);
// router.delete('/student/:studentId', deleteStudent);
module.exports = {
  routes: router,
};

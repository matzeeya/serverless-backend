per = require('./person.js');
const moment = require('moment-timezone');

class Student extends per.Person {
  constructor(preName, firstName, lastName, gender, student_id) {
    super(preName, firstName, lastName, gender);
    this.student_id = student_id;
  }

  setStudentId(student_id) {
    this.student_id = student_id;
  }

  getStudentId() {
    return this.student_id;
  }

  setBachelor(bachelor) {
    this.bachelor = bachelor;
  }

  getBachelor() {
    return this.bachelor;
  }

  setEduLevel(edu_level) {
    this.edu_level = edu_level;
  }

  getEduLevel() {
    return this.edu_level;
  }

  getInfo() {
    return super.getFullname() + ' ,' + this.student_id;
  }

  eduYear() {
    console.log('Date ' + moment.tz('Asia/Bangkok').format('YYYY-MM-DD'));
    var edu = str.substring(0, 2); //62
    var mBudda = moment.tz('Asia/Bangkok').format('YY');
    eduClassYear = parseInt(mBudda) - parseInt(edu);
    let e_class;

    if (eduClassYear - mBudda <= 0) {
      e_class = 1;
    } else {
      e_class = eduClassYear - mBudda;
    }
    return e_class;
  }
}

module.exports = {
  Student: Student,
};

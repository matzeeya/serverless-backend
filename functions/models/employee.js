per = require('./person.js');

class Exployee extends per.Person {
  constructor(preName, firstName, lastName, gender, position) {
    super(preName, firstName, lastName, gender);
    this.position = position;
  }

  setPosition(position) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }

  getInfo() {
    return super.getFullname() + ' ,' + this.position;
  }
}

module.exports = {
  Exployee: Exployee,
};

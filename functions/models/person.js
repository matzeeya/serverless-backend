class Person {
  constructor(preName, firstName, lastName, gender) {
    this.preName = preName;
    this.firstname = firstName;
    this.lastname = lastName;
    this.gender = gender;
  }

  getFullname() {
    return this.preName + this.firstname + ' ' + this.lastname;
  }

  setFullname(preName, firstname, lastname) {
    this.preName = preName;
    this.firstname = firstname;
    this.lastname = lastname;
  }

  setGender(gender) {
    this.gender = gender;
  }

  setNUAccount(nu_net) {
    this.nuAccount = nu_net;
  }

  setDepartment(department) {
    this.department = department;
  }

  setFaculty(faculty) {
    this.faculty = faculty;
  }

  getNUAccount() {
    return this.nuAccount;
  }

  getDepartment() {
    return this.department;
  }

  getFaculty() {
    return this.faculty;
  }

  getGender() {
    return this.gender;
  }
}
module.exports = {
  Person: Person,
};

const emp = require('../models/employee');

const geEmpById = async (req, res, next) => {
  const { empId } = req.params;
  console.log(`geEmpById: ${empId}`);
  try {
    const e = new emp.Exployee(
      'นาย',
      'ธงชัย',
      'เลี่ยมสกุล',
      'M',
      'นายช่างเทคนิค',
    );
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

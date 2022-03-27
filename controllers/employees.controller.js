const Employee = require("../models/Employee");

const getAllEmployees = async (req, resp) => {
  try {
    const employees = await Employee.find().exec();
    if (!employees)
      return resp.status(400).json({ message: "No employees found" });
    resp.json(employees);
  } catch (err) {
    console.error(err);
  }
};

const getSingleEmployee = async (req, resp) => {
  if (!req?.params.id)
    return resp.status(400).json({ message: "Employee ID is required" });

  try {
    const employee = await Employee.findById(req.params.id).exec();

    if (!employee) {
      return resp
        .status(400)
        .json({ message: `No Employee matches ${req.params.id} id` });
    }
    resp.json(employee);
  } catch (err) {
    console.error(err);
  }
};

const createNewEmployee = async (req, resp) => {
  if (!req?.body?.firstName || !req?.body?.lastName) {
    return resp
      .status(400)
      .json({ message: "First and last names are required" });
  }

  try {
    const result = await Employee.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    resp.json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, resp) => {
  if (!req?.params.id)
    return resp.status(400).json({ message: "Employee ID is required" });

  try {
    const employee = await Employee.findById(req.params.id).exec();
    if (!employee)
      return resp
        .status(400)
        .json({ message: `No employee matches ${req.params.id} id` });

    if (req.body.firstName) employee.firstName = req.body.firstName;
    if (req.body.lastName) employee.lastName = req.body.lastName;

    const result = await employee.save();
    resp.json(result);
  } catch (err) {
    console.error(err);
  }
};

const deleteEmployee = async (req, resp) => {
  if (!req?.params.id)
    return resp.status(400).json({ message: "Employee ID is required" });

  try {
    const employee = await Employee.findById(req.params.id).exec();

    if (!employee) {
      return resp
        .status(400)
        .json({ message: `No employee matches ${req.params.id}` });
    }

    const result = await Employee.deleteOne({ _id: req.params.id });
    resp.json(result);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getAllEmployees,
  getSingleEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};

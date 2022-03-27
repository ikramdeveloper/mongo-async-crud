const express = require("express");
const router = express.Router();

const ROLES_LIST = require("../../config/roles-list");
const verifyRoles = require("../../middleware/verifyRoles");

const {
  getAllEmployees,
  getSingleEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employees.controller");

router
  .route("/")
  .get(getAllEmployees)
  .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createNewEmployee);

router
  .route("/:id")
  .get(getSingleEmployee)
  .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
  .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee);

module.exports = router;

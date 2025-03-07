const express = require("express");
const router = express.Router();
const projectsController = require("../controllers/ProjectController");

router
  .get("/", projectsController.getAllProjects)
  .get("/:projectId", projectsController.getProjectById)
  .post("/addProject",projectsController.addProject);

module.exports = router;

const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");

const getAllProjects = asyncHandler(async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error();
    res.status(500).json({ message: 'Server error'});
  }
});

const getProjectById = asyncHandler(async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found'});
        }

        res.json(project);
    } catch (error) {
        return res.status(500).json({ message: 'Server error'});
    }
  });

  const getLanguages = asyncHandler(async (req, res) => {
    try {
      const result = await Project.aggregate([
        { $unwind: "$languages" }, 
        { $group: { _id: "$languages" } },
        { $group: { _id: null, languages: { $push: "$_id" } } }, 
        { $project: { _id: 0, languages: 1 } } 
      ]);

      const languages = result.length > 0 ? result[0].languages : [];
  
      res.json(languages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });  

  // Controller function to add a comment
const addProject = async (req, res) => {
  try {
    const { projectTitle, description, githubRepoUrl, languages, image, username } = req.body;

    // Perform any validation or checks needed
    if (!projectTitle || !username || !description || !githubRepoUrl || !languages || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new project
    const project = new Project({
      projectTitle, description, githubRepoUrl, languages, image, username
    });

    // Save the project to the database
    await project.save();

    // Respond with a success message and the created project
    res.status(201).json({
      message: 'Project added successfully',
      success: true,
      project,
    });

  } catch (error) {
    console.error(error);
    // Handle any errors and respond with an error message
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getLanguages,
  addProject
};

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  githubRepoUrl: {
    type: String,
    required: true,
  },
  languages: {
    type: [String],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Project", projectSchema);

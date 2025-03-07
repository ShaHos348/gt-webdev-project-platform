import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "./NavBar";
import axios from "axios";
import { TextField, Button } from "@mui/material";
import "./styles/Dashboard.css";

const Dashboard = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [projectTitle, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepoUrl, setGithub] = useState("");
  const [languages, setLanguages] = useState([]);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/users/username/${username}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.log(error));
  }, [username]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/projects/addProject",
        {
          projectTitle,
          description,
          githubRepoUrl,
          username,
          languages,
          image,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        alert("Project added successfully");
        setTitle("");
        setDescription("");
        setGithub("");
        setLanguages([]);
        setImage("");
      } else {
        alert("Error adding project");
      }
    } catch (error) {
      console.error("Error submitting project", error);
      alert("Failed to submit project");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="Dashboard">
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <a href={user.github}>Github</a>
      </div>
      <div id="add-project-form">
        <h2>Add Project</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            value={projectTitle}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="GitHub Link"
            value={githubRepoUrl}
            onChange={(e) => setGithub(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Languages (comma separated)"
            value={languages.join(", ")}
            onChange={(e) => setLanguages(e.target.value.split(",").map(lang => lang.trim()))}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          <Button type="submit" fullWidth variant="contained" color="primary">
            Submit Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;

import CommentForm from "./CommentForm";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Contributors from "./Contributors";
import ProgrammingLanguages from "./ProgrammingLanguages";
import NavBar from "./NavBar";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { purple } from "@mui/material/colors";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./styles/IndividualProject.css";
import axios from "axios";

const IndividualProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [likes, setLikes] = useState(0);
  const currentUserString = localStorage.getItem("user");
  const currentUser = JSON.parse(currentUserString);
  console.log("Current user: ");
  console.log(currentUser);

  useEffect(() => {
    fetch(`http://localhost:3001/projects/${projectId}`)
      .then((response) => response.json())
      .then((data) => setProject(data))
      .catch((error) => console.log(error));

    fetch(`http://localhost:3001/likes/getLikes/${projectId}`)
      .then((response) => response.json())
      .then((data) => setLikes(data))
      .catch((error) => console.log(error));
  }, [projectId]);

  if (!project) {
    return <div>Loading...</div>;
  }

  console.log("Project: ");
  console.log(project);

  const url = project.githubRepoUrl;
  const urlArr = url.split("/");
  const reponame = urlArr.pop();
  const user = urlArr.pop();
  const input = user + "/" + reponame;
  console.log(input);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:3001/likes",
        {
          project: projectId,
          user: currentUser._id,
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="IndividualProject">
      <NavBar />
      <div className="header">
        <h1>{project.projectTitle}</h1>
        <p>{project.description}</p>

        <div className="header-links">
          <Stack spacing={2} direction="row" onClick={handleLike}>
            <ColorButton variant="contained">
              {likes}
              <FavoriteBorderIcon />
            </ColorButton>
          </Stack>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="comment"
          >
            Comment
          </a>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="github"
          >
            Github Repository
          </a>
        </div>
      </div>
      <div className="project-content">
        <div className="content-right">
          <Contributors
            repoUrl={project.githubRepoUrl}
          />
          <ProgrammingLanguages repoName={input} />
        </div>
        <div className="content-left">
          <img
            src={project.image}
            alt={project.projectTitle}
            width={100}
            height={100}
          />
        </div>
      </div>
      <div width={300}>
        <CommentForm projectId={projectId} userId={currentUser._id} />
      </div>
    </div>
  );
};

export default IndividualProject;

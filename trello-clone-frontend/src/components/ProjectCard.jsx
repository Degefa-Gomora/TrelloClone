// src/components/ProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ProjectCard.css"; // Import component-specific styles

function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <Link to={`/project/${project._id}`} className="project-card-link">
        <h3>{project.name}</h3>
        <p>{project.description || "No description provided."}</p>
        <div className="project-meta">
          <span>Owner: {project.owner?.username || "N/A"}</span>
          <span>Lists: {project.lists?.length || 0}</span>
        </div>
      </Link>
    </div>
  );
}

export default ProjectCard;

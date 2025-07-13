// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createProject, getProjects } from "../api/projects"; // Import project API functions
import ProjectCard from "../components/ProjectCard"; // Import the ProjectCard component
import "./Dashboard.css"; // Import Dashboard specific styles

function Dashboard() {
  const { user, token, signOut } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [createProjectError, setCreateProjectError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const fetchedProjects = await getProjects(token);
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again.");
        // If error is due to expired token, log out
        if (err.response && err.response.status === 401) {
          signOut();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [token, signOut]); // Re-fetch if token changes

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreateProjectError("");
    if (!newProjectName.trim()) {
      setCreateProjectError("Project name cannot be empty.");
      return;
    }
    try {
      const newProject = await createProject(
        newProjectName,
        newProjectDescription,
        token
      );
      setProjects([...projects, newProject]); // Add new project to state
      setNewProjectName(""); // Clear form
      setNewProjectDescription(""); // Clear form
    } catch (err) {
      setCreateProjectError(err.message || "Failed to create project.");
      console.error("Error creating project:", err);
      if (err.response && err.response.status === 401) {
        signOut(); // Log out if token is invalid
      }
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {user?.username}!</h2>

      <div className="create-project-section">
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject} className="create-project-form">
          <input
            type="text"
            placeholder="Project Name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            required
          />
          <textarea
            placeholder="Project Description (optional)"
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          ></textarea>
          <button type="submit">Create Project</button>
        </form>
        {createProjectError && (
          <p style={{ color: "red" }}>{createProjectError}</p>
        )}
      </div>

      <h3>Your Projects</h3>
      {projects.length === 0 ? (
        <p>You don't have any projects yet. Create one above!</p>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

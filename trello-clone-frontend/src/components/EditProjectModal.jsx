// src/components/EditProjectModal.jsx
import React, { useState, useEffect } from "react";
import { updateProject } from "../api/projects"; // Import the new updateProject API call
import { useAuth } from "../context/AuthContext";
import "./EditProjectModal.css"; // We'll create this CSS file next

function EditProjectModal({ project, onClose, onProjectUpdated }) {
  const { token } = useAuth();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // This useEffect ensures the form fields update if the 'project' prop changes
  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the API to update the project with new name and description
      const updatedProject = await updateProject(
        project._id,
        { name, description },
        token
      );
      onProjectUpdated(updatedProject); // Notify the parent component (ProjectBoard) to update its state
      onClose(); // Close the modal after successful update
    } catch (err) {
      console.error("Error updating project:", err);
      // Show a user-friendly error message
      setError(
        "Failed to update project. Please try again. " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Edit Project</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">Project Name:</label>
            <input
              type="text"
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="projectDescription">Description:</label>
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              disabled={loading}
            ></textarea>
          </div>
          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProjectModal;

// src/components/MembersModal.jsx (NEW FILE)
import React, { useState, useEffect } from "react";
import "./MembersModal.css";
import { useAuth } from "../context/AuthContext";
import { searchUsers } from "../api/users"; // Import searchUsers from new users API
import { addProjectMember, removeProjectMember } from "../api/projects"; // Import project member APIs

function MembersModal({ project, onClose, onProjectUpdated }) {
  const { token, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentMembers, setCurrentMembers] = useState(project.members);
  const [searchError, setSearchError] = useState("");

  // Update currentMembers if project.members changes externally
  useEffect(() => {
    setCurrentMembers(project.members);
  }, [project.members]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError("");
    setSearchResults([]);
    if (!searchTerm.trim()) return;

    try {
      const results = await searchUsers(searchTerm, token);
      // Filter out users already in the project
      const newResults = results.filter(
        (resUser) =>
          !currentMembers.some((member) => member._id === resUser._id)
      );
      setSearchResults(newResults);
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchError("Failed to search users. Please try again.");
    }
  };

  const handleAddMember = async (userId) => {
    try {
      const updatedProject = await addProjectMember(project._id, userId, token);
      onProjectUpdated(updatedProject); // Update parent's project state
      setCurrentMembers(updatedProject.members); // Update local state
      setSearchTerm(""); // Clear search term
      setSearchResults([]); // Clear search results
    } catch (err) {
      console.error("Error adding member:", err);
      alert(err.message || "Failed to add member.");
    }
  };

  const handleRemoveMember = async (userIdToRemove) => {
    if (window.confirm(`Are you sure you want to remove this member?`)) {
      try {
        const updatedProject = await removeProjectMember(
          project._id,
          userIdToRemove,
          token
        );
        onProjectUpdated(updatedProject); // Update parent's project state
        setCurrentMembers(updatedProject.members); // Update local state
        // Re-run search if there was one, to potentially add the removed user back to results
        if (searchTerm.trim()) {
          handleSearch({ preventDefault: () => {} }); // Simulate form submission
        }
      } catch (err) {
        console.error("Error removing member:", err);
        alert(err.message || "Failed to remove member.");
      }
    }
  };

  return (
    <div className="members-modal-overlay">
      <div className="members-modal">
        <div className="modal-header">
          <h2>Manage Members</h2>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        <div className="modal-content">
          <h3>Current Members</h3>
          <ul className="current-members-list">
            {currentMembers.map((member) => (
              <li key={member._id}>
                <span>
                  {member.username} ({member.email})
                </span>
                {member._id !== user.id && ( // Don't allow user to remove themselves via this list
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="remove-member-btn"
                  >
                    Remove
                  </button>
                )}
                {member._id === project.owner && (
                  <span className="owner-tag">(Owner)</span>
                )}
              </li>
            ))}
            {currentMembers.length === 0 && <p>No members yet.</p>}
          </ul>

          <h3 className="add-members-heading">Add Members</h3>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by username or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>
          {searchError && <p className="search-error">{searchError}</p>}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4>Search Results:</h4>
              <ul>
                {searchResults.map((result) => (
                  <li key={result._id}>
                    <span>
                      {result.username} ({result.email})
                    </span>
                    <button
                      onClick={() => handleAddMember(result._id)}
                      className="add-member-btn"
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {searchTerm.trim() && searchResults.length === 0 && !searchError && (
            <p className="no-results-message">
              No users found matching "{searchTerm}" or already members.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MembersModal;

// src/components/TaskCard.jsx
import React, { useState, useEffect } from "react";
import "./TaskCard.css";
import { useAuth } from "../context/AuthContext";
import { updateTask } from "../api/projects"; // Import updateTask API

function TaskCard({
  project,
  list,
  task,
  onTaskUpdated,
  projectMembers,
  onDeleteTask,
}) {
  // Added onDeleteTask prop
  const { token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(
    task.description || ""
  );
  const [editedAssignedTo, setEditedAssignedTo] = useState(
    task.assignedTo && task.assignedTo.length > 0 ? task.assignedTo[0]._id : ""
  );
  const [editedDueDate, setEditedDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );

  // Reset form fields if task prop changes (e.g., after initial save or external update)
  useEffect(() => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
    setEditedAssignedTo(
      task.assignedTo && task.assignedTo.length > 0
        ? task.assignedTo[0]._id
        : ""
    );
    setEditedDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
  }, [task]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) {
      alert("Task title cannot be empty.");
      return;
    }

    try {
      // Ensure assignedTo is an array of IDs as per your Task schema
      const assignedToArray = editedAssignedTo ? [editedAssignedTo] : [];

      const updatedData = {
        title: editedTitle,
        description: editedDescription,
        assignedTo: assignedToArray, // Pass as an array
        dueDate: editedDueDate || null,
      };

      const updatedTask = await updateTask(
        project._id,
        list._id,
        task._id,
        updatedData,
        token
      );
      onTaskUpdated(list._id, updatedTask); // Notify parent component with the fully updated task
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task. Please try again.");
    }
  };

  const handleCancel = () => {
    // Revert changes and exit editing mode
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
    setEditedAssignedTo(
      task.assignedTo && task.assignedTo.length > 0
        ? task.assignedTo[0]._id
        : ""
    );
    setEditedDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    setIsEditing(false);
  };

  // NEW: Handle Task Deletion (calls the prop from ListCard)
  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Call the onDeleteTask prop, passing the necessary IDs
      // onDeleteTask function will be defined in ListCard and will make the API call
      onDeleteTask(project._id, list._id, task._id);
    }
  };

  const dueDateDisplay = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No Due Date";
  // Note: assignedTo is an array in your schema, so task.assignedTo will be an array of objects
  // You might want to map through it if multiple users can be assigned, or just take the first one.
  const assignedToDisplay =
    task.assignedTo && task.assignedTo.length > 0
      ? task.assignedTo.map((member) => member.username).join(", ")
      : "Unassigned";

  return (
    <div className="task-card">
      {isEditing ? (
        <form onSubmit={handleSave} className="task-edit-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            required
            autoFocus
          />
          <textarea
            placeholder="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          ></textarea>
          <select
            value={editedAssignedTo}
            onChange={(e) => setEditedAssignedTo(e.target.value)}
          >
            <option value="">Unassigned</option>
            {projectMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.username}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={editedDueDate}
            onChange={(e) => setEditedDueDate(e.target.value)}
          />
          <div className="form-actions">
            <button type="submit" className="btn-save">
              Save
            </button>
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit
              </button>
              {/* UPDATED: Call handleDeleteClick when the delete button is pressed */}
              <button onClick={handleDeleteClick} className="btn-delete">
                X
              </button>
            </div>
          </div>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className="assigned-to">Assigned: {assignedToDisplay}</span>
            <span className="due-date">Due: {dueDateDisplay}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;


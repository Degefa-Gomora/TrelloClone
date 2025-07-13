


// src/components/ListCard.jsx
import React, { useState , useEffect} from "react";
import TaskCard from "./TaskCard";
import "./ListCard.css";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  updateList,
  deleteList,
  deleteTask,
  getProjectById,
} from "../api/projects";

function ListCard({
  project,
  list,
  onListDeleted,
  onTaskAdded,
  onTaskUpdated,
  onTaskDeleted,
}) {
  const { token, user } = useAuth();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [editingList, setEditingList] = useState(false);
  const [newListName, setNewListName] = useState(list.name);
  const [addTaskDescription, setAddTaskDescription] = useState("");
  const [addTaskAssignedTo, setAddTaskAssignedTo] = useState("");
  const [addTaskDueDate, setAddTaskDueDate] = useState("");
  const [projectMembers, setProjectMembers] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const fetchedProject = await getProjectById(project._id, token);
        setProjectMembers(fetchedProject.members);
      } catch (err) {
        console.error("Failed to fetch project members:", err);
      }
    };
    fetchMembers();
  }, [project._id, token]);


  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const task = await createTask(
        project._id,
        list._id,
        newTaskTitle,
        addTaskDescription,
        addTaskAssignedTo ? [addTaskAssignedTo] : [],
        addTaskDueDate || null,
        token
      );
      onTaskAdded(list._id, task);
      setNewTaskTitle("");
      setAddTaskDescription("");
      setAddTaskAssignedTo("");
      setAddTaskDueDate("");
      setShowAddTaskForm(false);
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleDeleteList = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete the list "${list.name}" and all its tasks?`
      )
    ) {
      try {
        await deleteList(project._id, list._id, token);
        onListDeleted(list._id);
      } catch (err) {
        console.error("Error deleting list:", err);
        alert("Failed to delete list. Please try again.");
      }
    }
  };

  const handleUpdateListName = async () => {
    if (newListName.trim() === list.name) {
      setEditingList(false);
      return;
    }
    if (!newListName.trim()) {
      alert("List name cannot be empty.");
      return;
    }
    try {
      const updatedList = await updateList(
        project._id,
        list._id,
        { name: newListName },
        token
      );
      list.name = updatedList.name;
      setEditingList(false);
    } catch (err) {
      console.error("Error updating list name:", err);
      alert("Failed to update list name. Please try again.");
    }
  };

  const handleTaskDelete = async (projectId, listId, taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(projectId, listId, taskId, token);
        onTaskDeleted(listId, taskId);
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  return (
    <div className="list-card">
      <div className="list-header">
        {editingList ? (
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onBlur={handleUpdateListName}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateListName()}
            autoFocus
            className="list-name-input"
          />
        ) : (
          <h3 onClick={() => setEditingList(true)}>{list.name}</h3>
        )}
        <button onClick={handleDeleteList} className="btn-delete-list">
          X
        </button>
      </div>
      <div className="tasks-container">
        {/* FIX: Added optional chaining (?) to prevent error if list.tasks is undefined */}
        {list.tasks?.map((task) => (
          <TaskCard
            key={task._id}
            project={project}
            list={list}
            task={task}
            onTaskUpdated={onTaskUpdated}
            onDeleteTask={handleTaskDelete}
            projectMembers={projectMembers}
          />
        ))}
        {showAddTaskForm ? (
          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={addTaskDescription}
              onChange={(e) => setAddTaskDescription(e.target.value)}
            ></textarea>
            <select
              value={addTaskAssignedTo}
              onChange={(e) => setAddTaskAssignedTo(e.target.value)}
            >
              <option value="">Assign to...</option>
              {projectMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.username}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={addTaskDueDate}
              onChange={(e) => setAddTaskDueDate(e.target.value)}
            />
            <button type="submit" className="btn-add-task">
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setShowAddTaskForm(false)}
              className="btn-cancel-task"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddTaskForm(true)}
            className="add-task-btn"
          >
            + Add another task
          </button>
        )}
      </div>
    </div>
  );
}

export default ListCard;
// src/api/projects.js (COMPLETE AND UPDATED with updateProject)
import axios from "axios";

// Ensure this API_URL matches your backend server's address
// If your React app is served from the same domain as your backend, you might use '/api/projects'
const API_URL = "https://trello.degefagomora.com/api/projects";

// Helper to get auth header for protected routes
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json", // Important for PUT/POST requests
  },
});

// --- Project API Calls ---

/**
 * Creates a new project.
 * @param {string} name - The name of the project.
 * @param {string} description - The description of the project.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The created project data.
 */
export const createProject = async (name, description, token) => {
  try {
    const response = await axios.post(
      API_URL,
      { name, description },
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Create project failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Fetches all projects the user is a member of.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Array<Object>>} A list of projects.
 */
export const getProjects = async (token) => {
  try {
    const response = await axios.get(API_URL, authHeader(token));
    return response.data;
  } catch (error) {
    console.error(
      "Get projects failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Fetches a single project by its ID.
 * @param {string} projectId - The ID of the project.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The project data.
 */
export const getProjectById = async (projectId, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/${projectId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get project by ID failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * NEW: Updates an existing project.
 * @param {string} projectId - The ID of the project to update.
 * @param {Object} projectData - The data to update (e.g., { name, description }).
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The updated project data.
 */
export const updateProject = async (projectId, projectData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${projectId}`,
      projectData,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update project failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Deletes a project.
 * @param {string} projectId - The ID of the project to delete.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} Confirmation of deletion.
 */
export const deleteProject = async (projectId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${projectId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting project:",
      error.response?.data || error.message
    );
    throw error; // Re-throw to be caught by the component
  }
};

// --- List API Calls ---

/**
 * Creates a new list within a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} name - The name of the new list.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The created list data.
 */
export const createList = async (projectId, name, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${projectId}/lists`,
      { name },
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Create list failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Updates an existing list.
 * @param {string} projectId - The ID of the project.
 * @param {string} listId - The ID of the list to update.
 * @param {Object} data - The data to update the list with (e.g., { name }).
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The updated list data.
 */
export const updateList = async (projectId, listId, data, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${projectId}/lists/${listId}`,
      data,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Update list failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Deletes a list from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} listId - The ID of the list to delete.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} Confirmation of deletion.
 */
export const deleteList = async (projectId, listId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${projectId}/lists/${listId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Delete list failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// --- Task API Calls ---

/**
 * Creates a new task within a specific list.
 * @param {string} projectId - The ID of the project.
 * @param {string} listId - The ID of the list where the task belongs.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} assignedTo - User ID assigned to the task (optional).
 * @param {string} dueDate - Due date of the task (optional).
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The created task data.
 */
export const createTask = async (
  projectId,
  listId,
  title,
  description,
  assignedTo,
  dueDate,
  token
) => {
  try {
    const response = await axios.post(
      `${API_URL}/${projectId}/lists/${listId}/tasks`,
      { title, description, assignedTo, dueDate },
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Create task failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Updates an existing task.
 * @param {string} projectId - The ID of the project.
 * @param {string} listId - The ID of the list where the task belongs.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} data - The data to update the task with.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The updated task data.
 */
export const updateTask = async (projectId, listId, taskId, data, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${projectId}/lists/${listId}/tasks/${taskId}`,
      data,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Update task failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Deletes a task.
 * @param {string} projectId - The ID of the project.
 * @param {string} listId - The ID of the list where the task belongs.
 * @param {string} taskId - The ID of the task to delete.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} Confirmation of deletion.
 */
export const deleteTask = async (projectId, listId, taskId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${projectId}/lists/${listId}/tasks/${taskId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error("Delete task failed:", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// --- Collaborator (Member) API Calls ---

/**
 * Adds a member to a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user to add.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The updated project data.
 */
export const addProjectMember = async (projectId, userId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/${projectId}/members`,
      { userId },
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Add project member failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

/**
 * Removes a member from a project.
 * @param {string} projectId - The ID of the project.
 * @param {string} userId - The ID of the user to remove.
 * @param {string} token - User's authentication token.
 * @returns {Promise<Object>} The updated project data.
 */
export const removeProjectMember = async (projectId, userId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/${projectId}/members/${userId}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Remove project member failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

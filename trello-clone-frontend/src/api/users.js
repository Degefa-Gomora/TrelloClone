// src/api/users.js (NEW FILE)
import axios from "axios";

const API_URL = "https://trello.degefagomora.com/api/projects/users"; // Base URL for user-related project routes

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const searchUsers = async (query, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/search?q=${query}`,
      authHeader(token)
    );
    return response.data;
  } catch (error) {
    console.error(
      "Search users failed:",
      error.response?.data || error.message
    );
    throw error.response?.data || error.message;
  }
};

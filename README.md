# TrelloClone - A Full-Stack Trello Clone
<img width="1042" height="608" alt="image" src="https://github.com/user-attachments/assets/54857666-de7d-48b1-8aea-ad6fd79f24aa" />

<img width="1006" height="610" alt="image" src="https://github.com/user-attachments/assets/50773e15-9f22-421a-be2b-8d3e6eaaba8b" />

<img width="996" height="565" alt="image" src="https://github.com/user-attachments/assets/2ff741d2-e5ee-4484-b94e-e7dc3eb8327e" />




![Project Screenshot Placeholder](path/to/your/screenshot.png)
*(Optional: Add a screenshot or GIF of your application here)*

## Table of Contents

-   [About the Project](#about-the-project)
-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Live Demo](#live-demo)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup](#backend-setup)
    -   [Frontend Setup](#frontend-setup)
-   [Usage](#usage)
-   [Project Structure](#project-structure)
-   [Contributing](#contributing)
-   [License](#license)
-   [Contact](#contact)

## About the Project

TrelloClone is a minimalist, full-stack Trello-inspired task management application designed to help individuals and teams organize their work efficiently using boards, lists, and cards. Users can create projects, manage tasks within customizable lists, and collaborate with other members.

This application aims to replicate core functionalities of popular Kanban-style boards, providing a clear visual representation of workflow progress. It's built with a modern technology stack to ensure a responsive and intuitive user experience.

## Features

* **User Authentication:** Secure sign-up, login, and logout.
* **Project Management:**
    * Create, view, edit, and delete projects.
    * Each project functions as a board.
    * Assign project owners.
* **Collaborator Management:**
    * Add and remove members from projects.
    * Control access based on project membership.
* **List (Column) Management:**
    * Create, rename, and delete task lists within a project board.
* **Task (Card) Management:**
    * Create, view, edit, and delete tasks.
    * Assign tasks to users.
    * Set due dates and priorities for tasks.
    * Drag-and-drop functionality for moving tasks between lists (Future Enhancement/If implemented).
* **Responsive Design:** Optimized for various screen sizes (Future Enhancement/If implemented).
* **Real-time Updates:** (Future Enhancement/If implemented using WebSockets).

## Technologies Used

This project leverages a MERN (MongoDB, Express.js, React.js, Node.js) stack along with other modern libraries and tools.

**Frontend:**
* **React.js:** A JavaScript library for building user interfaces.
* **Vite:** A fast build tool for modern web projects.
* **React Router DOM:** For declarative routing in React applications.
* **Axios:** For making HTTP requests to the backend API.
* **CSS:** For styling (potentially with preprocessors like SASS/LESS if used, otherwise plain CSS).
* **React Context API:** For state management.

**Backend:** (Assuming a separate backend repository, if not, mention it's a monolithic setup)
* **Node.js:** JavaScript runtime.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for storing application data.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **JWT (JSON Web Tokens):** For authentication and authorization.
* **Bcrypt:** For password hashing.
* **CORS:** For handling Cross-Origin Resource Sharing.

**Development Tools:**
* **ESLint / Prettier:** For code linting and formatting.
* **Git:** Version control.
* **npm 

## Live Demo

https://trellofend.degefagomora.com/

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* npm 
* MongoDB (local instance or a cloud service like MongoDB Atlas)

### Backend Setup

First, you'll need to set up the backend server.
1.  **Clone the backend repository:**
 
    in the same folder here
2.  **Install dependencies:**
  
    npm install
 
    ```
3.  **Create a `.env` file** in the root of the backend directory and add the following environment variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string # e.g., mongodb://localhost:27017/trello_clone or your MongoDB Atlas URI
    JWT_SECRET=supersecretjwtkey # Use a strong, random string in production
    ```
4.  **Start the backend server:**

    npm start
  
    ```
    The backend server should now be running on `http://localhost:5000` (or your specified PORT).

### Frontend Setup

Next, set up the React frontend.
1.  **Clone this repository (if you haven't already):**
 
    git clone [https://github.com/](https://github.com/)[YourGitHubHandle]/trello-clone-frontend.git
    cd trello-clone-frontend

2.  **Install dependencies:**
   
    npm install
  
3.  **Create a `.env` file** in the root of the frontend directory (`trello-clone-frontend/`) and add the following environment variables:
    `
4.  **Start the frontend development server:**

    npm run dev
    The frontend application should now be running on `http://localhost:5173` (or another available port).

## Usage

1.  **Register a New Account:** Navigate to the `/register` page and create a new user account.
2.  **Login:** Use your newly created credentials to log in.
3.  **Dashboard:** After logging in, you'll be redirected to your dashboard where you can see your projects.
4.  **Create Project:** Click the "Create New Project" button to start a new board.
5.  **Project Board:** Enter a project to view its lists and tasks.
6.  **Manage Lists/Tasks:** Add new lists (columns) and tasks (cards). You can update and delete them as needed.
7.  **Collaborate:** Use the "Manage Members" button to invite other registered users to your projects.
8.  **Edit/Delete Project:** If you are the owner of a project, you will see "Edit Project" and "Delete Project" buttons.

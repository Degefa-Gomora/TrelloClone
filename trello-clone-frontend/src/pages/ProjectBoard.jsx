

// // // // export default ProjectBoard;

// // // // src/pages/ProjectBoard.jsx (UPDATED - Add Collaborators)
// // // import React, { useState, useEffect } from 'react';
// // // import { useParams, Link } from 'react-router-dom';
// // // import { useAuth } from '../context/AuthContext';
// // // import { getProjectById, createList } from '../api/projects';
// // // import ListCard from '../components/ListCard';
// // // import MembersModal from '../components/MembersModal'; // <--- Import MembersModal
// // // import './ProjectBoard.css';

// // // function ProjectBoard() {
// // //   const { projectId } = useParams();
// // //   const { user, token, signOut } = useAuth();
// // //   const [project, setProject] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [newListName, setNewListName] = useState('');
// // //   const [showAddListInput, setShowAddListInput] = useState(false);
// // //   const [showMembersModal, setShowMembersModal] = useState(false); // <--- New state for modal

// // //   useEffect(() => {
// // //     const fetchProject = async () => {
// // //       if (!token || !projectId) {
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       try {
// // //         const fetchedProject = await getProjectById(projectId, token);
// // //         setProject(fetchedProject);
// // //       } catch (err) {
// // //         console.error('Error fetching project board:', err);
// // //         setError('Failed to load project board. Please ensure you are a member and try again.');
// // //         if (err.response && err.response.status === 401) {
// // //           signOut();
// // //         }
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchProject();
// // //   }, [projectId, token, signOut]);

// // //   const handleCreateList = async (e) => {
// // //     e.preventDefault();
// // //     if (!newListName.trim()) return;

// // //     try {
// // //       const newList = await createList(projectId, newListName, token);
// // //       setProject(prevProject => ({
// // //         ...prevProject,
// // //         lists: [...prevProject.lists, newList],
// // //       }));
// // //       setNewListName('');
// // //       setShowAddListInput(false);
// // //     } catch (err) {
// // //       console.error('Error creating list:', err);
// // //       alert('Failed to create list. Please try again.');
// // //     }
// // //   };

// // //   const handleListDeleted = (listId) => {
// // //     setProject(prevProject => ({
// // //       ...prevProject,
// // //       lists: prevProject.lists.filter(list => list._id !== listId),
// // //     }));
// // //   };

// // //   const handleTaskAdded = (listId, newTask) => {
// // //     setProject(prevProject => ({
// // //       ...prevProject,
// // //       lists: prevProject.lists.map(list =>
// // //         list._id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
// // //       ),
// // //     }));
// // //   };

// // //   const handleTaskUpdated = (listId, updatedTask) => {
// // //     setProject(prevProject => ({
// // //       ...prevProject,
// // //       // Find the list, then find the task within that list and replace it
// // //       lists: prevProject.lists.map(list =>
// // //         list._id === listId
// // //           ? {
// // //               ...list,
// // //               tasks: list.tasks.map(task =>
// // //                 task._id === updatedTask._id ? updatedTask : task
// // //               ),
// // //             }
// // //           : list
// // //       ),
// // //     }));
// // //   };

// // //   const handleTaskDeleted = (listId, taskId) => {
// // //     setProject(prevProject => ({
// // //       ...prevProject,
// // //       lists: prevProject.lists.map(list =>
// // //         list._id === listId
// // //           ? { ...list, tasks: list.tasks.filter(task => task._id !== taskId) }
// // //           : list
// // //       ),
// // //     }));
// // //   };

// // //   // Callback to update project state after member changes in modal
// // //   const handleProjectUpdatedFromModal = (updatedProject) => {
// // //     setProject(updatedProject);
// // //   };

// // //   if (loading) return <p>Loading project board...</p>;
// // //   if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
// // //   if (!project) return <p style={{ textAlign: 'center' }}>Project not found or you don't have access.</p>;

// // //   return (
// // //     <div className="project-board-container">
// // //       <div className="project-header-actions"> {/* New div for header items */}
// // //         <Link to="/dashboard" className="back-to-dashboard-link">&larr; Back to Dashboard</Link>
// // //         <button onClick={() => setShowMembersModal(true)} className="manage-members-btn">
// // //           Manage Members ({project.members.length})
// // //         </button>
// // //       </div>

// // //       <h2 className="project-title">{project.name}</h2>
// // //       <p className="project-description">{project.description}</p>

// // //       <div className="board-content">
// // //         {project.lists.map((list) => (
// // //           <ListCard
// // //             key={list._id}
// // //             project={project}
// // //             list={list}
// // //             onListDeleted={handleListDeleted}
// // //             onTaskAdded={handleTaskAdded}
// // //             onTaskUpdated={handleTaskUpdated}
// // //             onTaskDeleted={handleTaskDeleted}
// // //           />
// // //         ))}

// // //         {showAddListInput ? (
// // //           <form onSubmit={handleCreateList} className="add-list-form">
// // //             <input
// // //               type="text"
// // //               placeholder="Enter list title..."
// // //               value={newListName}
// // //               onChange={(e) => setNewListName(e.target.value)}
// // //               autoFocus
// // //               required
// // //             />
// // //             <div className="add-list-actions">
// // //               <button type="submit" className="btn-add-list">Add list</button>
// // //               <button type="button" onClick={() => setShowAddListInput(false)} className="btn-cancel-add-list">X</button>
// // //             </div>
// // //           </form>
// // //         ) : (
// // //           <button onClick={() => setShowAddListInput(true)} className="add-list-button">
// // //             + Add another list
// // //           </button>
// // //         )}
// // //       </div>

// // //       {showMembersModal && project && (
// // //         <MembersModal
// // //           project={project}
// // //           onClose={() => setShowMembersModal(false)}
// // //           onProjectUpdated={handleProjectUpdatedFromModal}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // export default ProjectBoard;

// // // src/pages/ProjectBoard.jsx
// // import React, { useState, useEffect } from 'react';
// // import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
// // import { useAuth } from '../context/AuthContext';
// // import { getProjectById, createList } from '../api/projects';
// // import ListCard from '../components/ListCard';
// // import MembersModal from '../components/MembersModal';
// // import './ProjectBoard.css';

// // function ProjectBoard() {
// //   console.log("ProjectBoard component is rendering!");
// //   const { projectId } = useParams();
// //   const { user, token, signOut } = useAuth();
// //   const navigate = useNavigate(); // Initialize useNavigate
// //   const [project, setProject] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [newListName, setNewListName] = useState('');
// //   const [showAddListInput, setShowAddListInput] = useState(false);
// //   const [showMembersModal, setShowMembersModal] = useState(false);

// //   useEffect(() => {
// //     const fetchProject = async () => {
// //       if (!token || !projectId) {
// //         setLoading(false);
// //         return;
// //       }
// //       try {
// //         const fetchedProject = await getProjectById(projectId, token);
// //         setProject(fetchedProject);
// //         // ADD THESE CONSOLE LOGS:
// //         console.log("Fetched Project:", fetchedProject);
// //         console.log("Logged in User:", user);
// //         console.log("Project Owner ID:", fetchedProject.owner?._id);
// //         console.log("Logged in User ID:", user?._id);
// //         console.log(
// //           "Is current user the owner?",
// //           user?._id === fetchedProject.owner?._id
// //         );
// //         // ---
// //       } catch (err) {
// //         console.error('Error fetching project board:', err);
// //         setError('Failed to load project board. Please ensure you are a member and try again.');
// //         if (err.response && err.response.status === 401) {
// //           signOut();
// //         }
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchProject();
// //   }, [projectId, token, signOut]);

// //   const handleCreateList = async (e) => {
// //     e.preventDefault();
// //     if (!newListName.trim()) return;

// //     try {
// //       const newList = await createList(projectId, newListName, token);
// //       setProject(prevProject => ({
// //         ...prevProject,
// //         lists: [...prevProject.lists, newList],
// //       }));
// //       setNewListName('');
// //       setShowAddListInput(false);
// //     } catch (err) {
// //       console.error('Error creating list:', err);
// //       alert('Failed to create list. Please try again.');
// //     }
// //   };

// //   const handleListDeleted = (listId) => {
// //     setProject(prevProject => ({
// //       ...prevProject,
// //       lists: prevProject.lists.filter(list => list._id !== listId),
// //     }));
// //   };

// //   const handleTaskAdded = (listId, newTask) => {
// //     setProject(prevProject => ({
// //       ...prevProject,
// //       lists: prevProject.lists.map(list =>
// //         list._id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
// //       ),
// //     }));
// //   };

// //   const handleTaskUpdated = (listId, updatedTask) => {
// //     setProject(prevProject => ({
// //       ...prevProject,
// //       lists: prevProject.lists.map(list =>
// //         list._id === listId
// //           ? {
// //               ...list,
// //               tasks: list.tasks.map(task =>
// //                 task._id === updatedTask._id ? updatedTask : task
// //               ),
// //             }
// //           : list
// //       ),
// //     }));
// //   };

// //   const handleTaskDeleted = (listId, taskId) => {
// //     setProject(prevProject => ({
// //       ...prevProject,
// //       lists: prevProject.lists.map(list =>
// //         list._id === listId
// //           ? { ...list, tasks: list.tasks.filter(task => task._id !== taskId) }
// //           : list
// //       ),
// //     }));
// //   };

// //   // Callback to update project state after member changes in modal
// //   // UPDATED: Now also redirects to dashboard and closes modal
// //   const handleProjectUpdatedFromModal = (updatedProject) => {
// //     setProject(updatedProject);
// //     setShowMembersModal(false); // Close the modal
// //     navigate('/dashboard'); // Redirect to the dashboard
// //   };

// //   if (loading) return <p>Loading project board...</p>;
// //   if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
// //   if (!project) return <p style={{ textAlign: 'center' }}>Project not found or you don't have access.</p>;

// //   return (
// //     <div className="project-board-container">
// //       <div className="project-header-actions">
// //         <Link to="/dashboard" className="back-to-dashboard-link">&larr; Back to Dashboard</Link>
// //         <button onClick={() => setShowMembersModal(true)} className="manage-members-btn">
// //           Manage Members ({project.members.length})
// //         </button>
// //       </div>

// //       <h2 className="project-title">{project.name}</h2>
// //       <p className="project-description">{project.description}</p>

// //       <div className="board-content">
// //         {/* FIX: Added defensive check for project.lists before mapping */}
// //         {project.lists && project.lists.map((list) => (
// //           <ListCard
// //             key={list._id}
// //             project={project}
// //             list={list}
// //             onListDeleted={handleListDeleted}
// //             onTaskAdded={handleTaskAdded}
// //             onTaskUpdated={handleTaskUpdated}
// //             onTaskDeleted={handleTaskDeleted}
// //           />
// //         ))}

// //         {showAddListInput ? (
// //           <form onSubmit={handleCreateList} className="add-list-form">
// //             <input
// //               type="text"
// //               placeholder="Enter list title..."
// //               value={newListName}
// //               onChange={(e) => setNewListName(e.target.value)}
// //               autoFocus
// //               required
// //             />
// //             <div className="add-list-actions">
// //               <button type="submit" className="btn-add-list">Add list</button>
// //               <button type="button" onClick={() => setShowAddListInput(false)} className="btn-cancel-add-list">X</button>
// //             </div>
// //           </form>
// //         ) : (
// //           <button onClick={() => setShowAddListInput(true)} className="add-list-button">
// //             + Add another list
// //           </button>
// //         )}
// //       </div>

// //       {showMembersModal && project && (
// //         <MembersModal
// //           project={project}
// //           onClose={() => setShowMembersModal(false)}
// //           onProjectUpdated={handleProjectUpdatedFromModal}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // export default ProjectBoard;


// // src/pages/ProjectBoard.jsx - COMPLETE AND UPDATED FILE

// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// // IMPORT: Ensure deleteProject is here
// import { getProjectById, createList, deleteProject } from '../api/projects'; 
// import ListCard from '../components/ListCard';
// import MembersModal from '../components/MembersModal';
// import './ProjectBoard.css';

// function ProjectBoard() {
//   // Log every time the component attempts to render
//   console.log("ProjectBoard component is rendering!"); 

//   const { projectId } = useParams();
//   const { user, token, signOut } = useAuth(); // Destructure 'user'
//   const navigate = useNavigate(); // Initialize useNavigate for redirection
  
//   // State variables for project data, loading, errors, and UI controls
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newListName, setNewListName] = useState('');
//   const [showAddListInput, setShowAddListInput] = useState(false);
//   const [showMembersModal, setShowMembersModal] = useState(false);

//   // useEffect to fetch project data when component mounts or dependencies change
//   useEffect(() => {
//     const fetchProject = async () => {
//       // If no token or projectId, can't fetch. Set loading to false and return.
//       if (!token || !projectId) {
//         setLoading(false);
//         return;
//       }
//       try {
//         const fetchedProject = await getProjectById(projectId, token);
//         setProject(fetchedProject); // Update project state
        
//         // Logs from inside useEffect, showing data *after* successful fetch
//         console.log("Fetched Project (inside useEffect):", fetchedProject);
//         console.log("Logged in User (inside useEffect):", user);
//         console.log("Project Owner ID (inside useEffect):", fetchedProject.owner?._id);
//         console.log("Logged in User ID (inside useEffect):", user?._id);
//         console.log("Is current user the owner (inside useEffect)?", user?._id === fetchedProject.owner?._id);
//       } catch (err) {
//         console.error('Error fetching project board:', err);
//         setError('Failed to load project board. Please ensure you are a member and try again.');
//         // If error is due to unauthorized access, sign out the user
//         if (err.response && err.response.status === 401) {
//           signOut();
//         }
//       } finally {
//         setLoading(false); // Set loading to false once fetch is complete (success or error)
//       }
//     };
//     fetchProject(); // Call the fetch function
//   }, [projectId, token, signOut, user]); // Dependencies: Re-run effect if any of these change

//   // --- Handlers for List and Task operations ---
//   const handleCreateList = async (e) => {
//     e.preventDefault();
//     if (!newListName.trim()) return;

//     try {
//       const newList = await createList(projectId, newListName, token);
//       setProject(prevProject => ({
//         ...prevProject,
//         lists: [...prevProject.lists, newList],
//       }));
//       setNewListName('');
//       setShowAddListInput(false);
//     } catch (err) {
//       console.error('Error creating list:', err);
//       alert('Failed to create list. Please try again.');
//     }
//   };

//   const handleListDeleted = (listId) => {
//     setProject(prevProject => ({
//       ...prevProject,
//       lists: prevProject.lists.filter(list => list._id !== listId),
//     }));
//   };

//   const handleTaskAdded = (listId, newTask) => {
//     setProject(prevProject => ({
//       ...prevProject,
//       lists: prevProject.lists.map(list =>
//         list._id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
//       ),
//     }));
//   };

//   const handleTaskUpdated = (listId, updatedTask) => {
//     setProject(prevProject => ({
//       ...prevProject,
//       lists: prevProject.lists.map(list =>
//         list._id === listId
//           ? {
//               ...list,
//               tasks: list.tasks.map(task =>
//                 task._id === updatedTask._id ? updatedTask : task
//               ),
//             }
//           : list
//       ),
//     }));
//   };

//   const handleTaskDeleted = (listId, taskId) => {
//     setProject(prevProject => ({
//       ...prevProject,
//       lists: prevProject.lists.map(list =>
//         list._id === listId
//           ? { ...list, tasks: list.tasks.filter(task => task._id !== taskId) }
//           : list
//       ),
//     }));
//   };

//   // Callback to update project state after member changes in modal, and redirect
//   const handleProjectUpdatedFromModal = (updatedProject) => {
//     setProject(updatedProject);
//     setShowMembersModal(false); // Close the modal after update
//     navigate('/dashboard'); // Redirect to the dashboard
//   };

//   // NEW: Function to handle project deletion
//   const handleDeleteProject = async () => {
//     // Confirmation dialog before attempting deletion
//     if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
//       try {
//         await deleteProject(projectId, token); // Call your API to delete the project
//         alert('Project deleted successfully!');
//         navigate('/dashboard'); // Redirect to the dashboard after successful deletion
//       } catch (err) {
//         console.error('Error deleting project:', err);
//         alert('Failed to delete project. Please try again.');
//         // If the error is due to authentication, sign out
//         if (err.response && err.response.status === 401) {
//           signOut();
//         }
//       }
//     }
//   };

//   // Calculate isOwner here. This calculation runs on every render cycle.
//   // It depends on the current 'user' and 'project' state values.
//   const isOwner = user && project && project.owner && user._id === project.owner._id;

//   // *** NEW: Logs to check state and isOwner RIGHT BEFORE the component renders its JSX ***
//   // This is crucial for debugging why the button might not appear.
//   console.log("--- Render Check ---");
//   console.log("isOwner (at render time):", isOwner);
//   console.log("User state (at render time):", user);
//   console.log("Project state (at render time):", project);
//   console.log("Loading state (at render time):", loading);
//   console.log("--- End Render Check ---");
//   // --- End of new logs ---

//   // Conditional rendering for loading, error, or no project found states
//   if (loading) return <p>Loading project board...</p>;
//   if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
//   if (!project) return <p style={{ textAlign: 'center' }}>Project not found or you don't have access.</p>;

//   // Main component JSX
//   return (
//     <div className="project-board-container">
//       <div className="project-header-actions">
//         {/* Link back to dashboard */}
//         <Link to="/dashboard" className="back-to-dashboard-link">&larr; Back to Dashboard</Link>
        
//         {/* Button to manage members, opens the MembersModal */}
//         <button onClick={() => setShowMembersModal(true)} className="manage-members-btn">
//           Manage Members ({project.members.length})
//         </button>
        
//         {/* NEW: Project Delete Button - Visible ONLY if isOwner is true */}
//         {isOwner && ( 
//           <button onClick={handleDeleteProject} className="delete-project-btn">
//             Delete Project
//           </button>
//         )}
//       </div>

//       <h2 className="project-title">{project.name}</h2>
//       <p className="project-description">{project.description}</p>

//       <div className="board-content">
//         {/* Render ListCard components for each list in the project */}
//         {/* Added defensive check for project.lists before mapping to prevent errors if lists is null/undefined */}
//         {project.lists && project.lists.map((list) => (
//           <ListCard
//             key={list._id}
//             project={project} // Pass the entire project for potential sub-component checks
//             list={list}
//             onListDeleted={handleListDeleted}
//             onTaskAdded={handleTaskAdded}
//             onTaskUpdated={handleTaskUpdated}
//             onTaskDeleted={handleTaskDeleted}
//           />
//         ))}

//         {/* Conditional rendering for "Add another list" input/button */}
//         {showAddListInput ? (
//           <form onSubmit={handleCreateList} className="add-list-form">
//             <input
//               type="text"
//               placeholder="Enter list title..."
//               value={newListName}
//               onChange={(e) => setNewListName(e.target.value)}
//               autoFocus
//               required
//             />
//             <div className="add-list-actions">
//               <button type="submit" className="btn-add-list">Add list</button>
//               <button type="button" onClick={() => setShowAddListInput(false)} className="btn-cancel-add-list">X</button>
//             </div>
//           </form>
//         ) : (
//           <button onClick={() => setShowAddListInput(true)} className="add-list-button">
//             + Add another list
//           </button>
//         )}
//       </div>

//       {/* Render MembersModal if showMembersModal is true and project data is available */}
//       {showMembersModal && project && (
//         <MembersModal
//           project={project}
//           onClose={() => setShowMembersModal(false)}
//           onProjectUpdated={handleProjectUpdatedFromModal}
//         />
//       )}
//     </div>
//   );
// }

// export default ProjectBoard;

// src/pages/ProjectBoard.jsx (COMPLETE AND UPDATED)

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Import all necessary API functions for projects, lists, and tasks
import { 
  getProjectById, 
  createList, 
  deleteProject, 
  updateProject // <--- Make sure updateProject is imported
} from '../api/projects'; 
import ListCard from '../components/ListCard';
import MembersModal from '../components/MembersModal';
import EditProjectModal from '../components/EditProjectModal'; // <--- Import the new EditProjectModal
import './ProjectBoard.css';

function ProjectBoard() {

  const { projectId } = useParams();
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [showAddListInput, setShowAddListInput] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false); // <--- NEW STATE for Edit Project Modal

  useEffect(() => {
    const fetchProject = async () => {
      if (!token || !projectId) {
        setLoading(false);
        return;
      }
      try {
        const fetchedProject = await getProjectById(projectId, token);
        setProject(fetchedProject);
        
        // Console logs for debugging ownership
      } catch (err) {
        console.error('Error fetching project board:', err);
        setError('Failed to load project board. Please ensure you are a member and try again.');
        if (err.response && err.response.status === 401) {
          signOut();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, token, signOut, user]); 

  // --- List & Task Handlers ---
  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const newList = await createList(projectId, newListName, token);
      setProject(prevProject => ({
        ...prevProject,
        lists: [...prevProject.lists, newList],
      }));
      setNewListName('');
      setShowAddListInput(false);
    } catch (err) {
      console.error('Error creating list:', err);
      alert('Failed to create list. Please try again.');
    }
  };

  const handleListDeleted = (listId) => {
    setProject(prevProject => ({
      ...prevProject,
      lists: prevProject.lists.filter(list => list._id !== listId),
    }));
  };

  const handleTaskAdded = (listId, newTask) => {
    setProject(prevProject => ({
      ...prevProject,
      lists: prevProject.lists.map(list =>
        list._id === listId ? { ...list, tasks: [...list.tasks, newTask] } : list
      ),
    }));
  };

  const handleTaskUpdated = (listId, updatedTask) => {
    setProject(prevProject => ({
      ...prevProject,
      lists: prevProject.lists.map(list =>
        list._id === listId
          ? {
              ...list,
              tasks: list.tasks.map(task =>
                task._id === updatedTask._id ? updatedTask : task
              ),
            }
          : list
      ),
    }));
  };

  const handleTaskDeleted = (listId, taskId) => {
    setProject(prevProject => ({
      ...prevProject,
      lists: prevProject.lists.map(list =>
        list._id === listId
          ? { ...list, tasks: list.tasks.filter(task => task._id !== taskId) }
          : list
      ),
    }));
  };

  // Callback to update project state from modals (MembersModal, EditProjectModal)
  const handleProjectUpdatedFromModal = (updatedProject) => { 
    setProject(updatedProject); // Update the main project state
    setShowMembersModal(false); // Close members modal if it was open
    setShowEditProjectModal(false); // Close edit modal if it was open
    // For project edits, typically you don't navigate away unless the project ID changes.
    // For member changes, you might want to refresh members list or dashboard.
    // navigate('/dashboard'); // Uncomment if you specifically want to redirect after any project update from a modal
  };

  // Handler for deleting the entire project
  const handleDeleteProject = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(projectId, token); // Call the delete API
        alert('Project deleted successfully!');
        navigate('/dashboard'); // Redirect to dashboard after successful deletion
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project. Please try again.');
        if (err.response && err.response.status === 401) {
          signOut();
        }
      }
    }
  };

  // Determine if the current user is the project owner
  const isOwner = user && project && project.owner && user._id === project.owner._id;

  // --- Debugging Logs (Keep these for now as they're helpful) ---
  console.log("--- Render Check ---");
  console.log("isOwner (at render time):", isOwner);
  console.log("User state (at render time):", user);
  console.log("Project state (at render time):", project);
  console.log("Loading state (at render time):", loading);
  console.log("--- End Render Check ---");

  // --- Conditional Rendering for Loading/Error States ---
  if (loading) return <p>Loading project board...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!project) return <p style={{ textAlign: 'center' }}>Project not found or you don't have access.</p>;

  return (
    <div className="project-board-container">
      <div className="project-header-actions">
        <Link to="/dashboard" className="back-to-dashboard-link">&larr; Back to Dashboard</Link>
        
        {/* Manage Members Button */}
        <button onClick={() => setShowMembersModal(true)} className="manage-members-btn">
          Manage Members ({project.members.length})
        </button>
        
        {/* NEW: Edit Project Button - Only visible to the project owner */}
        {isOwner && (
          <button onClick={() => setShowEditProjectModal(true)} className="edit-project-btn">
            Edit Project
          </button>
        )}

        {/* Existing: Delete Project Button - Only visible to the project owner */}
        {isOwner && ( 
          <button onClick={handleDeleteProject} className="delete-project-btn">
            Delete Project
          </button>
        )}
      </div>

      <h2 className="project-title">{project.name}</h2>
      <p className="project-description">{project.description}</p>

      <div className="board-content">
        {project.lists && project.lists.map((list) => (
          <ListCard
            key={list._id}
            project={project}
            list={list}
            onListDeleted={handleListDeleted}
            onTaskAdded={handleTaskAdded}
            onTaskUpdated={handleTaskUpdated}
            onTaskDeleted={handleTaskDeleted}
          />
        ))}

        {showAddListInput ? (
          <form onSubmit={handleCreateList} className="add-list-form">
            <input
              type="text"
              placeholder="Enter list title..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              autoFocus
              required
            />
            <div className="add-list-actions">
              <button type="submit" className="btn-add-list">Add list</button>
              <button type="button" onClick={() => setShowAddListInput(false)} className="btn-cancel-add-list">X</button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowAddListInput(true)} className="add-list-button">
            + Add another list
          </button>
        )}
      </div>

      {/* Render MembersModal if showMembersModal is true and project data is available */}
      {showMembersModal && project && (
        <MembersModal
          project={project}
          onClose={() => setShowMembersModal(false)}
          onProjectUpdated={handleProjectUpdatedFromModal}
        />
      )}

      {/* NEW: Render EditProjectModal if showEditProjectModal is true and project data is available */}
      {showEditProjectModal && project && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditProjectModal(false)}
          onProjectUpdated={handleProjectUpdatedFromModal}
        />
      )}
    </div>
  );
}

export default ProjectBoard;
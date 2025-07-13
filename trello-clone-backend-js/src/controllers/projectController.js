


// // src/controllers/projectController.js
// const asyncHandler = require("express-async-handler"); // For simplifying async error handling
// const Project = require("../models/Project"); // Import the Project Mongoose model
// const User = require("../models/User"); // Import the User Mongoose model for member/assignedTo operations

// // --- Project Controllers ---

// // @desc    Create a new project
// // @route   POST /api/projects
// // @access  Private
// const createProject = asyncHandler(async (req, res) => {
//   const { name, description } = req.body;

//   if (!name) {
//     res.status(400);
//     throw new Error("Please add a project name");
//   }

//   const newProject = new Project({
//     name,
//     description,
//     owner: req.user._id, // This was already correct
//     members: [req.user._id], // This was already correct
//   });

//   const project = await newProject.save();
//   res.status(201).json(project);
// });

// // @desc    Get all projects for the authenticated user (owned or member of)
// // @route   GET /api/projects
// // @access  Private
// const getProjects = asyncHandler(async (req, res) => {
//   // Find projects where the authenticated user is either the owner or a member
//   const projects = await Project.find({
//     $or: [{ owner: req.user._id }, { members: req.user._id }], // This was already correct
//   })
//     .populate("owner", "username email") // Populate owner details
//     .populate("members", "username email") // Populate member details
//     .populate({
//       path: "lists",
//       populate: {
//         path: "tasks.assignedTo", // Populate assignedTo user for tasks nested within lists
//         select: "username email",
//       },
//     });
//   res.status(200).json(projects);
// });

// // @desc    Get project by ID
// // @route   GET /api/projects/:id
// // @access  Private
// const getProjectById = asyncHandler(async (req, res) => {
//   const project = await Project.findById(req.params.id)
//     .populate("owner", "username email")
//     .populate("members", "username email")
//     .populate({
//       path: "lists",
//       populate: {
//         path: "tasks.assignedTo",
//         select: "username email",
//       },
//     });

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if the user is the owner or a member of the project
//   const isOwner = project.owner.equals(req.user._id); // This was already correct
//   const isMember = project.members.some((member) =>
//     member.equals(req.user._id) // This was already correct
//   );

//   if (!isOwner && !isMember) {
//     res.status(403); // Forbidden
//     throw new Error("Not authorized to access this project");
//   }

//   res.status(200).json(project);
// });

// // @desc    Update a project
// // @route   PUT /api/projects/:id
// // @access  Private (Owner only)
// const updateProject = asyncHandler(async (req, res) => {
//   const { name, description } = req.body;

//   let project = await Project.findById(req.params.id);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Ensure user is the owner (or extend this logic for project admins later)
//   if (project.owner.toString() !== req.user._id.toString()) { // CHANGED TO req.user._id
//     res.status(401);
//     throw new Error("User not authorized");
//   }

//   project.name = name || project.name;
//   project.description = description || project.description;

//   await project.save();
//   res.status(200).json(project);
// });

// // @desc    Delete a project
// // @route   DELETE /api/projects/:id
// // @access  Private (Owner only)
// const deleteProject = asyncHandler(async (req, res) => {
//   const project = await Project.findById(req.params.id);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Ensure user is the owner
//   if (project.owner.toString() !== req.user._id.toString()) { // CHANGED TO req.user._id
//     res.status(401);
//     throw new Error("User not authorized");
//   }

//   // Mongoose handles cascading deletes for subdocuments automatically.
//   // If Lists/Tasks were separate collections, additional deleteMany calls would be needed.
//   await project.deleteOne(); // Use deleteOne() for Mongoose 6+

//   res.status(200).json({ message: "Project removed" });
// });

// // --- List Controllers ---
// // @desc    Create a new list for a project
// // @route   POST /api/projects/:projectId/lists
// // @access  Private
// const createList = asyncHandler(async (req, res) => {
//   const { name } = req.body;
//   const { projectId } = req.params;

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // --- DEBUGGING LOGS FOR createList (Keeping them for now, will remove later) ---
//   console.log('--- DEBUGGING CREATE LIST AUTHORIZATION ---');
//   console.log('Authenticated User ID (req.user._id):', req.user._id); // CHANGED TO req.user._id
//   console.log('Project ID:', projectId);
//   console.log('Project Members (converted to string):', project.members.map(member => member.toString()));
//   console.log('Is User a Member? Test Result:', project.members.some(memberId => memberId.toString() === req.user._id.toString())); // CHANGED TO req.user._id
//   console.log('-------------------------------------------');
//   // --- END DEBUGGING LOGS ---


//   // Check if user is a member of the project (FIXED COMPARISON)
//   if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) { // CHANGED TO req.user._id
//     res.status(403);
//     throw new Error("Not authorized to add lists to this project");
//   }

//   const newList = {
//     name,
//     tasks: [], // Initialize with an empty tasks array
//   };

//   project.lists.push(newList);
//   await project.save();

//   // Return the newly added list, which will have an _id generated by Mongoose
//   const addedList = project.lists[project.lists.length - 1];
//   res.status(201).json(addedList);
// });

// // @desc    Update a list
// // @route   PUT /api/projects/:projectId/lists/:listId
// // @access  Private
// const updateList = asyncHandler(async (req, res) => {
//   const { projectId, listId } = req.params;
//   const { name, taskOrder } = req.body; // taskOrder for reordering tasks

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if user is a member of the project (FIXED COMPARISON)
//   if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) { // CHANGED TO req.user._id
//     res.status(403);
//     throw new Error("Not authorized to update lists in this project");
//   }

//   const list = project.lists.id(listId);

//   if (!list) {
//     res.status(404);
//     throw new Error("List not found");
//   }

//   if (name !== undefined) {
//     list.name = name;
//   }

//   // Handle task reordering within the list if taskOrder is provided
//   if (taskOrder && Array.isArray(taskOrder)) {
//     const existingTasksMap = new Map(
//       list.tasks.map((task) => [task._id.toString(), task])
//     );
//     const reorderedTasks = [];

//     for (const taskId of taskOrder) {
//       const task = existingTasksMap.get(taskId);
//       if (task) {
//         reorderedTasks.push(task);
//         existingTasksMap.delete(taskId);
//       }
//     }
//     existingTasksMap.forEach((task) => reorderedTasks.push(task)); // Add any remaining tasks
//     list.tasks = reorderedTasks;
//   }

//   await project.save();
//   res.status(200).json(list);
// });

// // @desc    Delete a list
// // @route   DELETE /api/projects/:projectId/lists/:listId
// // @access  Private
// const deleteList = asyncHandler(async (req, res) => {
//   const { projectId, listId } = req.params;

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if user is a member of the project (FIXED COMPARISON)
//   if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) { // CHANGED TO req.user._id
//     res.status(403);
//     throw new Error("Not authorized to delete lists from this project");
//   }

//   // Using .deleteOne() for subdocuments directly
//   project.lists.id(listId).deleteOne();
//   await project.save();
//   res.status(200).json({ message: "List removed" });
// });

// // --- Task Controllers ---
// // @desc    Create a new task for a list
// // @route   POST /api/projects/:projectId/lists/:listId/tasks
// // @access  Private
// const createTask = asyncHandler(async (req, res) => {
//   const { projectId, listId } = req.params;
//   const { title, description, assignedTo, dueDate } = req.body;

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if user is a member of the project (FIXED COMPARISON)
//   if (
//     !project.members.some((memberId) => memberId.toString() === req.user._id.toString()) // CHANGED TO req.user._id
//   ) {
//     res.status(403);
//     throw new Error("Not authorized to add tasks to this project");
//   }

//   const list = project.lists.id(listId);

//   if (!list) {
//     res.status(404);
//     throw new Error("List not found");
//   }

//   if (!title) {
//     res.status(400);
//     throw new Error("Task title is required");
//   }

//   const newTask = {
//     title,
//     description,
//     assignedTo: assignedTo || null, // Can be null if not assigned
//     dueDate: dueDate || null, // Can be null if no due date
//     status: "To Do", // Default status
//   };

//   list.tasks.push(newTask);
//   await project.save();

//   // Find the created task (it will have an _id now)
//   const createdTask = list.tasks[list.tasks.length - 1];

//   // To return the task with populated assignedTo user, we need to re-fetch/populate.
//   const populatedProject = await Project.findById(projectId).populate({
//     path: "lists",
//     match: { _id: listId },
//     populate: {
//       path: "tasks",
//       match: { _id: createdTask._id }, // Find the specific newly created task
//       populate: {
//         path: "assignedTo",
//         select: "username email",
//       },
//     },
//   });

//   const populatedList = populatedProject.lists.find(
//     (l) => l._id.toString() === listId
//   );
//   const finalPopulatedTask = populatedList
//     ? populatedList.tasks.find(
//         (t) => t._id.toString() === createdTask._id.toString()
//       )
//     : null;

//   res.status(201).json(finalPopulatedTask);
// });

// // @desc    Update a task
// // @route   PUT /api/projects/:projectId/lists/:listId/tasks/:taskId
// // @access  Private
// const updateTask = asyncHandler(async (req, res) => {
//   const { projectId, listId, taskId } = req.params;
//   const { title, description, assignedTo, dueDate, status } = req.body;

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) { // CHANGED TO req.user._id
//     res.status(403);
//     throw new Error("Not authorized to update tasks in this project");
//   }

//   const list = project.lists.id(listId);
//   if (!list) {
//     res.status(404);
//     throw new Error("List not found");
//   }

//   const task = list.tasks.id(taskId);
//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   if (title !== undefined) task.title = title;
//   if (description !== undefined) task.description = description;
//   if (assignedTo !== undefined) task.assignedTo = assignedTo; // Mongoose will handle null if assignedTo is empty string
//   if (dueDate !== undefined) task.dueDate = dueDate;
//   if (status !== undefined) task.status = status;

//   await project.save();

//   // After saving, re-populate the specific task to return it with assignedTo details
//   const updatedProject = await Project.findById(projectId).populate({
//     path: "lists",
//     match: { _id: listId },
//     populate: {
//       path: "tasks",
//       match: { _id: taskId },
//       populate: {
//         path: "assignedTo",
//         select: "username email",
//       },
//     },
//   });

//   const updatedList = updatedProject.lists.find(
//     (l) => l._id.toString() === listId
//   );
//   const updatedTask = updatedList
//     ? updatedList.tasks.find((t) => t._id.toString() === taskId)
//     : null;

//   res.status(200).json(updatedTask);
// });

// // @desc    Delete a task
// // @route   DELETE /api/projects/:projectId/lists/:listId/tasks/:taskId
// // @access  Private
// const deleteTask = asyncHandler(async (req, res) => {
//   const { projectId, listId, taskId } = req.params;

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) { // CHANGED TO req.user._id
//     res.status(403);
//     throw new Error("Not authorized to delete tasks from this project");
//   }

//   const list = project.lists.id(listId);
//   if (!list) {
//     res.status(404);
//     throw new Error("List not found");
//   }

//   list.tasks.id(taskId).deleteOne(); // Use .deleteOne() for subdocuments
//   await project.save();
//   res.status(200).json({ message: "Task removed" });
// });

// // --- Collaborator / User Management Controllers ---
// // @desc    Search for users by username or email
// // @route   GET /api/projects/users/search?q=<query>
// // @access  Private
// const searchUsers = asyncHandler(async (req, res) => {
//   const { q } = req.query;
//   if (!q) {
//     res.status(400);
//     throw new Error('Search query "q" is required');
//   }

//   // Find users whose username or email matches the query (case-insensitive)
//   // Exclude the current user from the search results
//   const users = await User.find({
//     $or: [
//       { username: { $regex: q, $options: "i" } },
//       { email: { $regex: q, $options: "i" } },
//     ],
//     _id: { $ne: req.user._id }, // CHANGED TO req.user._id
//   }).select("username email"); // Only return username and email

//   res.status(200).json(users);
// });

// // @desc    Add a member to a project
// // @route   POST /api/projects/:projectId/members
// // @access  Private (any project member can add)
// const addProjectMember = asyncHandler(async (req, res) => {
//   const { userId } = req.body; // The ID of the user to add
//   const { projectId } = req.params;

//   const project = await Project.findById(projectId);
//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if the requesting user is a member of the project
//   const isMember = project.members.some(
//     (memberId) => memberId.toString() === req.user._id.toString() // CHANGED TO req.user._id
//   );
//   if (!isMember) {
//     res.status(403);
//     throw new Error("Access denied: Not a member of this project");
//   }

//   // Check if the user to add exists
//   const userToAdd = await User.findById(userId);
//   if (!userToAdd) {
//     res.status(404);
//     throw new Error("User to add not found");
//   }

//   // Check if user is already a member (FIXED COMPARISON)
//   if (project.members.some(memberId => memberId.toString() === userId)) {
//     res.status(400);
//     throw new Error("User is already a member of this project");
//   }

//   // Add user to project members
//   project.members.push(userId);
//   await project.save();

//   // Re-fetch project with populated members to send back the latest state
//   const updatedProject = await Project.findById(projectId).populate(
//     "members",
//     "username email"
//   );
//   res.status(200).json(updatedProject);
// });

// // @desc    Remove a member from a project
// // @route   DELETE /api/projects/:projectId/members/:userId
// // @access  Private (project owner or the member themselves can leave)
// const removeProjectMember = asyncHandler(async (req, res) => {
//   const { projectId, userId } = req.params; // userId to remove

//   const project = await Project.findById(projectId);
//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if the requesting user is an owner OR the user being removed
//   const isOwner = project.owner.toString() === req.user._id.toString(); // CHANGED TO req.user._id
//   const isRemovingSelf = userId === req.user._id.toString(); // CHANGED TO req.user._id

//   if (!isOwner && !isRemovingSelf) {
//     res.status(403);
//     throw new Error(
//       "Access denied: You can only remove yourself or if you are the project owner"
//     );
//   }

//   // Check if user to remove is actually a member (FIXED COMPARISON AND SYNTAX)
//   if (!project.members.some(memberId => memberId.toString() === userId)) {
//     res.status(404);
//     throw new Error("User is not a member of this project");
//   }

//   // Prevent owner from removing themselves if they are the only member left
//   if (project.owner.toString() === userId && project.members.length === 1) {
//     res.status(400);
//     throw new Error(
//       "The project owner cannot be removed if they are the last member."
//     );
//   }

//   // Remove user from project members
//   project.members = project.members.filter(
//     (memberId) => memberId.toString() !== userId
//   );
//   await project.save();

//   // Re-fetch project with populated members to send back the latest state
//   const updatedProject = await Project.findById(projectId).populate(
//     "members",
//     "username email"
//   );
//   res.status(200).json(updatedProject);
// });

// module.exports = {
//   createProject,
//   getProjects,
//   getProjectById,
//   updateProject,
//   deleteProject,
//   searchUsers,
//   addProjectMember,
//   removeProjectMember,
//   createList,
//   updateList,
//   deleteList,
//   createTask,
//   updateTask,
//   deleteTask,
// };

// src/controllers/projectController.js
const asyncHandler = require("express-async-handler");
const Project = require("../models/Project");
const User = require("../models/User");
const List = require("../models/List"); // NEW: Import the List Mongoose model
const Task = require("../models/Task"); // NEW: Import the Task Mongoose model

// Helper function to populate deep nested paths
const populateProjectQuery = (query) => {
  return query
    .populate("owner", "username email")
    .populate("members", "username email")
    .populate({
      path: "lists",
      populate: {
        path: "tasks",
        populate: {
          path: "assignedTo", // Assumes assignedTo is an array of User IDs
          select: "username email",
        },
      },
    });
};

// --- Project Controllers ---

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Please add a project name");
  }

  const newProject = new Project({
    name,
    description,
    owner: req.user._id,
    members: [req.user._id],
  });

  const project = await newProject.save();
  res.status(201).json(project);
});

// @desc    Get all projects for the authenticated user (owned or member of)
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await populateProjectQuery(
    Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
  );
  res.status(200).json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await populateProjectQuery(Project.findById(req.params.id));

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isOwner = project.owner.equals(req.user._id);
  const isMember = project.members.some((member) =>
    member.equals(req.user._id)
  );

  if (!isOwner && !isMember) {
    res.status(403);
    throw new Error("Not authorized to access this project");
  }

  res.status(200).json(project);
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Owner only)
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  let project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new new Error("Project not found");
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  project.name = name || project.name;
  project.description = description || project.description;

  await project.save();
  res.status(200).json(project);
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Owner only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // --- CASCADE DELETION ---
  // 1. Find all lists associated with this project
  const listsToDelete = await List.find({ project: project._id }).select('_id');
  const listIds = listsToDelete.map(list => list._id);

  // 2. Delete all tasks associated with these lists
  await Task.deleteMany({ list: { $in: listIds } });

  // 3. Delete all lists associated with this project
  await List.deleteMany({ project: project._id });

  // 4. Delete the project itself
  await project.deleteOne();

  res.status(200).json({ message: "Project and all associated lists and tasks removed" });
});

// --- List Controllers ---
// @desc    Create a new list for a project
// @route   POST /api/projects/:projectId/lists
// @access  Private
const createList = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // --- DEBUGGING LOGS (keeping for verification) ---
  

  // Check if user is a member of the project
  if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to add lists to this project");
  }

  // Calculate the order for the new list (e.g., last position)
  const currentMaxOrder = await List.countDocuments({ project: projectId });
  const newOrder = currentMaxOrder > 0 ? currentMaxOrder : 0; // Start at 0 or continue

  // 1. Create a new List document
  const newList = new List({
    name,
    project: projectId, // Link to the parent project
    tasks: [], // Initialize with an empty tasks array (of IDs)
    order: newOrder, // Assign the calculated order
  });

  // 2. Save the new List document
  const createdList = await newList.save();

  // 3. Push the _id of the newly created list into the project's lists array
  project.lists.push(createdList._id);

  // 4. Save the Project document to link the new list
  await project.save();

  res.status(201).json(createdList); // Return the newly created List document
});

// @desc    Update a list
// @route   PUT /api/projects/:projectId/lists/:listId
// @access  Private
const updateList = asyncHandler(async (req, res) => {
  const { projectId, listId } = req.params;
  const { name, order } = req.body; // Allow updating name and order

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is a member of the project
  if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to update lists in this project");
  }

  // Find the list document itself
  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Ensure the list belongs to the specified project
  if (list.project.toString() !== projectId) {
      res.status(400);
      throw new Error("List does not belong to this project");
  }

  if (name !== undefined) {
    list.name = name;
  }
  if (order !== undefined) {
    list.order = order;
    // Implement reordering logic if needed:
    // This could involve updating the 'order' of other lists in the project
    // if the new 'order' conflicts or shifts others. For now, a direct update.
  }

  await list.save(); // Save the List document directly
  res.status(200).json(list);
});

// @desc    Delete a list
// @route   DELETE /api/projects/:projectId/lists/:listId
// @access  Private
const deleteList = asyncHandler(async (req, res) => {
  const { projectId, listId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is a member of the project
  if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to delete lists from this project");
  }

  // Find the list document itself
  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Ensure the list belongs to the specified project
  if (list.project.toString() !== projectId) {
      res.status(400);
      throw new Error("List does not belong to this project");
  }

  // --- CASCADE DELETION ---
  // 1. Delete all tasks associated with this list
  await Task.deleteMany({ list: listId });

  // 2. Delete the actual List document
  await List.findByIdAndDelete(listId);

  // 3. Remove the list's ID from the project's lists array
  project.lists = project.lists.filter(
    (listRef) => listRef.toString() !== listId
  );
  await project.save();

  res.status(200).json({ message: "List and associated tasks removed successfully" });
});

// --- Task Controllers ---
// @desc    Create a new task for a list
// @route   POST /api/projects/:projectId/lists/:listId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { projectId, listId } = req.params;
  const { title, description, assignedTo, dueDate, completed } = req.body; // removed status from here, it has default in schema

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if user is a member of the project
  if (!project.members.some((memberId) => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to add tasks to this project");
  }

  // Fetch the List document
  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Ensure the list belongs to the specified project
  if (list.project.toString() !== projectId) {
      res.status(400);
      throw new Error("List does not belong to this project");
  }

  if (!title) {
    res.status(400);
    throw new Error("Task title is required");
  }

  // Calculate the order for the new task
  const currentMaxOrder = await Task.countDocuments({ list: listId });
  const newOrder = currentMaxOrder > 0 ? currentMaxOrder : 0; // Start at 0 or continue

  // 1. Create a new Task document
  const newTask = new Task({
    title,
    description,
    project: projectId, // Link to parent project
    list: listId,       // Link to parent list
    assignedTo: assignedTo || [], // Expect assignedTo to be an array of user IDs
    dueDate: dueDate || null,
    completed: completed || false,
    order: newOrder,
  });

  // 2. Save the new Task document
  const createdTask = await newTask.save();

  // 3. Push the _id of the newly created task into the list's tasks array
  list.tasks.push(createdTask._id);

  // 4. Save the List document to link the new task
  await list.save();

  // Populate assignedTo for the response
  const populatedTask = await Task.findById(createdTask._id).populate(
    "assignedTo",
    "username email"
  );

  res.status(201).json(populatedTask);
});

// @desc    Update a task
// @route   PUT /api/projects/:projectId/lists/:listId/tasks/:taskId
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { projectId, listId, taskId } = req.params;
  const { title, description, assignedTo, dueDate, completed, status, order } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to update tasks in this project");
  }

  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Ensure the list belongs to the specified project
  if (list.project.toString() !== projectId) {
      res.status(400);
      throw new Error("List does not belong to this project");
  }

  // Find the Task document itself
  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Ensure the task belongs to the specified list and project
  if (task.list.toString() !== listId || task.project.toString() !== projectId) {
      res.status(400);
      throw new Error("Task does not belong to this list or project");
  }


  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (assignedTo !== undefined) task.assignedTo = assignedTo; // Expect array of IDs
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = completed;
  if (status !== undefined) task.status = status; // Check if status is in enum ['To Do', 'In Progress', 'Done']
  if (order !== undefined) task.order = order;

  await task.save(); // Save the Task document directly

  // Populate assignedTo for the response
  const updatedTask = await Task.findById(task._id).populate(
    "assignedTo",
    "username email"
  );

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/projects/:projectId/lists/:listId/tasks/:taskId
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, listId, taskId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (!project.members.some(memberId => memberId.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to delete tasks from this project");
  }

  const list = await List.findById(listId);
  if (!list) {
    res.status(404);
    throw new Error("List not found");
  }

  // Ensure the list belongs to the specified project
  if (list.project.toString() !== projectId) {
      res.status(400);
      throw new Error("List does not belong to this project");
  }

  // Find the Task document itself
  const task = await Task.findById(taskId);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Ensure the task belongs to the specified list and project
  if (task.list.toString() !== listId || task.project.toString() !== projectId) {
      res.status(400);
      throw new Error("Task does not belong to this list or project");
  }

  // 1. Delete the actual Task document
  await Task.findByIdAndDelete(taskId);

  // 2. Remove the task's ID from the list's tasks array
  list.tasks = list.tasks.filter(
    (taskRef) => taskRef.toString() !== taskId
  );
  await list.save(); // Save the List document, not the Project

  res.status(200).json({ message: "Task removed successfully" });
});

// --- Collaborator / User Management Controllers ---
// @desc    Search for users by username or email
// @route   GET /api/projects/users/search?q=<query>
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400);
    throw new Error('Search query "q" is required');
  }

  const users = await User.find({
    $or: [
      { username: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
    _id: { $ne: req.user._id },
  }).select("username email");

  res.status(200).json(users);
});

// @desc    Add a member to a project
// @route   POST /api/projects/:projectId/members
// @access  Private (any project member can add)
const addProjectMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isMember = project.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );
  if (!isMember) {
    res.status(403);
    throw new Error("Access denied: Not a member of this project");
  }

  const userToAdd = await User.findById(userId);
  if (!userToAdd) {
    res.status(404);
    throw new Error("User to add not found");
  }

  if (project.members.some(memberId => memberId.toString() === userId)) {
    res.status(400);
    throw new Error("User is already a member of this project");
  }

  project.members.push(userId);
  await project.save();

  const updatedProject = await Project.findById(projectId).populate(
    "members",
    "username email"
  );
  res.status(200).json(updatedProject);
});

// @desc    Remove a member from a project
// @route   DELETE /api/projects/:projectId/members/:userId
// @access  Private (project owner or the member themselves can leave)
const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  const isRemovingSelf = userId === req.user._id.toString();

  if (!isOwner && !isRemovingSelf) {
    res.status(403);
    throw new Error(
      "Access denied: You can only remove yourself or if you are the project owner"
    );
  }

  if (!project.members.some(memberId => memberId.toString() === userId)) {
    res.status(404);
    throw new Error("User is not a member of this project");
  }

  if (project.owner.toString() === userId && project.members.length === 1) {
    res.status(400);
    throw new Error(
      "The project owner cannot be removed if they are the last member."
    );
  }

  project.members = project.members.filter(
    (memberId) => memberId.toString() !== userId
  );
  await project.save();

  const updatedProject = await Project.findById(projectId).populate(
    "members",
    "username email"
  );
  res.status(200).json(updatedProject);
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchUsers,
  addProjectMember,
  removeProjectMember,
  createList,
  updateList,
  deleteList,
  createTask,
  updateTask,
  deleteTask,
};
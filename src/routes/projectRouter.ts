import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { isManager, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();

/* Middleware */
router.use(authenticate);

/* Routes for Projects */
router.param("id", projectExists);

// Get all projects
router.get("/", ProjectController.getAllProjects);

// Get project by Id
router.get("/:id",
    param("id").isMongoId().withMessage("Invalid ID"),
    handleInputErrors, 
    ProjectController.getProjectById
);

// Create a Project
router.post("/",
    body("projectName")
        .notEmpty().withMessage("projectName is required"),
    body("projectDescription")
        .notEmpty().withMessage("projectDescription is required"),
    body("clientName")
        .notEmpty().withMessage("clientName is required"),
    handleInputErrors, 
    ProjectController.createProject
);

// Update a Project
router.put("/:id", 
    param("id").isMongoId().withMessage("Invalid ID"),
    body("projectName")
        .notEmpty().withMessage("projectName is required"),
    body("projectDescription")
        .notEmpty().withMessage("projectDescription is required"),
    body("clientName")
        .notEmpty().withMessage("clientName is required"),
    handleInputErrors, 
    ProjectController.updateProject
);

// Delete project by Id
router.delete("/:id",
    param("id").isMongoId().withMessage("Invalid ID"),
    handleInputErrors, 
    ProjectController.deleteProject
);

/* Routes for Tasks */
router.param("projectId", projectExists);
router.param("taskId", taskExists);
router.param("taskId", taskBelongsToProject);

// Get all tasks from a project
router.get("/:projectId/tasks", 
    //validateProjectExists, 
    TaskController.getProjectTasks
)

// Get task by Id
router.get("/:projectId/tasks/:taskId", 
    //validateProjectExists,
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors, 
    TaskController.getTaskById
)

// Create a Task
router.post("/:projectId/tasks", 
    //validateProjectExists, 
    isManager,
    body("taskName")
        .notEmpty().withMessage("taskName is required"),
    body("taskDescription")
        .notEmpty().withMessage("taskDescription is required"),
    handleInputErrors, 
    TaskController.createTask
);

// Update task status
router.post("/:projectId/tasks/:taskId/status", 
    param("taskId").isMongoId().withMessage("Invalid ID"),
    body("status")
        .notEmpty().withMessage("status is required"),
    handleInputErrors, 
    TaskController.updateTaskStatus
)

// Update a Task
router.put("/:projectId/tasks/:taskId", 
    //validateProjectExists,
    isManager,
    param("taskId").isMongoId().withMessage("Invalid ID"),
    body("taskName")
        .notEmpty().withMessage("taskName is required"),
    body("taskDescription")
        .notEmpty().withMessage("taskDescription is required"),
    handleInputErrors, 
    TaskController.updateTask
)

// Delete a Task
router.delete("/:projectId/tasks/:taskId", 
    //validateProjectExists,
    isManager,
    param("taskId").isMongoId().withMessage("Invalid ID"),
    handleInputErrors, 
    TaskController.deleteTask
)

/** ROUTES FOR TEAMS */

// Get team members
router.get("/:projectId/team", 
    TeamMemberController.getProjectTeam
)

// Get team member by id
router.get("/:projectId/team/:id", 
    param("id")
        .isMongoId().withMessage("Invalid userId"),
    handleInputErrors,
    TeamMemberController.getTeamMemberById
)

// Find member by email
router.post("/:projectId/team/find", 
    body("email")
        .isEmail().toLowerCase().withMessage("Invalid email"),
    handleInputErrors,
    TeamMemberController.findMemberByEmail 
)

// Add member to team
router.post("/:projectId/team/add",
    body("id")
        .isMongoId().withMessage("Invalid userId"),
    handleInputErrors,
    TeamMemberController.addMemberToTeam
)

// Remove member from team
router.delete("/:projectId/team/:userId", 
    param("userId")
        .isMongoId().withMessage("Invalid userId"),
    handleInputErrors,
    TeamMemberController.removeMemberFromTeam
)

/** Routes for Notes */

// Get all notes from a task
router.get("/:projectId/tasks/:taskId/notes", 

)

// Get note by Id
router.get("/:projectId/tasks/:taskId/notes/:noteId",
    
)

// Create a Note
router.post("/:projectId/tasks/:taskId/notes/create",
    body("content")
        .notEmpty().withMessage("content is required"),
    handleInputErrors,
    NoteController.createNote
)

//  Update a Note
router.put("/:projectId/tasks/:taskId/notes/:noteId/update",
    
)

// Delete a Note
router.delete("/:projectId/tasks/:taskId/notes/:noteId/delete",
    
)

// Export the router
export default router
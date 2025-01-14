import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";

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
router.delete("/:projectId/team/remove", 
    body("id")
        .isMongoId().withMessage("Invalid userId"),
    handleInputErrors,
    TeamMemberController.removeMemberFromTeam
)

// Export the router
export default router
import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

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

export default router
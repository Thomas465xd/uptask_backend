import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post("/create-account",
    body("name")
        .notEmpty().withMessage("name is required"),
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is not valid"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 6 characters long").trim(), 
    body("confirmPassword").custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true
    }),
    handleInputErrors,
    AuthController.createAccount
);

router.post("/confirm-account", 
    body("token")
        .notEmpty().withMessage("token is required"),
    handleInputErrors, 
    AuthController.confirmAccount
)

router.post("/login", 
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is not valid"),
    body("password")
        .notEmpty().withMessage("password is required"), 
    handleInputErrors, 
    AuthController.login
)

router.post("/request-code", 
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is not valid"),
    handleInputErrors, 
    AuthController.requestConfirmationEmail
)

router.post("/forgot-password", 
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is not valid"),
    handleInputErrors, 
    AuthController.forgotPassword
)

export default router
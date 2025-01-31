import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

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

router.post("/validate-token",
    body("token")
        .notEmpty().withMessage("token is required"),
    handleInputErrors, 
    AuthController.validateToken
)

router.post("/reset-password/:token",
    param("token")
        .isNumeric().withMessage("token is not valid"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 6 characters long").trim(), 
    body("confirmPassword").custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true
    }),
    handleInputErrors, 
    AuthController.resetPasswordWithToken
)

/** Profile & User */

router.get("/user", 
    authenticate,
    handleInputErrors, 
    AuthController.getUser
)

router.put("/profile", 
    authenticate,
    body("name")
        .notEmpty().withMessage("name is required"),
    body("email")
        .notEmpty().withMessage("email is required")
        .isEmail().withMessage("email is not valid"),
    handleInputErrors, 
    AuthController.updateProfile
)

router.post("/update-password", 
    authenticate,
    body("current_password")
        .notEmpty().withMessage("Current Password is required"),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").trim(), 
    body("confirmPassword").custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error("Passwords do not match")
        }
        return true
    }), 
    handleInputErrors, 
    AuthController.updateUserPassword
)

// 
router.post("/check-password", 
    authenticate, 
    body("password")
        .notEmpty().withMessage("Password is required"),
    handleInputErrors, 
    AuthController.checkPasswordForActions
)

export default router 
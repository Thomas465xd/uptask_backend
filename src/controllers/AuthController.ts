import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { comparePassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { transporter } from "../config/nodemailer";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        try {
            const { password, email } = req.body

            // Check if the user already exists
            const userExists = await User.findOne({ email });

            if (userExists) {
                const error = new Error("User already exists");
                res.status(409).json({ message: error.message });
                return;
            }

            const user = new User(req.body);

            /* Hash the password **/            
            //const salt = await bcrypt.genSalt(10); // salt = random string
            user.password = await hashPassword(password);

            // Generate a confirmation token
            const token = new Token()
            
            token.token = generateToken()
            token.user = user.id

            /* Send the confirmation email **/
            AuthEmail.sendConfirmationEmail({
                email: user.email, 
                name: user.name, 
                token: token.token
            })

            // Save the user in the DB
            await Promise.allSettled([user.save(), token.save()])

            res.status(201).json({ message: "Account created successfully, please check your email to confirm your account" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token }); 

            if(!tokenExists) {
                const error = new Error("Invalid Token")
                res.status(404).json({ message: error.message });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.confirmed = true;

            await Promise.allSettled([
                user.save(), 
                tokenExists.deleteOne(),
            ])

            res.status(200).json({ message: "Account confirmed successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if(!user) {
                const error = new Error("User not found")
                res.status(404).json({ message: error.message })
                return;
            }

            if(!user.confirmed) {

                // Generate a confirmation token
                const token = new Token()

                token.token = generateToken()
                token.user = user.id

                // Send the confirmation email
                AuthEmail.sendConfirmationEmail({
                    email: user.email, 
                    name: user.name, 
                    token: token.token
                })

                await Promise.allSettled([
                    token.save(),
                ])

                const error = new Error("Account not confirmed, please check your email to confirm your account")
                res.status(401).json({ message: error.message })
                return;
            }

            const isMatch = await comparePassword(password, user.password);

            /** Check if the passwords match */
            if(!isMatch) {
                const error = new Error("Invalid Credentials");
                res.status(401).json({ message: error.message });
                return;
            }

            /** Generate JWT for Auth */
            const token = generateJWT({
                id: user.id
            })

            res.status(200).json({ 
                message: "Login successful", 
                token 
            });
        } catch (error) {
            const errorMessage = error.message || "Internal server error";
            res.status(500).json({ message: errorMessage });
        }
    }

    static requestConfirmationEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Verificar si existe el usuario
            const user = await User.findOne({ email });
            if(!user) {
                const error = new Error("User does not exist")
                res.status(404).json({ message: error.message })
                return;
            }

            // Verify if the user is already confirmed
            if(user.confirmed) {
                const error = new Error("User already confirmed")
                res.status(409).json({ message: error.message })
                return;
            }

            // Generate a confirmation token
            const token = new Token()
            
            token.token = generateToken()
            token.user = user.id

            // Send the confirmation email
            AuthEmail.sendConfirmationEmail({
                email: user.email, 
                name: user.name, 
                token: token.token
            })

            await Promise.allSettled([
                token.save(),
            ])

            res.status(200).json({ message: "Confirmation email sent successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            // Verificar si existe el usuario
            const user = await User.findOne({ email });
            if(!user) {
                const error = new Error("User does not exist")
                res.status(404).json({ message: error.message })
                return;
            }

            // Generate a confirmation token
            const token = new Token()
            
            token.token = generateToken()
            token.user = user.id
            await token.save()

            // Send the confirmation email
            AuthEmail.sendResetPasswordEmail({
                email: user.email, 
                name: user.name, 
                token: token.token
            })

            res.status(200).json({ message: "Reset password email sent successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body
            const tokenExists = await Token.findOne({ token }); 

            if(!tokenExists) {
                const error = new Error("Invalid Token")
                res.status(404).json({ message: error.message });
                return;
            }

            res.status(200).json({ message: "Token is valid, set-up your new password" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExists = await Token.findOne({ token }); 

            if(!tokenExists) {
                const error = new Error("Invalid or expired token, try again")
                res.status(404).json({ message: error.message });
                return;
            }

            const user = await User.findById(tokenExists.user);
            user.password = await hashPassword(password);

            await Promise.allSettled([
                user.save(), 
                tokenExists.deleteOne(),
            ])

            res.status(200).json({ message: "Password reset successful, you can now log in" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static getUser = async (req: Request, res: Response) => {
        try {
            const user = req.user
            res.status(200).json( user );
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user
            const { name, email } = req.body

            const userExists = await User.findOne({email})
            if(userExists && userExists.id.toString() !== user.id.toString()) {
                const error = new Error("Email already registered")
                res.status(409).json({message: error.message})
                return
            }

            user.name = name 
            user.email = email

            await user.save()

            res.status(200).json({ message: "Profile Updated Successfully", user });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static updateUserPassword = async (req: Request, res: Response) => {
        try {
            const { current_password, password } = req.body

            const user = await User.findById(req.user.id)

            const isPasswordCorrect = await comparePassword(current_password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error("Current Password is incorrect")
                res.status(401).json({error: error.message})
                return
            }

            user.password = await hashPassword(password)
            await user.save()

            res.status(200).json({message: "Password Updated Successfully"})

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static checkPasswordForActions = async (req: Request, res: Response) => {
        try {
            const { password } = req.body

            const user = await User.findById(req.user.id)

            const isPasswordCorrect = await comparePassword(password, user.password)
            if(!isPasswordCorrect) {
                const error = new Error("Current Password is incorrect")
                res.status(401).json({error: error.message})
                return
            }

            res.status(200).json({message: "Action Allowed"})

        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
}

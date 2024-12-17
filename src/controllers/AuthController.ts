import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { hashPassword } from "../utils/auth";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {

        try {
            const { password, email } = req.body

            // Check if the user already exists
            const userExists = await User.findOne({ email });

            if (userExists) {
                res.status(409).json({ error: "User already exists" });
                return;
            }

            const user = new User(req.body);

            /* Hash the password **/            
            //const salt = await bcrypt.genSalt(10); // salt = random string
            user.password = await hashPassword(password);

            // Save the user in the DB
            await user.save();

            res.status(201).json({ message: "Account created successfully, please check your email to confirm your account" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            
        } catch (error) {
            
        }
    }
}
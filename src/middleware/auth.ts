import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { UserInterface } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: UserInterface;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //console.log(req.headers.authorization)
        const bearerToken = req.headers.authorization.split(" ")[1];

        if(!bearerToken) {
            const error = new Error("Authentication token is missing");
            res.status(401).json({ error: error.message });
        }

        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        //console.log(decoded)

        if(typeof decoded === "object" && decoded.id) {
            const user = await User.findById(decoded.id).select("_id name email");
            // console.log(user)

            if(!user) {
                const error = new Error("User not found");
                res.status(401).json({ error: error.message });
                return;
            }

            req.user = user;
        }


        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
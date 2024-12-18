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
        const authHeader = req.headers.authorization;

        // Validar existencia del header
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ error: "Authentication token is missing or malformed" });
            return;
        }

        const token = authHeader.split(" ")[1];

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };

        if (!decoded || !decoded.id) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }

        // Buscar usuario en la base de datos
        const user = await User.findById(decoded.id).select("_id name email");

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Agregar usuario a la petición
        req.user = user;

        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        if (error.name === "TokenExpiredError") {
            res.status(401).json({ error: "Token expired" });
            return;
        }

        console.error("Authentication middleware error:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};

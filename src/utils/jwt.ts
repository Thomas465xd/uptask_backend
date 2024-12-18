import jwt from "jsonwebtoken";

export const generateJWT = () => {
    const data = {
        name: "Fernando",
    }
    const token = jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "6m" });
    return token;
}
import dotenv from "dotenv"
dotenv.config({path : "node_modules/@repo/backend-common/.env"})
export const JWT_SECRET = process.env.JWT_SECRET
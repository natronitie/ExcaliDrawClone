import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken"


const jwtSecret = JWT_SECRET as string

export const auth = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers["token"]
    if (typeof token !== "string"){
        res.json({
            message : "Invalid Token"
        })
        return;
    }
    try{
        const decodedObj = jwt.verify(token , jwtSecret);
        if(typeof decodedObj === "string"){
            res.json({
                message : "Auth Failed"
            });
            return;
        }
        req.id = decodedObj.id;
    }catch(e){
        res.json({
            message : "token invalid"
        })
        return;
    }
    next();
}

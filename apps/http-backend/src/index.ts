import express from "express";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt"
import { JWT_SECRET } from "@repo/backend-common/config"
import {dbClient, Prisma} from "@repo/db/client"
import * as types from "@repo/common/schema"
import { auth } from "./middleware";
import cors from "cors"


const jwtSecret = JWT_SECRET as string

console.log(jwtSecret + " " + JWT_SECRET)

const app = express();

app.use(express.json())
app.use(cors())

app.post("/signup", async (req:Request, res:Response)=>{
    const validInput = types.signupSchema.safeParse(req.body).success
    if (!validInput){
        console.log(req.body)
        res.json({
            message : "Invalid Input"
        });
        return;
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    let user;
    try{
        user = await dbClient.user.create({
            data : {
                username : req.body.username,
                password : req.body.password,
                name : req.body.name
            }
        })
    }catch(e : unknown){
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                res.json({
                    message : `Duplicate value for unique field: ${e.meta?.target}`
                })
            }
        } else if (e instanceof Error) {
            res.status(411).json({
                error : "Generic error : " + e.message
            })
        }else{
            res.json({
                error : "Unknown error" + e
            });
        }
        return
    }
    const token = jwt.sign({
        id : user.id
    }, jwtSecret)
    res.json({
        token
    }) 
})

app.post("/signin", async(req:Request, res:Response)=>{
    const validInput = types.signinSchema.safeParse(req.body).success
    if (!validInput){
        res.json({
            message : "Invalid Input"
        });
        return;
    }
    const user = await dbClient.user.findFirst({
        where:{
            username : req.body.username
        }
    });
    if(!user){ 
        res.json({
            message : "Invalid username"
        });
        return;
    }
    const isPassword= await bcrypt.compare(req.body.password, user.password);
    if(!isPassword){
        res.status(403).json({
            message : "Invalid Password"
        })
        return
    }
    const token = jwt.sign({
        id : user.id
    }, jwtSecret)
    res.json({
        token
    })
})

app.post("/create-room", auth, async(req:Request, res:Response)=>{
    const validInput = types.roomSchema.safeParse(req.body)
    if (!validInput.success){
        res.json({
            message : "Invalid Input",
            error : validInput.error
        });
        return;
    }
    let createdRoom : {slug: string};
    try{
        createdRoom = await dbClient.room.create({
            data : {
                slug : req.body.slug as string,
                adminId : req.id as string
            },
            select:{
                slug:true
            }
        })
    }catch(e : unknown){
        console.log("====================================================");
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === 'P2002') {
                console.log(1);
                res.json({
                    error : `Duplicate value for unique field: ${e.meta?.target}`
                })
            }
        } else if (e instanceof Error) {
            console.log(2);
            res.status(411).json({
                error : "Generic error : " + e.message
            })
        }
        res.json({
                error : "Unknown error"
            });
        console.log("returned");
        return;
    }
    console.log("sending out slug")
    res.json({
        slug : createdRoom.slug
    })
})

app.get("/rooms", auth, async(req:Request, res:Response)=>{
    const rooms = await dbClient.room.findMany({
        select : {
            slug : true,
            id : true
        }
    })
    res.json({
        rooms
    })
})

app.get("/shapes/:roomSlug", auth, async(req:Request, res: Response)=>{
    const roomSlug = req.params.roomSlug;
    if (!roomSlug) {
        res.json({
            message : "Invalid Room"
        })
        return;
    }
    const shapes = await dbClient.shape.findMany({
        where : {
            roomSlug
        },
        take : 50,
        orderBy : {
            id : "desc"
        },
        omit:{
            roomSlug : true,
            userId : true,
            id:true
        }
    })
    res.json({
        shapes
    })
});


app.listen(3001, "0.0.0.0")
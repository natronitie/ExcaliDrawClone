import {z} from "zod"

export const signupSchema = z.object({
    username : z.string().min(4).max(50),
    password : z.string().min(8).max(16),
    name : z.string(),
    photo : z.string().optional()
})

export const signinSchema = z.object({
    username : z.string().min(4).max(8),
    password : z.string().min(8).max(16)
})

export const roomSchema = z.object({
    slug : z.string().min(5).max(12),
})

export const chatSchema = z.object({
    type : z.enum(["join", "chat", "leave", "stream"]),
    roomSlug : z.string(), 
    shapeProps : z.object({
        type : z.string(),
        startX: z.number(),
        startY : z.number(),
        endX : z.number(),
        endY : z.number()
    }).optional()
})
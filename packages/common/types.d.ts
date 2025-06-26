import {z} from "zod"
import {chatSchema} from  "./types";

const shapeSchema = chatSchema.required().shape.shapeProps

export type chatType = z.infer<typeof chatSchema>
export type shapeType= z.infer<typeof shapeSchema> 

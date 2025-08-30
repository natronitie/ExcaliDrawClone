import { WebSocketServer, WebSocket } from "ws"
import { dbClient } from "@repo/db/client";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"
import { chatSchema } from "@repo/common/schema";
import { chatType} from "@repo/common/types"


const jwtSecret = JWT_SECRET as string;

const wss = new WebSocketServer({port : 8080,
    host : "0.0.0.0"
});
console.log("server is listening on port : 8080")

function checkUser(socket : WebSocket, url:string):string | null{
    let decoded;
    try{
        decoded = jwt.verify(url.split("=")[1] ?? "", jwtSecret)
    }catch(e){
        socket.send("unAuthenticated access attempted");
        return null;
    }
    if(typeof decoded === "string") {
        socket.send("Authentication failed"); 
        return null;
    }else if (!decoded.id){
        return null;
    }
    return decoded.id;
}

interface Users{
    userId : string,
    socket : WebSocket
}

type stateType = Record<string, Users[]>
type auxState = Record<string, string[]>

const state : stateType = {} 
const auxilliaryState : auxState = {}

wss.on("connection", (socket, req)=>{
    console.log("url is "+ req.url)
    let userId = checkUser(socket, req.url as string)
    
    if(!userId){
        //can happen for browser if the token has been nuked
        socket.send("sign in again")
        socket.terminate();
        return;
    }

    let userState = auxilliaryState[userId]
    if(!userState){
        auxilliaryState[userId] = []
        userState = auxilliaryState[userId]
    }
    
    const user:Users = {userId, socket}

    socket.on("message", async(message)=>{
        let parsedData : chatType;
        try{
            parsedData = JSON.parse(message.toString());
            chatSchema.parse(parsedData);
        }catch(e){
            socket.send("invalid Input");
            return;
        }
        if(parsedData.type === "join") joinHandler(parsedData, socket, userId, userState, user)
        else if (parsedData.type === "chat" || parsedData.type==="stream") chatHandler(parsedData, socket, userId, user)
        else if(parsedData.type === "leave"){
           close(userState, userId);
        }
    })
    socket.on("close", ()=>{
        close(userState, userId)
    })
})

/*
join roomId, userId, 
chat : type, msg, userid, roomId, 
leave : type, roomId, userId
*/

async function joinHandler(parsedData:chatType, socket : WebSocket, userId:string, userState:string[], user:Users){
    const room = await dbClient.room.findFirst({
        where: {
            slug : parsedData.roomSlug
        },
        select:{
            slug:true
        }
    })
    console.log(room);
    if(!room){
        socket.send("Invalid room")
        socket.terminate();
        return;
    }
    let drawRoom = state[parsedData.roomSlug];
    if(!drawRoom){
        state[parsedData.roomSlug] = [user]
    }else if(!drawRoom.includes({userId, socket})){
        drawRoom.push(user)
        state[parsedData.roomSlug] = drawRoom;
    }
    console.log(state[parsedData.roomSlug])
    if(!userState.includes(parsedData.roomSlug)){
        userState.push(parsedData.roomSlug)
        auxilliaryState[userId] = userState
    }
    socket.send("connected to room "+parsedData.roomSlug)
}


async function chatHandler(parsedData:chatType, socket:WebSocket, userId:string, user:Users){
    //since user sends the roomId someone from postman can send their shapes to rooms that they are not part of if not verified
    const shape = parsedData.shapeProps;
    if(!shape){
        socket.send("No shape, take dick #maloha mother fucker")
        return;
    }
    const room = state[parsedData.roomSlug]
    if(!room){
        socket.send("Invalid Room")
        socket.terminate();
        return;
    }
    if(!(room.includes(user))){
        socket.send("Invalid Room")
        socket.terminate();
        return;
    }
    const isShapeCreated =parsedData.type === "chat"? await dbClient.shape.create({
            data: {...shape, ...{
                roomSlug : parsedData.roomSlug,
                userId
            }}
        }):null
    if(parsedData.type==="stream"||isShapeCreated){
        room.forEach(x=>{
            if(x.socket!==socket){
                x.socket.send(JSON.stringify(parsedData.type==="stream"?{...shape, ...{stream : true}}:shape))
            }
        })
    }
}

function close(userState : string[], userId : string){
    userState.forEach(x=>state[x]?.filter(x=>x.userId!==userId))
    delete auxilliaryState.userId
}
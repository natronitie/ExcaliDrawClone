"use client"
import { Loading } from "@/components/loading";
import { useParams, useRouter } from "next/navigation";
import { RefObject, useEffect, useRef, useState } from "react";
import {shapeType} from "@repo/common/types"
import { ToolBar } from "@/components/toolbar";

function useWindow(canvasref:RefObject<HTMLCanvasElement | null>, prevShapeRef:RefObject<{
    type: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}[]>){
    console.log("out of effect")
    const c = useRef(0)
    useEffect(()=>{
            console.log("hook called")
            if(!canvasref.current) return
            canvasref.current.height = window.innerHeight;
            canvasref.current.width = window.innerWidth;
            // setInterval(()=>{
            //     c.current=c.current+1;
            //     console.log(c.current)
            // }, 1000)
            window.addEventListener("resize", ()=>{
                if(!canvasref.current) return
                canvasref.current.height=window.innerHeight
                canvasref.current.width=window.innerWidth
                renderAll(prevShapeRef, canvasref.current.getContext("2d") as CanvasRenderingContext2D)
            })
    }, [])
}

export default function(){
    const router = useRouter()
    const roomSlug = useParams<{canvasId : string}>().canvasId
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const prevShapeRef = useRef<shapeType[]>([])
    const figureRef = useRef<"circle" | "rect" | "triangle"| "arc" | "line" | "pointer" | "pencil">("pointer");
    
    useWindow(canvasRef, prevShapeRef);    
    console.log("before useEffect of useWindow");
    const fetchPrevShapes = async()=>{
        const res :{shapes:shapeType[]} = await fetch(`http://localhost:3001/shapes/${roomSlug}`, {
            headers:{
                "Content-Type": "application/json",
                "token" : localStorage.getItem("token") as string
            }
        }).then(res=>res.json())
        res.shapes.forEach((shape:shapeType)=>{
            prevShapeRef.current.push(shape)
        })
        setLoading(false)
    }

    const waitAndRender = async(canvas : HTMLCanvasElement, wss : WebSocket, roomSlug:string, prevShapeRef:RefObject<{
        type: string;
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    }[]>)=>{
        if(canvasRef.current){
            await fetchPrevShapes()
            initGame(canvasRef.current, figureRef, wss as WebSocket, roomSlug, prevShapeRef);
        }
    }

    useEffect(()=>{
        alert("twice rice")
        console.log("hi");
        const wss = new WebSocket(`ws://localhost:8080/?token=${localStorage.getItem("token")}`)
        console.log(roomSlug)
        wss.onopen = ()=>{
            wss.send(JSON.stringify({
                type : "join",
                roomSlug
            }))
        }
        wss.onmessage = (e)=>{
            let shape:(shapeType&{stream : boolean});
            try{
                shape = JSON.parse(e.data)
            }catch(err){
                console.log(e.data.toString())
                console.log("received string")
                if(e.data.toString() === "sign in again"){
                    router.push("../signin")
                }else if(e.data.toString() === "Invalid room"){
                    router.push("../rooms")
                }else if(e.data.toString() === "connected to room "+roomSlug){
                    if(canvasRef.current) waitAndRender(canvasRef.current, wss as WebSocket, roomSlug, prevShapeRef);
                }
                return;
            }
            if(!shape.stream){
                prevShapeRef.current.push(shape)
                if(shape.type === "pencil") renderAll(prevShapeRef, canvasRef.current?.getContext("2d") as CanvasRenderingContext2D);
                console.log(shape.stream)
            }
            else{ 
                stream(canvasRef.current as HTMLCanvasElement, shape, prevShapeRef, figureRef)
                console.log(shape.stream)
            }
        }
    }, [])
    return <div>
        <div className="w-screen h-screen">
            <canvas ref = {canvasRef} height = {0} width = {0} />
        </div>
            {loading&&<Loading/>}
            {!loading&&<ToolBar figureRef={figureRef}/>}
    </div>
}


function initGame(canvas : HTMLCanvasElement, figureRef:RefObject<"circle" | "rect" | "triangle"| "arc" | "line" | "pointer" | "pencil">, wss : WebSocket, roomSlug:string, prevShapeRef:RefObject<{
    type: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}[]>){
    const ctx =  canvas.getContext("2d");
    let click = false;
    if(!ctx)return
    renderAll(prevShapeRef, ctx);

    let shape:shapeType;

    canvas.addEventListener("mousedown", (e)=>{
        click = true;
        console.log("mouse down")
        if(figureRef.current==="pointer"){
            click = false;
            return
        }
        shape={
            type:  figureRef.current,
            startX : e.clientX,
            startY : e.clientY,
            endX : NaN,
            endY : NaN
        }
    })
    canvas.addEventListener("mousemove", (e)=>{
        if(click){
            console.log("mouse moving")
            shape.endX = e.clientX;
            shape.endY = e.clientY;
            if(figureRef.current !== "pencil"){
                render(shape, ctx, canvas)
                renderAll(prevShapeRef, ctx)
                wss.send(JSON.stringify({
                    type : "stream",
                    roomSlug,
                    shapeProps : shape
                }))
            }else{
                prevShapeRef.current.push(shape)
                renderAll(prevShapeRef, ctx)
                console.log(prevShapeRef.current.length+"oe idhar");
                wss.send(JSON.stringify({
                    type : "chat",
                    roomSlug,
                    shapeProps : shape
                }))
                shape.startX = shape.endX;
                shape.startY = shape.endY;
            }
        }
    })
    canvas.addEventListener("mouseup", (e)=>{
        click = false;
        if(figureRef.current==="pointer"){return}
        console.log("mouse up")
        shape.endX = e.clientX;
        shape.endY = e.clientY;
        if(shape.type!="pencil"){
            ctx.clearRect(0,0,canvas.width, canvas.height)
        }
        prevShapeRef.current.push(shape)
        renderAll(prevShapeRef, ctx)
        wss.send(JSON.stringify({
            type : "chat",
            roomSlug,
            shapeProps : shape
        }))
    })
}

function renderAll(prevShapeRef:RefObject<{
    type: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}[]>, ctx:CanvasRenderingContext2D){
        [...prevShapeRef.current].forEach(shape=>{
            ctx.beginPath();
            ctx.strokeStyle = "white"
            if(shape.type==="rect")ctx.rect(shape.startX, shape.startY, shape.endX-shape.startX, shape.endY-shape.startY)
            else if(shape.type==="circle")ctx.arc((shape.startX+shape.endX)/2, (shape.startY+shape.endY)/2, Math.sqrt((shape.startX-shape.endX)**2+(shape.startY-shape.endY)**2)/2, 0, 2*Math.PI)
            else if(shape.type==="line"||shape.type==="pencil"){
                ctx.moveTo(shape.startX, shape.startY)
                ctx.lineTo(shape.endX, shape.endY)
            }else if (shape.type==="pointer"){

            }
            ctx.stroke();
        })
        console.log(prevShapeRef.current.length);
    }

function render(shape:shapeType, ctx:CanvasRenderingContext2D, canvas:HTMLCanvasElement){
    if(!shape)return
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.beginPath();
    ctx.strokeStyle = "white"
    if(shape.type==="rect")ctx.rect(shape.startX, shape.startY, shape.endX-shape.startX, shape.endY-shape.startY)
    else if(shape.type==="circle")ctx.arc((shape.startX+shape.endX)/2, (shape.startY+shape.endY)/2, Math.sqrt((shape.startX-shape.endX)**2+(shape.startY-shape.endY)**2)/2, 0, 2*Math.PI)
    else if(shape.type==="line"){
        ctx.moveTo(shape.startX, shape.startY)
        ctx.lineTo(shape.endX, shape.endY)
    }
    ctx.stroke();
}

function stream (canvas:HTMLCanvasElement, shape:shapeType, prevShapeRef:RefObject<{
    type: string;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}[]>, figureRef: RefObject<"circle" | "rect" | "triangle" | "arc" | "line" | "pointer" | "pencil">){
    const ctx = canvas.getContext("2d")
    if(!ctx)return
    render(shape, ctx, canvas)
    renderAll(prevShapeRef, ctx)
}
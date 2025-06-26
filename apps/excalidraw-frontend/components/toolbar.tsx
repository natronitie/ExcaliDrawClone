import { RefObject } from "react"
import { CircleIcon, LineIcon, PencilIcon, PointerIcon, RectIcon } from "./icons"

export const ToolBar = ({figureRef}:{figureRef:RefObject<"circle" | "rect" | "triangle" | "arc" | "line" | "pointer" | "pencil">})=>{
    return <div className="absolute left-15 top-50 rounded-4xl border-2">
        <div className="h-80 rounded-4xl w-16 p-2 pt-8 pb-8 bg-slate-700 border-yellow-500 hover:shadow-amber-400/50">
            <div onClick={()=>{
                figureRef.current = "circle";
            }}
            className="flex justify-center mb-6 p-2 transition duration-200 hover:rounded-4xl hover:outline hover:scale-125">
                <CircleIcon radius={12} width={0.5} fill="white" bg="bg-slate-700"/>
            </div>
             <div onClick={()=>{
                figureRef.current = "rect"
             }} 
             className="flex justify-center p-2 transition duration-200 hover:rounded-2xl hover:outline hover:scale-125">
                <RectIcon/>
            </div>
             <div onClick={()=>{
                figureRef.current = "line"
             }} 
             className="flex justify-center p-2 transition duration-200 hover:rounded-2xl hover:outline hover:scale-125">
                <LineIcon/>
            </div>
            <div onClick={()=>{
                figureRef.current = "pointer"
             }} 
             className="flex justify-center p-2 transition duration-200 hover:rounded-2xl hover:outline hover:scale-125">
                <PointerIcon/>
            </div>
            <div onClick={()=>{
                figureRef.current = "pencil"
             }} 
             className="flex justify-center p-2 transition duration-200 hover:rounded-2xl hover:outline hover:scale-125">
                <PencilIcon/>
            </div>
        </div>
    </div>
}
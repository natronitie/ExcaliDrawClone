import { ReactNode } from "react"

export const Box = ({onClick, children}:{
    onClick : any,
    children : ReactNode
})=>{
    return <div onClick={onClick}
                className="hover:shadow-amber-400/100 hover:shadow-xl w-23 h-23 border-2 rounded-2xl col-span-1 flex justify-center items-center">
                    {children}
            </div>
}
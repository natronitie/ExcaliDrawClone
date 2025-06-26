import { ReactNode } from "react"

const variant = {
    height : {
        "auto" : "h-full",
        "md" : "h-80",
        "lg" : "h-100"
    },
    width : {
        "auto" : "w-full",
        "md" : "w-80",
        "lg" : "w-100"
    },
    text : {
        "auto" : "text-lg",
        "md" : "text-lg",
        "lg" : "text-2xl"
    }
}

export const Popup = ({children, size}:{children:ReactNode, size : "md"|"lg"|"auto"})=>{
    return <div className = "bg-black absolute left-0 top-0 w-screen h-screen flex items-center justify-center">
            <div className={`${variant.height[size]} ${variant.width[size]} ${variant.text[size]} bg-black shadow-2xl shadow-yellow-500/100 flex justify-center items-center font-extrabold text-orange-300`}>
                {children}
            </div>
        </div>
}
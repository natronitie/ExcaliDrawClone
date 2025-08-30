import { RefObject } from "react"

const variant : {[key:string]:string} = {
    "auth" : "pr-4",
    "def" : ""
}

export const LabelledInput = ({type, placeholder, lable, ref, usage}:{
    type : string,
    placeholder:string,
    lable : string,
    ref? : RefObject<HTMLInputElement | null>,
    usage? : string 
})=>{
    return<div>
        <div className={`font-bold text-2xl p-2 ${variant[usage??"def"]}`}>{lable}</div>
        <div>
            <input ref = {ref} type = {type} placeholder={placeholder} className="p-2 rounded-xl outline-none font-medium text-white "/>
        </div>
    </div>
}
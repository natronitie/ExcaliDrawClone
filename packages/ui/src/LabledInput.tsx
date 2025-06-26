import { Ref } from "react"

interface LabelInputProps{
    placeholder:string,
    ref : Ref<HTMLInputElement>,
    lable : string 
}
export const LabelInput = ({placeholder, ref, lable}:LabelInputProps)=>{
    return <div className="w-96 border-2 border-white rounded-2xl p-2">
        <div className="m-2 bg-green-200">
            {lable}    
        </div>
        <div>
            <input placeholder={placeholder} ref={ref} className="outline-none bg-green-300"/> 
        </div>
    </div>
}
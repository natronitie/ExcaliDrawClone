import { ReactNode } from "react";

export default function ({children}: {children:ReactNode}){
    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-80 h-90 border-yellow-500 border-6 border-double rounded-4xl p-8 pl-10 pr-10 shadow-lg shadow-yellow-500/100">
            {children}
        </div>
    </div>
}
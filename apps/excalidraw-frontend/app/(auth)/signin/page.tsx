"use client"

import { LabelledInput } from "@repo/ui/labelledInput";
import {Button} from "@repo/ui/button";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function(){
    const router = useRouter();
    const userRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    return <>
        <div className="flex justify-center shadow-2xl shadow-orange-400/50 hover:shadow-amber-400/100 rounded-4xl border-amber-500 border-b-1">
            <LabelledInput ref={userRef} usage="auth" lable="Username" type="text" placeholder="username"/>
        </div>
        <div className="flex justify-center mt-6 shadow-2xl shadow-orange-400/50 hover:shadow-amber-400/100 rounded-4xl border-orange-300 border-b-[0.5px]">
            <LabelledInput ref={passwordRef} usage="auth" lable="Password" type="password" placeholder="password"/>
        </div>
        <div className="mt-8 flex justify-center">
            <Button variant="primary" onClick={async()=>{
                const username = userRef.current?.value
                const password = passwordRef.current?.value
                if(!username || !password){
                    alert("fill all the details")
                    return
                }
                const res = await fetch("http://13.201.35.90:3001/signin", {
                    method : "POST",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        username,
                        password,
                    })
                })
                const data = await res.json();
                if(!data.token){
                    alert(data.message)
                    return;
                }
                localStorage.setItem("token", data.token)
                router.push("../rooms")
            }}>Sign In</Button>
        </div>
    </>
}
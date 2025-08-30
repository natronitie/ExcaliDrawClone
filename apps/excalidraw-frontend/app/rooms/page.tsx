"use client"

import { Box } from "@/components/box";
import { CreateRoom } from "@/components/createRoom";
import { PlusIcon } from "@/components/icons";
import { Loading } from "@/components/loading";
import { useRouter } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"



export default function(){
    const router = useRouter();
    const [rooms, setRooms] = useState<ReactNode[]>([])
    const [loading, setLoading] = useState(true);
    const [toPopup, setToPopup] = useState(false)
    useEffect(()=>{
        const getRooms =async function(){
            const res = await fetch("http://13.201.35.90:3001/rooms", {
                method : "GET",
                headers:{
                    "token" : localStorage.getItem("token") as string,
                    "Content-Type": "application/json",
                }
            })
            const data = await res.json();
            if(!data.rooms){
                alert(data.message??data.error)
                router.push("../signin")
                return
            }
            setRooms(
                data.rooms.map((x:{id : number, slug : string}, index : number) =>
                    <Box onClick={()=>{router.push(`../canvas/${x.slug}`)}} key={index}>
                            {x.slug}
                        </Box> 
                )
            )
            setLoading(false)
        }
        getRooms()
    }, [])
    return <div className = "h-screen flex justify-center items-center">
        <div className="w-100 grid grid-cols-3 gap-2">
            {loading&&<Loading/>}
            {!loading&&rooms}
            <div onClick={()=>{
                    setToPopup(true)
                }} 
                className="hover:shadow-amber-400/100 hover:shadow-xl w-23 h-23 border-2 rounded-2xl col-span-1 flex justify-center items-center">
                <PlusIcon/>
            </div>
            {toPopup&&<CreateRoom setToPopup = {setToPopup} setRooms={setRooms}/>}
        </div>
    </div>
}

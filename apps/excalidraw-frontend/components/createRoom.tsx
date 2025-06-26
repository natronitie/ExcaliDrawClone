"use client"
import { LabelledInput } from "@repo/ui/labelledInput"
import { Popup } from "./popupCard"
import { Dispatch, ReactNode, SetStateAction, useRef } from "react"
import { Button } from "@repo/ui/button"
import { Box } from "./box"
import { useRouter } from "next/navigation"

export const CreateRoom = ({setToPopup, setRooms}:{
    setToPopup : Dispatch<SetStateAction<boolean>>,
    setRooms : Dispatch<SetStateAction<ReactNode[]>>
})=>{
    const inRef = useRef<HTMLInputElement>(null)
    const router = useRouter();
    return <Popup size="auto">
        <div className="border-4">
            <LabelledInput ref={inRef} type="text" placeholder="room slug" lable="Room Slug"/>
            <Button onClick={async()=>{
                const input = inRef.current
                async function createRoom(){
                    if(!input){
                        alert("Please provide a slug");
                        return;
                    }
                    const slug = input.value
                    let createdSlug;
                    try{
                        createdSlug = await fetch("http://localhost:3001/create-room", {
                            headers:{
                                "Content-Type": "application/json",
                                "token" : localStorage.getItem("token")??""
                            },
                            method:"POST",
                            body:JSON.stringify({
                                slug
                            })
                        }).then(res=>res.json())
                    }catch(e){
                        alert("DataBase Query failed!")
                        return;
                    }
                    console.log(createdSlug)
                    setRooms(rooms=>{
                    const newRooms = [...rooms, 
                        <Box onClick={()=>{
                            router.push(`../canvas/${createdSlug.slug}`)
                        }} key={rooms.length}>
                            {createdSlug.slug}
                        </Box>]
                        console.log(newRooms.toString())
                        return newRooms
                    })
                    setToPopup(false)
                }
                await createRoom()
            }} variant="primary">
                Create Room
            </Button>
        </div>
    </Popup>
}
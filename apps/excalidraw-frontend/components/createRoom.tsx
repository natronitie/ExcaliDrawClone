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
                    if(!input) return;//avoiding ts errors
                    if(!input.value){
                        alert("Please provide a slug");
                        return;
                    }
                    const slug = input.value
                    let createdSlug;
                    createdSlug = await fetch("http://localhost:3001/create-room", {
                        headers:{
                            "Content-Type": "application/json",
                            "token" : localStorage.getItem("token")??""
                        },//keep in mind that there is a zod schema check for min 5 chars
                        method:"POST",
                        body:JSON.stringify({
                            slug
                        })
                    }).then(res=>res.json())
                    if(createdSlug.error){
                        console.log("you are not a valid user");
                        router.push("../signup");
                        return;
                    }
                    console.log(createdSlug+"kya hai ye")
                    console.log("aage basho")
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
                    console.log("ho gya")
                }
                await createRoom()
            }} variant="primary">
                Create Room
            </Button>
        </div>
    </Popup>
}
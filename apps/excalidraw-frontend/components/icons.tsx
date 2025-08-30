export const PlusIcon = ()=>{
    return <svg fill="white" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 500 500" enableBackground="new 0 0 500 500" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M306,192h-48v-48c0-4.4-3.6-8-8-8s-8,3.6-8,8v48h-48c-4.4,0-8,3.6-8,8s3.6,8,8,8h48v48c0,4.4,3.6,8,8,8s8-3.6,8-8v-48h48 c4.4,0,8-3.6,8-8S310.4,192,306,192z"></path> </g></svg>
}

export const CircleIcon = ({radius, width, fill , bg}:{
    radius : number,
    width : number,
    fill : string,
    bg:string
})=>{
    return(
        <svg height="30" width="30">
            <circle r={"15"} cx={15} cy={15} fill={fill}/>
            <circle r={12} cx={15} cy={15} fill="rgb(51 65 85)"/>
        </svg>
    ) 
}

export const RectIcon = ()=>{
    return( 
<svg width="32" height="22" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="22" x="0" y="0" fill="white" />
    <rect width="26" height="16" x="3" y="3" fill="rgb(51 65 85)"/>        
</svg>)
}
export const LineIcon = ()=>{
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25" />
</svg>

}

export const PointerIcon = ()=>{
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
</svg>

}

export const PencilIcon = (()=>{
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className = "size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
})
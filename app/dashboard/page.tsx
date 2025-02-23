"use client"
import { useRouter } from "next/navigation";
import React from "react";

export default function Dashboard(){
    const router = useRouter();
    const [isLoading, setisLoading] = React.useState(true);
    React.useEffect(()=>{
        const token = localStorage.getItem('authToken');
        if(!token){
            router.push('/signin');
        }
        else{
            setisLoading(false);
        }
    }, [router])
    if(isLoading) return <p>Loading...</p>
    return(
        <div style={{color: "white"}}>
            Hi from dashboard
        </div>
    )
}
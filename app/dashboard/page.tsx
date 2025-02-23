"use client"
import { Box, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";

type JwtPayload = {
    userId: string,
    email: string,
    exp: number
}

export default function Dashboard(){
    const router = useRouter();
    const [isLoading, setisLoading] = React.useState(true);
    const isTokenExpired = (token: string | null) => {
        if (!token) return true;
        try {
            const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
            return decoded.exp * 1000 < Date.now();
        } catch (error) {
            return true;
        }
    };
    React.useEffect(()=>{
        const token = localStorage.getItem('authToken');
        if(!token || isTokenExpired(token)){
            localStorage.removeItem("authToken");
            router.push('/signin');
        }
        else{
            setisLoading(false);
        }
    }, [router])
    if(isLoading) return <p>Loading...</p>
    return(
        <Box>
            <Typography sx={{color: "white"}}>
                Hi this is from dashboard
            </Typography>
        </Box>
    )
}
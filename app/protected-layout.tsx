import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

type JwtPayload = {
    userId: string,
    email: string,
    iat: number,
    exp: number
};

export default function Protected({children}: {children: ReactNode}){
    const router = useRouter();
    useEffect(()=>{
        const token = localStorage.getItem('authToken');
        if(!token){
            router.push('/signin');
            return;
        }
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        if(decoded.exp * 1000 < Date.now()){
            console.log(decoded)
            localStorage.removeItem('authToken');
            router.push('/signin');
        }
    }, [router])
    return<>{children}</>
}
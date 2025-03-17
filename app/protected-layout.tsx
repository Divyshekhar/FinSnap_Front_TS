import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Cookies from 'js-cookie';
type JwtPayload = {
    userId: string,
    email: string,
    iat: number,
    exp: number
}

export default function Protected({children}: {children: ReactNode}){
    const router = useRouter();
    useEffect(()=>{
        const token = Cookies.get("token");
        if(!token){
            router.push('/signin');
            return;
        }
        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        if(decoded.exp * 1000 < Date.now()){
            Cookies.remove('token');
            router.push('/signin');
        }
    }, [router])
    return<>{children}</>
}
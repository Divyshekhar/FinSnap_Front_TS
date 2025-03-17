import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { useAuth } from "./(context)/authContext";
type JwtPayload = {
    userId: string,
    email: string,
    iat: number,
    exp: number
}

export default function Protected({ children }: { children: ReactNode }) {
    const router = useRouter();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const getCookie = async() => {
        const response = await axios.get("http://localhost:5000/user/token", {withCredentials: true})
        if(response){
            setIsAuthenticated(true)
        }

        const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
        if(decoded.exp * 1000 < Date.now()){
            console.log(decoded)
            localStorage.removeItem('authToken');
            router.push('/signin'); 
        }
    }
    useEffect(() => {
      getCookie()
      checkAuth()
    }, []);

    return <>{children}</>
}
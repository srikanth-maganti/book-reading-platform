import {createContext,useState,useEffect} from "react"
import React from 'react'

export const AuthContext=createContext();
export function AuthProvider({children})
{
    const [isauthenticated,setisauthenticated]=useState(false);

    useEffect(()=>{
        let token=localStorage.getItem("token");
        setisauthenticated(!!token);
    },[])
    return (
        <AuthContext.Provider value={{isauthenticated,setisauthenticated}}>
            {children}
        </AuthContext.Provider>
    )
}
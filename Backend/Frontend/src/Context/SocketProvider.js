import React, { useContext } from "react";
import { useMemo } from "react";
import { createContext } from "react";
import {io} from 'socket.io-client';
const SocketContext = createContext(null);
export const useSocket=()=>{
    const socket = useContext(SocketContext);
    return socket;
}
export const SocketProvider =(props)=>{
    const socket  =  useMemo(()=>io("https://socket-server-3npn.onrender.com"),[]);
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
        
    )
}
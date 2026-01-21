"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "../models/authModel";
import { useToken } from "./TokenContext";

type AuthContextType = {
    uid: string | null;
    isAuth: boolean;
    fullName: string;
    email: string;
    setUid: (uid: string | null) => void;
    setIsAuth: (auth: boolean) => void;
    setFullName: (fullName: string) => void;
    setEmail: (email: string) => void;
}; 

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, isAdmin }: { children: React.ReactNode, isAdmin: boolean }) {
    const [uid, setUid] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const token = useToken();

    useEffect(() => {
        async function loadSession() {
            const data = await getSession(token);
            
            if (data && data.isAuth) {
                setUid(data.uid);
                setIsAuth(data.isAuth);
                setFullName(data.fullName);
                setEmail(data.email)
            }
        }
        if (!isAdmin) {
            loadSession();
        }
    }, []);

    return (
        <AuthContext.Provider value={{ uid, isAuth, fullName, email, setUid, setIsAuth, setFullName, setEmail }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
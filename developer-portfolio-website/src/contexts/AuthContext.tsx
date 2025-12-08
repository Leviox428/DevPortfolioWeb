import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "../models/reviewSectionModel";
import { useFormState } from "react-hook-form";


type AuthContextType = {
    uid: string | null;
    isAuth: boolean;
    authToken: string,
    setUid: (uid: string | null) => void;
    setIsAuth: (auth: boolean) => void;
    setAuthToken: (authToken: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [uid, setUid] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [authToken, setAuthToken] = useState<string>("");

    useEffect(() => {
        async function load() {
            const data = await getSession();
            setUid(data.uid);
            setAuthToken(data.authToken);
            setIsAuth(Boolean(data.uid));
        }
        load();
    }, []);

    return (
        <AuthContext.Provider value={{ uid, isAuth, authToken, setUid, setIsAuth, setAuthToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
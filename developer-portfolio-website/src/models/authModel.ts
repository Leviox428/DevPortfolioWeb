import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, updateEmail, updatePassword, signInWithCustomToken, verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { TokenContextType } from "../contexts/TokenContext";
import { auth } from "@/src/lib/firebaseClient";
import { AuthData } from "./types/authTypes";

export async function getSession(tokenContext: TokenContextType) {
    const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` 
        },
    });
    const data = await res.json();
    if (!data.isAuth) return null;

    if (!auth.currentUser) {
        await signInWithCustomToken(auth, data.customToken);
    }

    return data;
}

export async function handleAuth(tokenContext: TokenContextType, authToken: string) {
    await fetch("/api/session", {
        method: "POST",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` 
        },
        body: JSON.stringify({ authToken }),
    });
}

export async function login(password: string, email: string, isAdmin: boolean, tokenContext: TokenContextType): Promise<AuthData | null> {  
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const authToken = await userCred.user.getIdToken();
    const uid = userCred.user.uid;
    const fullName = userCred.user.displayName ?? "";

    if (!isAdmin) return { authToken, uid, fullName };
    
    const res = await fetch(`/api/admin?email=${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to check admin");
    }

    const data = await res.json();
    if (data.isAdmin) return { authToken, uid, fullName };

    return null;
}

export async function register(password: string, email: string, fullName: string): Promise<AuthData> {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCred.user, {
        displayName: fullName,
    });

    const authToken = await userCred.user.getIdToken();
    const uid = userCred.user.uid;
    return { authToken, uid, fullName };
}

export async function changeFullName(fullName: string) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated");
    }

    await updateProfile(user, { displayName: fullName });
}

export async function changePassword(password: string) {
    const user = auth.currentUser;

    if (!user) {
        throw new Error("User is not authenticated");
    }
    try {
        await updatePassword(user, password);
    } catch (error: any) {
        console.error(error.code, error.message);
        throw error;
    }
    
}

export async function changeEmail(email: string) {
    const user = auth.currentUser;
    console.log(email);
    if (!user) {
        throw new Error("User is not authenticated");
    }

    try {
        await verifyBeforeUpdateEmail(user, email);
    } catch (error: any) {
        console.error(error.code, error.message);
        throw error;
    }
}


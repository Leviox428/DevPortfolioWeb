import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { TokenContextType } from "../contexts/TokenContext";
import { ReviewType } from "./types/reviewsSectionTypes";
import { auth } from "@/src/lib/firebaseClient";

export async function fetchReviews(tokenContext: TokenContextType): Promise<ReviewType[]> {
    const response = await fetch("/api/review", {
        method: "Get",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}`, 
        },
        
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to fetch reviews: ${error}`);
    }

    return response.json();
}

export async function addReview(tokenContext: TokenContextType, authToken: string, author: string, content: string, stars: number) {
    await fetch("/api/review", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` ,
            Auth: `${authToken}`
        },
        body: JSON.stringify({ author, content, stars }),
    });
}

export async function handleAuth(tokenContext: TokenContextType, authToken: string) {
    await fetch("/api/session", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` 
        },
        body: JSON.stringify({ authToken }),
    });
}

export async function login(password: string, email: string): Promise<string> {  
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const authToken = await userCred.user.getIdToken();
    return authToken;
}

export async function register(password: string, email: string): Promise<string> {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const authToken = await userCred.user.getIdToken();
    return authToken;
}
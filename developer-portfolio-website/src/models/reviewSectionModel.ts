import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { TokenContextType } from "../contexts/TokenContext";
import { ReviewType } from "./types/reviewsSectionTypes";
import { auth } from "@/src/lib/firebaseClient";
import { Auth } from "./types/authTypes";

export async function fetchReviews(
    tokenContext: TokenContextType,
    userId?: string | null
): Promise<ReviewType[]> {

    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    
    const response = await fetch(`/api/reviews${query}`, {
        method: "GET",
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

export async function getSession() {
    const res = await fetch("/api/session");
    const data = await res.json();
    return data;
}

export async function addReview(tokenContext: TokenContextType, auth: Auth, author: string, content: string, stars: number) {
    let id = auth.uid;
    await fetch("/api/reviews", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` ,
            Auth: `${auth.authToken}`
        },
        body: JSON.stringify({ author, content, id, stars }),
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

export async function login(password: string, email: string): Promise<Auth> {  
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const authToken = await userCred.user.getIdToken();
    const uid = userCred.user.uid;
    return { authToken, uid };
}

export async function register(password: string, email: string): Promise<Auth> {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const authToken = await userCred.user.getIdToken();
    const uid = userCred.user.uid;
    return { authToken, uid };
}
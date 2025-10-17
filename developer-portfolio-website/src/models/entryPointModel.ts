import { TokenContextType } from "../contexts/TokenContext";

export function trackVisitor(tokenContext: TokenContextType): void {  
    fetch("/api/trackVisitor", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}`, 
        },
    }).catch(() => null);
}

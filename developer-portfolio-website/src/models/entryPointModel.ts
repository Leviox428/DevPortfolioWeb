import { useToken } from "../contexts/TokenContext";

export function trackVisitor() {
    const { token } = useToken();
    
    fetch("/api/trackVisitor", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
    }).catch(() => null);
}

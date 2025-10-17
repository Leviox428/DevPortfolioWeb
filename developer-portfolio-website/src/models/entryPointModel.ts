export function trackVisitor(token: string | null): void {  
    fetch("/api/trackVisitor", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
    }).catch(() => null);
}

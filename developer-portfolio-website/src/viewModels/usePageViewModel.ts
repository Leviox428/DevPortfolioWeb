import { useEffect } from "react";

export default function usePageViewModel() {
    
    useEffect(() => {
        const THROTTLE_MS = 60 * 60 * 1000; // 1 hour
        const last_seen = "last_seen";

        const now = Date.now();
        const lastSeen = parseInt(localStorage.getItem(last_seen) || "0", 10);

        if (!lastSeen || now - lastSeen > THROTTLE_MS) {
            fetch("/api/trackVisitor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            }).catch(() => null);

            localStorage.setItem(last_seen, now.toString());
        }
    },[]);
    
}
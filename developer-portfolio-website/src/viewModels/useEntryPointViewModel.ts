import { useEffect } from "react";
import { trackVisitor } from "../models/entryPointModel";

export default function usePageViewModel(token: string | null) { 
    useEffect(() => {
        const THROTTLE_MS = 60 * 60 * 1000; // 1 hour
        const last_seen = "last_seen";

        const now = Date.now();
        const lastSeen = parseInt(localStorage.getItem(last_seen) || "0", 10);

        if (!lastSeen || now - lastSeen > THROTTLE_MS) {
            trackVisitor(token);
            localStorage.setItem(last_seen, now.toString());
        }
    }, [token]);
}
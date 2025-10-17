export function trackVisitor() {
    fetch("/api/trackVisitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    }).catch(() => null);
}

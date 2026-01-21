import { TokenContextType } from "@/src/contexts/TokenContext";

export async function fetchAboutMe(token: TokenContextType, locale: string) {
    const res = await fetch(`/api/aboutMe?locale=${encodeURIComponent(locale)}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
        },
    });
    if (!res.ok) throw new Error("Failed to fetch About Me");

    const data = await res.json();
    return data;
}

export async function updateAboutMe(text: string, token: TokenContextType, locale: string) {
    const res = await fetch("/api/aboutMe", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify({ text, locale }),
    });

    if (!res.ok) throw new Error("Failed to save About Me");
}

export async function getCvUrl(token: TokenContextType, locale: string) {
    const res = await fetch(`/api/cv/?locale=${encodeURIComponent(locale)}`, {
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token.token}`,
        },
    });
    const { url } = await res.json();
    return url;
}
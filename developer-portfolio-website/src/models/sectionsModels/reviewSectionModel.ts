import { TokenContextType } from "@/src/contexts/TokenContext";
import { ReviewType } from "../types/reviewsSectionTypes";

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

export async function addReview(tokenContext: TokenContextType, fullName: string, content: string, stars: number) {
    const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}`,
        },
        body: JSON.stringify({ fullName, content, stars }),
    });

    if (!res.ok) {       
        const data = await res.json();
        throw new Error(data.error ?? "Failed to submit review");
    }
}

export async function deleteReview(tokenContext: TokenContextType, reviewID: string) {
    const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}`,
        },
        body: JSON.stringify({ reviewId: reviewID }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to delete");
}

export async function updateReview(tokenContext: TokenContextType, reviewID: string, content: string, stars: number) {
    const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenContext.token}` ,
        },
        body: JSON.stringify({
            reviewId: reviewID,
            content,
            stars,
        }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Failed to update");
}

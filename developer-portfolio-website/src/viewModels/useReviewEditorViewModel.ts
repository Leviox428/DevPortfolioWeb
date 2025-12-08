import { useEffect, useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { fetchReviews } from "../models/reviewSectionModel";
import { useToken } from "../contexts/TokenContext";
import { useAuth } from "../contexts/AuthContext";

export default function useReviewEditorViewModel() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setIsLoading] = useState();
    const token = useToken();
    const { uid } = useAuth();
    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await fetchReviews(token, uid);
                setReviews(data);
            } catch (err) {
                console.log("Failed to load reviews");
            } 
        };


            loadReviews(); 
    }, []);

    return {
        loading,
        reviews
    }
}
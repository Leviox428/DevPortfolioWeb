import { useEffect, useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { useToken } from "../contexts/TokenContext";
import { useAuth } from "../contexts/AuthContext";
import { fetchReviews } from "../models/sectionsModels/reviewSectionModel";

export default function useReviewEditorViewModel() {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setIsLoading] = useState(true);
    const token = useToken();
    const { uid } = useAuth();
    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await fetchReviews(token, uid);
                setReviews(data);
                setIsLoading(false);
            } catch (err) {
                console.log("Failed to load reviews");
            } 
        };


            loadReviews(); 
    }, []);

    return {
        loading,
        reviews,

        setReviews
    }
}
import { useEffect, useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { fetchReviews } from "../models/reviewSectionModel";
import { useToken } from "../contexts/TokenContext";

export default function useReviewEditorViewModel(authToken: string) {
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const token = useToken();
    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await fetchReviews(token);
                setReviews(data);
            } catch (err) {
                console.log("Failed to load reviews");
            } 
        };


            loadReviews(); 
    }, []);
}
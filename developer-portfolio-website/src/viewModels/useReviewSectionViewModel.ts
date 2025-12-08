import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { useToken } from "../contexts/TokenContext";
import { fetchReviews } from "../models/reviewSectionModel";

export default function useReviewSectionViewModel() {
    const t = useTranslations("ReviewSection");
    const [showModal, setShowModal] = useState(false);
    const token = useToken();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState(true);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        async function loadReviews() {
            try {
                setLoading(true);
                const data = await fetchReviews(token);
                setReviews(data);
                setLoading(false);
            } catch (err) {
                console.log("Failed to load reviews");
            } 
        };

        loadReviews();

    }, []);

    return {
        t,
        reviews,
        loading,
        showModal,

        handleOpenModal,
        handleCloseModal,
    }
}
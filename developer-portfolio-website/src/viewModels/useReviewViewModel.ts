import { useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { deleteReview, updateReview } from "../models/sectionsModels/reviewSectionModel";
import { useToken } from "../contexts/TokenContext";
import { useTranslations } from "next-intl";

export default function useReviewViewModel(review: ReviewType, onDeleted?: () => void) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(review.content);
    const [stars, setStars] = useState(review.stars);
    const [loading, setLoading] = useState(false);
    const token = useToken();
    const tCommon = useTranslations("Common");

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        setLoading(true);
        try {
            await deleteReview(token, review.id);
            onDeleted?.();
        } catch (err) {
            alert("Error deleting review");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!content || content.length < 10) {
            alert("Content must be at least 10 characters");
            return;
        }

        setLoading(true);
        try {
            await updateReview(token, review.id, content, stars);
            alert("Review updated");
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert("Error updating review: " + (err as Error).message);
        } finally {
            setLoading(false);
        }
    };
    return {
        isEditing,  
        stars,
        content,
        loading,
        tCommon,

        setContent,
        setStars,
        handleEdit,
        handleDelete,
        setIsEditing
    }
}
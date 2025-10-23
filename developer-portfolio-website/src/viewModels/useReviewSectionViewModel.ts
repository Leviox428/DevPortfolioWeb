import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { useToken } from "../contexts/TokenContext";
import { fetchReviews } from "../models/reviewSectionModel";

export default function useReviewSectionViewModel() {
    const t = useTranslations("ReviewSection");
    const [showModal, setShowModal] = useState(false);
    const token = useToken();
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const authToken = useRef<string>("");

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        async function loadReviews() {
            try {
                const data = await fetchReviews(token);
                setReviews(data);
            } catch (err) {
                console.log("Failed to load reviews");
            } 
        };

        async function checkSession() {
            setLoading(true);
            try {
                const res = await fetch("/api/session");
                const data = await res.json();
                authToken.current = data.authToken;
                setIsAuth(data.isAuth);
            } catch (err: unknown) {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
            }


        loadReviews();
        checkSession();  
    }, []);

    return {
        t,
        reviews,
        loading,
        showModal,
        isAuth,
        authToken,

        handleOpenModal,
        handleCloseModal,
        setIsAuth
    }
}
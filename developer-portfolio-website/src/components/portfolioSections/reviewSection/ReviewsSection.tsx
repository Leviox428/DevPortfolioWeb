import { AuthProvider } from "@/src/contexts/AuthContext";
import ReviewsSectionInner from "./ReviewSectionInner";

export default function ReviewsSection() {
    return (
        <AuthProvider>
            <ReviewsSectionInner />
        </AuthProvider>
    );
}
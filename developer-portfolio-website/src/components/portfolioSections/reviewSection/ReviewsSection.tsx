import { AuthProvider } from "@/src/contexts/AuthContext";
import ReviewsSectionInner from "./ReviewSectionInner";

export default function ReviewsSection() {
    return (
        <AuthProvider isAdmin={false}>
            <ReviewsSectionInner />
        </AuthProvider>
    );
}
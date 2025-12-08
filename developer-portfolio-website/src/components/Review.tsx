import { ReviewType } from "../models/types/reviewsSectionTypes";

interface ReviewProps {
  review: ReviewType;
  editable?: boolean;
}

export default function Review({ review, editable }: ReviewProps) {
    return (
        <div className="border p-4 rounded-lg bg-zinc-800/50">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">{review.author}</span>
                <div>
                    {"★".repeat(review.stars)}
                    {"☆".repeat(5 - review.stars)}
                </div>
            </div>
            <p className="text-white whitespace-pre-wrap break-words">{review.content}</p>
        </div>
    )
}
import { ReviewType } from "../models/types/reviewsSectionTypes";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface ReviewProps {
  review: ReviewType;
  editable?: boolean;
}

export default function Review({ review, editable }: ReviewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(review.content);
  const [stars, setStars] = useState(review.stars);
  const [loading, setLoading] = useState(false);

  const { authToken } = useAuth();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Auth": authToken,
        },
        body: JSON.stringify({ reviewId: review.id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete");

      alert("Review deleted");
      router.refresh(); // refresh the page to remove deleted review
    } catch (err) {
      console.error(err);
      alert("Error deleting review: " + (err as Error).message);
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
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Auth": authToken,
        },
        body: JSON.stringify({
          reviewId: review.id,
          content,
          stars,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update");

      alert("Review updated");
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error updating review: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-zinc-800/50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">{review.author}</span>
        <div>
          {"★".repeat(stars)}
          {"☆".repeat(5 - stars)}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="w-full p-2 mb-2 rounded bg-zinc-700 text-white"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="text-white whitespace-pre-wrap break-words">{content}</p>
      )}

      {editable && (
        <div className="flex gap-5 mt-2">
          {isEditing ? (
            <>
              <p
                className={`underline cursor-pointer hover:text-green-500 ${loading ? "opacity-50" : ""}`}
                onClick={handleEdit}
              >
                Save
              </p>
              <p
                className={`underline cursor-pointer hover:text-gray-300 ${loading ? "opacity-50" : ""}`}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </p>
            </>
          ) : (
            <>
              <p
                className={`underline cursor-pointer hover:text-red-500 ${loading ? "opacity-50" : ""}`}
                onClick={handleDelete}
              >
                Delete
              </p>
              <p
                className={`underline cursor-pointer hover:text-blue-500 ${loading ? "opacity-50" : ""}`}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

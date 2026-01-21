import { ReviewType } from "../../../models/types/reviewsSectionTypes";
import useReviewViewModel from "../../../viewModels/useReviewViewModel";
import StarSelector from "./StarSelector";

interface ReviewProps {
  review: ReviewType;
  editable?: boolean;
  onDeleted?: () => void;
}

export default function Review({ review, editable, onDeleted }: ReviewProps) {
  const vm = useReviewViewModel(review, onDeleted);

  return (
    <div className="border p-4 rounded-lg bg-zinc-800/50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-lg">{review.fullName}</span>
        {!vm.isEditing ? (
          <div>
            {"★".repeat(vm.stars)}
            {"☆".repeat(5 - vm.stars)}
          </div>
        ) : (
          <StarSelector value={vm.stars} onChange={vm.setStars} />
        )}
      </div>

      {vm.isEditing ? (
        <textarea
          className="w-full p-2 mb-2 rounded bg-zinc-700 text-white"
          value={vm.content}
          onChange={(e) => vm.setContent(e.target.value)}
          rows={3}
        />
      ) : (
        <p className="text-white whitespace-pre-wrap break-words">{vm.content}</p>
      )}

      {editable && (
        <div className="flex gap-5 mt-2">
          {vm.isEditing ? (
            <>
              <p
                className={`underline cursor-pointer hover:text-green-500 ${vm.loading ? "opacity-50" : ""}`}
                onClick={vm.handleEdit}
              >
                {vm.tCommon("save")}
              </p>
              <p
                className={`underline cursor-pointer hover:text-gray-300 ${vm.loading ? "opacity-50" : ""}`}
                onClick={() => vm.setIsEditing(false)}
              >
                {vm.tCommon("cancel")}
              </p>
            </>
          ) : (
            <>
              <p
                className={`underline cursor-pointer hover:text-red-500 ${vm.loading ? "opacity-50" : ""}`}
                onClick={vm.handleDelete}
              >
                {vm.tCommon("delete")}
              </p>
              <p
                className={`underline cursor-pointer hover:text-blue-500 ${vm.loading ? "opacity-50" : ""}`}
                onClick={() => vm.setIsEditing(true)}
              >
                {vm.tCommon("edit")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

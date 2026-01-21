import useReviewEditorViewModel from "@/src/viewModels/useReviewEditorViewModel"
import Review from "./Review";
import { Spinner } from "../../shadcnComponents/Spinner";

export default function ReviewEdiotr () {
    const vm = useReviewEditorViewModel();

    const removeReview = (id: string) => {
        vm.setReviews((prev) => prev.filter((r) => r.id !== id));
    };


    return (
        <div className="relative flex flex-col place-items-center place-content-center w-full h-full">            
            <div className="m-6 pt-4 overflow-y-auto scrollbar flex flex-1 flex-col gap-4 w-[90%] sm:w-[80%] md:w-[65%] lg:w-[50%]">
                {!vm.loading && vm.reviews.map((r) => (
                    <Review 
                        key={r.id} 
                        review={r} 
                        editable={true}
                        onDeleted={() => removeReview(r.id)}
                    >
                    </Review>
                ))}
                {vm.loading &&
                    <Spinner className="self-center size-12"/>
                }
            </div>            
        </div>
    )
}
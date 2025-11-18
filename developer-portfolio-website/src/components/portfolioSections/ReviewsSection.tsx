import useReviewSectionViewModel from "@/src/viewModels/useReviewSectionViewModel"
import { MdArrowBack } from "react-icons/md";
import Review from "../Review";
import { Button } from "../shadcnComponents/Button";
import { Spinner } from "../shadcnComponents/Spinner";
import AuthCard from "../AuthCard";
import ReviewEditor from "../AccountManager";

export default function ReviewsSection() {
    const vm = useReviewSectionViewModel();

    return (
        <div className="relative flex flex-col place-items-center place-content-center w-full h-full">
            <Button onClick={vm.handleOpenModal} variant={"outline"} className="w-90px mt-6 ml-6 h-40px self-start cursor-pointer">{vm.t("addReview")}</Button>
            <div className="m-6 pt-4 overflow-y-auto scrollbar place-content-center flex flex-1 flex-col gap-4 w-[90%] sm:w-[80%] md:w-[65%] lg:w-[50%]">
                {!vm.loading && vm.reviews.map((review, index) => (
                    <Review key={index} review={review}></Review>
                ))}
                {vm.loading &&
                    <Spinner className="self-center size-12"/>
                }
            </div>

            {vm.showModal && !vm.isAuth && (
                <div className="fixed z-3 inset-0 flex items-center justify-center bg-black/65 rounded-2xl shadow-lg backdrop-blur-sm">
                    <MdArrowBack onClick={vm.handleCloseModal} className="m-1 w-[24px] h-[24px] absolute top-1 right-1 cursor-pointer z-4" />
                    <AuthCard setIsAuth={vm.setIsAuth}></AuthCard>
                </div>
            )}
            {vm.showModal && vm.isAuth && (
                <div className="fixed z-3 inset-0 flex items-center justify-center bg-black/65 rounded-2xl shadow-lg backdrop-blur-sm">
                    <MdArrowBack onClick={vm.handleCloseModal} className="m-1 w-[24px] h-[24px] absolute top-1 right-1 cursor-pointer z-4" />
                    <ReviewEditor authToken={vm.authToken.current}></ReviewEditor>
                </div>
            )}
        </div>
    )
}
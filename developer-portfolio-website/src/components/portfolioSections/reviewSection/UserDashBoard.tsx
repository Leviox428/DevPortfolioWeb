import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import ReviewForm from "./ReviewForm";
import ReviewEdiotr from "./ReviewEditor";
import UserAccount from "./UserAccount";
import { useTranslations } from "next-intl";


export default function UserDashBoard() {
    const t = useTranslations("ReviewSection");
    return (
        <div className="relative w-full h-full p-20 flex place-items-center">
            <Tabs defaultValue="add-review" className="flex flex-col gap-4 w-full h-full place-content-center place-items-center">
                <TabsList className="bg-[#262626] p-2 w-[340px] rounded-xl flex gap-2 justify-around">
                    <TabsTrigger value="add-review">
                        {t("addReview")}
                    </TabsTrigger>
                    <TabsTrigger value="my-reviews">
                        {t("myReviews")}
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        {t("account")}
                    </TabsTrigger>
                </TabsList>
                <TabsContent className="flex place-content-center w-full h-full" value="add-review">
                    <ReviewForm/>
                </TabsContent>
                <TabsContent className="flex place-content-center w-full h-full" value="my-reviews">
                    <ReviewEdiotr></ReviewEdiotr>
                </TabsContent>
                <TabsContent className="flex place-content-center w-full h-full" value="account">
                    <UserAccount></UserAccount>
                </TabsContent>
            </Tabs>
        </div>
    )
}

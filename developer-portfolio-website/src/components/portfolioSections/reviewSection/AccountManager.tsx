import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import ReviewForm from "./ReviewForm";
import ReviewEdiotr from "./ReviewEditor";


export default function AccountManager() {
    return (
        <div className="relative w-full h-full p-20 flex place-items-center">
            <Tabs defaultValue="add-review" className="flex flex-col gap-4 w-full h-full place-content-center place-items-center">
                <TabsList className="bg-[#262626] p-2 w-[340px] rounded-xl flex gap-2 place-content-center">
                    <TabsTrigger value="add-review">
                        Add Review
                    </TabsTrigger>
                    <TabsTrigger value="my-reviews">
                        My Reviews
                    </TabsTrigger>
                    <TabsTrigger value="account">
                        Account
                    </TabsTrigger>
                </TabsList>
                <TabsContent className="flex place-content-center w-full h-full" value="add-review">
                    <ReviewForm/>
                </TabsContent>
                <TabsContent className="flex place-content-center w-full h-full" value="my-reviews">
                    <ReviewEdiotr></ReviewEdiotr>
                </TabsContent>
            </Tabs>
        </div>
    )
}

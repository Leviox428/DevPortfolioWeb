import { Controller } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { Button } from "./shadcnComponents/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./shadcnComponents/Card";
import { FieldGroup, Field, FieldLabel, FieldError } from "./shadcnComponents/Field";
import { Input } from "./shadcnComponents/Input";
import useReviewEditorViewModel from "@/src/viewModels/useReviewEditorViewModel";
import z from "zod";
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from "./shadcnComponents/InputGroup";
import { reviewEditorFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import ReviewEditor from "./ReviewEditor";

type AccountManagerProps = {
    authToken: string;
}

export default function AccountManager({ authToken }: AccountManagerProps) {
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
                    <ReviewEditor authToken={authToken}/>
                </TabsContent>
                <TabsContent className="flex place-content-center w-full h-full" value="my-reviews">Change your password here.</TabsContent>
            </Tabs>
        </div>
    )
}

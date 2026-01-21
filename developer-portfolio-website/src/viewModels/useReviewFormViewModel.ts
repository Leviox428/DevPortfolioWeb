import { useTranslations } from "next-intl";
import z from "zod";
import { reviewEditorFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import { useAuth } from "../contexts/AuthContext";
import { addReview } from "../models/sectionsModels/reviewSectionModel";

export default function useReviewFormViewModel() {
    const token = useToken();
    const { fullName } = useAuth();
    const t = useTranslations("ReviewEditor");
    const tCommon = useTranslations("Common");
    const isSubmitting = useRef(false);
    const [stars, setStars] = useState<number>(1);

    const formSchema  = z.object({     
        content: z
            .string()
            .min(
                reviewEditorFieldInfoDict["content"].min,
                `${t("contentFieldMin")} ${reviewEditorFieldInfoDict["content"].min} ${tCommon("characters")}.`
            )
            .max(
                reviewEditorFieldInfoDict["content"].max,
                `${t("contentFieldMax")} ${reviewEditorFieldInfoDict["content"].max} ${tCommon("characters")}.`
            ),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                content: "",
            },
        })
    
    async function onSubmit(data: z.infer<typeof formSchema>) {              
        await addReview(token, fullName, data.content, stars);      
    }

    return {
        t,
        tCommon,
        formSchema,
        form,
        isSubmitting,
        stars,

        setStars,
        onSubmit
    }
}
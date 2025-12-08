import { useTranslations } from "next-intl";
import z from "zod";
import { reviewEditorFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useToken } from "../contexts/TokenContext";
import { addReview } from "../models/reviewSectionModel";
import { useAuth } from "../contexts/AuthContext";

export default function useReviewFormViewModel() {
    const token = useToken();
    const { authToken, uid } = useAuth();
    const t = useTranslations("ReviewEditor");
    const isSubmitting = useRef(false);

    const formSchema  = z.object({
        author: z
            .string()
            .min(
                reviewEditorFieldInfoDict["author"].min,
                `${t("authorFieldMin")} ${reviewEditorFieldInfoDict["author"].min} ${t("characters")}.`
            )
            .max(
                reviewEditorFieldInfoDict["author"].max,
                `${t("authorFieldMax")} ${reviewEditorFieldInfoDict["author"].max} ${t("characters")}.`
            ),
        content: z
            .string()
            .min(
                reviewEditorFieldInfoDict["content"].min,
                `${t("contentFieldMin")} ${reviewEditorFieldInfoDict["content"].min} ${t("characters")}.`
            )
            .max(
                reviewEditorFieldInfoDict["content"].max,
                `${t("contentFieldMax")} ${reviewEditorFieldInfoDict["content"].max} ${t("characters")}.`
            ),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                author: "",
                content: "",
            },
        })
    
    async function onSubmit(data: z.infer<typeof formSchema>) {
        await addReview(token, { authToken, uid }, data.author, data.content, 2);
    }

    return {
        t,
        formSchema,
        form,
        isSubmitting,

        onSubmit
    }
}
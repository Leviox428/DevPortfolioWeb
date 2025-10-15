import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { fieldInfoDict } from "../models/types/reachOutSectionTypes"


export default function useReachOutSectionViewModel() {
    const t = useTranslations("ReachOutSection");

    const formSchema = z.object({
        name: z
            .string()
            .min(
                fieldInfoDict["name"].min,
                `${t("nameFieldMin")} ${fieldInfoDict["name"].min} ${t("characters")}.`
            )
            .max(
                fieldInfoDict["name"].max,
                `${t("nameFieldMax")} ${fieldInfoDict["name"].max} ${t("characters")}.`
            ),
        email: z
            .string()
            .min(
                fieldInfoDict["email"].min,
                `${t("emailFieldMin")} ${fieldInfoDict["email"].min} ${t("characters")}.`
            )
            .max(
                fieldInfoDict["email"].max,
                `${t("emailFieldMax")} ${fieldInfoDict["email"].max} ${t("characters")}.`
            ),
        subject: z
            .string()
            .min(
                fieldInfoDict["subject"].min,
                `${t("subjectFieldMin")} ${fieldInfoDict["subject"].min} ${t("characters")}.`
            )
            .max(
                fieldInfoDict["subject"].max,
                `${t("subjectFieldMax")} ${fieldInfoDict["subject"].max} ${t("characters")}.`
            ),
        message: z
            .string()
            .min(
                fieldInfoDict["message"].min,
                `${t("messageFieldMin")} ${fieldInfoDict["message"].min} ${t("characters")}.`
            )
            .max(
                fieldInfoDict["message"].max,
                `${t("messageFieldMax")} ${fieldInfoDict["message"].max} ${t("characters")}.`
            ),
    });
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {  
        
    }

    return {
        formSchema,
        form,
        t,

        onSubmit
    }
}
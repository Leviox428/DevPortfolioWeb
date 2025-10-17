import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { fieldInfoDict } from "../models/types/reachOutSectionTypes"
import { sendEmail, submitFormToServer } from "../models/reachOutSectionModel"
import { useRef } from "react"
import { useToken } from "../contexts/TokenContext"


export default function useReachOutSectionViewModel() {
    const t = useTranslations("ReachOutSection");
    const isSubmitting = useRef(false);
    const token = useToken();

    const formSchema = z.object({
        email: z
            .email({
                message: t("emailFieldInvalidEmail"), 
                pattern: z.regexes.rfc5322Email,
            })
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
            email: "",
            subject: "",
            message: ""
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {

        if (isSubmitting.current) return;
        isSubmitting.current = true;

        await submitFormToServer(data, token);
        await sendEmail(data, token);

        form.reset();
        isSubmitting.current = false;
    }

    return {
        formSchema,
        form,
        t,

        isSubmitting,
        onSubmit
    }
}
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { reachOutFieldInfoDict } from "../models/types/reachOutSectionTypes"
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
                reachOutFieldInfoDict["email"].min,
                `${t("emailFieldMin")} ${reachOutFieldInfoDict["email"].min} ${t("characters")}.`
            )
            .max(
                reachOutFieldInfoDict["email"].max,
                `${t("emailFieldMax")} ${reachOutFieldInfoDict["email"].max} ${t("characters")}.`
            ),
        subject: z
            .string()
            .min(
                reachOutFieldInfoDict["subject"].min,
                `${t("subjectFieldMin")} ${reachOutFieldInfoDict["subject"].min} ${t("characters")}.`
            )
            .max(
                reachOutFieldInfoDict["subject"].max,
                `${t("subjectFieldMax")} ${reachOutFieldInfoDict["subject"].max} ${t("characters")}.`
            ),
        message: z
            .string()                   
            .min(
                reachOutFieldInfoDict["message"].min,
                `${t("messageFieldMin")} ${reachOutFieldInfoDict["message"].min} ${t("characters")}.`
            )
            .max(
                reachOutFieldInfoDict["message"].max,
                `${t("messageFieldMax")} ${reachOutFieldInfoDict["message"].max} ${t("characters")}.`
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
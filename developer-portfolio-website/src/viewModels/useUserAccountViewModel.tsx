import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import z from "zod";
import { useTranslations } from "next-intl";
import { authCardFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeEmail, changeFullName, changePassword } from "../models/authModel";
import { toast } from "sonner";
export default function useUserAccountViewModel() {
    const auth = useAuth();

    const [fullName, setFullName] = useState(auth.fullName);
    const [email, setEmail] = useState(auth.email);
    
    const isSubmitting = useRef(false);

    const t = useTranslations("Auth");
    const tCommon = useTranslations("Common");

    const emailSchema = z
        .object({
            email: z
                .email({
                    message: tCommon("emailFieldInvalidEmail"), 
                    pattern: z.regexes.rfc5322Email,
                })
                .min(
                    authCardFieldInfoDict["email"].min,
                    `${tCommon("emailFieldMin")} ${authCardFieldInfoDict["email"].min} ${tCommon("characters")}.`
                )
                .max(
                    authCardFieldInfoDict["email"].max,
                    `${tCommon("emailFieldMax")} ${authCardFieldInfoDict["email"].max} ${tCommon("characters")}.`
                ),
        })

    const passwordSchema = z
        .object({
            password: z
                .string()
                .min(
                    authCardFieldInfoDict["password"].min,
                    `${tCommon("passwordFieldMin")} ${authCardFieldInfoDict["password"].min} ${tCommon("characters")}.`
                )
                .max(
                    authCardFieldInfoDict["password"].max,
                    `${tCommon("passwordFieldMax")} ${authCardFieldInfoDict["password"].max} ${tCommon("characters")}.`
                ),
            confirmPassword: z
                .string()
                    .min(authCardFieldInfoDict.password.min, `${tCommon("passwordFieldMin")} ${authCardFieldInfoDict.password.min} ${tCommon("characters")}.`)
                    .max(authCardFieldInfoDict.password.max, `${tCommon("passwordFieldMax")} ${authCardFieldInfoDict.password.max} ${tCommon("characters")}.`),
            })                                     
        .refine((data) => data.password === data.confirmPassword, {
            message: tCommon("passwordsNoMatch"),
            path: ["confirmPassword"]
        })

    const fullNameSchema = z
        .object({
            fullName: z
                .string()
                .min(authCardFieldInfoDict.fullName.min, `${t("fullNameFieldMin")} ${authCardFieldInfoDict.fullName.min} ${tCommon("characters")}.`)
                .max(authCardFieldInfoDict.fullName.max, `${t("fullNameFieldMax")} ${authCardFieldInfoDict.fullName.max} ${tCommon("characters")}.`),
        })
            
    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })
    
    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        },
    })
    
    const fullNameForm = useForm<z.infer<typeof fullNameSchema>>({
        resolver: zodResolver(fullNameSchema),
        defaultValues: {
            fullName: "",
        },
    })  

    async function submitNewEmail(data: z.infer<typeof emailSchema>) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        try {
            await changeEmail(data.email);
            setEmail(data.email);
        } catch {
            auth.isAuth = false;
            toast(tCommon("submitError"));
        }
        toast(tCommon("submitting"));
        isSubmitting.current = false;
    }

    async function submitNewFullName(data: z.infer<typeof fullNameSchema>) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        try {
            await changeFullName(data.fullName);
            setFullName(data.fullName);

        } catch {
            auth.isAuth = false;
            toast(tCommon("submitError"));
        }
        toast(tCommon("submitting"));
        isSubmitting.current = false;
    }

    async function submitNewPassword(data: z.infer<typeof passwordSchema>) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        try {
            await changePassword(data.password);
        } catch {
            toast(tCommon("submitError"));
        }
        toast(tCommon("submitting"));
        isSubmitting.current = false;
    }

    return {
        fullName,
        email,
        passwordForm,
        fullNameForm,
        emailForm,
        t,

        submitNewEmail,
        submitNewFullName,
        submitNewPassword
    }
}
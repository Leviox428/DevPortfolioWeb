import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import z from "zod";
import { authCardFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleAuth, login, register } from "../models/reviewSectionModel";

export default function useAuthCardViewModel() {
    const t = useTranslations("AuthCard");
    const token = useToken();
    const [isLogin, setIsLogin] = useState(true);
    const isSubmitting = useRef(false);

    const baseSchema  = z
        .object({
            email: z
                .email({
                    message: t("emailFieldInvalidEmail"), 
                    pattern: z.regexes.rfc5322Email,
                })
                .min(
                    authCardFieldInfoDict["email"].min,
                    `${t("emailFieldMin")} ${authCardFieldInfoDict["email"].min} ${t("characters")}.`
                )
                .max(
                    authCardFieldInfoDict["email"].max,
                    `${t("emailFieldMax")} ${authCardFieldInfoDict["email"].max} ${t("characters")}.`
                ),
            password: z
                .string()
                .min(
                    authCardFieldInfoDict["password"].min,
                    `${t("passwordFieldMin")} ${authCardFieldInfoDict["password"].min} ${t("characters")}.`
                )
                .max(
                    authCardFieldInfoDict["password"].max,
                    `${t("passwordFieldMax")} ${authCardFieldInfoDict["password"].max} ${t("characters")}.`
                ),
        })

    const registerSchema = baseSchema
        .extend({
            confirmPassword: z
            .string()
            .min(authCardFieldInfoDict.password.min, `${t("passwordFieldMin")} ${authCardFieldInfoDict.password.min} ${t("characters")}.`)
            .max(authCardFieldInfoDict.password.max, `${t("passwordFieldMax")} ${authCardFieldInfoDict.password.max} ${t("characters")}.`)
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("passwordsNoMatch"),
            path: ["confirmPassword"]
        });
    

    type LoginSchema = z.infer<typeof baseSchema>;
    type RegisterSchema = z.infer<typeof registerSchema>;
    type AuthSchema = LoginSchema | RegisterSchema;

    const formSchema = isLogin ? baseSchema : registerSchema;

    const form = useForm<AuthSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;
        
        let autToken: string;
        if (isLogin) {
            autToken = await login(data.password, data.email);
        } else {
            autToken = await register(data.password, data.email);
        }
        await handleAuth(token, autToken);

        form.reset();
        isSubmitting.current = false;
    }

    function onChangeAuthClicked() {
        setIsLogin((prev) => !prev);
    }

    return {
        t,
        isLogin,
        form,
        formSchema,
        isSubmitting,

        onSubmit,
        onRegisterClicked: onChangeAuthClicked
    }
}
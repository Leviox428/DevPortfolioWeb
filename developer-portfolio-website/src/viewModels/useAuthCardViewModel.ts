import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useToken } from "../contexts/TokenContext";
import z from "zod";
import { authCardFieldInfoDict } from "../models/types/reviewsSectionTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthData } from "../models/types/authTypes";
import { useAuth } from "../contexts/AuthContext";
import { handleAuth, login, register } from "../models/authModel";
import { toast } from "sonner";

export default function useAuthCardViewModel() {
    const t = useTranslations("Auth");
    const tCommon = useTranslations("Common");
    const token = useToken();
    const [isLogin, setIsLogin] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const isSubmitting = useRef(false);
    const { setIsAuth, setUid, setFullName, setEmail } = useAuth();

    const baseSchema  = z
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
        })

    const registerSchema = baseSchema
        .extend({
            confirmPassword: z
                .string()
                .min(authCardFieldInfoDict.password.min, `${tCommon("passwordFieldMin")} ${authCardFieldInfoDict.password.min} ${tCommon("characters")}.`)
                .max(authCardFieldInfoDict.password.max, `${tCommon("passwordFieldMax")} ${authCardFieldInfoDict.password.max} ${tCommon("characters")}.`),
            fullName: z
                .string()
                .min(authCardFieldInfoDict.fullName.min, `${t("fullNameFieldMin")} ${authCardFieldInfoDict.fullName.min} ${tCommon("characters")}.`)
                .max(authCardFieldInfoDict.fullName.max, `${t("fullNameFieldMax")} ${authCardFieldInfoDict.fullName.max} ${tCommon("characters")}.`),
            })
        .refine((data) => data.password === data.confirmPassword, {
            message: tCommon("passwordsNoMatch"),
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

    async function onSubmit(data: AuthSchema) {
        if (isSubmitting.current) return;
        isSubmitting.current = true;

        let auth: AuthData | null;

        try {
            if (isLogin) {      
                const loginData = data as LoginSchema;
                auth = await login(loginData.password, loginData.email, isAdmin, token);
        } else {
            const registerData = data as RegisterSchema;

            auth = await register(
                registerData.password,
                registerData.email,
                registerData.fullName
            );
        }
            if (!isAdmin && auth) {
                await handleAuth(token, auth.authToken);

                setIsAuth(true);
                setUid(auth.uid);
                setFullName(auth.fullName);
                setEmail(data.email);
            }

            form.reset();
        } catch {
            toast(tCommon("submitError"))
        }
        
        isSubmitting.current = false;
    }

    function onChangeAuthClicked() {
        setIsLogin((prev) => !prev);
    }

    return {
        t,
        tCommon,
        isLogin,
        form,
        formSchema,
        isSubmitting,

        setIsAdmin,
        onSubmit,
        onChangeAuthClicked
    }
}
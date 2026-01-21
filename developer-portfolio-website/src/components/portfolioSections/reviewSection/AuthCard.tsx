import { Controller } from "react-hook-form";
import { Button } from "../../shadcnComponents/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../shadcnComponents/Card";
import { FieldGroup, Field, FieldLabel, FieldError } from "../../shadcnComponents/Field";
import { Input } from "../../shadcnComponents/Input";
import useAuthCardViewModel from "../../../viewModels/useAuthCardViewModel";
import { Toaster } from "sonner";
import { useEffect } from "react";

interface AuthCardProps {
    isAdmin: boolean
}

export default function AuthCard({ isAdmin }: AuthCardProps) {
    const vm = useAuthCardViewModel();
    useEffect(() => {
        vm.setIsAdmin(isAdmin);
    }, []);

    return (
        <div className="relative flex place-items-center place-content-center w-full h-full">
            <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl m-6 overflow-hidden max-h-[80%]">
                <CardHeader>
                    <CardTitle>
                        {vm.isLogin ? vm.t("cardTitleLogin") : vm.t("cardTitleRegister")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto scrollbar">
                    <form id="login-form" onSubmit={vm.form.handleSubmit(vm.onSubmit)}>
                        <FieldGroup>
                            {!vm.isLogin &&
                                <Controller
                                    name="fullName"
                                    control={vm.form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="fullName-field-input">
                                                {vm.t("fullNameFieldTitle")}
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                id="fullName-field-input"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                                />
                                            {fieldState.invalid && (
                                                <FieldError className="text-red-400" errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            }                           
                            <Controller
                                name="email"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email-field-input">
                                            {vm.tCommon("emailFieldTitle")}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email-field-input"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={vm.tCommon("emailPlaceHolder")}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-400" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password-field-input">
                                            {vm.tCommon("passwordFieldTitle")}
                                        </FieldLabel>
                                        <Input
                                            type="password"
                                            {...field}
                                            id="password-field-input"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-400" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            {!vm.isLogin &&
                                <Controller
                                    name="confirmPassword"
                                    control={vm.form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="confirm-password-field-input">
                                                {vm.tCommon("confirmPasswordFieldTitle")}
                                            </FieldLabel>
                                            <Input
                                                type="password"
                                                {...field}
                                                id="confirm-password-field-input"
                                                aria-invalid={fieldState.invalid}
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError className="text-red-400" errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            }                         
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Field orientation="horizontal">
                        <Button type="button" variant="destructive" onClick={() => vm.form.reset()} className="cursor-pointer">
                            {vm.tCommon("reset")}
                        </Button>
                        <Button type="submit" variant="outline" form="login-form" disabled={vm.form.formState.isSubmitting} className="cursor-pointer">
                            {vm.form.formState.isSubmitting ? vm.tCommon("submitting") : vm.tCommon("submit")}
                        </Button>                    
                    </Field>
                    {isAdmin &&
                        <p 
                            onClick={vm.onChangeAuthClicked} 
                            className="cursor-pointer text-muted-foreground mt-2"
                        >
                            {vm.isLogin ? vm.t("clickRegister") : vm.t("clickLogin")}                        
                        </p>
                    }
                </CardFooter>
            </Card>
            <Toaster position="bottom-right" />
        </div>
    )
}
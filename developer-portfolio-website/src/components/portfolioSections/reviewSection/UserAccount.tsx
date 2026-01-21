import useUserAccountViewModel from "@/src/viewModels/useUserAccountViewModel";
import { Separator } from "@radix-ui/react-separator";
import { Controller } from "react-hook-form";
import { Toaster } from "sonner";
import { Button } from "../../shadcnComponents/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../shadcnComponents/Card";
import { FieldGroup, Field, FieldLabel, FieldError } from "../../shadcnComponents/Field";
import { Input } from "../../shadcnComponents/Input";

export default function UserAccount() {
    const vm = useUserAccountViewModel();
   
    return (
        <div className="relative flex flex-col w-full place-items-center h-full overflow-y-auto scrollbar">
            <Card className="flex-none w-full sm:max-w-md md:max-w-lg lg:max-w-xl m-6 overflow-hidden">
                <CardHeader>
                    <CardTitle>{vm.t("changeName")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="name-form" onSubmit={vm.fullNameForm.handleSubmit(vm.submitNewFullName)}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>{vm.t("currentName")}</FieldLabel>
                                <Input value={vm.fullName || ""} readOnly />
                            </Field>

                            <Controller
                                name="fullName"
                                control={vm.fullNameForm.control}
                                render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>{vm.t("newName")}</FieldLabel>
                                    <Input {...field}/>
                                    {fieldState.invalid && (
                                    <FieldError
                                        className="text-red-400"
                                        errors={[fieldState.error]}
                                    />
                                    )}
                                </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" form="name-form" className="cursor-pointer" variant={"outline"}>
                        {vm.t("update")}
                    </Button>
                </CardFooter>
            </Card>

            <Separator />

            <Card className="flex-none w-full sm:max-w-md md:max-w-lg lg:max-w-xl m-6 overflow-hidden">
                <CardHeader>
                    <CardTitle>{vm.t("changeEmail")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="email-form" onSubmit={vm.emailForm.handleSubmit(vm.submitNewEmail)}>
                        <FieldGroup>
                        <Field>
                            <FieldLabel>{vm.t("currentEmail")}</FieldLabel>
                            <Input value={vm.email || ""} readOnly />
                        </Field>

                        <Controller
                            name="email"
                            control={vm.emailForm.control}
                            render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>{vm.t("newEmail")}</FieldLabel>
                                <Input {...field}/>
                                {fieldState.invalid && (
                                <FieldError
                                    className="text-red-400"
                                    errors={[fieldState.error]}
                                />
                                )}
                            </Field>
                            )}
                        />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" form="email-form" className="cursor-pointer" variant={"outline"}>
                        {vm.t("update")}
                    </Button>
                </CardFooter>
            </Card>

            <Separator />

            <Card className="flex-none w-full sm:max-w-md md:max-w-lg lg:max-w-xl m-6 overflow-hidden">
                <CardHeader>
                    <CardTitle>{vm.t("changePassword")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        id="password-form"
                        onSubmit={vm.passwordForm.handleSubmit(vm.submitNewPassword)}
                    >
                        <FieldGroup>
                        <Controller
                            name="password"
                            control={vm.passwordForm.control}
                            render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>{vm.t("newPassword")}</FieldLabel>
                                <Input type="password" {...field} />
                                {fieldState.invalid && (
                                <FieldError
                                    className="text-red-400"
                                    errors={[fieldState.error]}
                                />
                                )}
                            </Field>
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={vm.passwordForm.control}
                            render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>{vm.t("confirmPassword")}</FieldLabel>
                                <Input type="password" {...field} />
                                {fieldState.invalid && (
                                <FieldError
                                    className="text-red-400"
                                    errors={[fieldState.error]}
                                />
                                )}
                            </Field>
                            )}
                        />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" form="password-form" className="cursor-pointer" variant={"outline"}>
                        {vm.t("update")}
                    </Button>
                </CardFooter>
            </Card>

            <Toaster position="bottom-right" />
        </div>
        
    )
}
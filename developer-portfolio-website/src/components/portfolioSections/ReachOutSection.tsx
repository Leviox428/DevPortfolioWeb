"use client"
import * as React from "react"
import { Controller } from "react-hook-form"
import { Button } from "../shadcnComponents/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../shadcnComponents/Card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../shadcnComponents/Field"
import { Input } from "../shadcnComponents/Input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../shadcnComponents/InputGroup"
import useReachOutSectionViewModel from "@/src/viewModels/useReachOutSectionViewModel"
import { fieldInfoDict } from "@/src/models/types/reachOutSectionTypes"
import { toast, Toaster } from "sonner"
import z from "zod"

export default function ReachOutSection() {
    const vm = useReachOutSectionViewModel();

    async function onSubmit(data: z.infer<typeof vm.formSchema>) {
        try {
            await vm.onSubmit(data);

            toast(vm.t("submitInfo"), {
                className: "scrollbar",
                description: (
                    <pre className="scrollbar bg-code text-white text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
                        <code>{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
                position: "bottom-right",
                classNames: {
                    title: "text-white",
                    content: "text-white flex flex-col gap-2 bg-zinc-900/90",
                },
                style: {
                    background: "#18181b",
                } as React.CSSProperties,
                duration: 2500
            })
        } catch {
            toast(vm.t("submitError"))
            vm.isSubmitting.current = false;
        }      
    }
    

    return (
        <div className="relative flex place-items-center place-content-center relative w-full h-full">
            <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl m-6 overflow-hidden max-h-[80%]">
                <CardHeader>
                    <CardTitle>{vm.t("cardTitle")}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto scrollbar">
                    <form id="contact-form" onSubmit={vm.form.handleSubmit(onSubmit)}>
                        <FieldGroup>                           
                            <Controller
                                name="email"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email-field-input">
                                            {vm.t("emailFieldTitle")}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="email-field-input"
                                            aria-invalid={fieldState.invalid}
                                            placeholder={vm.t("emailPlaceHolder")}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-400" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                             <Controller
                                name="subject"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="subject-field-input">
                                            {vm.t("subjectFieldTitle")}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="subject-field-input"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-400" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="message"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="message-field-input-text-area">
                                            {vm.t("messageFieldTitle")}
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="message-field-input-text-area"
                                                rows={6}
                                                className="min-h-24 resize-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums [word-spacing:0.3rem]">
                                                {field.value.length}/{fieldInfoDict["message"].max} {vm.t("characters")}
                                            </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && (
                                            <FieldError className="text-red-400" errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="destructive" onClick={() => vm.form.reset()}>
                            {vm.t("reset")}
                        </Button>
                        <Button type="submit" variant="outline" form="contact-form" disabled={vm.form.formState.isSubmitting}>
                             {vm.form.formState.isSubmitting ? vm.t("submitting") : vm.t("submit")}
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
            <Toaster position="bottom-right" />
        </div>
  )
}
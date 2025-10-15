"use client"
import * as React from "react"
import { Controller } from "react-hook-form"
import { Button } from "../shaddnComponents/Button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../shaddnComponents/Card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../shaddnComponents/Field"
import { Input } from "../shaddnComponents/Input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../shaddnComponents/InputGroup"
import useReachOutSectionViewModel from "@/src/viewModels/useReachOutSectionViewModel"
import { fieldInfoDict } from "@/src/models/types/reachOutSectionTypes"

export default function ReachOutSection() {
    const vm = useReachOutSectionViewModel();
    
    return (
        <div className="flex place-content-center place-items-center relative w-full h-full p-6">
            <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
                <CardHeader>
                    <CardTitle>{vm.t("cardTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="contact-form" onSubmit={vm.form.handleSubmit(vm.onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name-field-title">
                                            {vm.t("nameFielTitle")}
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="name-field-input"
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
                                name="email"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email-field-title">
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
                                        <FieldLabel htmlFor="subject-field-title">
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
                                        <FieldLabel htmlFor="message-field-title">
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
                                            <InputGroupText className="tabular-nums">
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
                        <Button type="button" variant="outline" onClick={() => vm.form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="contact-form">
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </div>
  )
}
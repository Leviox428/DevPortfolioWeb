import { Controller } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { reviewEditorFieldInfoDict } from "../../../models/types/reviewsSectionTypes";
import { Button } from "../../shadcnComponents/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../shadcnComponents/Card";
import { FieldGroup, Field, FieldLabel, FieldError } from "../../shadcnComponents/Field";
import { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText } from "../../shadcnComponents/InputGroup";
import useReviewFormViewModel from "../../../viewModels/useReviewFormViewModel";
import z from "zod";
import StarSelector from "./StarSelector";

export default function ReviewForm() {
    const vm = useReviewFormViewModel();

    async function onSubmit(data: z.infer<typeof vm.formSchema>) {
        try {
            await vm.onSubmit(data); 

            toast(vm.tCommon("submitInfo"), {
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
        <>
            <Card className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl max-h-[450px] overflow-hidden">
                <CardHeader>
                    <CardTitle>
                        {vm.t("cardTitleAddReview")}                  
                    </CardTitle>
                </CardHeader>
                <CardContent className="overflow-y-auto scrollbar">
                    <form id="add-review-form" onSubmit={vm.form.handleSubmit(onSubmit)}>
                        <FieldGroup>                                                     
                            <Controller
                                name="content"
                                control={vm.form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="content-field-input-text-area">
                                            {vm.t("contentFieldTitle")}
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="content-field-input-text-area"
                                                rows={6}
                                                className="min-h-24 resize-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums [word-spacing:0.3rem]">
                                                {field.value.length}/{reviewEditorFieldInfoDict["content"].max} {vm.tCommon("characters")}
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
                <CardFooter className="flex flex-col gap-2">
                    <Field>
                        <StarSelector value={vm.stars} onChange={vm.setStars}></StarSelector>
                    </Field>      
                    <Field orientation="horizontal" className="mt-3">
                        <Button type="button" variant="destructive" onClick={() => vm.form.reset()} className="cursor-pointer p-0">
                            {vm.tCommon("reset")}
                        </Button>
                        <Button type="submit" variant="outline" form="add-review-form" disabled={vm.form.formState.isSubmitting} className="cursor-pointer">
                            {vm.form.formState.isSubmitting ? vm.tCommon("submitting") : vm.tCommon("submit")}
                        </Button>                    
                    </Field>
                </CardFooter>
            </Card>
            <Toaster position="bottom-right" />
        </>
    )
}
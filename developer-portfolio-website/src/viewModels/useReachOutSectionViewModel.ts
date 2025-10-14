import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function useReachOutSectionViewModel() {

    const formSchema = z.object({
        title: z
            .string()
            .min(5, "Bug title must be at least 5 characters.")
            .max(32, "Bug title must be at most 32 characters."),
        description: z
            .string()
            .min(20, "Description must be at least 20 characters.")
            .max(100, "Description must be at most 100 characters."),
    })
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    })
    function onSubmit(data: z.infer<typeof formSchema>) {  
    }

    return {
        formSchema,
        form,

        onSubmit
    }
}
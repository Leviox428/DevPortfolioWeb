
type FormData = {
    email: string,
    subject: string,
    message: string
}

export async function submitFormToServer(data: FormData) {

    const response = await fetch("/api/sendFormData", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error();
}
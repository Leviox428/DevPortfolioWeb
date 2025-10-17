import { useToken } from "../contexts/TokenContext";

type FormData = {
    email: string,
    subject: string,
    message: string
}

export async function submitFormToServer(data: FormData) {
    const token = useToken();

    const response = await fetch("/api/sendFormData", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error();
}

export async function sendEmail(data: FormData) {
    const token = useToken();

    const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error();
}

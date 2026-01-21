import { useToken } from "@/src/contexts/TokenContext";
import { fetchAboutMe, getCvUrl } from "@/src/models/sectionsModels/aboutMeModel";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"

export default function AboutMeSectionViewModel() {
    const [text, setText] = useState("");
    const [cvUrl, setCvUrl] = useState("");
    const token = useToken();
    const locale = usePathname().startsWith("/en") ? "en" : "sk";

    useEffect(() => {
        async function loadAboutMe() {
            const data = await fetchAboutMe(token, locale);
            setText(data.text ?? "");
        }

        async function loadCvUrl() {
            const url = await getCvUrl(token, locale);
            setCvUrl(url)
        }

        loadAboutMe();
        loadCvUrl();
    }, []);

    return {
        text,
        cvUrl
    }
}
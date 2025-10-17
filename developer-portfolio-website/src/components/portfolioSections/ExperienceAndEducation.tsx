import { Separator } from "../shadcnComponents/Separator";
import DecryptedText from "../animatedComponents/DecryptedText";
import { useTranslations } from "next-intl";

export default function ExperienceAndEducationSection() {
    const t = useTranslations("ExperienceAndEducationSection");

    return (
        <div className="relative flex-col flex w-full h-full p-6 gap-8 scrollbar overflow-y-auto">
            <DecryptedText 
                speed={10}
                maxIterations={100}
                text="Education:"
                animateOn="view"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                >
            </DecryptedText>
            
            <div className="flex wrap flex-col md:flex-row gap-4 place-items-center">       
                <img className="w-[150px] h-[80px]" src="/images/unizaLogo.png" alt="Uniza logo" />
                <p className="text-md lg:text-xl xl:text-2xl"><strong>2022-2025:</strong></p>
                <p className="xl:text-lg">{t("education")}</p>
            </div>  

            <Separator className="bg-zinc-300/90"></Separator>

            <DecryptedText 
                speed={10}
                maxIterations={100}
                text="Experience:"
                animateOn="view"
                className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
            >
            </DecryptedText>

            <div className="flex wrap flex-col md:flex-row gap-4 place-items-center mt-5">
                <img 
                    className="w-[150px] h-[80px]" 
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-original.svg"
                    alt=""
                >
                </img>
                <p className="text-md lg:text-xl xl:text-2xl"><strong>{t("selfEmployed")} | 2022 – 2024:</strong></p>
                <ul className="list-disc list-inside text-base xl:text-lg space-y-1 text-left pl-5 list-outside">
                    <li>{t("experienceWordpress1")}</li>
                    <li>{t("experienceWordpress2")}</li>
                    <li>{t("experienceWordpress3")}</li>
                    <li>{t("experienceWordpress4")}</li>
                </ul>
            </div>  
        </div>
    )
}
import { Separator } from "../shadcnComponents/Separator";
import DecryptedText from "../animatedComponents/DecryptedText";
import { useTranslations } from "next-intl";

export default function SkillsAndHobbySection() {
    const t = useTranslations("SkillsAndHobbySection");

    return (
        <div className="relative flex-col flex w-full h-full py-10 md:px-10">
            <div className="flex flex-col gap-8 scrollbar overflow-y-auto px-10">
                <DecryptedText
                    speed={10}
                    maxIterations={100}
                    text="Hard Skills:"
                    animateOn="view"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                    parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                >
                </DecryptedText>
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1">
                        <ul className="list-disc list-inside text-base xl:text-xl space-y-1 text-left pl-5 list-outside">
                            <li>{t("hardSkill1")}</li>
                            <li>{t("hardSkill2")}</li>
                            <li>{t("hardSkill3")}</li>
                            <li>{t("hardSkill4")}</li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <ul className="list-disc list-inside text-base xl:text-xl space-y-1 text-left pl-5 list-outside">
                            <li>{t("hardSkill5")}</li>
                            <li>{t("hardSkill6")}</li>
                            <li>{t("hardSkill7")}</li>
                            <li>{t("hardSkill8")}</li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-zinc-300/90"></Separator>

                <DecryptedText
                    speed={10}
                    maxIterations={100}
                    text="Soft Skills:"
                    animateOn="view"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                    parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                >
                </DecryptedText>
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1">
                        <ul className="list-disc list-inside text-base xl:text-xl space-y-1 text-left pl-5 list-outside">
                            <li>{t("softSkill1")}</li>
                            <li>{t("softSkill2")}</li>
                            <li>{t("softSkill3")}</li>
                        </ul>
                    </div>
                    <div className="flex-1">
                        <ul className="list-disc list-inside text-base xl:text-xl space-y-1 text-left pl-5 list-outside">
                            <li>{t("softSkill4")}</li>
                            <li>{t("softSkill5")}</li>
                            <li>{t("softSkill6")}</li>
                        </ul>
                    </div>
                </div>

                <Separator className="bg-zinc-300/90"></Separator>

                <DecryptedText
                    speed={10}
                    maxIterations={100}
                    text="Hobby:"
                    animateOn="view"
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                    parentClassName="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
                >
                </DecryptedText>
                <p className="xl:text-lg text-left">{t("hobby")}</p>
            </div>
        </div>
    )
}
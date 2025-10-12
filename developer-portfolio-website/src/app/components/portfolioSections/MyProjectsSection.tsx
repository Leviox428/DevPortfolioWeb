import { useLocale, useTranslations } from "next-intl";
import { ComboBox } from "../shadcnComponents/ui/ComboBox";
import { UsedTech } from "@/src/enums/UsedTech";
import { useEffect, useState } from "react";
import ElectricBorder from "../animatedComponents/ElectricBorder";
import ProjectCard from "../ProjectCard";

interface Project {
    id: number;
    title: { en: string; sk: string };
    shortDescription: { en: string; sk: string };
    languages: string[];
    link?: string;
    thumbnail: string;
}

export default function MyProjectsSection() {
    const locale = useLocale() as "en" | "sk";
    const t = useTranslations("MyProjectsSection");
    const [selection, setSelection] = useState("");
    const [filtered, setFiltered] = useState<Project[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch("/data/projects.json")
            .then(res => res.json())
            .then((data: Project[]) => {
                setProjects(data);
                setFiltered(data);
            });
    }, []);

    useEffect(() => {
        if (!selection || selection === t("selection")) {
            setFiltered(projects);
        } else {
            setFiltered(projects.filter(p => p.languages.includes(selection)));
        }
    }, [selection, projects, t]);

    return (
        <div className="relative flex-col flex w-full h-full p-6">
            <ComboBox                
                searchPlaceHolderText={t("searchPlaceHolderText")} 
                selectionPlaceHolderText={t("selectionPlaceHolderText")} 
                programmingLanguages={[t("selection")].concat(Object.values(UsedTech) as string[])}
                notFoundText={t("notFoundText")}
                width={250}
                setSelection={setSelection}
                >
            </ComboBox>
            <ElectricBorder 
                className="h-full w-full flex-1 mt-10"
                color="#7df9ff"
                speed={0.1}
                chaos={0.8}
                thickness={2}
                style={{ borderRadius: 16 }}
            >
                <div className="relative w-full h-full p-4">
                    <div className="overflow-y-auto relative h-full w-full flex gap-3 flex-wrap justify-center content-evenly">
                        {filtered.map(project => (
                            <ProjectCard
                                key={project.id}
                                title={project.title[locale]}
                                description={project.shortDescription[locale]}
                                thumbnail={project.thumbnail}
                            />
                        ))}
                    </div>
                </div>
            </ElectricBorder>
            <div></div>
        </div>
    )
}

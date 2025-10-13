import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Project } from "../models/types/myProjectSectionTypes";
import { fetchProjects } from "../models/myProjectsectionModel";

export default function useMyProjectSectionViewModel() {
    const locale = useLocale() as "en" | "sk";
    const t = useTranslations("MyProjectsSection");
    const [selection, setSelection] = useState("");
    const [filtered, setFiltered] = useState<Project[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetchProjects()
            .then((data) => {
                setProjects(data);
                setFiltered(data);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!selection || selection === t("selection")) {
            setFiltered(projects);
        } else {
            setFiltered(projects.filter(p => p.languages.includes(selection)));
        }
    }, [selection, projects, t]);

    return {
        locale,
        t,
        selection,
        filtered,
        projects,

        setSelection
    };
}
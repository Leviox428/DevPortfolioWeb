import { useLocale, useTranslations } from "next-intl";
import { ComboBox } from "../shadcnComponents/ComboBox";
import { UsedTech } from "@/src/models/enums/UsedTech";

import ProjectCard from "../ProjectCard";
import useMyProjectSectionViewModel from "@/src/viewModels/useMyProjectSectionViewModel";


export default function MyProjectsSection() {
    const vm = useMyProjectSectionViewModel();

    return (
        <div className="relative flex-col flex w-full h-full p-6">
            <ComboBox                
                searchPlaceHolderText={vm.t("searchPlaceHolderText")} 
                selectionPlaceHolderText={vm.t("selectionPlaceHolderText")} 
                programmingLanguages={[vm.t("selection")].concat(Object.values(UsedTech) as string[])}
                notFoundText={vm.t("notFoundText")}
                width={250}
                setSelection={vm.setSelection}
                >
            </ComboBox>
            <div 
                className="h-full w-full flex-1 mt-10"
            >
                <div className="relative w-full h-full p-4">
                    <div className="overflow-y-auto scrollbar relative h-full w-full flex gap-3 flex-wrap justify-center content-evenly">
                        {vm.filtered.map(project => (
                            <ProjectCard
                                key={project.id}
                                title={project.title[vm.locale]}
                                description={project.shortDescription[vm.locale]}
                                thumbnail={project.thumbnail}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

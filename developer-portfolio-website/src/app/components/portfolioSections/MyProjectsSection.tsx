import { ComboBox } from "../shadcnComponents/ui/ComboBox";

export default function MyProjectsSection() {
    return (
        <div className="relative flex w-full h-full">
            <ComboBox placeHolderText="jadi" selectionPlaceHolderText="da" programmingLanguages={["skibidi", "javol"]}></ComboBox>
        </div>
    )
}

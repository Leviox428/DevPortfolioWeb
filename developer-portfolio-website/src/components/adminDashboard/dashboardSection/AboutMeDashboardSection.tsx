import useAboutMeDashboardSectionViewModel from "@/src/viewModels/dahsboardViewModels/useAboutMeDashboardSectionViewModel";
import { Textarea } from "../../shadcnComponents/TextArea";
import { Button } from "../../shadcnComponents/Button";


export default function AboutMeDashboardSection() {
  const vm = useAboutMeDashboardSectionViewModel();

  if (vm.isLoading) {
    return (
      <div className="rounded-lg bg-zinc-800 p-4 text-zinc-400">
        Loading About Me…
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-zinc-800 p-4 overflow-y-auto scrollbar">
      <h2 className="mb-3 text-lg font-semibold text-white">About Me</h2>

      <Textarea
        value={vm.text}
        onChange={(e: { target: { value: string; }; }) => vm.setText(e.target.value)}
        placeholder="Write your About Me section here..."
        className="min-h-[150px] max-h-[250px] resize-none bg-zinc-700 text-zinc-200 placeholder:text-zinc-400"
      />

      {vm.error && (
        <p className="mt-2 text-sm text-red-400">
          {vm.error}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        <Button
          onClick={vm.saveAboutMe}
          disabled={vm.isSaving}
          className="bg-zinc-900 text-white hover:bg-zinc-700"
        >
          {vm.isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
      <div className="flex flex-col mt-6 border-t border-zinc-700 pt-4">
        <h3 className="mb-2 text-md font-semibold text-white">Upload CV</h3>

        <input
          type="file"
          accept="application/pdf"
          onChange={vm.handleFileChange}
          className="mb-2 text-white"
        />

        <Button
          onClick={vm.handleUpload}
          disabled={!vm.file}
          className="bg-blue-600 text-white hover:bg-blue-500"
        >
          Upload PDF
        </Button>

        {vm.uploadStatus && (
          <p className="mt-2 text-sm text-zinc-300">{vm.uploadStatus}</p>
        )}
      </div>
    </div>
  );
}
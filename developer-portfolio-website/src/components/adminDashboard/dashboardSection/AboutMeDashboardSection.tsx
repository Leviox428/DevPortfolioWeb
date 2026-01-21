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
    <div className="rounded-lg bg-zinc-800 p-4">
      <h2 className="mb-3 text-lg font-semibold text-white">About Me</h2>

      <Textarea
        value={vm.text}
        onChange={(e: { target: { value: string; }; }) => vm.setText(e.target.value)}
        placeholder="Write your About Me section here..."
        className="min-h-[150px] resize-none bg-zinc-700 text-zinc-200 placeholder:text-zinc-400"
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
    </div>
  );
}
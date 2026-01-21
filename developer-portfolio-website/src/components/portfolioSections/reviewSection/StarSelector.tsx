export default function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onClick={() => onChange(star)}
          className={`
            w-6 h-6 rounded-sm cursor-pointer flex items-center justify-center text-sm
            ${star <= value ? "bg-yellow-400 text-black" : "bg-zinc-600 text-white"}
            hover:bg-yellow-300 hover:text-black transition
          `}
        >
          {star}
        </div>
      ))}
    </div>
  );
}
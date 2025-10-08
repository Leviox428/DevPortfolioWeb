interface Props {
    onClose: () => void;
}


export default function PortfolioSecion({ onClose } : Props) {
    return (
        <div className="absolute inset-0 flex items-center justify-center mx-4 my-18 xl:mx-auto xl:w-[1200px] 
            bg-black/15 rounded-2xl shadow-lg backdrop-blur-sm border border-white/5">
            <button onClick={onClose} className="text-2xl absolute top-2 right-3 text-white hover:text-red-500">
                ×
            </button>
        </div>
    )
}